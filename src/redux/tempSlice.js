import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    selectors: {
        source: undefined,
        adminLevel: undefined,
        orgUnit: undefined,
    }
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setSelectors: (state, { payload }) => {
            state.selectors = {
                ...state.selectors,
                ...payload
            }
        },
    }
})

export const { 
    setSelectors
} = appSlice.actions

export default appSlice.reducer