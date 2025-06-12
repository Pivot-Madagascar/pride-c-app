// hooks/useDataFetchStatus.js
import { useState, useCallback } from 'react'

const useDataFetchStatus = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const startLoading = useCallback(() => {
        setLoading(true)
        setError(null)
    }, [])

    const finishLoading = useCallback(() => {
        setLoading(false)
    }, [])

    const setErrorState = useCallback((err) => {
        setError(err instanceof Error ? err : new Error(String(err)))
    }, [])

    return {
        loading,
        error,
        startLoading,
        finishLoading,
        setError: setErrorState,
    }
}

export default useDataFetchStatus
