import { createSlice } from '@reduxjs/toolkit'
import { MALARIA } from '../constants/mapping'

const initialState = {
    historic: {
        adjusted: { data: MALARIA.historic.adjusted },
        csbCases: { data: MALARIA.historic.csbCases },
        comCases: { data: MALARIA.historic.comCases },
        simulation: { data: MALARIA.forecast.adjusted.avg },
    },
    forecast: {
        adjusted: {
            avg: { data: MALARIA.forecast.adjusted.avg },
            lowci: { data: MALARIA.forecast.adjusted.lowci },
            uppci: { data: MALARIA.forecast.adjusted.uppci },
            dataTable: {},
            annualAvg: {},
        },
        csbCases: {
            avg: { data: MALARIA.forecast.csbCases.avg },
            lowci: { data: MALARIA.forecast.csbCases.lowci },
            uppci: { data: MALARIA.forecast.csbCases.uppci },
        },
        comCases: {
            avg: { data: MALARIA.forecast.comCases.avg },
            lowci: { data: MALARIA.forecast.comCases.lowci },
            uppci: { data: MALARIA.forecast.comCases.uppci },
        },
    },
    alert: {
        csb: { dataElement: MALARIA.alert.csb },
        comCases: { dataElement: MALARIA.alert.comCases },
        incidence: { dataElement: MALARIA.alert.incidence },
        csbVigilance: { dataElement: MALARIA.alert.csbVigilance },
        trend: { dataElement: MALARIA.compare.trend }
    },
    compare: {
        csb: { dataElement: MALARIA.compare.csb },
        comCases: { dataElement: MALARIA.compare.comCases },
        incidence: { dataElement: MALARIA.compare.incidence }
    },
}

const malariaSlice = createSlice({
    name: 'malaria',
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
        setMalariaAlertData: (state, action) => {
            const { caseType, adminLevel, data } = action.payload
            if (state.alert[caseType]) {
                state.alert[caseType][adminLevel] = data
            } else {
                console.error(`Invalid alertType: ${caseType}`)
            }
        },
        setMalariaCompareData: (state, action) => {
            const { caseType, adminLevel, data } = action.payload
            if (state.compare[caseType]) {
                state.compare[caseType][adminLevel] = data
            } else {
                console.error(`Invalid compareType: ${caseType}`)
            }
        },
    },
})

export const {
    setHistoricData,
    clearHistoricData,
    setMalariaAlertData,
    setForecastData,
    clearForecastData,
    setMalariaCompareData
} = malariaSlice.actions

export default malariaSlice.reducer
