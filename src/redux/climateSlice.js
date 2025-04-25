import { createSlice } from '@reduxjs/toolkit'

const initialState = {}

const climateSlice = createSlice({
    name: 'climate',
    initialState,
    reducers: {
        setClimateData: (state, action) => {
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
    },
})

export const {
    setClimateData
} = climateSlice.actions

export default climateSlice.reducer
