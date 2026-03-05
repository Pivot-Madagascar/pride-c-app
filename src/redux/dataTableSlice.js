import { createSlice } from "@reduxjs/toolkit"

const getLastThreeMonths = () => {
    const months = []
    const currentDate = new Date()

    for (let i = 0; i < 3; i++) {
        const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + i,
            1
        )
        const label = date.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
        })
        const value = `${date.getFullYear()}${String(
            date.getMonth() + 1
        ).padStart(2, '0')}`
        months.push({ label, value, show: true })
    }

    return months
}

const initialState = {
    activePeriods: undefined,
    periodOptions: getLastThreeMonths()
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