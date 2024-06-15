import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { 
    combineValuesByOrgUnits
} from '../utils/formating'
import {
    createQuery,
    constructDimensions,
    mapRowToDetailsClimate,
} from '../utils/request'


const initialState = {
    preciptitation: null,
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
    test: null
}

export const fetchPrecipitation = createAsyncThunk(
    'climate/fetchPrecipitation',
    async ({ params, engine }) => {
        const precipitationDim = constructDimensions(params)
        const precipitationQuery = createQuery(precipitationDim)
        const { data } = await engine.query(precipitationQuery)
        const { items } = data.metaData
        const rows = data.rows
        const formattedValue = rows.map((row) => mapRowToDetailsClimate(row, items))
        return combineValuesByOrgUnits(params.orgUnits, formattedValue)
    }
)

export const fetchVegetationIndex = createAsyncThunk(
    'climate/fetchVegetationIndex',
    async ({ params, engine }) => {
        const vegetationIndexDim = constructDimensions(params)
        const vegetationIndexQuery = createQuery(vegetationIndexDim)
        const { data } = await engine.query(vegetationIndexQuery)
        const { items } = data.metaData
        const rows = data.rows
        const formattedValue = rows.map((row) => mapRowToDetailsClimate(row, items))
        return combineValuesByOrgUnits(params.orgUnits, formattedValue)
    }
)

export const fetchTemperature = createAsyncThunk(
    'climate/fetchTemperature',
    async ({ params, engine }) => {
        const temperatureDim = constructDimensions(params)
        const temperatureQuery = createQuery(temperatureDim)
        const { data } = await engine.query(temperatureQuery)
        const { items } = data.metaData
        const rows = data.rows
        const formattedValue = rows.map((row) => mapRowToDetailsClimate(row, items))
        return combineValuesByOrgUnits(params.orgUnits, formattedValue)
    }
)

export const fetchWaterSurfaceIndex = createAsyncThunk(
    'climate/fetchWaterSurfaceIndex',
    async ({ params, engine }) => {
        console.error(params.orgUnits);
        const waterSurfaceIndexDim = constructDimensions(params)
        const waterSurfaceIndexQuery = createQuery(waterSurfaceIndexDim)
        const { data } = await engine.query(waterSurfaceIndexQuery)
        const { items } = data.metaData
        const rows = data.rows
        const formattedValue = rows.map((row) => mapRowToDetailsClimate(row, items))
        return combineValuesByOrgUnits(params.orgUnits, formattedValue)
    }
)

const climateSlice = createSlice({
    name: "climate",
    initialState,
    reducer: {
        setTest: (state, { payload }) => {
            state.test = payload
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchPrecipitation.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchPrecipitation.fulfilled, (state, { payload }) => {
            state.loading = false
            state.precipitation = payload
        })
        .addCase(fetchPrecipitation.rejected, (state, { error }) => {
            state.loading = false
            state.error = error.message
        })
        .addCase(fetchTemperature.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchTemperature.fulfilled, (state, { payload }) => {
            state.loading = false
            state.temperature = payload
        })
        .addCase(fetchTemperature.rejected, (state, { error }) => {
            state.loading = false
            state.error = error.message
        })
        .addCase(fetchVegetationIndex.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchVegetationIndex.fulfilled, (state, { payload }) => {
            state.loading = false
            state.vegetationIndex = payload
        })
        .addCase(fetchVegetationIndex.rejected, (state, { error }) => {
            state.loading = false
            state.error = error.message
        })
        .addCase(fetchWaterSurfaceIndex.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchWaterSurfaceIndex.fulfilled, (state, { payload }) => {
            state.loading = false
            state.waterSurfaceIndex = payload
        })
        .addCase(fetchWaterSurfaceIndex.rejected, (state, { error }) => {
            state.loading = false
            state.error = error.message
        })
    }
})

export const {
    setTest,
} = climateSlice.actions

export default climateSlice.reducer