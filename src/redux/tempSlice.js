import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    selectors: {
        source: undefined,
        adminLevel: undefined,
        orgUnit: undefined,
    }
}

const tempSlice = createSlice({
    name: 'temp',
    initialState,
    reducers: {
        setSelectors: (state, { payload }) => {
            state.selectors = {
                ...state.selectors,
                ...payload,
            }
        },
    },
})

export const { setSelectors } = tempSlice.actions

export default tempSlice.reducer
