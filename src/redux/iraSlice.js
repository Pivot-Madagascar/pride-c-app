import { createSlice } from '@reduxjs/toolkit'
import { IRA } from '../constants/mapping'

const initialState = {
    historic: {
        adjusted: { data: IRA.historic.adjusted },
        csbCases: { data: IRA.historic.csbCases },
        comCases: { data: IRA.historic.comCases },
        simulation: { data: IRA.forecast.adjusted.avg },
    },
    forecast: {
        adjusted: {
            avg: { data: IRA.forecast.adjusted.avg },
            lowci: { data: IRA.forecast.adjusted.lowci },
            uppci: { data: IRA.forecast.adjusted.uppci },
            dataTable: {},
            annualAvg: {},
        },
        csbCases: {
            avg: { data: IRA.forecast.csbCases.avg},
            lowci: { data: IRA.forecast.csbCases.lowci },
            uppci: { data: IRA.forecast.csbCases.uppci },
        },
        comCases: {
            avg: { data: IRA.forecast.comCases.avg },
            lowci: { data: IRA.forecast.comCases.lowci },
            uppci: { data: IRA.forecast.comCases.uppci },
        },
    },
    alert: {
        csb: { dataElement: IRA.alert.csb },
        comCases: { dataElement: IRA.alert.comCases },
        incidence: { dataElement: IRA.alert.incidence },
        csbVigilance: { dataElement: IRA.alert.csbVigilance },
    },
    compare: {
        csb: { dataElement: IRA.compare.csb },
        comCases: { dataElement: IRA.compare.comCases },
        incidence: { dataElement: IRA.compare.incidence },
        trend: { dataElement: IRA.compare.trend },
    },
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
