import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    createQuery,
    constructDimensions,
    mapRowToDetails,
} from '../utils/request'

function regroupData(data) {
    function parsePeriodName(periodName) {
        const [month, year] = periodName.split(' ')
        const months = {
            January: 1,
            February: 2,
            March: 3,
            April: 4,
            May: 5,
            June: 6,
            July: 7,
            August: 8,
            September: 9,
            October: 10,
            November: 11,
            December: 12,
        }
        return { month: months[month], year: parseInt(year) }
    }

    const periods = Array.from(
        new Set(data.map((item) => item.periodName))
    ).sort((a, b) => {
        const periodA = parsePeriodName(a)
        const periodB = parsePeriodName(b)
        return periodA.year === periodB.year
            ? periodA.month - periodB.month
            : periodA.year - periodB.year
    })

    const grouped = data.reduce((acc, item) => {
        if (!acc[item.orgUnit]) {
            acc[item.orgUnit] = {
                orgUnit: item.orgUnit,
                orgUnitName: item.orgUnitName,
                values: {},
            }
        }
        acc[item.orgUnit].values[item.periodName] = parseInt(item.value)
        return acc
    }, {})

    for (const orgUnit in grouped) {
        const valuesArray = []
        periods.forEach((period) => {
            valuesArray.push(
                grouped[orgUnit].values[period] !== undefined
                    ? grouped[orgUnit].values[period]
                    : 0 // TODO: To be replaced by 'null' after updating from the backend
            )
        })
        grouped[orgUnit].values = valuesArray
    }

    return Object.values(grouped)
}

const initialState = {
    diarrheaMean: null,
    diarrheaLower: null,
    diarrheaUpper: null,
    diarrhea_2016: null,
    diarrhea_2017: null,
    diarrhea_2018: null,
    mean_2016: null,
    lower_2016: null,
    upper_2016: null,
    dataTableData: null,
    loading: false,
    error: null,
}

export const fetchDiarrheaMean = createAsyncThunk(
    'diarrhea/fetchDiarrheaMean',
    async ({ params, engine }) => {
        const meanDimensions = constructDimensions(params)
        const meanQuery = createQuery(meanDimensions)
        const { data } = await engine.query(meanQuery)
        const { items } = data.metaData
        const rows = data.rows
        return rows.map((row) => mapRowToDetails(row, items))
    }
)

export const fetchDiarrheaLower = createAsyncThunk(
    'diarrhea/fetchDiarrheaLower',
    async ({ params, engine }) => {
        const lowerDimensions = constructDimensions(params)
        const lowerQuery = createQuery(lowerDimensions)
        const { data } = await engine.query(lowerQuery)
        const { items } = data.metaData
        const rows = data.rows
        return rows.map((row) => mapRowToDetails(row, items))
    }
)

export const fetchDiarrheaUpper = createAsyncThunk(
    'diarrhea/fetchDiarrheaUpper',
    async ({ params, engine }) => {
        const upperDimensions = constructDimensions(params)
        const upperQuery = createQuery(upperDimensions)
        const { data } = await engine.query(upperQuery)
        const { items } = data.metaData
        const rows = data.rows
        return rows.map((row) => mapRowToDetails(row, items))
    }
)

export const fetchDiarrhea2016 = createAsyncThunk(
    'diarrhea/fetchDiarrhea2016',
    async ({ params, engine }) => {
        const dimensions = constructDimensions(params)
        const query = createQuery(dimensions)
        const { data } = await engine.query(query)
        const { items } = data.metaData
        const rows = data.rows
        const payload = rows.map((row) => mapRowToDetails(row, items))
        return regroupData(payload)
    }
)

export const fetchMean2016 = createAsyncThunk(
    'diarrhea/fetchMean2016',
    async ({ params, engine }) => {
        const dimensions = constructDimensions(params)
        const query = createQuery(dimensions)
        const { data } = await engine.query(query)
        const { items } = data.metaData
        const rows = data.rows
        const payload = rows.map((row) => mapRowToDetails(row, items))
        return regroupData(payload)
    }
)

export const fetchUpper2016 = createAsyncThunk(
    'diarrhea/fetchUpper2016',
    async ({ params, engine }) => {
        const dimensions = constructDimensions(params)
        const query = createQuery(dimensions)
        const { data } = await engine.query(query)
        const { items } = data.metaData
        const rows = data.rows
        const payload = rows.map((row) => mapRowToDetails(row, items))
        return regroupData(payload)
    }
)

export const fetchLower2016 = createAsyncThunk(
    'diarrhea/fetchLower2016',
    async ({ params, engine }) => {
        const dimensions = constructDimensions(params)
        const query = createQuery(dimensions)
        const { data } = await engine.query(query)
        const { items } = data.metaData
        const rows = data.rows
        const payload = rows.map((row) => mapRowToDetails(row, items))
        return regroupData(payload)
    }
)

export const fetchDiarrhea2017 = createAsyncThunk(
    'diarrhea/fetchDiarrhea2017',
    async ({ params, engine }) => {
        const dimensions = constructDimensions(params)
        const query = createQuery(dimensions)
        const { data } = await engine.query(query)
        const { items } = data.metaData
        const rows = data.rows
        const payload = rows.map((row) => mapRowToDetails(row, items))
        return regroupData(payload)
    }
)

export const fetchDiarrhea2018 = createAsyncThunk(
    'diarrhea/fetchDiarrhea2018',
    async ({ params, engine }) => {
        const dimensions = constructDimensions(params)
        const query = createQuery(dimensions)
        const { data } = await engine.query(query)
        const { items } = data.metaData
        const rows = data.rows
        const payload = rows.map((row) => mapRowToDetails(row, items))
        return regroupData(payload)
    }
)

const diarrheaSlice = createSlice({
    name: 'diarrhea',
    initialState,
    reducers: {
        setDiarrheaDataTable: (state, { payload }) => {
            state.dataTableData = payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDiarrheaMean.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchDiarrheaMean.fulfilled, (state, { payload }) => {
                state.loading = false
                state.diarrheaMean = payload
            })
            .addCase(fetchDiarrheaMean.rejected, (state, { error }) => {
                state.loading = false
                state.error = error.message
            })
            .addCase(fetchDiarrheaLower.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchDiarrheaLower.fulfilled, (state, { payload }) => {
                state.loading = false
                state.diarrheaLower = payload
            })
            .addCase(fetchDiarrheaLower.rejected, (state, { error }) => {
                state.loading = false
                state.error = error.message
            })
            .addCase(fetchDiarrheaUpper.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchDiarrheaUpper.fulfilled, (state, { payload }) => {
                state.loading = false
                state.diarrheaUpper = payload
            })
            .addCase(fetchDiarrheaUpper.rejected, (state, { error }) => {
                state.loading = false
                state.error = error.message
            })
            .addCase(fetchDiarrhea2016.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchDiarrhea2016.fulfilled, (state, { payload }) => {
                state.loading = false
                state.diarrhea_2016 = payload
            })
            .addCase(fetchDiarrhea2016.rejected, (state, { error }) => {
                state.loading = false
                state.error = error.message
            })
            .addCase(fetchMean2016.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchMean2016.fulfilled, (state, { payload }) => {
                state.loading = false
                state.mean_2016 = payload
            })
            .addCase(fetchMean2016.rejected, (state, { error }) => {
                state.loading = false
                state.error = error.message
            })
            .addCase(fetchLower2016.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchLower2016.fulfilled, (state, { payload }) => {
                state.loading = false
                state.lower_2016 = payload
            })
            .addCase(fetchLower2016.rejected, (state, { error }) => {
                state.loading = false
                state.error = error.message
            })
            .addCase(fetchUpper2016.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchUpper2016.fulfilled, (state, { payload }) => {
                state.loading = false
                state.upper_2016 = payload
            })
            .addCase(fetchUpper2016.rejected, (state, { error }) => {
                state.loading = false
                state.error = error.message
            })
            .addCase(fetchDiarrhea2017.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchDiarrhea2017.fulfilled, (state, { payload }) => {
                state.loading = false
                state.diarrhea_2017 = payload
            })
            .addCase(fetchDiarrhea2017.rejected, (state, { error }) => {
                state.loading = false
                state.error = error.message
            })
            .addCase(fetchDiarrhea2018.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchDiarrhea2018.fulfilled, (state, { payload }) => {
                state.loading = false
                state.diarrhea_2018 = payload
            })
            .addCase(fetchDiarrhea2018.rejected, (state, { error }) => {
                state.loading = false
                state.error = error.message
            })
    },
})

export const { setDiarrheaDataTable } = diarrheaSlice.actions

export default diarrheaSlice.reducer