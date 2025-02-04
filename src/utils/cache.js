const DB_NAME = 'ReduxCacheDB'
const STORE_NAME = 'cache'

const getCachedData = async (cacheKey) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME) // Open DB
        request.onsuccess = (e) => {
            const db = e.target.result
            const tx = db.transaction(STORE_NAME, 'readonly') 
            const store = tx.objectStore(STORE_NAME)
            const getRequest = store.get(cacheKey)  // Get the data by key
            
            getRequest.onsuccess = () => {
                resolve(getRequest.result)  // Return the cached data
            }

            getRequest.onerror = (err) => {
                reject(err)  // Handle errors
            }
        }
        request.onerror = (err) => {
            reject(err)  // Handle DB open errors
        }
    })
}

export { getCachedData }
