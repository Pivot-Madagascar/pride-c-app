import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect, useState } from 'react'

const query = {
    pridecUpdate: {
        resource: 'dataStore/pridec/pridec_update',
    },
}

export const usePridecUpdate = () => {
    const engine = useDataEngine()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchData = async () => {
        try {
            setLoading(true)
            const result = await engine.query(query)
            setData(result && result.pridecUpdate !== undefined || null ? JSON.parse(result.pridecUpdate) : null)
            setError(null)
        } catch (err) {
            setError(err)
            setData(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [engine])

    const refetch = () => {
        fetchData()
    }

    return {
        data: data && data.pridec_update !== undefined || null ? data.pridec_update : null,
        loading,
        error,
        refetch,
    }
}
