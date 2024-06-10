import { configureStore } from '@reduxjs/toolkit'
import appSettingsReducer from './appSettings'
import climateReducer from './climateSlice'
import diarrheaReducer from './diarrheaSlice'
import iraReducer from './iraSlice'
import malariaReducer from './malariaSlice'
import orgUnitReducer from './orgUnitSlice'

// Custom middleware to save state to sessionStorage
const saveStateToStorage = (store) => (next) => (action) => {
    const result = next(action)
    sessionStorage.setItem('pridec', JSON.stringify(store.getState()))
    return result
}

// Load persisted state from sessionStorage
const loadStateFromStorage = () => {
    const serializedState = sessionStorage.getItem('pridec')
    return serializedState ? JSON.parse(serializedState) : undefined
}

const store = configureStore({
    reducer: {
        orgUnit: orgUnitReducer,
        malaria: malariaReducer,
        ira: iraReducer,
        diarrhea: diarrheaReducer,
        climate: climateReducer,
        appSettings: appSettingsReducer
    },
    preloadedState: loadStateFromStorage(),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(saveStateToStorage),
})

export default store
