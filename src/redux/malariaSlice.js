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
                    : null
            )
        })
        grouped[orgUnit].values = valuesArray
    }

    return Object.values(grouped)
}

const initialState = {
    malariaMean: null,
    malariaLower: null,
    malariaUpper: null,
    malaria_2016: null,
    malaria_2017: null,
    malaria_2018: null,
    mean_2016: null,
    lower_2016: null,
    upper_2016: null,
    dataTableData: null,
    loading: false,
    error: null,
}

export const fetchMalariaMean = createAsyncThunk(
    'malaria/fetchMalariaMean',
    async ({ params, engine }) => {
        const meanDimensions = constructDimensions(params)
        const meanQuery = createQuery(meanDimensions)
        const { data } = await engine.query(meanQuery)
        const { items } = data.metaData
        const rows = data.rows
        return rows.map((row) => mapRowToDetails(row, items))
    }
)

export const fetchMalariaLower = createAsyncThunk(
    'malaria/fetchMalariaLower',
    async ({ params, engine }) => {
        const lowerDimensions = constructDimensions(params)
        const lowerQuery = createQuery(lowerDimensions)
        const { data } = await engine.query(lowerQuery)
        const { items } = data.metaData
        const rows = data.rows
        return rows.map((row) => mapRowToDetails(row, items))
    }
)

export const fetchMalariaUpper = createAsyncThunk(
    'malaria/fetchMalariaUpper',
    async ({ params, engine }) => {
        const upperDimensions = constructDimensions(params)
        const upperQuery = createQuery(upperDimensions)
        const { data } = await engine.query(upperQuery)
        const { items } = data.metaData
        const rows = data.rows
        return rows.map((row) => mapRowToDetails(row, items))
    }
)

export const fetchMalaria2016 = createAsyncThunk(
    'malaria/fetchMalaria2016',
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
    'malaria/fetchMean2016',
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
    'malaria/fetchUpper2016',
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
    'malaria/fetchLower2016',
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

export const fetchMalaria2017 = createAsyncThunk(
    'malaria/fetchMalaria2017',
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

export const fetchMalaria2018 = createAsyncThunk(
    'malaria/fetchMalaria2018',
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

const malariaSlice = createSlice({
    name: 'malaria',
    initialState,
    reducers: {
        setMalariaDataTable: (state, { payload }) => {
            state.dataTableData = payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMalariaMean.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchMalariaMean.fulfilled, (state, { payload }) => {
                state.loading = false
                state.malariaMean = payload
            })
            .addCase(fetchMalariaMean.rejected, (state, { error }) => {
                state.loading = false
                state.error = error.message
            })
            .addCase(fetchMalariaLower.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchMalariaLower.fulfilled, (state, { payload }) => {
                state.loading = false
                state.malariaLower = payload
            })
            .addCase(fetchMalariaLower.rejected, (state, { error }) => {
                state.loading = false
                state.error = error.message
            })
            .addCase(fetchMalariaUpper.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchMalariaUpper.fulfilled, (state, { payload }) => {
                state.loading = false
                state.malariaUpper = payload
            })
            .addCase(fetchMalariaUpper.rejected, (state, { error }) => {
                state.loading = false
                state.error = error.message
            })
            .addCase(fetchMalaria2016.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchMalaria2016.fulfilled, (state, { payload }) => {
                state.loading = false
                state.malaria_2016 = payload
            })
            .addCase(fetchMalaria2016.rejected, (state, { error }) => {
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
            .addCase(fetchMalaria2017.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchMalaria2017.fulfilled, (state, { payload }) => {
                state.loading = false
                state.malaria_2017 = payload
            })
            .addCase(fetchMalaria2017.rejected, (state, { error }) => {
                state.loading = false
                state.error = error.message
            })
            .addCase(fetchMalaria2018.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchMalaria2018.fulfilled, (state, { payload }) => {
                state.loading = false
                state.malaria_2018 = payload
            })
            .addCase(fetchMalaria2018.rejected, (state, { error }) => {
                state.loading = false
                state.error = error.message
            })
    },
})

export const { setMalariaDataTable } = malariaSlice.actions

export default malariaSlice.reducer