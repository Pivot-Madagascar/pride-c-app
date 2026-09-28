import { createSlice } from "@reduxjs/toolkit"
import { getNextThreeMonths } from "@/utils/diseaseData"

const getNextThreeMonthsDetails = () =>
    getNextThreeMonths().map((value) => {
        const year = Number(value.slice(0, 4))
        const month = Number(value.slice(4, 6))

        const label = new Date(Date.UTC(year, month - 1, 1)).toLocaleString(
            'default',
            {
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC',
            }
        )

        return { label, value, show: true }
    }
)

const initialState = {
    activePeriods: undefined,
    periodOptions: getNextThreeMonthsDetails()
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