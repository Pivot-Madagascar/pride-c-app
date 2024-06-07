import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    malariaMean: null,
    malariaLower: null,
    malariaUpper: null,
    combinedData: null
}

const malariaSlice = createSlice({
    name: "malaria",
    initialState,
    reducers: {
        setMalariaMean: (state, { payload }) => {
            state.malariaMean = payload
        },
        setMalariaLower: (state, { payload }) => {
            state.malariaLower = payload
        },
        setMalariaUpper: (state, { payload }) => {
            state.malariaUpper = payload
        },
        setCombinedData: (state, { payload }) => {
            state.combinedData = payload
        }
    }
})

export const {
    setMalariaMean,
    setMalariaLower,
    setMalariaUpper,
    setCombinedData
} = malariaSlice.actions

export default malariaSlice.reducer