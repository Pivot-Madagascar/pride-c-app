import { useDataEngine } from '@dhis2/app-runtime'
import { useState, useEffect } from 'react'

const mapRowToDetails = (row, items) => {
    try {
        const dataElement = row[0]
        const orgUnit = row[1]
        const period = row[2]
        const value = row[3]

        return {
            dataElement,
            period,
            orgUnit,
            value,
        }
    } catch (error) {
        console.error('Error in mapRowToDetails:', error)
        console.log('Row:', row)
        console.log('Items:', items)
        throw error
    }
}

const useAnalyticsData = ({ dataElements, orgUnits, periods }) => {
    const engine = useDataEngine()
    const [analyticsData, setAnalyticsData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    useEffect(() => {
        if (!dataElements|| !orgUnits.length || !periods.length) {
            return
        }
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
                const { analytics } = await engine.query(query)
                const { rows } = analytics
                const items = analytics.metaData.items
                const data = rows.map((row) => mapRowToDetails(row, items))
                setAnalyticsData(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchAnalytics()
    }, [engine, dataElements.join(';'), orgUnits.join(';'), periods.join(';')]) 
    return { analyticsData, loading, error }
}
export default useAnalyticsData
