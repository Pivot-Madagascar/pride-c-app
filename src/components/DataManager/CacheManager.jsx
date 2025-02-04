import { useIndexedDBCache } from "../../hooks/useIndexedDBCache"

const CacheManager = ({ cacheConfigs }) => {
    cacheConfigs.forEach(({ cacheKey, selector, action }) => {
        useIndexedDBCache({ cacheKey, selector, action })
    })

    return null
}

export default CacheManager
