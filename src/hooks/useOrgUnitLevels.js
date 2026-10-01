import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFetchedDimensions } from '@/redux/appSlice'
import { setOrgUnitLevels as setOrgUnitLevelsAction } from '@/redux/orgUnitSlice'
import { useExecuteQuery } from '@/hooks/useExecuteQuery'

const useOrgUnitLevels = (orgUnitDetails = null) => {
    const { execute } = useExecuteQuery()
    const dispatch = useDispatch()

    const [orgUnitLevels, setOrgUnitLevels] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const cachedDimensions = useSelector((state) => state.app.fetchedDimensions)
    const storedOrgUnitLevels = useSelector(
        (state) => state.orgUnit.orgUnitLevels
    )

    const fetchedKeysRef = useRef(new Set())
    const cachedDimensionsRef = useRef(cachedDimensions)
    const storedOrgUnitLevelsRef = useRef(storedOrgUnitLevels)

    cachedDimensionsRef.current = cachedDimensions
    storedOrgUnitLevelsRef.current = storedOrgUnitLevels

    useEffect(() => {
        const fetchOrgUnitLevels = async () => {
            // Wait for orgUnitDetails to be available before fetching
            // This ensures fetchOrgUnitDetails runs first
            if (!orgUnitDetails) {
                setLoading(false)
                return
            }

            const query = {
                orgUnitLevels: {
                    resource: 'organisationUnitLevels',
                    params: {
                        fields: 'id,name,level',
                    },
                },
            }

            const key = JSON.stringify(query)

            if (fetchedKeysRef.current.has(key)) {
                // Use stored data from Redux if available
                if (storedOrgUnitLevelsRef.current && storedOrgUnitLevelsRef.current.length > 0) {
                    setOrgUnitLevels(storedOrgUnitLevelsRef.current)
                }
                setLoading(false)
                return
            }

            const isStored = cachedDimensionsRef.current.includes(key)

            if (isStored && storedOrgUnitLevelsRef.current && storedOrgUnitLevelsRef.current.length > 0) {
                // Data already in cache and Redux
                setOrgUnitLevels(storedOrgUnitLevelsRef.current)
                fetchedKeysRef.current.add(key)
                setLoading(false)
                setError(null)
                return
            }

            try {
                setLoading(true)
                const result = await execute({ query, type: 'query' })

                // Check if result is an error string
                if (
                    typeof result === 'string' &&
                    result.startsWith('ERROR:')
                ) {
                    throw new Error(result)
                }

                // Parse the JSON string returned by useExecuteQuery
                const parsedResult = JSON.parse(result)

                const orgUnitLevelsData =
                    parsedResult && parsedResult.orgUnitLevels
                const orgUnitLevelsList =
                    orgUnitLevelsData &&
                    orgUnitLevelsData.organisationUnitLevels

                // Store in Redux
                dispatch(setOrgUnitLevelsAction(orgUnitLevelsList || []))
                
                setOrgUnitLevels(orgUnitLevelsList || [])
                setError(null)
                
                // Mark as fetched
                fetchedKeysRef.current.add(key)
            } catch (err) {
                setError(err)
                setOrgUnitLevels([])
            } finally {
                setLoading(false)
                dispatch(setFetchedDimensions(key))
            }
        }

        fetchOrgUnitLevels()
    }, [execute, dispatch, orgUnitDetails])

    return {
        loading,
        error,
        orgUnitLevels,
    }
}

export default useOrgUnitLevels
