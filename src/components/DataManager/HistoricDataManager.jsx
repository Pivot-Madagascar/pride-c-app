import { useDataEngine } from '@dhis2/app-runtime'
import React, { useEffect, useMemo, useState } from 'react'
import { generateYearMonths } from '../../utils/format-time'
import { collectValuesByOrgUnit } from '../../utils/formatting'
import { fetchAnalyticsData } from '../../utils/request'
const HistoricDataManager = ({
    caseType,
    adminLevel,
    orgUnitIds,
    dataElementId,
    onSetHistoricData,
    storedValue,
    periods,
}) => {
    const engine = useDataEngine()

    const [loading, setLoading] = useState(false)

    const historicPeriods = useMemo(
        () =>
            periods.reduce((acc, year) => {
                acc[year] = generateYearMonths(year)
                return acc
            }, {}),
        [periods]
    )

    const combineDataByOrgUnit = (acc, result, key) => {
        const data = collectValuesByOrgUnit(result)
        data.forEach((item) => {
            const orgUnit = item.orgUnit
            const values = item.values
            if (!acc[orgUnit]) {
                acc[orgUnit] = {}
            }
            acc[orgUnit][key] = values
        })
    }

    const fetchData = async () => {
        setLoading(true)
        try {
            const keys = Object.keys(historicPeriods)
            const data = await keys.reduce(async (accPromise, key) => {
                const acc = await accPromise
                const result = await fetchAnalyticsData({
                    dataElement: dataElementId,
                    engine,
                    periods: historicPeriods[key],
                    orgUnits: orgUnitIds
                })
                combineDataByOrgUnit(acc, result, key)
                return acc
            }, Promise.resolve({}))
            if (onSetHistoricData) {
                onSetHistoricData({
                    caseType,
                    adminLevel,
                    data,
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

export default HistoricDataManager
