import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchForecastData } from '../../utils/request'

const getCurrentMonth = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0') // getMonth() returns 0-11, so add 1 and pad with zero if needed
    return `${year}${month}`
}

const IndicatorsDataManager = ({
    caseType,
    adminLevel,
    orgUnitIds,
    dataElementId,
    onSetAlertData,
    storedValue,
}) => {
    const engine = useDataEngine()
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)
    const period = getCurrentMonth()


    const fetchData = async () => {
        setLoading(true)
        try {
            const result = await fetchForecastData(
                dataElementId,
                engine,
                [String(period)],
                orgUnitIds
            )
            const combinedData = {}
            result.forEach((item) => {
                combinedData[item.orgUnit] = item.values
            })
            if (onSetAlertData) {
                dispatch(onSetAlertData({
                    caseType, 
                    adminLevel,
                    data: combinedData,
                }))
            }
        } catch (error) {
            console.error(`Error fetching ${adminLevel} historic data:`, error)
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

export default IndicatorsDataManager
