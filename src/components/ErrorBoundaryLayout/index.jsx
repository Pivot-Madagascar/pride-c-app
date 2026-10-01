import React from 'react'
import { Outlet } from 'react-router-dom'
import ErrorBoundary from '@/components/ErrorBoundary'

const ErrorBoundaryLayout = () => {
    return (
        <ErrorBoundary>
            <Outlet />
        </ErrorBoundary>
    )
}

export default ErrorBoundaryLayout
