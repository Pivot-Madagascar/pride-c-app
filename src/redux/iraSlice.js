import { createSlice } from '@reduxjs/toolkit'
import { IRA } from '../constants/mapping'

const initialState = {
    historic: {
        adjusted: {
            data: IRA.historic.adjusted,
            district: undefined,
            municipal: undefined,
            fokontany: undefined,
        },
        csbCases: {
            data: IRA.historic.csbCases,
            district: undefined,
            municipal: undefined,
            fokontany: undefined,
        },
        comCases: {
            data: IRA.historic.comCases,
            district: undefined,
            municipal: undefined,
            fokontany: undefined,
        },
        simulation: {
            data: IRA.forecast.adjusted.avg,
            district: undefined,
            municipal: undefined,
            fokontany: undefined,
        },
    },
    forecast: {
        adjusted: {
            avg: {
                data: IRA.forecast.adjusted.avg,
                district: undefined,
                municipal: undefined,
                fokontany: undefined,
            },
            lowci: {
                data: IRA.forecast.adjusted.lowci,
                district: undefined,
                municipal: undefined,
                fokontany: undefined,
            },
            uppci: {
                data: IRA.forecast.adjusted.uppci,
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
                data: IRA.forecast.csbCases.avg,
                district: undefined,
                municipal: undefined,
                fokontany: undefined,
            },
            lowci: {
                data: IRA.forecast.csbCases.lowci,
                district: undefined,
                municipal: undefined,
                fokontany: undefined,
            },
            uppci: {
                data: IRA.forecast.csbCases.uppci,
                district: undefined,
                municipal: undefined,
                fokontany: undefined,
            },
        },
        comCases: {
            avg: {
                data: IRA.forecast.comCases.avg,
                district: undefined,
                municipal: undefined,
                fokontany: undefined,
            },
            lowci: {
                data: IRA.forecast.comCases.lowci,
                district: undefined,
                municipal: undefined,
                fokontany: undefined,
            },
            uppci: {
                data: IRA.forecast.comCases.uppci,
                district: undefined,
                municipal: undefined,
                fokontany: undefined,
            },
        },
    },
    alert: {
        csb: {
            data: IRA.alert.csb,
            district: undefined,
        },
        adjusted: {
            data: IRA.alert.adjusted,
            district: undefined,
        },
        vigilance: {
            data: IRA.alert.vigilance,
            district: undefined,
        },
    },
    compare: {
        csb: {
            data: IRA.compare.csb,
            district: undefined,
        },
        adjusted: {
            data: IRA.compare.adjusted,
            district: undefined,
        },
        trend: {
            data: IRA.compare.trend,
            district: undefined,
        },
        csbVigilance: {
            data: IRA.compare.csbVigilance,
            district: undefined,
        },
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
    },
})

export const {
    setHistoricData,
    clearHistoricData,
    setForecastData,
    clearForecastData,
    setIraAlertData,
    setIraCompareData
} = iraSlice.actions

export default iraSlice.reducer
