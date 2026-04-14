import { useCallback, useEffect, useState } from 'react'
import { useExecuteQuery } from '@/hooks/useExecuteQuery'

const query = {
    pridecUpdate: {
        resource: 'dataStore/pridec/pridec_update',
    },
}

export const usePridecUpdate = () => {
    const { loading, execute } = useExecuteQuery()
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    const fetchData = useCallback(async () => {
        const result = await execute({ query, type: 'query' })

        if (typeof result === 'string' && result.startsWith('ERROR:')) {
            setError(new Error(result))
            setData(null)
        } else {
            const parsedResult = JSON.parse(result)
            const pridecUpdate = parsedResult && parsedResult.pridecUpdate
            setData(pridecUpdate !== undefined ? pridecUpdate : null)
            setError(null)
        }
    }, [execute])

    // Fetch on mount
    useEffect(() => {
        fetchData()
    }, [fetchData])

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    }
}
