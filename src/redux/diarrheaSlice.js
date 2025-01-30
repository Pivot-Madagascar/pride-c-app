import { createSlice } from '@reduxjs/toolkit'
import { DIARRHEA } from '../constants/mapping'

const initialState = {
    historic: {
        adjusted: { data: DIARRHEA.historic.adjusted },
        csbCases: { data: DIARRHEA.historic.csbCases },
        comCases: { data: DIARRHEA.historic.comCases },
        simulation: { data: DIARRHEA.forecast.adjusted.avg }
    },
    forecast: {
        adjusted: {
            avg: { data: DIARRHEA.forecast.adjusted.avg },
            lowci: { data: DIARRHEA.forecast.adjusted.lowci },
            uppci: { data: DIARRHEA.forecast.adjusted.uppci },
            dataTable: {},
            annualAvg : {}
        },
        csbCases: {
            avg: { data: DIARRHEA.forecast.csbCases.avg },
            lowci: { data: DIARRHEA.forecast.csbCases.lowci },
            uppci: { data: DIARRHEA.forecast.csbCases.uppci },
        },
        comCases: {
            avg: { data: DIARRHEA.forecast.comCases.avg },
            lowci: { data: DIARRHEA.forecast.comCases.lowci },
            uppci: { data: DIARRHEA.forecast.comCases.uppci },
        },
    },
    alert: {
            csb: { dataElement: DIARRHEA.alert.csb },
            comCases: { dataElement: DIARRHEA.alert.comCases },
            incidence: { dataElement: DIARRHEA.alert.incidence },
            csbVigilance: { dataElement: DIARRHEA.alert.csbVigilance },
        },
        compare: {
            csb: { dataElement: DIARRHEA.compare.csb },
            comCases: { dataElement: DIARRHEA.compare.comCases },
            incidence: { dataElement: DIARRHEA.compare.incidence },
            trend: { dataElement: DIARRHEA.compare.trend },
        },
}

const diarrheaSlice = createSlice({
    name: 'diarrhea',
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
        setDiarrheaAlertData: (state, action) => {
            const { caseType, adminLevel, data } = action.payload
            if (state.alert[caseType]) {
                state.alert[caseType][adminLevel] = data
            } else {
                console.error(`Invalid alertType: ${caseType}`)
            }
        },
        setDiarrheaCompareData: (state, action) => {
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
    setForecastData,
    clearForecastData,
    setDiarrheaAlertData,
    setDiarrheaCompareData
} = diarrheaSlice.actions

export default diarrheaSlice.reducer
