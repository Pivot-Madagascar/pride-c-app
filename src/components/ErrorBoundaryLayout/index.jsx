import React from 'react'
import { Outlet } from 'react-router-dom'
import ErrorBoundary from '../ErrorBoundary'

const ErrorBoundaryLayout = () => {
    return (
        <ErrorBoundary>
            <Outlet />
        </ErrorBoundary>
    )
}

export default ErrorBoundaryLayout
