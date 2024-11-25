import { useDataEngine } from '@dhis2/app-runtime'
import React, { useEffect, useState } from 'react'
import { fetchForecastData, fetchAndFormat } from '../../utils/request'

const getCurrentMonth = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0') // getMonth() returns 0-11, so add 1 and pad with zero if needed
    return `${year}${month}`
}

const AlertDataManager = ({
    caseType,
    adminLevel,
    orgUnitIds,
    dataElementId,
    onSetAlertData,
    storedValue,
}) => {
    const engine = useDataEngine()

    const [loading, setLoading] = useState(false)
    const period = getCurrentMonth()


    const fetchData = async () => {
        setLoading(true)
        console.log(caseType, 'case type');
        console.log(adminLevel, 'admin leval');
        console.log(orgUnitIds, 'orgUnit');
        console.log(dataElementId, 'data element ID ');
        console.log(storedValue, 'stored value');
        try {
            const result = await fetchForecastData(
                dataElementId,
                engine,
                [String(period)],
                orgUnitIds
            )
            // console.log(result);
            const combineData = {}
            result.forEach((item) => {
                const orgUnit = item.orgUnit
                const values = item.values
                combineData[orgUnit] = values
            })
            if (onSetAlertData) {
                onSetAlertData({
                    caseType,
                    adminLevel,
                    data: combineData,
                })
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

export default AlertDataManager
