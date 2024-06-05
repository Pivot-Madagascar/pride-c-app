import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    malariaMean: [],
    malariaLower: [],
    malariaUpper: []
}

const malariaSlice = createSlice({
    name: "malaria",
    initialState,
    reducer: {
        setMalariaMean: (state, { payload }) => {
            state.malariaMean = payload
        },
        setMalariaLower: (state, { payload }) => {
            state.malariaLower = payload
        },
        setMalariaUpper: (state, { payload }) => {
            state.malariaUpper = payload
        }
    }
})

export const {
    setMalariaMean,
    setMalariaLower,
    setMalariaUpper
} = malariaSlice.actions

export default malariaSlice.reducer