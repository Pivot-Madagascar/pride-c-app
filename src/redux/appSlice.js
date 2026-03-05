import { createSlice } from '@reduxjs/toolkit'

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
