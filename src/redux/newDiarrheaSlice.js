import { createSlice } from '@reduxjs/toolkit'
import { DIARRHEA } from '../constants/mapping'

const initialState = {
    historic: {
        adjusted: {
            data: DIARRHEA.historic.adjusted,
            district: undefined,
            municipal: undefined,
            fokontany: undefined,
        },
        csbCases: {
            data: DIARRHEA.historic.csbCases,
            district: undefined,
            municipal: undefined,
            fokontany: undefined,
        },
        comCases: {
            data: DIARRHEA.historic.comCases,
            district: undefined,
            municipal: undefined,
            fokontany: undefined,
        },
    },
    forecast: {
        adjusted: {
            avg: {
                data: DIARRHEA.forecast.adjusted.avg,
                district: undefined,
                municipal: undefined,
                fokontany: undefined,
            },
            lowci: {
                data: DIARRHEA.forecast.adjusted.lowci,
                district: undefined,
                municipal: undefined,
                fokontany: undefined,
            },
            uppci: {
                data: DIARRHEA.forecast.adjusted.uppci,
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
                data: DIARRHEA.forecast.csbCases.avg,
                district: undefined,
                municipal: undefined,
                fokontany: undefined,
            },
            lowci: {
                data: DIARRHEA.forecast.csbCases.lowci,
                district: undefined,
                municipal: undefined,
                fokontany: undefined,
            },
            uppci: {
                data: DIARRHEA.forecast.csbCases.uppci,
                district: undefined,
                municipal: undefined,
                fokontany: undefined,
            },
        },
        comCases: {
            avg: {
                data: DIARRHEA.forecast.comCases.avg,
                district: undefined,
                municipal: undefined,
                fokontany: undefined,
            },
            lowci: {
                data: DIARRHEA.forecast.comCases.lowci,
                district: undefined,
                municipal: undefined,
                fokontany: undefined,
            },
            uppci: {
                data: DIARRHEA.forecast.comCases.uppci,
                district: undefined,
                municipal: undefined,
                fokontany: undefined,
            },
        },
    },
}

const newDiarrheaSlice = createSlice({
    name: 'newDiarrhea',
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
} = newDiarrheaSlice.actions

export default newDiarrheaSlice.reducer
