import { createSlice } from '@reduxjs/toolkit'

const setDetails =
    (key) =>
    (state, { payload }) => {
        state[key] = payload
    }

const initialState = {
    district: [{ id: 'VtP4BdCeXIo', displayName: 'Ifanadiana' }],
    parentDetails: null,
    municipalities: null,
    csb: null,
    fokontanyList: null,
    fktToMunicipalities: [],
    orgUnitsId: null,
    orgUnitLevels: undefined,
    orgUnits: {},
    geoJson: {},
    pridecOrgUnits: [
        {
            name: 'CSB2 Atsindra',
            id: 'pczrAub8lnt',
            level: 5,
        },
        {
            name: 'CSB2 Tsaratanana',
            id: 'uWoBok9YyvB',
            level: 5,
        },
        {
            name: 'CSB2 Antaretra',
            id: 'okDqhh9n4yT',
            level: 5,
        },
        {
            name: 'CSB2 Marotoko',
            id: 'DDR2w1c1GyE',
            level: 5,
        },
        {
            name: 'CSB2 Ampasinambo',
            id: 'U1YeJp3NDNV',
            level: 5,
        },
        {
            name: 'CSB2 Ambohimiera',
            id: 'D9UWDj19ljP',
            level: 5,
        },
        {
            name: 'CSB1 Ambodiara Sud',
            id: 'M38BJM8ju1A',
            level: 5,
        },
        {
            name: 'CSB2 Kelilalina',
            id: 'RRe6ic0AU1Z',
            level: 5,
        },
        {
            name: 'CSB2 Ranomafana',
            id: 'r4U7PhBKR7S',
            level: 5,
        },
        {
            name: 'CSB2 Fasintsara',
            id: 'EE6WwIMgQ0F',
            level: 5,
        },
        {
            name: 'CSB1 Ambodimanga Nord',
            id: 'WCqkkkKNJEi',
            level: 5,
        },
        {
            name: 'CSB1 Maromanana',
            id: 'YCvVB1VwWi0',
            level: 5,
        },
        {
            name: 'CSB2 Ambohimanga du Sud',
            id: 'mBZLeZ7Irx6',
            level: 5,
        },
        {
            name: 'CSB2 Analampasina',
            id: 'hXuxS0MOq3b',
            level: 5,
        },
        {
            name: 'CSB2 Maroharatra',
            id: 'ZPvH8UsgwYv',
            level: 5,
        },
        {
            name: 'CSB1 Ambalavolo',
            id: 'QHPyq70qulM',
            level: 5,
        },
        {
            name: 'CSB2 Ifanadiana',
            id: 'O1wNJut8eci',
            level: 5,
        },
        {
            name: 'CSB2 Androrangavola',
            id: 'z6kDxHwInUT',
            level: 5,
        },
        {
            name: 'CSB1 Mahasoa',
            id: 'h0z1bKoHDrU',
            level: 5,
        },
        {
            name: 'CSB1 Analamarina Nord',
            id: 'Pi2y9HFBDRj',
            level: 5,
        },
        {
            name: 'CSB2 Ambiabe',
            id: 'FGM6Ric1YnC',
            level: 5,
        },
    ],
}

const orgUnitSlice = createSlice({
    name: 'orgUnit',
    initialState,
    reducers: {
        reset: () => initialState,
        setOrgUnits: (state, { payload }) => {
            const { path, value } = payload
            const lastKey = path.pop()
            let current = state
            path.forEach((key) => {
                if (!current[key]) {
                    current[key] = {}
                }
                current = current[key]
            })
            current[lastKey] = value
            // state.orgUnits = payload
        },
        setDistrictDetails: setDetails('districtDetails'),
        setMunicipalityDetails: setDetails('municipalityDetails'),
        setCsbDetails: setDetails('csbDetails'),
        setFokontanyDetails: setDetails('fokontanyDetails'),
        setParentDetails: setDetails('parentDetails'),
        setOrgUnitLevels: (state, { payload }) => {
            state.orgUnitLevels = payload
        },
        setOrgUnitsDetails: (state, { payload }) => {
            const { level, data } = payload
            const prevState = state.orgUnits
            const keys = Object.keys(prevState)
            if (!keys.includes(level) && data && level) {
                state.orgUnits[level] = data
            }
        },
        setGeoJson: (state, { payload }) => {
            const { level, data } = payload
            const prevState = state.geoJson
            const keys = Object.keys(prevState)
            if (!keys.includes(level) && data && level) {
                state.geoJson[level] = data
            }
        },
        setPridecOrgUnits: (state, { payload }) => {
            state.pridecOrgUnits = payload
        },
    },
})

export const {
    reset,
    setOrgUnits,
    setOrgUnitLevels,
    setDistrictDetails,
    setMunicipalityDetails,
    setCsbDetails,
    setFokontanyDetails,
    setParentDetails,
    setOrgUnitsDetails,
    setGeoJson,
    setPridecOrgUnits,
} = orgUnitSlice.actions
export default orgUnitSlice.reducer
