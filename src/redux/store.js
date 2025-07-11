import { configureStore } from '@reduxjs/toolkit'
import appSettingsReducer from './appSettings'
import appReducer from './appSlice'
import climateReducer from './climateSlice'
import dataTableReducer from './dataTableSlice'
import diarrheaReducer from './diarrheaSlice'
import iraReducer from './iraSlice'
import malariaReducer from './malariaSlice'
import notificationReducer from './notificationSlice'
import orgUnitReducer from './orgUnitSlice'
import tempReducer from './tempSlice'

/** --- Constants --- */
const CACHE_KEY = '/redux-state'
const CACHE_NAME = 'redux-cache'
const DEBOUNCE_DELAY = 300 // milliseconds

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
        if (!storeInstance) return

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
        if (isLastMinuteOfMonth()) {
            console.log(
                '[Cache] Clearing cache because it is the end of the month.'
            )
            await clearCache()
            saveQueue.clear()
            return
        }

        const state = store.getState()
        const promises = []

        for (const sliceName of saveQueue) {
            const sliceState = state[sliceName]
            promises.push(saveSliceToCache(sliceName, sliceState))
        }

        await Promise.all(promises)

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
const actionSanitizer = (action) =>
    action.type === 'FILE_DOWNLOAD_SUCCESS' && action.data
        ? { ...action, data: '<<LONG_BLOB>>' }
        : action

const stateSanitizer = (state) =>
    state.data ? { ...state, data: '<<LONG_BLOB>>' } : state

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
    getState: () => storeInstance?.getState() || null,

    // Subscribe to store changes
    subscribe: (listener) => storeInstance?.subscribe(listener),
}
