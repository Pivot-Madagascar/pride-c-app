import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

const DB_NAME = 'ReduxCacheDB'
const STORE_NAME = 'cache'

export const useIndexedDBCache = ({ cacheKey, selector, action }) => {
    const dispatch = useDispatch()
    const selectedState = useSelector(selector)

    // Open IndexedDB
    const openDB = () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 1)
            request.onupgradeneeded = (event) => {
                const db = event.target.result
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME)
                }
            }
            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject('Failed to open IndexedDB')
        })
    }

    // Save data to IndexedDB
    const saveToIndexedDB = async (key, data) => {
        const db = await openDB()
        const transaction = db.transaction(STORE_NAME, 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        store.put(data, key)
    }

    // Load data from IndexedDB
    const getFromIndexedDB = async (key) => {
        const db = await openDB()
        return new Promise((resolve) => {
            const transaction = db.transaction(STORE_NAME, 'readonly')
            const store = transaction.objectStore(STORE_NAME)
            const request = store.get(key)
            request.onsuccess = () => resolve(request.result || null)
        })
    }

    // Load cached data into Redux on mount
    useEffect(() => {
        (async () => {
            const cachedData = await getFromIndexedDB(cacheKey)
            if (cachedData) {
                dispatch(action(cachedData))
            }
        })()
    }, [cacheKey, dispatch, action])

    // Save to IndexedDB whenever Redux state changes
    useEffect(() => {
        if (selectedState) {
            saveToIndexedDB(cacheKey, selectedState)
        }
    }, [cacheKey, selectedState])
}
