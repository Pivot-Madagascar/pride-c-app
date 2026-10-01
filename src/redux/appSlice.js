import { createSlice } from '@reduxjs/toolkit'

const MAX_DIMENSIONS = 110000
const MAX_FETCHED_KEYS = 10000

const initialState = {
    fetchedDimensions: [],
    fetchedDataElementKeys: [],
    fetchedIndicatorKeys: [],
    isOnline: true,
    lastDataUpdate: null,
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        reset: () => initialState,
        setFetchedDimensions: (state, { payload }) => {
            if (!state.fetchedDimensions.includes(payload)) {
                state.fetchedDimensions.push(payload)
                
                // Auto-cleanup: keep only 50% most recent if exceeds limit
                if (state.fetchedDimensions.length > MAX_DIMENSIONS) {
                    const keepCount = Math.floor(MAX_DIMENSIONS / 2)
                    state.fetchedDimensions = state.fetchedDimensions.slice(-keepCount)
                    console.log(`[AppSlice] Dimensions cleaned up. Keeping ${keepCount} most recent of ${MAX_DIMENSIONS} max.`)
                }
            }
        },
        setFetchedDataElementKeys: (state, { payload }) => {
            if (!state.fetchedDataElementKeys.includes(payload)) {
                state.fetchedDataElementKeys.push(payload)
                if (state.fetchedDataElementKeys.length > MAX_FETCHED_KEYS) {
                    const keepCount = Math.floor(MAX_FETCHED_KEYS / 2)
                    state.fetchedDataElementKeys = state.fetchedDataElementKeys.slice(-keepCount)
                }
            }
        },
        setFetchedIndicatorKeys: (state, { payload }) => {
            if (!state.fetchedIndicatorKeys.includes(payload)) {
                state.fetchedIndicatorKeys.push(payload)
                if (state.fetchedIndicatorKeys.length > MAX_FETCHED_KEYS) {
                    const keepCount = Math.floor(MAX_FETCHED_KEYS / 2)
                    state.fetchedIndicatorKeys = state.fetchedIndicatorKeys.slice(-keepCount)
                }
            }
        },
        setOnlineStatus: (state, { payload }) => {
            state.isOnline = payload
        },
        clearFetchedDimensions: (state) => {
            state.fetchedDimensions = []
        },
        clearFetchedDataElementKeys: (state) => {
            state.fetchedDataElementKeys = []
        },
        clearFetchedIndicatorKeys: (state) => {
            state.fetchedIndicatorKeys = []
        },
        setLastDataUpdate: (state, { payload }) => {
            state.lastDataUpdate = payload
        },
    },
})

export const {
    reset,
    setFetchedDimensions,
    setFetchedDataElementKeys,
    setFetchedIndicatorKeys,
    setOnlineStatus,
    clearFetchedDimensions,
    clearFetchedDataElementKeys,
    clearFetchedIndicatorKeys,
    setLastDataUpdate,
} = appSlice.actions

export default appSlice.reducer
