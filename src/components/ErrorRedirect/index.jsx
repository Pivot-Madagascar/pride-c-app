import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ErrorRedirect = ({ error }) => {
    const navigate = useNavigate()

    useEffect(() => {
        navigate('/error', { state: { error } })
    }, [error, navigate])

    return null
}

export default ErrorRedirect
