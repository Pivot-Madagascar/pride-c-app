import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    historic: {},
    forecast: {},
    alert: {},
    compare: {},
    simulation: {},
    currentOrgUnit: undefined
}

const iraSlice = createSlice({
    name: 'ira',
    initialState,
    reducers: {
        setIraData: (state, action) => {
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
    setIraData,
    setCurrentOrgUnit
} = iraSlice.actions

export default iraSlice.reducer
