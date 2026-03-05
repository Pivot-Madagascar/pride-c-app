import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    ageClasses: null
}

const appSettingsSlice = createSlice({
    name: 'appSettings',
    initialState,
    reducers: {
        reset: () => initialState,
        setAgeClasses: (state, { payload }) => {
            state.ageClasses = payload
        }
    }
})

export const { reset, setAgeClasses } = appSettingsSlice.actions

export default appSettingsSlice.reducer