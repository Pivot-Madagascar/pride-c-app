import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    diarrheaMean: [],
    diarrheaLower: [],
    diarrheaUpper: []
}

const diarrheaSlice = createSlice({
    name: "diarrhea",
    initialState,
    reducer: {
        setDiarrheaMean: (state, { payload }) => {
            state.diarrheaMean = payload
        },
        setDiarrheaLower: (state, { payload }) => {
            state.diarrheaLower = payload
        },
        setDiarrheaUpper: (state, { payload }) => {
            state.diarrheaUpper = payload
        }
    }
})

export const {
    setDiarrheaMean,
    setDiarrheaLower,
    setDiarrheaUpper
} = diarrheaSlice.actions

export default diarrheaSlice.reducer