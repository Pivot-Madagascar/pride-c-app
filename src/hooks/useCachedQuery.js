import { useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    setFetchedDimensions,
    clearFetchedDimensions,
} from '../redux/appSlice.js'

/**
 * Unified hook for managing cached queries
 * Handles both Redux store caching and browser Cache API
 */
export const useCachedQuery = ({ queryKey, query, selector, storageKey }) => {
    const dispatch = useDispatch()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Get cached dimensions from Redux
    const cachedDimensions = useSelector((state) => state.app.fetchedDimensions)
    const storedData = useSelector(selector)

    // Check if query is already cached
    const isCached = cachedDimensions.includes(queryKey)

    // Browser Cache API functions
    const saveToBrowserCache = useCallback(async (key, dataToCache) => {
        try {
            const cache = await caches.open('pride-c-cache')
            const response = new Response(JSON.stringify(dataToCache), {
                headers: { 'Content-Type': 'application/json' },
            })
            await cache.put(key, response)
        } catch (err) {
            console.error(
                '[useCachedQuery] Error saving to browser cache:',
                err
            )
        }
    }, [])

    const getFromBrowserCache = useCallback(async (key) => {
        try {
            const cache = await caches.open('pride-c-cache')
            const cachedResponse = await cache.match(key)
            if (cachedResponse) {
                return await cachedResponse.json()
            }
            return null
        } catch (err) {
            console.error(
                '[useCachedQuery] Error getting from browser cache:',
                err
            )
            return null
        }
    }, [])

    // Main fetch function
    const fetchData = useCallback(
        async (engine, executeFn) => {
            if (isCached && storedData) {
                // Use data from Redux store
                setData(storedData)
                setLoading(false)
                return
            }

            // Check browser cache if storageKey provided
            if (storageKey) {
                const browserCachedData = await getFromBrowserCache(storageKey)
                if (browserCachedData) {
                    setData(browserCachedData)
                    setLoading(false)
                    dispatch(setFetchedDimensions(queryKey))
                    return
                }
            }

            // Fetch from API
            setLoading(true)
            try {
                const result = await executeFn({ query, type: 'query' })

                // Check for error
                if (typeof result === 'string' && result.startsWith('ERROR:')) {
                    throw new Error(result)
                }

                // Parse result
                const parsedResult =
                    typeof result === 'string' ? JSON.parse(result) : result

                // Extract data based on query structure
                let extractedData = parsedResult
                const keys = Object.keys(parsedResult || {})
                if (keys.length > 0) {
                    extractedData = parsedResult[keys[0]]
                }

                setData(extractedData)
                setError(null)

                // Save to caches
                dispatch(setFetchedDimensions(queryKey))
                if (storageKey) {
                    await saveToBrowserCache(storageKey, extractedData)
                }
            } catch (err) {
                setError(err)
                setData(null)
            } finally {
                setLoading(false)
            }
        },
        [
            isCached,
            storedData,
            storageKey,
            queryKey,
            dispatch,
            getFromBrowserCache,
            saveToBrowserCache,
        ]
    )

    // Clear cache for this query
    const clearCache = useCallback(() => {
        dispatch(clearFetchedDimensions())
        // Optionally clear browser cache
        if (storageKey) {
            caches.open('pride-c-cache').then((cache) => {
                cache.delete(storageKey)
            })
        }
    }, [dispatch, storageKey])

    // Check if data is stale (older than 1 hour)
    const isStale = useCallback(() => {
        // This could be extended to check timestamps
        return false
    }, [])

    return {
        data,
        loading,
        error,
        isCached,
        fetchData,
        clearCache,
        isStale,
    }
}

export default useCachedQuery
