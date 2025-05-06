import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    fetchedDimensions: []
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setFetchedDimensions: (state, { payload }) => {
            state.fetchedDimensions.push(payload)
        },
    },
})

export const { setFetchedDimensions } = appSlice.actions

export default appSlice.reducer
