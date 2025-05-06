import { useDataEngine } from '@dhis2/app-runtime'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setFetchedDimensions } from '../redux/appSlice'

const parseFeatures = (data) =>
    data.map(({ type, id, geometry, properties }) => ({
        type,
        id,
        properties: {
            orgUnitId: id,
            orgUnitName: properties.name,
            level: properties.level,
        },
        geometry,
    }))

const parseOrgUnits = (data) =>
    data.map(({ id, properties }) => {
        const {  name, level, parent, parentGraph } = properties
        return {
            id,
            name,
            level,
            parent,
            parentGraph
        }
    })

const useOrgUnits = ({ parent, adminLevels }) => {
    const dispatch = useDispatch()
    const engine = useDataEngine()

    const [features, setFeatures] = useState()
    const [orgUnits, setOrgUnits] = useState()
    const [adminlevel, setAdminLevel] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const cachedDimensions = useSelector((state) => state.app.fetchedDimensions)

    useEffect(() => {
        const fetchOrgUnits = async () => {
            setLoading(true)
            setError(null)
            
            const levels = adminLevels.map((level) => level.level)

            const query = {
                geojson: {
                    resource: 'organisationUnits.geojson',
                    params: {
                        parent,
                        level: Array.isArray(levels)
                            ? levels.join(',')
                            : levels,
                    },
                },
            }

            const key = JSON.stringify(query)

            const isStored = cachedDimensions.includes(key)

            if (!isStored) {
                try {
                    const { geojson, loading: isLoaded } = await engine.query(query)
    
                    setLoading(isLoaded)
    
                    const groupedByLevel = geojson?.features.reduce(
                        (acc, feature) => {
                            const level = feature.properties.level
                            if (!acc[level]) {
                                acc[level] = []
                            }
                            acc[level].push(feature)
                            return acc
                        },
                        {}
                    )
    
                    const keys = Object.keys(groupedByLevel)
                    keys.map((key) => {
                        const currentGeoJson = groupedByLevel[key]
                        const orgUnits = parseOrgUnits(currentGeoJson)
                        const features = parseFeatures(currentGeoJson)
                        const { id } = adminLevels.find(
                            (level) => level.level == key
                        )
                        if (orgUnits.length === features.length && id) {
                            setFeatures(features)
                            setOrgUnits(orgUnits)
                            setAdminLevel(id)
                        }
                    })
                } catch (err) {
                    setError(err.message)
                } finally {
                    setLoading(false)
                    dispatch(setFetchedDimensions(key))
                }
            }
        }
        if (!parent || !adminLevels) {
            setFeatures()
            setOrgUnits()
            return
        } else {
            if (loading) {
                fetchOrgUnits()
            }
        }
    }, [engine, parent, adminLevels, loading])
    return {
        orgUnits,
        features,
        error,
        loading,
        adminlevel
    }
}
export default useOrgUnits
