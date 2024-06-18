import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    precipitationMunicipality: null,
    temperatureMunicipality: null,
    vegetationIndexMunicipality: null,
    waterSurfaceIndexMunicipality: null,
    vegetativeWaterIndexMunicipality: null,
    bushfireAreaMunicipality: null,
    no2AtmLevelMunicipality: null,
    aodAtmLevelMunicipality: null,
    floodedRiceFieldsMunicipality: null,
    atmHumidityMunicipality: null,
    windSpeedMunicipality: null,
}

const climateMunicipalityLvlSlice = createSlice({
    name: "climate",
    initialState,
    reducers: {
        setPrecipitationMunicipality: (state, { payload }) => {
            if (state.precipitationMunicipality === null) {
                state.precipitationMunicipality = {}
            }
            state.precipitationMunicipality[payload.year] = payload.precipitation
        },
        setTemperatureMunicipality: (state, { payload }) => {
            if (state.temperatureMunicipality === null) {
                state.temperatureMunicipality = {}
            }
            state.temperatureMunicipality[payload.year] = payload.temperature
        },
        setVegetationIndexMunicipality: (state, { payload }) => {
            if (state.vegetationIndexMunicipality === null) {
                state.vegetationIndexMunicipality = {}
            }
            state.vegetationIndexMunicipality[payload.year] = payload.vegetationIndex
        },
        setWaterSurfaceIndexMunicipality: (state, { payload }) => {
            if (state.waterSurfaceIndexMunicipality === null) {
                state.waterSurfaceIndexMunicipality = {}
            }
            state.waterSurfaceIndexMunicipality[payload.year] = payload.waterSurfaceIndex
        },
        setVegetativeWaterIndexMunicipality: (state, { payload }) => {
            if (state.vegetativeWaterIndexMunicipality === null) {
                state.vegetativeWaterIndexMunicipality = {}
            }
            state.vegetativeWaterIndexMunicipality[payload.year] = payload.vegetativeWaterIndex
        },
        setBushfireAreaMunicipality: (state, { payload }) => {
            if (state.bushfireAreaMunicipality === null) {
                state.bushfireAreaMunicipality = {}
            }
            state.bushfireAreaMunicipality[payload.year] = payload.bushfireArea
        },
        setNo2AtmLevelMunicipality: (state, { payload }) => {
            if (state.no2AtmLevelMunicipality === null) {
                state.no2AtmLevelMunicipality = {}
            }
            state.no2AtmLevelMunicipality[payload.year] = payload.no2AtmLevel
        },
        setAodAtmLevelMunicipality: (state, { payload }) => {
            if (state.aodAtmLevelMunicipality === null) {
                state.aodAtmLevelMunicipality = {}
            }
            state.aodAtmLevelMunicipality[payload.year] = payload.aodAtmLevel
        },
        setFloodedRiceFieldsMunicipality: (state, { payload }) => {
            if (state.floodedRiceFieldsMunicipality === null) {
                state.floodedRiceFieldsMunicipality = {}
            }
            state.floodedRiceFieldsMunicipality[payload.year] = payload.floodedRiceFields
        },
        setAtmHumidityMunicipality: (state, { payload }) => {
            if (state.atmHumidityMunicipality === null) {
                state.atmHumidityMunicipality = {}
            }
            state.atmHumidityMunicipality[payload.year] = payload.atmHumidity
        },
        setWindSpeedMunicipality: (state, { payload }) => {
            if (state.windSpeedMunicipality === null) {
                state.windSpeedMunicipality = {}
            }
            state.windSpeedMunicipality[payload.year] = payload.windSpeed
        },
    },
})

export const {
    setPrecipitationMunicipality,
    setTemperatureMunicipality,
    setVegetationIndexMunicipality,
    setWaterSurfaceIndexMunicipality,
    setVegetativeWaterIndexMunicipality,
    setBushfireAreaMunicipality,
    setNo2AtmLevelMunicipality,
    setAodAtmLevelMunicipality,
    setFloodedRiceFieldsMunicipality,
    setAtmHumidityMunicipality,
    setWindSpeedMunicipality,
} = climateMunicipalityLvlSlice.actions

export default climateMunicipalityLvlSlice.reducer
