import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    message: '',
    type: 'info',
    id: null,
    visible: false
}

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        showNotification: (state, action) => {
            const { message, type, id } = action.payload
            state.message = message
            state.type = type
            state.id = id || null
            state.visible = true
        },
        clearNotification: (state, action) => {
            if (!action.payload || action.payload === state.id) {
                return initialState
            }
        },
    },
})

export const { showNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer
