import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    historic: {},
    forecast: {},
    alert: {},
    compare: {},
    simulation: {},
    currentOrgUnit: undefined
}

const malariaSlice = createSlice({
    name: 'malaria',
    initialState,
    reducers: {
        reset: () => initialState,
        setMalariaData: (state, { payload }) => {
            const { path, value } = payload
            const lastKey = path.pop() 
            let current = state
            path.forEach((key) => {
                if (!current[key]) {
                    current[key] = {} 
                }
                current = current[key] 
            })
            current[lastKey] = value
        },
        setCurrentOrgUnit: (state, { payload }) => {
            state.currentOrgUnit = payload
        }
    },
})

export const {
    reset,
    setMalariaData,
    setCurrentOrgUnit
} = malariaSlice.actions

export default malariaSlice.reducer
