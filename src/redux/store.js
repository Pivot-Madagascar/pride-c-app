import { configureStore, combineReducers, createAction } from '@reduxjs/toolkit'
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

// ===========================================
// CONSTANTS & CONFIGURATION
// ===========================================
const CONFIG = {
    CACHE_KEY: 'redux-state',
    CACHE_NAME: 'redux-cache-v1',
    DEBOUNCE_DELAY: 500,
    MAX_CACHE_AGE: 24 * 60 * 60 * 1000, // 24 heures
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    CACHEABLE_SLICES: [
        'orgUnit',
        'malaria',
        'ira',
        'diarrhea',
        'climate',
        'app',
    ],
}

// ===========================================
// ACTIONS
// ===========================================
export const cacheActions = {
    clear: createAction('cache/clear'),
    save: createAction('cache/save'),
    load: createAction('cache/load'),
}

export const storeActions = {
    reset: createAction('store/reset'),
    hydrate: createAction('store/hydrate'),
}

// ===========================================
// ROOT REDUCER
// ===========================================
const appReducers = {
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
}

const rootReducer = combineReducers(appReducers)

const enhancedRootReducer = (state, action) => {
    // Handle store reset
    if (action.type === storeActions.reset.type) {
        return rootReducer(undefined, { type: '@@INIT' })
    }

    // Handle store hydration
    if (action.type === storeActions.hydrate.type) {
        return {
            ...rootReducer(state, action),
            ...action.payload,
        }
    }

    return rootReducer(state, action)
}

// ===========================================
// PERSISTENCE SERVICE
// ===========================================
class PersistenceService {
    constructor(config = CONFIG) {
        this.config = config
        this.cache = null
        this.saveQueue = new Set()
        this.debounceTimer = null
        this.isInitialized = false
    }

    async initialize() {
        if (this.isInitialized) return

        try {
            if ('caches' in window) {
                this.cache = await caches.open(this.config.CACHE_NAME)
                this.isInitialized = true
            }
        } catch (error) {
            console.warn(
                '[Persistence] Cache API not available:',
                error.message
            )
        }
    }

    async loadState() {
        if (!this.isInitialized) return {}

        try {
            const cacheEntries = await Promise.allSettled(
                this.config.CACHEABLE_SLICES.map(async (sliceName) => {
                    const response = await this.cache.match(
                        `${this.config.CACHE_KEY}/${sliceName}`
                    )
                    if (!response) return null

                    const data = await response.json()
                    const timestamp = response.headers.get('x-cache-timestamp')

                    // Check cache age
                    if (
                        timestamp &&
                        Date.now() - parseInt(timestamp) >
                            this.config.MAX_CACHE_AGE
                    ) {
                        await this.cache.delete(
                            `${this.config.CACHE_KEY}/${sliceName}`
                        )
                        return null
                    }

                    return [sliceName, data]
                })
            )

            const validEntries = cacheEntries
                .filter(
                    (result) => result.status === 'fulfilled' && result.value
                )
                .map((result) => result.value)

            return Object.fromEntries(validEntries)
        } catch (error) {
            console.error('[Persistence] Load error:', error)
            return {}
        }
    }

    async saveSlice(sliceName, sliceState) {
        if (!this.isInitialized) return false

        try {
            const response = new Response(JSON.stringify(sliceState), {
                headers: {
                    'Content-Type': 'application/json',
                    'x-cache-timestamp': Date.now().toString(),
                },
            })

            await this.cache.put(
                `${this.config.CACHE_KEY}/${sliceName}`,
                response
            )
            return true
        } catch (error) {
            console.error(`[Persistence] Save error for ${sliceName}:`, error)
            return false
        }
    }

    async saveWithRetry(sliceName, sliceState) {
        for (let attempt = 1; attempt <= this.config.MAX_RETRIES; attempt++) {
            const success = await this.saveSlice(sliceName, sliceState)
            if (success) return true

            if (attempt < this.config.MAX_RETRIES) {
                await new Promise((resolve) =>
                    setTimeout(resolve, this.config.RETRY_DELAY * attempt)
                )
            }
        }
        return false
    }

    async executeSave(storeRef) {
        if (this.saveQueue.size === 0) return

        const slicesToSave = Array.from(this.saveQueue)
        this.saveQueue.clear()

        if (!storeRef) return

        const state = storeRef.getState()
        const savePromises = slicesToSave.map((sliceName) =>
            this.saveWithRetry(sliceName, state[sliceName])
        )

        try {
            const results = await Promise.allSettled(savePromises)
            const failedSaves = results
                .map((result, index) => ({
                    result,
                    slice: slicesToSave[index],
                }))
                .filter(
                    ({ result }) =>
                        result.status === 'rejected' || !result.value
                )
                .map(({ slice }) => slice)

            if (failedSaves.length > 0) {
                console.warn(
                    '[Persistence] Failed to save slices:',
                    failedSaves
                )
            }

            if (process.env.NODE_ENV === 'development') {
                console.log('[Persistence] Saved slices:', slicesToSave)
            }
        } catch (error) {
            console.error('[Persistence] Batch save error:', error)
        }
    }

    scheduleSave(sliceName, storeRef) {
        this.saveQueue.add(sliceName)

        clearTimeout(this.debounceTimer)
        this.debounceTimer = setTimeout(() => {
            this.executeSave(storeRef)
        }, this.config.DEBOUNCE_DELAY)
    }

    async clearCache() {
        try {
            if (this.cache) {
                const keys = await this.cache.keys()
                await Promise.all(keys.map((key) => this.cache.delete(key)))
            }
            clearTimeout(this.debounceTimer)
            this.saveQueue.clear()
            console.log('[Persistence] Cache cleared')
        } catch (error) {
            console.error('[Persistence] Clear cache error:', error)
        }
    }

    cleanup() {
        clearTimeout(this.debounceTimer)
        this.saveQueue.clear()
    }
}

// ===========================================
// PERSISTENCE MIDDLEWARE
// ===========================================
const createPersistenceMiddleware = (persistenceService) => {
    return (store) => (next) => (action) => {
        const result = next(action)

        // Handle cache actions
        if (action.type === cacheActions.clear.type) {
            persistenceService.clearCache()
            return result
        }

        if (action.type === cacheActions.save.type) {
            persistenceService.executeSave(store)
            return result
        }

        // Auto-save cacheable slices
        const actionSlice = action.type.split('/')[0]
        if (CONFIG.CACHEABLE_SLICES.includes(actionSlice)) {
            persistenceService.scheduleSave(actionSlice, store)
        }

        return result
    }
}

// ===========================================
// STORE FACTORY
// ===========================================
export const createAppStore = async (options = {}) => {
    const {
        preloadedState = {},
        enablePersistence = true,
        config = CONFIG,
    } = options

    // Initialize persistence
    let persistenceService = null
    let persistedState = {}

    if (enablePersistence && typeof window !== 'undefined') {
        persistenceService = new PersistenceService(config)
        await persistenceService.initialize()
        persistedState = await persistenceService.loadState()
    }

    // Merge states
    const initialState = {
        ...persistedState,
        ...preloadedState,
    }

    // Create store
    const store = configureStore({
        reducer: enhancedRootReducer,
        preloadedState: initialState,
        middleware: (getDefaultMiddleware) => {
            const middlewares = getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [storeActions.hydrate.type],
                },
                immutableCheck: false,
            })

            if (persistenceService) {
                middlewares.push(
                    createPersistenceMiddleware(persistenceService)
                )
            }

            return middlewares
        },
        devTools: process.env.NODE_ENV === 'development' && {
            name: 'PrideC Store',
            maxAge: 50,
            actionSanitizer: (action) => {
                if (
                    action.type.includes('FILE_DOWNLOAD') &&
                    action.payload?.data
                ) {
                    return {
                        ...action,
                        payload: { ...action.payload, data: '<<BLOB>>' },
                    }
                }
                return action
            },
        },
    })

    // Setup cleanup
    if (typeof window !== 'undefined' && persistenceService) {
        const cleanup = () => {
            if (persistenceService.saveQueue.size > 0) {
                // Force immediate save on page unload
                persistenceService.executeSave(store)
            }
            persistenceService.cleanup()
        }

        window.addEventListener('beforeunload', cleanup, { once: true })
        window.addEventListener('pagehide', cleanup, { once: true })
    }

    // Expose persistence controls
    store.persistence = {
        save: () =>
            persistenceService
                ? persistenceService.executeSave(store)
                : Promise.resolve(),
        clear: () =>
            persistenceService
                ? persistenceService.clearCache()
                : Promise.resolve(),
        isEnabled: !!persistenceService,
    }

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
}

// ===========================================
// EXPORTS
// ===========================================
export default createAppStore
export { CONFIG as STORE_CONFIG }