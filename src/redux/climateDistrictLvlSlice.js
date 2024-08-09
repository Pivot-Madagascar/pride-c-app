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

const climateDistrictLvlSlice = createSlice({
    name: "climate",
    initialState,
    reducers: {
        setDistrictPrecipitation: updateDataReducer('precipitation'),
        setDistrictTemperature: updateDataReducer('temperature'),
        setDistrictVegetationIndex: updateDataReducer('vegetationIndex'),
        setDistrictWaterSurfaceIndex: updateDataReducer('waterSurfaceIndex'),
        setDistrictVegetativeWaterIndex: updateDataReducer('vegetativeWaterIndex'),
        setDistrictBushfireArea: updateDataReducer('bushfireArea'),
        setDistrictNo2AtmLevel: updateDataReducer('no2AtmLevel'),
        setDistrictAodAtmLevel: updateDataReducer('aodAtmLevel'),
        setDistrictFloodedRiceFields: updateDataReducer('floodedRiceFields'),
        setDistrictAtmHumidity: updateDataReducer('atmHumidity'),
        setDistrictWindSpeed: updateDataReducer('windSpeed'),
    },
})

export const {
    setDistrictPrecipitation,
    setDistrictTemperature,
    setDistrictVegetationIndex,
    setDistrictWaterSurfaceIndex,
    setDistrictVegetativeWaterIndex,
    setDistrictBushfireArea,
    setDistrictNo2AtmLevel,
    setDistrictAodAtmLevel,
    setDistrictFloodedRiceFields,
    setDistrictAtmHumidity,
    setDistrictWindSpeed,
} = climateDistrictLvlSlice.actions

export default climateDistrictLvlSlice.reducer
