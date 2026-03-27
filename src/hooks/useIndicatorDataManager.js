import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getMonthYYYYMM, fetchAnalyticsData } from '@/utils'

const useIndicatorsData = (indicators, adminLevels) => {
    const engine = useDataEngine()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const period = getMonthYYYYMM()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const combinedData = {}
                for (const { level, ids } of adminLevels) {
                    for (const indicator of indicators) {
                        const result = await fetchAnalyticsData({
                            dataElement: indicator.dataElementId,
                            engine,
                            periods: [String(period)],
                            orgUnits: ids 
                        })
                        result.forEach((item) => {
                            combinedData[item.orgUnit] = item.values
                        })

                        if (indicator.action) {
                            dispatch(
                                indicator.action({
                                    caseType: indicator.source,
                                    adminLevel: level,
                                    data: combinedData,
                                })
                            )
                        }
                    }
                }
            } catch (error) {
                console.error(`Error fetching historic data:`, error)
                setError(error)
            } finally {
                setLoading(false)
            }
        }

        if (adminLevels.length > 0) {
            fetchData()
        }
    }, [indicators, adminLevels, engine, dispatch, period])

    return { loading, error }
}

export default useIndicatorsData
