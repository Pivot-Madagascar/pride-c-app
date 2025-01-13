import { createSlice } from '@reduxjs/toolkit'
import { MALARIA } from '../constants/mapping'

const initialState = {
    historic: {
        adjusted: {
            data: MALARIA.historic.adjusted,
            district: undefined,
            municipal: undefined,
            fokontany: undefined,
        },
        csbCases: {
            data: MALARIA.historic.csbCases,
            district: undefined,
            municipal: undefined,
            fokontany: undefined,
        },
        comCases: {
            data: MALARIA.historic.comCases,
            district: undefined,
            municipal: undefined,
            fokontany: undefined,
        },
        simulation: {
            data: MALARIA.forecast.adjusted.avg,
            district: undefined,
            municipal: undefined,
            fokontany: undefined,
        },
    },
    forecast: {
        adjusted: {
            avg: {
                data: MALARIA.forecast.adjusted.avg,
                district: undefined,
                municipal: undefined,
                fokontany: undefined,
            },
            lowci: {
                data: MALARIA.forecast.adjusted.lowci,
                district: undefined,
                municipal: undefined,
                fokontany: undefined,
            },
            uppci: {
                data: MALARIA.forecast.adjusted.uppci,
                district: undefined,
                municipal: undefined,
                fokontany: undefined,
            },
            dataTable: {
                municipal: undefined,
                fokontany: undefined,
            },
            annualAvg: {
                district: undefined,
                municipal: undefined,
                fokontany: undefined,
            },
        },
        csbCases: {
            avg: {
                data: MALARIA.forecast.csbCases.avg,
                district: undefined,
                municipal: undefined,
                fokontany: undefined,
            },
            lowci: {
                data: MALARIA.forecast.csbCases.lowci,
                district: undefined,
                municipal: undefined,
                fokontany: undefined,
            },
            uppci: {
                data: MALARIA.forecast.csbCases.uppci,
                district: undefined,
                municipal: undefined,
                fokontany: undefined,
            },
        },
        comCases: {
            avg: {
                data: MALARIA.forecast.comCases.avg,
                district: undefined,
                municipal: undefined,
                fokontany: undefined,
            },
            lowci: {
                data: MALARIA.forecast.comCases.lowci,
                district: undefined,
                municipal: undefined,
                fokontany: undefined,
            },
            uppci: {
                data: MALARIA.forecast.comCases.uppci,
                district: undefined,
                municipal: undefined,
                fokontany: undefined,
            },
        },
    },
    alert: {
        csb: {
            dataElement: MALARIA.alert.csb,
            district: undefined,
        },
        comCases: {
            dataElement: MALARIA.alert.comCases,
            district: undefined,
        },
        incidence: {
            dataElement: MALARIA.alert.incidence,
            district: undefined,
        },
        csbVigilance: {
            dataElement: MALARIA.alert.csbVigilance,
            district: undefined,
        },
    },
    compare: {
        csb: {
            dataElement: MALARIA.compare.csb,
            district: undefined,
        },
        comCases: {
            dataElement: MALARIA.compare.comCases,
            district: undefined,
        },
        incidence: {
            dataElement: MALARIA.compare.incidence,
            district: undefined,
        },
        trend: {
            dataElement: MALARIA.compare.trend,
            district: undefined,
        },
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
