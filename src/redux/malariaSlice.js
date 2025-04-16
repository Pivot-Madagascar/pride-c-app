import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    historic: {},
    forecast: {},
    alert: {},
    compare: {},
    simulation: {}
}

const malariaSlice = createSlice({
    name: 'malaria',
    initialState,
    reducers: {
        setMalariaData: (state, action) => {
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
    setMalariaData,
} = malariaSlice.actions

export default malariaSlice.reducer
