const getCachedData = async (cacheKey) => {
    return new Promise(async (resolve, reject) => {
        try {
            const cache = await caches.open('pride-c-cache') // Open the cache
            const cachedResponse = await cache.match(cacheKey) // Match the cache key
            if (cachedResponse) {
                const data = await cachedResponse.json() // Parse the cached response
                resolve(data) // Return the cached data
            } else {
                resolve(null) // If no cached data, resolve with null
            }
        } catch (err) {
            reject(err) // Handle any errors
        }
    })
}
export { getCachedData }
