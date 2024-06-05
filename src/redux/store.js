import { configureStore } from "@reduxjs/toolkit"
import orgUnitReducer from "./orgUnitSlice"

export default configureStore({
    reducer: {
        orgUnit: orgUnitReducer
    }
})