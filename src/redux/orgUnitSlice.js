import { createSlice } from '@reduxjs/toolkit'

const generateFormattedArray = (objects) => {
    return objects.map((obj) => ({
        municipality: obj.parent?.parent?.displayName,
        municipalityId: obj.parent?.parent?.id,
        formationSanitaire: obj.parent?.displayName,
        formationSanitaireId: obj.parent?.id,
        displayName: obj.displayName,
        id: obj.id,
    }))
}

const groupObjectsByParent = (objects) => {
    let groupedObjects = {}
    let parentsSet = new Set()
    let orgUnitsId = []

    // Iterate through the array of objects
    objects.forEach((obj) => {
        // Extract the parent information
        const parentId = obj.parent?.parent?.id
        const parentDisplayName = obj.parent?.parent?.displayName

        // Check if the parent information is present
        if (parentId && parentDisplayName) {
            // Create a unique key for the parent
            const parentKey = `${parentDisplayName}-${parentId}`

            // Add the parent to the set
            parentsSet.add(
                JSON.stringify({
                    displayName: parentDisplayName,
                    id: parentId,
                })
            )

            // If the group for this parent does not exist, create it
            if (!groupedObjects[parentKey]) {
                groupedObjects[parentKey] = {
                    parent: {
                        displayName: parentDisplayName,
                        id: parentId,
                    },
                    combinedChildren: [],
                }
            }

            // Add a copy of the object without the parent structure to the combinedChildren array
            const newObj = { ...obj }
            delete newObj.parent
            orgUnitsId.push(newObj.id)
            groupedObjects[parentKey].combinedChildren.push(newObj)
        }
    })

    // Convert the set of parents to an array
    const municipalities = Array.from(parentsSet).map((parent) =>
        JSON.parse(parent)
    )

    const formattedArray = generateFormattedArray(objects)

    return {
        municipalities: municipalities,
        fokontanyList: formattedArray,
        combinedFkt: groupedObjects,
        orgUnitsId: orgUnitsId 
    }
}

const initialState = {
    municipalities: null,
    fokontanyList: null,
    fktToMunicipalities: [],
    orgUnitsId: null,
}

const orgUnitSlice = createSlice({
    name: 'orgUnit',
    initialState,
    reducers: {
        setOrgUnits: (state, { payload }) => {
            const { 
                municipalities, 
                fokontanyList, 
                combinedFkt,
                orgUnitsId
            } = groupObjectsByParent(payload)

            state.municipalities = municipalities           
            state.fokontanyList = fokontanyList
            state.fktToMunicipalities = combinedFkt
            state.orgUnitsId = orgUnitsId
        },
    },
})

export const { setOrgUnits } = orgUnitSlice.actions

export default orgUnitSlice.reducer
