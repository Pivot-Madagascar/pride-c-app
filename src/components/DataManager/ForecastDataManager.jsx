import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setForecastData } from '../../redux/newMalariaSlice'
import { fetchAndFormat, fetchForecastData} from '../../utils/request'
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

    const lastThreeMonths = () => {
        const months = []
        const date = new Date()

        for (let i = 0; i < 3; i++) {
            const year = date.getFullYear()
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            months.unshift(`${year}${month}`)
            date.setMonth(date.getMonth() - 1)
        }

        return months
    }

    const fetchData = async () => {
        if (!storedData) {
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
                console.error(
                    `Error fetching ${adminLevel} forecast data:`,
                    error
                )
            }
        }
    }

    useEffect(() => {
        fetchData()
    }, [storedData, orgUnitIds])

    return null
}

export default ForecastDataManager
