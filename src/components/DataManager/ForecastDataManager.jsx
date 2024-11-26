import { useDataEngine } from '@dhis2/app-runtime'
import React, { useEffect, useState } from 'react'
import { fetchForecastData } from '../../utils/request'

const ForecastDataManager = ({
    forecastType,
    caseType,
    adminLevel,
    orgUnitIds,
    dataElementId,
    periods,
    onSetForecastData, 
    storedValue,
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

    const fetchData = async () => {
        setLoading(true)
        const activePeriods = periods ? periods : lastThreeMonths()
        try {
            const result = await fetchForecastData(
                dataElementId,
                engine,
                activePeriods,
                orgUnitIds
            )
            const combineData = {}
            result.forEach((item) => {
                const orgUnit = item.orgUnit
                const values = item.values
                combineData[orgUnit] = values
            })

            if (onSetForecastData) {
                onSetForecastData({
                    forecastType,
                    caseType,
                    adminLevel,
                    data: combineData,
                })
            } else {
                console.error('Error: the onSetForecastData callback was not provided')
            }
        } catch (error) {
            console.error(`Error fetching ${adminLevel} forecast data:`, error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!storedValue && !loading) {
            fetchData()
        }
    }, [storedValue, orgUnitIds, loading])

    return null
}

export default ForecastDataManager
