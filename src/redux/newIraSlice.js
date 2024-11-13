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
                fokontany: undefined
            },
            annualAvg : {
                district: undefined,
                municipal: undefined,
                fokontany: undefined,
            }
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
}

const newIraSlice = createSlice({
    name: 'newIra',
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
    },
})

export const {
    setHistoricData,
    clearHistoricData,
    setForecastData,
    clearForecastData,
} = newIraSlice.actions

export default newIraSlice.reducer
