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
    pridecOrgUnits: undefined,
}

const orgUnitSlice = createSlice({
    name: 'orgUnit',
    initialState,
    reducers: {
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
        }
    },
})

export const {
    setOrgUnits,
    setOrgUnitLevels,
    setDistrictDetails,
    setMunicipalityDetails,
    setCsbDetails,
    setFokontanyDetails,
    setParentDetails,
    setOrgUnitsDetails,
    setGeoJson,
    setPridecOrgUnits
} = orgUnitSlice.actions
export default orgUnitSlice.reducer
