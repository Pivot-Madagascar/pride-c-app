import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { generateYearMonths, collectValuesByOrgUnit, fetchAnalyticsData } from '@/utils'

const useHistoricData = ({
    caseType,
    adminLevel,
    orgUnitIds,
    dataElementId,
    storedValue,
    periods,
    onSetHistoricData,
}) => {
    const engine = useDataEngine()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const isFetching = useRef(false)

    const historicPeriods = useMemo(
        () => periods.reduce((acc, year) => ({
            ...acc,
            [year]: generateYearMonths(year)
        }), {}),
        [periods]
    )

    const combineDataByOrgUnit = useCallback((acc, result, key) => {
        collectValuesByOrgUnit(result).forEach(({ orgUnit, values }) => {
            if (!acc[orgUnit]) acc[orgUnit] = {}
            acc[orgUnit][key] = values
        })
    }, [])

    const fetchData = useCallback(async () => {
        if (isFetching.current) return
        isFetching.current = true
        setLoading(true)
        setError(null)

        try {
            const dataEntries = await Promise.all(
                Object.keys(historicPeriods).map(async key => {
                    const result = await fetchAnalyticsData({
                        dataElement: dataElementId,
                        engine,
                        periods: historicPeriods[key],
                        orgUnits: orgUnitIds
                    })
                    return { key, result }
                })
            )

            const data = dataEntries.reduce((acc, { key, result }) => {
                combineDataByOrgUnit(acc, result, key)
                return acc
            }, {})

            onSetHistoricData?.({ caseType, adminLevel, data })
        } catch (error) {
            console.error(`Error fetching ${adminLevel} historic data:`, error)
            setError(error)
        } finally {
            setLoading(false)
            isFetching.current = false
        }
    }, [engine, historicPeriods, dataElementId, orgUnitIds, caseType, adminLevel, combineDataByOrgUnit, onSetHistoricData])

    useEffect(() => {
        if (!storedValue && !isFetching.current) {
            fetchData()
        }
    }, [storedValue, fetchData])

    return { loading, error }
}

export default useHistoricData
