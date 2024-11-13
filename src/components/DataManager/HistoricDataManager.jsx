import { useDataEngine } from '@dhis2/app-runtime'
import React, { useEffect, useMemo, useState } from 'react'
import { generateYearMonths } from '../../utils/format-time'
import { fetchAndFormat } from '../../utils/request'

const currentYear = new Date().getFullYear()
const lastThreeYears = [currentYear - 6, currentYear - 7, currentYear - 8]

const HistoricDataManager = ({
    caseType,
    adminLevel,
    orgUnitIds,
    dataElementId,
    onSetHistoricData,
    storedValue
}) => {
    const engine = useDataEngine()

    const [loading, setLoading] = useState(false)

    const historicPeriods = useMemo(
        () =>
            lastThreeYears.reduce((acc, year) => {
                acc[year] = generateYearMonths(year)
                return acc
            }, {}),
        [lastThreeYears]
    )

    const fetchData = async () => {
        setLoading(true)
        try {
            const keys = Object.keys(historicPeriods)
            const combinedData = await keys.reduce(async (accPromise, key) => {
                const acc = await accPromise
                const result = await fetchAndFormat(
                    dataElementId,
                    engine,
                    historicPeriods[key],
                    orgUnitIds
                )
                result.forEach((item) => {
                    const orgUnit = item.orgUnit
                    const values = item.values
                    if (!acc[orgUnit]) {
                        acc[orgUnit] = {}
                    }
                    acc[orgUnit][key] = values
                })
                return acc
            }, Promise.resolve({}))
            if (onSetHistoricData) {
                onSetHistoricData({
                    caseType,
                    adminLevel,
                    data: combinedData
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
