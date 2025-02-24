import { useCacheStorage } from "../../hooks/useCacheStorage"

const CacheManager = ({ cacheConfigs }) => {
    cacheConfigs.forEach(({ cacheKey, selector, action }) => {
        useCacheStorage({ cacheKey, selector, action })
    })

    return null
}

export default CacheManager
