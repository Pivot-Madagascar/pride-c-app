import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    iraMean: [],
    iraLower: [],
    iraUpper: []
}

const iraSlice = createSlice({
    name: "ira",
    initialState,
    reducer: {
        setIraMean: (state, { payload }) => {
            state.malariaMean = payload
        },
        setIraLower: (state, { payload }) => {
            state.malariaLower = payload
        },
        setIraUpper: (state, { payload }) => {
            state.malariaUpper = payload
        }
    }
})

export const {
    setIraMean,
    setIraLower,
    setIraUpper
} = iraSlice.actions

export default iraSlice.reducer