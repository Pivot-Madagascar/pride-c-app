import { createSlice } from '@reduxjs/toolkit'
import { CLIMATE, MALARIA, IRA, DIARRHEA } from '@/constants/new_mapping'

export { MALARIA, IRA, DIARRHEA, CLIMATE } from '@/constants/new_mapping'

const initialState = {
    climate: { ...CLIMATE },
    malaria: { ...MALARIA },
    ira: { ...IRA },
    diarrhea: { ...DIARRHEA },
}

const dataElementsSlice = createSlice({
    name: 'dataElements',
    initialState,
    reducers: {
        reset: () => initialState,
        setDataId: (state, action) => {
            const { category, subcategory, elementKey, id } = action.payload
            if (category === 'climate') {
                if (state.climate[elementKey]) {
                    state.climate[elementKey].id = id
                }
            } else if (state[category]) {
                if (subcategory && state[category][subcategory]) {
                    if (state[category][subcategory][elementKey]) {
                        state[category][subcategory][elementKey].id = id
                    }
                }
            }
        },
        setDataIds: (state, action) => {
            const updates = action.payload
            updates.forEach(({ category, subcategory, elementKey, id }) => {
                if (category === 'climate') {
                    if (state.climate[elementKey]) {
                        state.climate[elementKey].id = id
                    }
                } else {
                    if (
                        subcategory &&
                        state[category] &&
                        state[category][subcategory]
                    ) {
                        const subcat = state[category][subcategory]
                        const keyParts = elementKey.split('.')

                        if (keyParts.length > 1) {
                            let current = subcat[keyParts[0]]
                            for (let i = 1; i < keyParts.length - 1; i++) {
                                if (current && current[keyParts[i]]) {
                                    current = current[keyParts[i]]
                                } else {
                                    return
                                }
                            }
                            const finalKey = keyParts[keyParts.length - 1]
                            if (current && current[finalKey]) {
                                current[finalKey].id = id
                            }
                        } else {
                            if (subcat[elementKey]) {
                                subcat[elementKey].id = id
                            }
                        }
                    }
                }
            })
        },
        hydrate: (state, action) => {
            return action.payload
        },
    },
})

export const { reset, setDataId, setDataIds, hydrate } =
    dataElementsSlice.actions

export default dataElementsSlice.reducer
