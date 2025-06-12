import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    fetchedDimensions: [],
    isOnline: true,
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setFetchedDimensions: (state, { payload }) => {
            // Avoid duplicates
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
    },
})

export const { setFetchedDimensions, setOnlineStatus, clearFetchedDimensions } =
    appSlice.actions

export default appSlice.reducer
