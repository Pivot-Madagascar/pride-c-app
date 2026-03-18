import { useEffect, useState, useRef } from 'react'
import { useDataEngine } from '@dhis2/app-runtime'
import { useDispatch, useSelector } from 'react-redux'
import { setFetchedDimensions } from '../redux/appSlice'
import { setParentDetails } from '../redux/orgUnitSlice.js'

const useOrgUnitDetails = (uid) => {
    const engine = useDataEngine()
    const dispatch = useDispatch()

    const [orgUnitDetails, setOrgUnitDetails] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const cachedDimensions = useSelector((state) => state.app.fetchedDimensions)
    const storedParentDetails = useSelector((state) => state.orgUnit.parentDetails)

    // Track fetched keys to avoid infinite loops
    const fetchedKeysRef = useRef(new Set())
    const cachedDimensionsRef = useRef(cachedDimensions)
    const storedParentDetailsRef = useRef(storedParentDetails)
    
    // Update refs when values change
    cachedDimensionsRef.current = cachedDimensions
    storedParentDetailsRef.current = storedParentDetails

    useEffect(() => {
        const fetchOrgUnitDetails = async () => {
            if (!uid) {
                setLoading(false)
                return
            }

            const query = {
                orgUnit: {
                    resource: `organisationUnits/${uid}`,
                    params: {
                        fields: 'id,name,level',
                    },
                },
            }

            const key = JSON.stringify(query)

            // Skip if already fetched in this session
            if (fetchedKeysRef.current.has(key)) {
                if (storedParentDetailsRef.current) {
                    setOrgUnitDetails(storedParentDetailsRef.current)
                }
                setLoading(false)
                return
            }

            const isStored = cachedDimensionsRef.current.includes(key)

            if (isStored && storedParentDetailsRef.current) {
                setOrgUnitDetails(storedParentDetailsRef.current)
                fetchedKeysRef.current.add(key)
                setLoading(false)
                setError(null)
                return
            }

            // Need to fetch from API
            try {
                setLoading(true)
                const result = await engine.query(query)
                const details = result?.orgUnit || null
                
                // Store in Redux
                dispatch(setParentDetails(details))
                
                setOrgUnitDetails(details)
                setError(null)
                
                // Mark as fetched
                fetchedKeysRef.current.add(key)
            } catch (err) {
                setError(err)
                setOrgUnitDetails(null)
            } finally {
                setLoading(false)
                dispatch(setFetchedDimensions(key))
            }
        }

        fetchOrgUnitDetails()
    }, [engine, dispatch, uid])

    return {
        loading,
        error,
        orgUnitDetails,
    }
}

export default useOrgUnitDetails
