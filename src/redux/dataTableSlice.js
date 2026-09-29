import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    activePeriods: undefined,
    periodOptions: []
}

const dataTableSlice = createSlice({
    name: 'dataTable',
    initialState,
    reducers: {
        reset: () => initialState,
        setActivePeriods: (state, { payload }) => {
            state.activePeriods = payload
        },
        setPeriodOptions: (state, { payload }) => {
            state.periodOptions = payload
        }
    }
})

export const { reset, setActivePeriods, setPeriodOptions } = dataTableSlice.actions

export default dataTableSlice.reducer