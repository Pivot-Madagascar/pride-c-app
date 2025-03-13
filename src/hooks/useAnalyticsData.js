import { useDataEngine } from '@dhis2/app-runtime'
import { useState, useEffect } from 'react'

const useAnalyticsData = ({ dataElements, orgUnits, periods }) => {
    const engine = useDataEngine()
    const [analyticsData, setAnalyticsData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!dataElements.length || !orgUnits.length || !periods.length) {return}

        const fetchAnalytics = async () => {
            setLoading(true)
            try {
                const query = {
                    analytics: {
                        resource: 'analytics',
                        params: {
                            dimension: [
                                `dx:${dataElements.join(';')}`, 
                                `ou:${orgUnits.join(';')}`, 
                                `pe:${periods.join(';')}`, 
                            ],
                            displayProperty: 'NAME',
                        },
                    },
                }

                const response = await engine.query(query)
                setAnalyticsData(response.analytics)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchAnalytics()
    }, [engine, dataElements, orgUnits, periods])

    return { analyticsData, loading, error }
}

export default useAnalyticsData
