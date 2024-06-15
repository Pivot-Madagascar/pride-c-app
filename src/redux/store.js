import { configureStore } from '@reduxjs/toolkit'
import appSettingsReducer from './appSettings'
import climateReducer from './climateSlice'
import diarrheaReducer from './diarrheaSlice'
import iraReducer from './iraSlice'
import malariaReducer from './malariaSlice'
import orgUnitReducer from './orgUnitSlice'

const actionSanitizer = (action) =>
    action.type === 'FILE_DOWNLOAD_SUCCESS' && action.data
        ? { ...action, data: '<<LONG_BLOB>>' }
        : action

const stateSanitizer = (state) =>
    state.data ? { ...state, data: '<<LONG_BLOB>>' } : state

// Custom middleware to save state to sessionStorage
const saveStateToStorage = (store) => (next) => (action) => {
    const result = next(action)
    const stateToPersist = { orgUnit: store.getState().orgUnit }
    sessionStorage.setItem('pridec', JSON.stringify(stateToPersist))
    return result
}

// Load persisted state from sessionStorage
const loadStateFromStorage = () => {
    const serializedState = sessionStorage.getItem('pridec')
    return serializedState ? JSON.parse(serializedState) : undefined
}

const preloadedState = loadStateFromStorage()
const initialState = {
    orgUnit: preloadedState ? preloadedState.orgUnit : undefined,
}

const isDevelopment = process.env.NODE_ENV === 'development'

const store = configureStore({
    reducer: {
        orgUnit: orgUnitReducer,
        malaria: malariaReducer,
        ira: iraReducer,
        diarrhea: diarrheaReducer,
        climate: climateReducer,
        appSettings: appSettingsReducer,
    },
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat(
            saveStateToStorage
        ),
    devTools: isDevelopment && {
        name: 'MyApp',
        maxAge: 50,
        trace: false,
        shouldCatchErrors: true,
        actionSanitizer,
        stateSanitizer,
    },
})

export default store
