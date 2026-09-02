import { createAsyncThunk } from '@reduxjs/toolkit'
import { setFetchedDimensions } from '@/redux/appSlice'
import {
    setParentDetails,
    setOrgUnitLevels,
    setOrgUnits,
    setPridecOrgUnits,
} from '@/redux/orgUnitSlice'
import { fetchPridecOrgUnitsFromDataStore, fetchPridecOU } from '@/utils/request'

// Helpers (extracted from existing hooks)
 
const parseFeatures = (data) =>
    data.map(({ type, id, geometry, properties }) => ({
        type,
        id,
        properties: {
            orgUnitId: id,
            orgUnitName: properties.name,
            level: properties.level,
        },
        geometry,
    }))
 
const parseOrgUnits = (data) =>
    data.map(({ id, properties }) => {
        const { name, level, parent, parentGraph } = properties
        return { id, name, level, parent, parentGraph }
    })
 
const processOrgUnitOptions = ({ orgUnitOptions, parentDetails, adminLevels, storeOrgUnits }) =>
    orgUnitOptions.map((option) => {
        const { level, parentGraph } = option
        const graphArr = parentGraph.split('/')
        const { id: parentId } = parentDetails
 
        const index = graphArr.indexOf(parentId)
        if (index === -1) {return option}
 
        const currentAdminLevel = adminLevels.find(
            (el) => el.level === Number(level)
        )?.name
 
        let parentData = null
        const payload = graphArr
            .slice(index)
            .reverse()
            .map((t, i) => {
                const currentLevel = level - (i + 1)
                const adminLevel = adminLevels.find(({ level }) => level === currentLevel)
 
                if (adminLevel?.id && storeOrgUnits[adminLevel.id]) {
                    parentData =
                        storeOrgUnits[adminLevel.id].find(({ id }) => id === t) || parentData
                }
 
                return {
                    name: parentData?.name,
                    id: parentData?.id,
                    level: currentLevel,
                    adminLevelName: adminLevel?.name,
                    adminLevelId: adminLevel?.id,
                }
            })
 
        return { ...option, parents: payload, levelName: currentAdminLevel }
    })

// Step 1 — Fetch OrgUnit Details (parent)
 
export const fetchParentDetails = createAsyncThunk(
    'orgUnit/fetchParentDetails',
    async ({ engine, parentId }, { dispatch, getState, rejectWithValue }) => {
        const query = {
            orgUnit: {
                resource: `organisationUnits/${parentId}`,
                params: { fields: 'id,name,level' },
            },
        }
        const key = JSON.stringify(query)
        const cachedDimensions = getState().app.fetchedDimensions
        const isStored = cachedDimensions.includes(key)
 
        if (isStored) {
            // Already in Redux cache — return directly
            return getState().orgUnit.parentDetails
        }
 
        try {
            const result = await engine.query(query)
            const details = result?.orgUnit || null
            dispatch(setParentDetails(details))
            dispatch(setFetchedDimensions(key))
            return details
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

// Step 2 — Fetch OrgUnit Levels
 
export const fetchOrgUnitLevels = createAsyncThunk(
    'orgUnit/fetchOrgUnitLevels',
    async ({ engine }, { dispatch, getState, rejectWithValue }) => {
        const query = {
            orgUnitLevels: {
                resource: 'organisationUnitLevels',
                params: { fields: 'id,name,level' },
            },
        }
        const key = JSON.stringify(query)
        const cachedDimensions = getState().app.fetchedDimensions
        const isStored = cachedDimensions.includes(key)
 
        if (isStored) {
            return getState().orgUnit.orgUnitLevels
        }
 
        try {
            const result = await engine.query(query)
            const levels = result?.orgUnitLevels?.organisationUnitLevels || []
 
            // Calculate adminLevels filtered by parent level
            // (requires parentDetails already in store via step 1)
            const parentLevel = getState().orgUnit.parentDetails?.level
            const adminLevels = levels
                .filter((el) => el.level >= parentLevel)
                .sort((a, b) => a.level - b.level)
 
            dispatch(setOrgUnitLevels(adminLevels))
            dispatch(setFetchedDimensions(key))
            return adminLevels
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)
 
// Step 3 — Fetch OrgUnits GeoJSON

export const fetchOrgUnitsGeoJson = createAsyncThunk(
    'orgUnit/fetchOrgUnitsGeoJson',
    async ({ engine, parentId }, { dispatch, getState, rejectWithValue }) => {
        // Read adminLevels from store (updated by step 2)
        const adminLevels = getState().orgUnit.orgUnitLevels
        const parentDetails = getState().orgUnit.parentDetails
        const storeOrgUnits = getState().orgUnit.orgUnits

        if (!adminLevels || adminLevels.length === 0) {
            return rejectWithValue('adminLevels missing in store')
        }

        const levels = adminLevels.map((level) => level.level)

        const query = {
            geojson: {
                resource: 'organisationUnits.geojson',
                params: {
                    parent: parentId,
                    level: Array.isArray(levels) ? levels.join(',') : levels,
                },
            },
        }

        const key = JSON.stringify(query)
        const cachedDimensions = getState().app.fetchedDimensions
        const isStored = cachedDimensions.includes(key)

        if (isStored) {
            return { alreadyCached: true }
        }

        try {
            const { geojson } = await engine.query(query)

            const groupedByLevel = geojson?.features.reduce((acc, feature) => {
                const level = feature.properties.level
                if (!acc[level]) {acc[level] = []}
                acc[level].push(feature)
                return acc
            }, {})

            // Sort levels from highest to lowest 
            // so each level can see orgUnits from parent levels
            // already dispatched when processOrgUnitOptions executes
            const sortedLevelKeys = Object.keys(groupedByLevel).sort(
                (a, b) => Number(a) - Number(b)
            )

            sortedLevelKeys.forEach((levelKey) => {
                const currentGeoJson = groupedByLevel[levelKey]
                const orgUnits = parseOrgUnits(currentGeoJson)
                const features = parseFeatures(currentGeoJson)
                const adminLevel = adminLevels.find((l) => l.level == levelKey)

                if (orgUnits.length === features.length && adminLevel?.id) {
                    // Re-read storeOrgUnits at each iteration to include
                    // levels already dispatched in this same loop
                    const freshStoreOrgUnits = getState().orgUnit.orgUnits

                    const processedOrgUnits = processOrgUnitOptions({
                        orgUnitOptions: orgUnits,
                        parentDetails,
                        adminLevels,
                        storeOrgUnits: freshStoreOrgUnits,
                    })

                    dispatch(
                        setOrgUnits({
                            path: ['orgUnits', adminLevel.id],
                            value: processedOrgUnits,
                        })
                    )
                    dispatch(
                        setOrgUnits({
                            path: ['features', adminLevel.id],
                            value: features,
                        })
                    )
                }
            })

            dispatch(setFetchedDimensions(key))
            return { alreadyCached: false }
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

// Step 4 — Fetch Pridec OrgUnits from DataStore

export const fetchPridecOrgUnits = createAsyncThunk(
    'orgUnit/fetchPridecOrgUnits',
    async ({ engine }, { dispatch, rejectWithValue }) => {
        try {
            const pridecOrgUnits = await fetchPridecOU({ engine })

            dispatch(setPridecOrgUnits(pridecOrgUnits))

            return { success: true, data: pridecOrgUnits }
        } catch (err) {
            console.error('[fetchPridecOrgUnits] Thunk rejected, dispatching fallback')
            dispatch(setPridecOrgUnits([]))
            return rejectWithValue(err.message)
        }
    }
)

// Orchestrator thunk — chains the 4 steps

export const fetchOrgUnitFlow = createAsyncThunk(
    'orgUnit/fetchOrgUnitFlow',
    async ({ engine, parentId }, { dispatch, rejectWithValue }) => {
        try {
            // Step 1 — parentDetails → stored in Redux
            await dispatch(fetchParentDetails({ engine, parentId })).unwrap()

            // Step 2 — orgUnitLevels → reads parentDetails from getState()
            await dispatch(fetchOrgUnitLevels({ engine })).unwrap()

            // Step 3 — orgUnits GeoJSON → reads adminLevels + parentDetails from getState()
            await dispatch(fetchOrgUnitsGeoJson({ engine, parentId })).unwrap()

            // Step 4 — Fetch PRIDEC specific orgUnits from DataStore
            await dispatch(fetchPridecOrgUnits({ engine })).unwrap()

            return { success: true }
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)
 