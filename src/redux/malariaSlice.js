import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { updateDataReducer } from '../utils/formatting'
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
    loading: false,
    error: null,
    mean: null,
    lower: null,
    upper: null,
    districtData: null,
    municipalData: null,
    fokontanyData: null,
    dataTableData: null,
    historic: null
}

const malariaSlice = createSlice({
    name: 'malaria',
    initialState,
    reducers: {
        setMean: updateDataReducer('mean'),
        setLower: updateDataReducer('lower'),
        setUpper: updateDataReducer('upper'),
        setDistrictData: updateDataReducer('districtData'),
        setMunicipalData: updateDataReducer('municipalData'),
        setFokontanyData: updateDataReducer('fokontanyData'),
        setDataTableData: updateDataReducer('dataTableData'),
        setHistoric: updateDataReducer('historic')
    }
})

export const { 
    setLower,
    setUpper,
    setMean,
    setDistrictData,
    setMunicipalData,
    setFokontanyData,
    setDataTableData
} = malariaSlice.actions

export default malariaSlice.reducer