import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    preciptitation: [],
    temperature: [],
    vegetationIndex: [],
    waterSurfaceIndex: [],
    vegetativeWaterIndex: [],
    bushfireArea: [],
    no2AtmLevel: [],
    aodAtmLevel: [],
    floodedRiceFields: [],
    atmHumidity: [],
    windSpeed: []
}

const climateSlice = createSlice({
    name: "climate",
    initialState,
    reducer: {
        setPrecipitation: (state, { payload }) => {
            state.precipitation = payload
        },
        setTemperature: (state, { payload }) => {
            state.temperature = payload
        },
        setVegetationIndex: (state, { payload }) => {
            state.vegetationIndex = payload
        },
        setWaterSurfaceIndex: (state, { payload }) => {
            state.waterSurfaceIndex = payload
        },
        setVegetativeWaterIndex: (state, { payload }) => {
            state.vegetativeWaterIndex = payload
        },
        setBushFireAre: (state, { payload }) => {
            state.bushfireArea = payload
        },
        setNo2AtmLevel: (state, { payload }) => {
            state.no2AtmLevel = payload
        },
        setAodAtmLevel: (state, { payload }) => {
            state.aodAtmLevel = payload
        },
        setFloodedRiceFields: (state, { payload }) => {
            state.floodedRiceFields = payload
        },
        setAtmHumidity: (state, { payload }) => {
            state.atmHumidity = payload
        },
        setWindSpeed: (state, { payload }) => {
            state.windSpeed = payload
        }
    }
})

export const {
    setPrecipitation,
    setTemperature,
    setVegetationIndex,
    setWaterSurfaceIndex,
    setVegetativeWaterIndex,
    setBushFireAre,
    setNo2AtmLevel,
    setAodAtmLevel,
    setFloodedRiceFields,
    setAtmHumidity,
    setWindSpeed
} = climateSlice.actions

export default climateSlice.reducer