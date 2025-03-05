import { useDataEngine } from '@dhis2/app-runtime'
import { useState, useEffect } from 'react'

const parseFeatures = (data) =>
    data.features.map(({ type, id, geometry, properties }) => ({
        type,
        id,
        properties: {
            orgUnit_id: id,
            orgUnit_name: properties.name,
            level: properties.level,
        },
        geometry,
    }))

const parseOrgUnits = (data) =>
    data.features.map(({ id, properties }) => ({
        id,
        name: properties.name,
        level: properties.level,
    }))

const useOrgUnits = ({ parent, level }) => {
    const engine = useDataEngine()
    const [features, setFeatures] = useState([])
    const [orgUnits, setOrgUnits] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        if (!parent || !level) {
            setFeatures([])
            setOrgUnits([])
            return
        }
        const fetchOrgUnits = async () => {
            setLoading(true)
            setError(null)
            try {
                const query = {
                    geojson: {
                        resource: 'organisationUnits.geojson',
                        params: {
                            parent,
                            level,
                        },
                    },
                }
                const { geojson } = await engine.query(query)
                setFeatures(parseFeatures(geojson))
                setOrgUnits(parseOrgUnits(geojson))
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchOrgUnits()
    }, [engine, parent, level]) 
    return {
        orgUnits,
        features,
        error,
        loading,
    }
}
export default useOrgUnits
