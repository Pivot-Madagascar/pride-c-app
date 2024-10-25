import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setForecastData } from '../../redux/newMalariaSlice'
import { fetchForecastData } from '../../utils/request'
import { useDataEngine } from '@dhis2/app-runtime'

const ForecastDataManager = ({
    forecastType,
    caseType,
    adminLevel,
    orgUnitIds,
    dataElementId,
}) => {
    const engine = useDataEngine()
    const dispatch = useDispatch()
    const storedData = useSelector(
        (state) =>
            state.newMalaria.forecast[forecastType]?.[caseType]?.[adminLevel]
    )

    const [loading, setLoading] = useState(false)

    const lastThreeMonths = () => {
        const currentDate = new Date()
        const lastThreeMonths = []

        for (let i = 0; i < 3; i++) {
            const month = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() - i,
                1
            )
            const yearMonth = month.toISOString().slice(0, 7).replace('-', '')
            lastThreeMonths.unshift(yearMonth)
        }

        return lastThreeMonths
    }

    const fetchData = async () => {
        setLoading(true)
        try {
            const result = await fetchForecastData(
                dataElementId,
                engine,
                lastThreeMonths(),
                orgUnitIds
            )
            const combineData = {}
            result.forEach((item) => {
                const orgUnit = item.orgUnit
                const values = item.values
                combineData[orgUnit] = values
            })
            dispatch(
                setForecastData({
                    forecastType,
                    caseType,
                    adminLevel,
                    data: combineData,
                })
            )
        } catch (error) {
            console.error(`Error fetching ${adminLevel} forecast data:`, error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!storedData && !loading) {
            fetchData()
        }
    }, [storedData, orgUnitIds, loading])

    return null
}

export default ForecastDataManager
