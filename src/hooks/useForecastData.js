import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect, useState } from 'react'
import { aggregateByOrgUnit, fetchAnalyticsData } from '@/utils'

const useForecastData = ({
    forecastType,
    caseType,
    adminLevel,
    orgUnitIds,
    dataElementId,
    periods,
    onSetForecastData,
    store,
}) => {

    const engine = useDataEngine()
    const [loading, setLoading] = useState(false)

    const lastThreeMonths = () => {
        const currentDate = new Date()
        const lastThreeMonths = []
        for (let i = 1; i < 4; i++) {
            const month = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + i,
                1
            )
            const yearMonth = month.toISOString().slice(0, 7).replace('-', '')
            lastThreeMonths.unshift(yearMonth)
        }
        return lastThreeMonths
    }

    const formatData = (data) => {
        const aggregatedData = aggregateByOrgUnit(data)
        return aggregatedData.reduce((acc, item) => {
            const orgUnit = item.orgUnit
            const values = item.values
            acc[orgUnit] = values
            return acc
        }, {})
    }

    const fetchData = async () => {
        setLoading(true)
        const activePeriods = periods ? periods : lastThreeMonths()
        try {
            const data = await fetchAnalyticsData({
                dataElement: dataElementId,
                engine,
                periods: activePeriods,
                orgUnits: orgUnitIds,
            })
            if (onSetForecastData) {
                onSetForecastData({
                    forecastType,
                    caseType,
                    adminLevel,
                    data: formatData(data),
                })
            } else {
                console.error(
                    'Error: the onSetForecastData callback was not provided'
                )
            }
        } catch (error) {
            console.error(`Error fetching forecast data:`, error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!store && !loading) {
            fetchData()
        }
    }, [store, orgUnitIds, loading])
    return { loading }
}

export default useForecastData
