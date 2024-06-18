import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    precipitationDistrict: null,
    temperatureDistrict: null,
    vegetationIndexDistrict: null,
    waterSurfaceIndexDistrict: null,
    vegetativeWaterIndexDistrict: null,
    bushfireAreaDistrict: null,
    no2AtmLevelDistrict: null,
    aodAtmLevelDistrict: null,
    floodedRiceFieldsDistrict: null,
    atmHumidityDistrict: null,
    windSpeedDistrict: null,
}

const climateDistrictLvlSlice = createSlice({
    name: "climate",
    initialState,
    reducers: {
        setPrecipitationDistrict: (state, { payload }) => {
            if (state.precipitationDistrict === null) {
                state.precipitationDistrict = {}
            }
            state.precipitationDistrict[payload.year] = payload.precipitation
        },
        setTemperatureDistrict: (state, { payload }) => {
            if (state.temperatureDistrict === null) {
                state.temperatureDistrict = {}
            }
            state.temperatureDistrict[payload.year] = payload.temperature
        },
        setVegetationIndexDistrict: (state, { payload }) => {
            if (state.vegetationIndexDistrict === null) {
                state.vegetationIndexDistrict = {}
            }
            state.vegetationIndexDistrict[payload.year] = payload.vegetationIndex
        },
        setWaterSurfaceIndexDistrict: (state, { payload }) => {
            if (state.waterSurfaceIndexDistrict === null) {
                state.waterSurfaceIndexDistrict = {}
            }
            state.waterSurfaceIndexDistrict[payload.year] = payload.waterSurfaceIndex
        },
        setVegetativeWaterIndexDistrict: (state, { payload }) => {
            if (state.vegetativeWaterIndexDistrict === null) {
                state.vegetativeWaterIndexDistrict = {}
            }
            state.vegetativeWaterIndexDistrict[payload.year] = payload.vegetativeWaterIndex
        },
        setBushfireAreaDistrict: (state, { payload }) => {
            if (state.bushfireAreaDistrict === null) {
                state.bushfireAreaDistrict = {}
            }
            state.bushfireAreaDistrict[payload.year] = payload.bushfireArea
        },
        setNo2AtmLevelDistrict: (state, { payload }) => {
            if (state.no2AtmLevelDistrict === null) {
                state.no2AtmLevelDistrict = {}
            }
            state.no2AtmLevelDistrict[payload.year] = payload.no2AtmLevel
        },
        setAodAtmLevelDistrict: (state, { payload }) => {
            if (state.aodAtmLevelDistrict === null) {
                state.aodAtmLevelDistrict = {}
            }
            state.aodAtmLevelDistrict[payload.year] = payload.aodAtmLevel
        },
        setFloodedRiceFieldsDistrict: (state, { payload }) => {
            if (state.floodedRiceFieldsDistrict === null) {
                state.floodedRiceFieldsDistrict = {}
            }
            state.floodedRiceFieldsDistrict[payload.year] = payload.floodedRiceFields
        },
        setAtmHumidityDistrict: (state, { payload }) => {
            if (state.atmHumidityDistrict === null) {
                state.atmHumidityDistrict = {}
            }
            state.atmHumidityDistrict[payload.year] = payload.atmHumidity
        },
        setWindSpeedDistrict: (state, { payload }) => {
            if (state.windSpeedDistrict === null) {
                state.windSpeedDistrict = {}
            }
            state.windSpeedDistrict[payload.year] = payload.windSpeed
        },
    },
})

export const {
    setPrecipitationDistrict,
    setTemperatureDistrict,
    setVegetationIndexDistrict,
    setWaterSurfaceIndexDistrict,
    setVegetativeWaterIndexDistrict,
    setBushfireAreaDistrict,
    setNo2AtmLevelDistrict,
    setAodAtmLevelDistrict,
    setFloodedRiceFieldsDistrict,
    setAtmHumidityDistrict,
    setWindSpeedDistrict,
} = climateDistrictLvlSlice.actions

export default climateDistrictLvlSlice.reducer
