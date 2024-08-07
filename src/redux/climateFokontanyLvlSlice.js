import { createSlice } from '@reduxjs/toolkit'
import { updateDataReducer } from '../utils/formatting.js'

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

const climateFokontanyLvlSlice = createSlice({
    name: 'climate',
    initialState,
    reducers: {
        setFokontanyPrecipitation: updateDataReducer('precipitation'),
        setFokontanyTemperature: updateDataReducer('temperature'),
        setFokontanyVegetationIndex: updateDataReducer('vegetationIndex'),
        setFokontanyWaterSurfaceIndex: updateDataReducer('waterSurfaceIndex'),
        setFokontanyVegetativeWaterIndex: updateDataReducer('vegetativeWaterIndex'),
        setFokontanyBushfireArea: updateDataReducer('bushfireArea'),
        setFokontanyNo2AtmLevel: updateDataReducer('no2AtmLevel'),
        setFokontanyAodAtmLevel: updateDataReducer('aodAtmLevel'),
        setFokontanyFloodedRiceFields: updateDataReducer('floodedRiceFields'),
        setFokontanyAtmHumidity: updateDataReducer('atmHumidity'),
        setFokontanyWindSpeed: updateDataReducer('windSpeed'),
    },
})

export const {
    setFokontanyPrecipitation,
    setFokontanyTemperature,
    setFokontanyVegetationIndex,
    setFokontanyWaterSurfaceIndex,
    setFokontanyVegetativeWaterIndex,
    setFokontanyBushfireArea,
    setFokontanyNo2AtmLevel,
    setFokontanyAodAtmLevel,
    setFokontanyFloodedRiceFields,
    setFokontanyAtmHumidity,
    setFokontanyWindSpeed,
} = climateFokontanyLvlSlice.actions

export default climateFokontanyLvlSlice.reducer
