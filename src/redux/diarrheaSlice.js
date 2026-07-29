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
    name: 'disease_diarrhea',
    initialState,
    reducers: {
        reset: () => initialState,
        setData: (state, action) => {
            const { path, value } = action.payload;
            const lastKey = path.pop();
            let current = state;
            path.forEach((key) => {
                if (!current[key]) {
                    current[key] = {};
                }
                current = current[key];
            });
            current[lastKey] = value;
        },
        setCurrentOrgUnit: (state, action) => {
            state.currentOrgUnit = action.payload;
        },
    },
});

export const {
    reset,
    setData,
    setCurrentOrgUnit,
} = diarrheaSlice.actions;

export default diarrheaSlice.reducer
