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
        }
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
        // setForecastGeoData: (state, action) => {
        //     const { caseType, adminLevel, data } = action.payload
        //     if (state.forecast[caseType])
        // },
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
} = malariaSlice.actions

export default malariaSlice.reducer
