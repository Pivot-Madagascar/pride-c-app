import { createSlice } from '@reduxjs/toolkit'

const setDetails =
    (key) =>
    (state, { payload }) => {
        state[key] = payload
    }

const formatObjects = (objects) => {
    return objects.map(({ parent, displayName, id }) => ({
        municipality: parent?.parent?.displayName,
        municipalityId: parent?.parent?.id,
        formationSanitaire: parent?.displayName,
        formationSanitaireId: parent?.id,
        displayName,
        id,
    }))
}

const groupObjectsByParent = (objects) => {
    const groupedObjects = {}
    const parentsSet = new Set()
    const orgUnitsId = []
    objects.forEach((obj) => {
        const parentId = obj.parent?.parent?.id
        const parentDisplayName = obj.parent?.parent?.displayName
        if (parentId && parentDisplayName) {
            const parentKey = `${parentDisplayName}-${parentId}`
            parentsSet.add(
                JSON.stringify({ displayName: parentDisplayName, id: parentId })
            )
            if (!groupedObjects[parentKey]) {
                groupedObjects[parentKey] = {
                    parent: { displayName: parentDisplayName, id: parentId },
                    combinedChildren: [],
                }
            }
            const newObj = { ...obj, parent: undefined } // Remove parent structure
            orgUnitsId.push(newObj.id)
            groupedObjects[parentKey].combinedChildren.push(newObj)
        }
    })
    const municipalities = Array.from(parentsSet).map(JSON.parse)
    const formattedArray = formatObjects(objects)
    return {
        municipalities,
        fokontanyList: formattedArray,
        combinedFkt: groupedObjects,
        orgUnitsId,
    }
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
    pridecOrgUnits: undefined
}

const orgUnitSlice = createSlice({
    name: 'orgUnit',
    initialState,
    reducers: {
        setOrgUnits: (state, { payload }) => {
            const { municipalities, fokontanyList, combinedFkt, orgUnitsId } =
                groupObjectsByParent(payload)
            state.municipalities = municipalities
            state.fokontanyList = fokontanyList
            state.fktToMunicipalities = combinedFkt
            state.orgUnitsId = orgUnitsId
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
