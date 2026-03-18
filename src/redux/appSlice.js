import { createSlice } from '@reduxjs/toolkit'

const MAX_DIMENSIONS = 110000

const initialState = {
    fetchedDimensions: [],
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
        setOnlineStatus: (state, { payload }) => {
            state.isOnline = payload
        },
        clearFetchedDimensions: (state) => {
            state.fetchedDimensions = []
        },
        setLastDataUpdate: (state, { payload }) => {
            state.lastDataUpdate = payload
        },
    },
})

export const {
    reset,
    setFetchedDimensions,
    setOnlineStatus,
    clearFetchedDimensions,
    setLastDataUpdate,
} = appSlice.actions

export default appSlice.reducer
