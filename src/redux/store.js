import { configureStore } from '@reduxjs/toolkit'
import climateReducer from './climateSlice'
import diarrheaReducer from './diarrheaSlice'
import iraReducer from './iraSlice'
import malariaReducer from './malariaSlice'
import orgUnitReducer from './orgUnitSlice'

export default configureStore({
    reducer: {
        orgUnit: orgUnitReducer,
        malaria: malariaReducer,
        ira: iraReducer,
        diarrhea: diarrheaReducer,
        climate: climateReducer
    },
})
