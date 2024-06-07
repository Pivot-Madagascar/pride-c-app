import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    ageClasses: null
}

const appSettingsSlice = createSlice({
    name: 'appSettings',
    initialState,
    reducers: {
        setAgeClasses: (state, { payload }) => {
            state.ageClasses = payload
        }
    }
})

export const { setAgeClasses } = appSettingsSlice.actions

export default appSettingsSlice.reducer