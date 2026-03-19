import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearNotification } from '../../redux/notificationSlice'
import { showToast } from '../../utils/toasts.jsx'

const NotificationListener = () => {
    const { message, type, visible, id } = useSelector(
        (state) => state.notification
    )
    const dispatch = useDispatch()

    useEffect(() => {
        if (visible && message) {
            showToast(message, type, id)
            dispatch(clearNotification())
        }
    }, [visible, message, type, id, dispatch])

    return null
}

export default NotificationListener
