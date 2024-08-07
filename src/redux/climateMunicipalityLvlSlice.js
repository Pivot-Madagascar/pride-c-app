import { createSlice } from "@reduxjs/toolkit"
import { updateDataReducer } from "../utils/formatting.js"

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

const climateMunicipalityLvlSlice = createSlice({
    name: "climate",
    initialState,
    reducers: {
        setMunicipalityPrecipitation: updateDataReducer('precipitation'),
        setMunicipalityTemperature: updateDataReducer('temperature'),
        setMunicipalityVegetationIndex: updateDataReducer('vegetationIndex'),
        setMunicipalityWaterSurfaceIndex: updateDataReducer('waterSurfaceIndex'),
        setMunicipalityVegetativeWaterIndex: updateDataReducer('vegetativeWaterIndex'),
        setMunicipalityBushfireArea: updateDataReducer('bushfireArea'),
        setMunicipalityNo2AtmLevel: updateDataReducer('no2AtmLevel'),
        setMunicipalityAodAtmLevel: updateDataReducer('aodAtmLevel'),
        setMunicipalityFloodedRiceFields: updateDataReducer('floodedRiceFields'),
        setMunicipalityAtmHumidity: updateDataReducer('atmHumidity'),
        setMunicipalityWindSpeed: updateDataReducer('windSpeed'),
    },
})

export const {
    setMunicipalityPrecipitation,
    setMunicipalityTemperature,
    setMunicipalityVegetationIndex,
    setMunicipalityWaterSurfaceIndex,
    setMunicipalityVegetativeWaterIndex,
    setMunicipalityBushfireArea,
    setMunicipalityNo2AtmLevel,
    setMunicipalityAodAtmLevel,
    setMunicipalityFloodedRiceFields,
    setMunicipalityAtmHumidity,
    setMunicipalityWindSpeed,
} = climateMunicipalityLvlSlice.actions

export default climateMunicipalityLvlSlice.reducer
