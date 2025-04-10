const cache = new Map() // In-memory cache

const deepGet = (obj, path) => path.reduce((acc, key) => acc?.[key], obj)
const deepSet = (obj, path, value) => {
    return path.reduce((acc, key, index) => {
        if (index === path.length - 1) {
            acc[key] = value
        } else {
            acc[key] = acc[key] || {}
        }
        return acc[key]
    }, obj)
}

const cacheUtils = {
    get: ({ path, cacheKey = 'pride-c', useLocalStorage = false }) => {
        if (useLocalStorage && typeof localStorage !== 'undefined') {
            const storedData = JSON.parse(localStorage.getItem(cacheKey)) || {}
            return deepGet(storedData, path)
        }
        return deepGet(cache, path)
    },

    set: ({ path, cacheKey = 'pride-c', value, useLocalStorage = false }) => {
        if (useLocalStorage && typeof localStorage !== 'undefined') {
            const storedData = JSON.parse(localStorage.getItem(cacheKey)) || {}
            deepSet(storedData, path, value)
            localStorage.setItem(cacheKey, JSON.stringify(storedData))
        } else {
            deepSet(cache, path, value)
        }
    },

    clear: ({ cacheKey = 'pride-c', useLocalStorage = false }) => {
        if (useLocalStorage && typeof localStorage !== 'undefined') {
            localStorage.removeItem(cacheKey)
        } else {
            cache.clear()
        }
    },
}

export default cacheUtils
