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
    name: 'disease_ira',
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
} = iraSlice.actions;

export default iraSlice.reducer
