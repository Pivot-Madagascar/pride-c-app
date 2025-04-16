import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    historic: {},
    forecast: {},
    alert: {},
    compare: {},
    simulation: {}
}

const iraSlice = createSlice({
    name: 'ira',
    initialState,
    reducers: {
        setHistoricData: (state, action) => {
            const { caseType, adminLevel, data } = action.payload
            if (state.historic[caseType]) {
                state.historic[caseType][adminLevel] = data
            } else {
                console.error(`Invalid caseType: ${caseType} for historic data`)
            }
        },
        clearHistoricData: (state, action) => {
            const { caseType, adminLevel } = action.payload
            if (state.historic[caseType]) {
                state.historic[caseType][adminLevel] = []
            } else {
                console.error(`Invalid caseType: ${caseType} for historic data`)
            }
        },
        setForecastData: (state, action) => {
            const { forecastType, caseType, adminLevel, data } = action.payload

            if (
                state.forecast[forecastType] &&
                state.forecast[forecastType][caseType]
            ) {
                state.forecast[forecastType][caseType][adminLevel] = data
            } else {
                console.error(
                    `Invalid forecastType: ${forecastType} or caseType: ${caseType}`
                )
            }
        },
        clearForecastData: (state, action) => {
            const { forecastType, caseType, adminLevel } = action.payload

            if (
                state.forecast[forecastType] &&
                state.forecast[forecastType][caseType]
            ) {
                state.forecast[forecastType][caseType][adminLevel] = []
            } else {
                console.error(
                    `Invalid forecastType: ${forecastType} or caseType: ${caseType}`
                )
            }
        },
        setIraAlertData: (state, action) => {
            const { caseType, adminLevel, data } = action.payload
            if (state.alert[caseType]) {
                state.alert[caseType][adminLevel] = data
            } else {
                console.error(`Invalid alertType: ${caseType}`)
            }
        },
        setIraCompareData: (state, action) => {
            const { caseType, adminLevel, data } = action.payload
            if (state.compare[caseType]) {
                state.compare[caseType][adminLevel] = data
            } else {
                console.error(`Invalid compareType: ${caseType}`)
            }
        },
        setIraData: (state, action) => {
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
    setHistoricData,
    clearHistoricData,
    setForecastData,
    clearForecastData,
    setIraAlertData,
    setIraCompareData,
    setIraData
} = iraSlice.actions

export default iraSlice.reducer
