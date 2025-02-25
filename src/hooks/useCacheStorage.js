import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
export const useCacheStorage = ({ cacheKey, selector, action }) => {
    const dispatch = useDispatch()
    const selectedState = useSelector(selector)
    // Save data to Cache Storage
    const saveToCache = async (key, data) => {
        const cache = await caches.open('pride-c-cache')
        const response = new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
        })
        await cache.put(key, response)
    }
    // Load data from Cache Storage
    const getFromCache = async (key) => {
        const cache = await caches.open('pride-c-cache')
        const cachedResponse = await cache.match(key)
        if (cachedResponse) {
            const data = await cachedResponse.json()
            return data
        }
        return null
    }
    // Load cached data into Redux on mount
    useEffect(() => {
        ;(async () => {
            const cachedData = await getFromCache(cacheKey)
            if (cachedData) {
                dispatch(action(cachedData))
            }
        })()
    }, [cacheKey, dispatch, action])
    // Save to Cache Storage whenever Redux state changes
    useEffect(() => {
        if (selectedState) {
            saveToCache(cacheKey, selectedState)
        }
    }, [cacheKey, selectedState])
}
