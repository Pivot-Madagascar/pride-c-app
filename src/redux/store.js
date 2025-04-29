import { configureStore } from '@reduxjs/toolkit'
import appSettingsReducer from './appSettings'
import appReducer from './appSlice'
import climateDistrictLvlReducer from './climateDistrictLvlSlice'
import climateFokontanyLvlReducer from './climateFokontanyLvlSlice'
import climateMunicipalityLvlReducer from './climateMunicipalityLvlSlice'
import climateReducer from './climateSlice'
import dataTableReducer from './dataTableSlice'
import diarrheaReducer from './diarrheaSlice'
import iraReducer from './iraSlice'
import malariaReducer from './malariaSlice'
import orgUnitReducer from './orgUnitSlice'
import tempReducer from './tempSlice'

/** --- Constants --- */
const CACHE_KEY = '/redux-state'
const CACHE_NAME = 'redux-cache'
const DEBOUNCE_DELAY = 300 // milliseconds

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

    const slices = ['orgUnit', 'malaria', 'ira', 'diarrhea', 'climate', 'app']

    const loadSlice = async (key) => {
        const response = await cache.match(`${CACHE_KEY}/${key}`)
        if (response) {
            const data = await response.json()
            return [key, data]
        }
        return [key, undefined]
    }

    const results = await Promise.all(slices.map(loadSlice))

    return Object.fromEntries(results)
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

    const sliceNames = [
        'orgUnit',
        'malaria',
        'ira',
        'diarrhea',
        'climate',
        'app',
    ]

    const actionType = action.type

    const sliceName = sliceNames.find((name) =>
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

    return configureStore({
        reducer: {
            orgUnit: orgUnitReducer,
            malaria: malariaReducer,
            ira: iraReducer,
            diarrhea: diarrheaReducer,
            climateFokontanyLvl: climateFokontanyLvlReducer,
            climateDistrictLvl: climateDistrictLvlReducer,
            climateMunicipalityLvl: climateMunicipalityLvlReducer,
            appSettings: appSettingsReducer,
            app: appReducer,
            dataTable: dataTableReducer,
            climate: climateReducer,
            temp: tempReducer,
        },
        preloadedState,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
                immutableCheck: false,
            }).concat(saveStateToCacheMiddleware),
        devTools: isDevelopment && {
            name: 'MyApp',
            maxAge: 50,
            trace: false,
            shouldCatchErrors: true,
            actionSanitizer,
            stateSanitizer,
        },
    })
}
