import { useDataEngine } from '@dhis2/app-runtime'
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setFetchedDimensions } from '@/redux/appSlice'
import { setOrgUnitsDetails, setGeoJson } from '@/redux/orgUnitSlice'

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

    const [features, setFeatures] = useState(null)
    const [orgUnits, setOrgUnits] = useState(null)
    const [adminlevel, setAdminLevel] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const cachedDimensions = useSelector((state) => state.app.fetchedDimensions)

    // Track fetched keys to avoid infinite loops
    const fetchedKeysRef = useRef(new Set())
    const cachedDimensionsRef = useRef(cachedDimensions)
    const localStateSetRef = useRef(false)
    
    // Update refs when values change
    cachedDimensionsRef.current = cachedDimensions

    useEffect(() => {
        const fetchOrgUnits = async () => {
            console.log('[useOrgUnits] Checking conditions:', { parent, adminLevels })
            
            if (!parent || !adminLevels || !adminLevels.length) {
                console.log('[useOrgUnits] Conditions not met, returning early')
                setLoading(false)
                return
            }
            
            setLoading(true)
            setError(null)
            
            const levels = adminLevels.map((level) => level.level)
            console.log('[useOrgUnits] Fetching for levels:', levels)

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
            console.log('[useOrgUnits] Query key:', key)

            // Skip if already fetched in this session
            if (fetchedKeysRef.current.has(key)) {
                console.log('[useOrgUnits] Already fetched in session, returning')
                setLoading(false)
                return
            }

            const isStored = cachedDimensionsRef.current.includes(key)
            console.log('[useOrgUnits] Is stored in cache:', isStored)

            if (!isStored) {
                try {
                    console.log('[useOrgUnits] Fetching from API...')
                    const { geojson, loading: isLoaded } = await engine.query(query)
                    console.log('[useOrgUnits] API response:', geojson)
    
                    setLoading(isLoaded)
    
                    if (!geojson || !geojson.features || geojson.features.length === 0) {
                        console.log('[useOrgUnits] No features returned from API')
                        setLoading(false)
                        return
                    }
    
                    const groupedByLevel = geojson.features.reduce(
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
    
                    console.log('[useOrgUnits] Grouped by level:', groupedByLevel)
                    
                    const keys = Object.keys(groupedByLevel)
                    console.log('[useOrgUnits] Keys:', keys)
                    
                    keys.forEach((key) => {
                        const currentGeoJson = groupedByLevel[key]
                        const parsedOrgUnits = parseOrgUnits(currentGeoJson)
                        const parsedFeatures = parseFeatures(currentGeoJson)
                        const levelInfo = adminLevels.find(
                            (level) => level.level == key
                        )
                        console.log('[useOrgUnits] Processing level:', key, { levelInfo, orgUnitsCount: parsedOrgUnits.length })
                        
                        if (parsedOrgUnits.length > 0 && levelInfo?.id) {
                            // Save to Redux
                            dispatch(setOrgUnitsDetails({
                                level: levelInfo.id,
                                data: parsedOrgUnits
                            }))
                            dispatch(setGeoJson({
                                level: levelInfo.id,
                                data: parsedFeatures
                            }))
                            
                            // Update local state with first level data (only once)
                            if (!localStateSetRef.current) {
                                console.log('[useOrgUnits] Setting local state:', { orgUnitsCount: parsedOrgUnits.length, featuresCount: parsedFeatures.length })
                                setOrgUnits(parsedOrgUnits)
                                setFeatures(parsedFeatures)
                                localStateSetRef.current = true
                            }
                        }
                    })
                } catch (err) {
                    console.error('[useOrgUnits] Error fetching:', err)
                    setError(err.message)
                } finally {
                    setLoading(false)
                    fetchedKeysRef.current.add(key)
                    dispatch(setFetchedDimensions(key))
                }
            } else {
                // Data is in cache but we need to load it from Redux
                console.log('[useOrgUnits] Loading from Redux cache...')
                setLoading(false)
            }
        }
        
        fetchOrgUnits()
    }, [engine, parent, adminLevels, dispatch])

    // Set adminlevel based on the first admin level if available
    useEffect(() => {
        if (adminLevels && adminLevels.length > 0) {
            setAdminLevel(adminLevels[0].id)
        }
    }, [adminLevels])

    return {
        orgUnits,
        features,
        error,
        loading,
        adminlevel
    }
}
export default useOrgUnits
