import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    precipitation: null,
    temperature: null,
    vegetationIndex: null,
    waterSurfaceIndex: null,
    vegetativeWaterIndex: null,
    bushfireArea: null,
    no2AtmLevel: null,
    aodAtmLevel: null,
    floodedRiceFields: null,
    atmHumidity: null,
    windSpeed: null,
}

const climateSlice = createSlice({
    name: "climate",
    initialState,
    reducers: {
        setPrecipitation: (state, { payload }) => {
            if (state.precipitation === null) {
                state.precipitation = {}
            }
            state.precipitation[payload.year] = payload.precipitation
        },
        setTemperature: (state, { payload }) => {
            if (state.temperature === null) {
                state.temperature = {}
            }
            state.temperature[payload.year] = payload.temperature
        },
        setVegetationIndex: (state, { payload }) => {
            if (state.vegetationIndex === null) {
                state.vegetationIndex = {}
            }
            state.vegetationIndex[payload.year] = payload.vegetationIndex
        },
        setWaterSurfaceIndex: (state, { payload }) => {
            if (state.waterSurfaceIndex === null) {
                state.waterSurfaceIndex = {}
            }
            state.waterSurfaceIndex[payload.year] = payload.waterSurfaceIndex
        },
        setVegetativeWaterIndex: (state, { payload }) => {
            if (state.vegetativeWaterIndex === null) {
                state.vegetativeWaterIndex = {}
            }
            state.vegetativeWaterIndex[payload.year] = payload.vegetativeWaterIndex
        },
        setBushfireArea: (state, { payload }) => {
            if (state.bushfireArea === null) {
                state.bushfireArea = {}
            }
            state.bushfireArea[payload.year] = payload.bushfireArea
        },
        setNo2AtmLevel: (state, { payload }) => {
            if (state.no2AtmLevel === null) {
                state.no2AtmLevel = {}
            }
            state.no2AtmLevel[payload.year] = payload.no2AtmLevel
        },
        setAodAtmLevel: (state, { payload }) => {
            if (state.aodAtmLevel === null) {
                state.aodAtmLevel = {}
            }
            state.aodAtmLevel[payload.year] = payload.aodAtmLevel
        },
        setFloodedRiceFields: (state, { payload }) => {
            if (state.floodedRiceFields === null) {
                state.floodedRiceFields = {}
            }
            state.floodedRiceFields[payload.year] = payload.floodedRiceFields
        },
        setAtmHumidity: (state, { payload }) => {
            if (state.atmHumidity === null) {
                state.atmHumidity = {}
            }
            state.atmHumidity[payload.year] = payload.atmHumidity
        },
        setWindSpeed: (state, { payload }) => {
            if (state.windSpeed === null) {
                state.windSpeed = {}
            }
            state.windSpeed[payload.year] = payload.windSpeed
        },
    },
})

export const {
    setPrecipitation,
    setTemperature,
    setVegetationIndex,
    setWaterSurfaceIndex,
    setVegetativeWaterIndex,
    setBushfireArea,
    setNo2AtmLevel,
    setAodAtmLevel,
    setFloodedRiceFields,
    setAtmHumidity,
    setWindSpeed,
} = climateSlice.actions

export default climateSlice.reducer
