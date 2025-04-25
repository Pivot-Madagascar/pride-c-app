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

const CACHE_KEY = '/redux-state'
const CACHE_NAME = 'redux-cache'

// Async: Save state to Cache Storage
const saveStateToCache = async (stateToPersist) => {
    const cache = await caches.open(CACHE_NAME)
    const response = new Response(JSON.stringify(stateToPersist), {
        headers: { 'Content-Type': 'application/json' },
    })
    await cache.put(CACHE_KEY, response)
}

// Async: Load state from Cache Storage
export const loadStateFromCache = async () => {
    const cache = await caches.open(CACHE_NAME)
    const response = await cache.match(CACHE_KEY)
    if (response) {
        const data = await response.json()
        return data
    }
    return undefined
}

// Middleware to save specific slices to cache
const saveStateToCacheMiddleware = (store) => (next) => (action) => {
    const result = next(action)

    const stateToPersist = {
        orgUnit: store.getState().orgUnit,
        malaria: store.getState().malaria,
        ira: store.getState().ira,
        diarrhea: store.getState().diarrhea,
        climate: store.getState().climate,
        app: store.getState().app,
    }

    // Fire and forget
    saveStateToCache(stateToPersist)

    return result
}

// Redux DevTools sanitizers
const actionSanitizer = (action) =>
    action.type === 'FILE_DOWNLOAD_SUCCESS' && action.data
        ? { ...action, data: '<<LONG_BLOB>>' }
        : action

const stateSanitizer = (state) =>
    state.data ? { ...state, data: '<<LONG_BLOB>>' } : state

// Function to create store (to be used after loading preloaded state)
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
