import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    historic: {},
    forecast: {},
    alert: {},
    compare: {},
    simulation: {},
    currentOrgUnit: undefined
}

const diarrheaSlice = createSlice({
    name: 'diarrhea',
    initialState,
    reducers: {
        setDiarrheaData: (state, action) => {
            const { path, value } = action.payload
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
    setDiarrheaData,
    setCurrentOrgUnit
} = diarrheaSlice.actions

export default diarrheaSlice.reducer
