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
        reset: () => initialState,
        setSelectors: (state, { payload }) => {
            state.selectors = {
                ...state.selectors,
                ...payload,
            }
        },
    },
})

export const { reset, setSelectors } = tempSlice.actions

export default tempSlice.reducer
