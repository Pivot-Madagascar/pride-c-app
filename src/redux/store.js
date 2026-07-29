import { configureStore } from '@reduxjs/toolkit'
import appSettingsReducer from '@/redux/appSettings'
import appReducer from '@/redux/appSlice'
import climateReducer from '@/redux/climateSlice'
import dataTableReducer from '@/redux/dataTableSlice'
import diarrheaReducer from '@/redux/diarrheaSlice'
import iraReducer from '@/redux/iraSlice'
import malariaReducer from '@/redux/malariaSlice'
import notificationReducer from '@/redux/notificationSlice'
import orgUnitReducer from '@/redux/orgUnitSlice'
import tempReducer from '@/redux/tempSlice'

/** --- Constants --- */
const CACHE_KEY = '/redux-state'
const CACHE_NAME = 'redux-cache'
const DEBOUNCE_DELAY = 300 // milliseconds
const MAX_CACHE_SIZE_MB = 500

/** --- Priority slices to keep when cache exceeds limit --- */
const PRIORITY_SLICES = ['orgUnit', 'malaria', 'ira', 'diarrhea', 'climate']

/** --- Configuration --- */
const CONFIG = {
    CACHEABLE_SLICES: [
        'orgUnit',
        'malaria',
        'ira',
        'diarrhea',
        'climate',
        'app',
    ],
}

/** --- Store Reference (will be set after store creation) --- */
let storeInstance = null

/** --- Utils: Detect if it's last minute of the month --- */
const isLastMinuteOfMonth = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const lastDay = new Date(year, month + 1, 0).getDate()

    return (
        now.getDate() === lastDay &&
        now.getHours() === 23 &&
        now.getMinutes() === 59
    )
}

/** --- Utils: Clear full cache --- */
const clearCache = async () => {
    await caches.delete(CACHE_NAME)
}

/** --- Utils: Calculate cache size in bytes --- */
const calculateCacheSize = async (cache) => {
    const keys = await cache.keys()
    let totalSize = 0

    for (const request of keys) {
        const response = await cache.match(request)
        if (response) {
            const blob = await response.clone().blob()
            totalSize += blob.size
        }
    }

    return totalSize
}

/** --- Utils: Enforce cache size limit --- */
const enforceCacheSizeLimit = async () => {
    try {
        const cache = await caches.open(CACHE_NAME)
        const MAX_CACHE_SIZE_BYTES = MAX_CACHE_SIZE_MB * 1024 * 1024
        const keys = await cache.keys()

        // Calculate total size
        let totalSize = 0
        const entries = []

        for (const request of keys) {
            const response = await cache.match(request)
            if (response) {
                const blob = await response.clone().blob()
                const url = request.url
                const sliceName = url.split('/').pop()
                entries.push({ sliceName, size: blob.size })
                totalSize += blob.size
            }
        }

        // If under limit, do nothing
        if (totalSize <= MAX_CACHE_SIZE_BYTES) {
            return
        }

        console.warn(`[Cache] Cache size (${(totalSize / 1024 / 1024).toFixed(2)}MB) exceeds limit (${MAX_CACHE_SIZE_MB}MB). Cleaning up...`)

        // Sort entries by priority (keep priority slices, remove others)
        const sortedEntries = entries.sort((a, b) => {
            const aIsPriority = PRIORITY_SLICES.includes(a.sliceName)
            const bIsPriority = PRIORITY_SLICES.includes(b.sliceName)
            if (aIsPriority && !bIsPriority) return -1
            if (!aIsPriority && bIsPriority) return 1
            return b.size - a.size // Remove largest first
        })

        // Remove non-priority slices until under limit
        for (const entry of sortedEntries) {
            if (totalSize <= MAX_CACHE_SIZE_BYTES * 0.8) { // Keep 20% margin
                break
            }

            if (!PRIORITY_SLICES.includes(entry.sliceName)) {
                await cache.delete(`${CACHE_KEY}/${entry.sliceName}`)
                totalSize -= entry.size
                console.log(`[Cache] Removed slice: ${entry.sliceName}`)
            }
        }

        console.log(`[Cache] Cache size after cleanup: ${(totalSize / 1024 / 1024).toFixed(2)}MB`)
    } catch (error) {
        console.error('[Cache] Error enforcing cache size limit:', error)
    }
}

/** --- Save a single slice to cache --- */
const saveSliceToCache = async (sliceName, sliceState) => {
    const cache = await caches.open(CACHE_NAME)
    const response = new Response(JSON.stringify(sliceState), {
        headers: { 'Content-Type': 'application/json' },
    })
    await cache.put(`${CACHE_KEY}/${sliceName}`, response)
}

/** --- Load all slices from cache --- */
export const loadStateFromCache = async () => {
    const cache = await caches.open(CACHE_NAME)

    const loadSlice = async (key) => {
        const response = await cache.match(`${CACHE_KEY}/${key}`)
        if (response) {
            const data = await response.json()
            return [key, data]
        }
        return [key, undefined]
    }

    const results = await Promise.all(CONFIG.CACHEABLE_SLICES.map(loadSlice))

    return Object.fromEntries(results)
}

/** --- Store Actions --- */
const storeActions = {
    // Reset entire store to initial state
    reset: () => {
        if (!storeInstance) {return}

        // Dispatch reset actions for each slice that supports it
        // You'll need to implement these reset actions in your slice files
        const resetActions = [
            { type: 'orgUnit/reset' },
            { type: 'malaria/reset' },
            { type: 'ira/reset' },
            { type: 'diarrhea/reset' },
            { type: 'climate/reset' },
            { type: 'app/reset' },
            { type: 'appSettings/reset' },
            { type: 'dataTable/reset' },
            { type: 'temp/reset' },
            { type: 'notification/reset' },
        ]

        resetActions.forEach((action) => {
            try {
                storeInstance.dispatch(action)
            } catch (error) {
                console.warn(
                    `[Store] Reset action ${action.type} not implemented:`,
                    error.message
                )
            }
        })
    },

    // Hydrate store with external data
    hydrate: (data) => {
        if (!storeInstance || !data) return

        Object.keys(data).forEach((sliceName) => {
            if (data[sliceName]) {
                try {
                    storeInstance.dispatch({
                        type: `${sliceName}/hydrate`,
                        payload: data[sliceName],
                    })
                } catch (error) {
                    console.warn(
                        `[Store] Hydrate action ${sliceName}/hydrate not implemented:`,
                        error.message
                    )
                }
            }
        })
    }
}

/** --- Cache Actions --- */
const cacheActions = {
    // Clear cache
    clear: async () => {
        try {
            await clearCache()
            console.log('[Cache] Cache cleared successfully')
        } catch (error) {
            console.error('[Cache] Error clearing cache:', error)
        }
    },

    // Force save current state to cache
    save: async () => {
        if (!storeInstance) return

        try {
            const state = storeInstance.getState()
            const promises = CONFIG.CACHEABLE_SLICES.map((sliceName) => {
                const sliceState = state[sliceName]
                return saveSliceToCache(sliceName, sliceState)
            })

            await Promise.all(promises)
            console.log('[Cache] All cacheable slices saved to cache')
        } catch (error) {
            console.error('[Cache] Error saving cache:', error)
        }
    },
}

/** --- Debounce System --- */
const saveQueue = new Set()
let debounceTimer = null

const debounceSaveSlices = (store) => {
    if (debounceTimer) {
        clearTimeout(debounceTimer)
    }

    debounceTimer = setTimeout(async () => {
        // if (isLastMinuteOfMonth()) {
        //     console.log(
        //         '[Cache] Clearing cache because it is the end of the month.'
        //     )
        //     await clearCache()
        //     saveQueue.clear()
        //     return
        // }

        const state = store.getState()
        const promises = []

        for (const sliceName of saveQueue) {
            const sliceState = state[sliceName]
            promises.push(saveSliceToCache(sliceName, sliceState))
        }

        await Promise.all(promises)

        // Enforce cache size limit after saving
        await enforceCacheSizeLimit()

        console.log('[Cache] Saved slices:', Array.from(saveQueue))
        saveQueue.clear()
    }, DEBOUNCE_DELAY)
}

/** --- Middleware: Save only changed slices --- */
const saveStateToCacheMiddleware = (store) => (next) => (action) => {
    const result = next(action)

    const actionType = action.type
    const sliceName = CONFIG.CACHEABLE_SLICES.find((name) =>
        actionType.startsWith(name + '/')
    )

    if (sliceName) {
        saveQueue.add(sliceName)
        debounceSaveSlices(store)
    }

    return result
}

/** --- DevTools: Sanitizers (Optional for large data) --- */
const actionSanitizer = (action) => {
    // Sanitize large action payloads
    if (action.type === 'FILE_DOWNLOAD_SUCCESS' && action.data) {
        return { ...action, data: '<<LONG_BLOB>>' }
    }

    // Sanitize actions with large payloads from disease data
    if (action.payload && typeof action.payload === 'object') {
        const sanitizedPayload = sanitizeLargeObject(action.payload)
        return { ...action, payload: sanitizedPayload }
    }

    return action
}

const stateSanitizer = (state) => {
    // Sanitize large state objects
    const sanitizedState = {}

    for (const [key, value] of Object.entries(state)) {
        if (key === 'data' && value) {
            sanitizedState[key] = '<<LONG_BLOB>>'
        } else if (typeof value === 'object' && value !== null) {
            sanitizedState[key] = sanitizeLargeObject(value)
        } else {
            sanitizedState[key] = value
        }
    }

    return sanitizedState
}

// Helper function to sanitize large objects/arrays
const sanitizeLargeObject = (obj, maxDepth = 2, maxArrayLength = 10) => {
    if (obj === null || typeof obj !== 'object') {
        return obj
    }

    if (Array.isArray(obj)) {
        if (obj.length > maxArrayLength) {
            return [
                ...obj.slice(0, maxArrayLength),
                `... and ${obj.length - maxArrayLength} more items`
            ]
        }
        return obj.map(item => sanitizeLargeObject(item, maxDepth - 1, maxArrayLength))
    }

    if (maxDepth <= 0) {
        return `<<OBJECT with ${Object.keys(obj).length} keys>>`
    }

    const sanitized = {}
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
            sanitized[key] = sanitizeLargeObject(value, maxDepth - 1, maxArrayLength)
        } else {
            sanitized[key] = value
        }
    }

    return sanitized
}

/** --- Create Store --- */
export const createStore = (preloadedState) => {
    const isDevelopment = process.env.NODE_ENV === 'development'

    const store = configureStore({
        reducer: {
            orgUnit: orgUnitReducer,
            malaria: malariaReducer,
            ira: iraReducer,
            diarrhea: diarrheaReducer,
            appSettings: appSettingsReducer,
            app: appReducer,
            dataTable: dataTableReducer,
            climate: climateReducer,
            temp: tempReducer,
            notification: notificationReducer,
        },
        preloadedState,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
                immutableCheck: false,
            }).concat(saveStateToCacheMiddleware),
        devTools: isDevelopment && {
            name: 'PrideC',
            maxAge: 50,
            trace: false,
            shouldCatchErrors: true,
            actionSanitizer,
            stateSanitizer,
        },
    })

    // Set store reference for utilities
    storeInstance = store

    return store
}

// ===========================================
// UTILITIES FOR COMPONENTS
// ===========================================
export const storeUtils = {
    // Reset entire store
    reset: () => storeActions.reset(),

    // Reset store (alias for reset)
    resetStore: () => storeActions.reset(),

    // Hydrate store with external data
    hydrate: (data) => storeActions.hydrate(data),

    // Cache management
    clearCache: () => cacheActions.clear(),
    saveCache: () => cacheActions.save(),

    // Get cacheable slice names
    getCacheableSlices: () => [...CONFIG.CACHEABLE_SLICES],

    // Additional utilities
    getStoreInstance: () => storeInstance,

    // Check if store is initialized
    isInitialized: () => !!storeInstance,

    // Get current state snapshot
    getState: () => (storeInstance ? storeInstance.getState() : null),

    // Subscribe to store changes
    subscribe: (listener) => (storeInstance ? storeInstance.subscribe(listener) : undefined),
}
