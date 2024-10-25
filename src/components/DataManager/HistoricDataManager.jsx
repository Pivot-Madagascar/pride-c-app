import { useDataEngine } from '@dhis2/app-runtime'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setHistoricData } from '../../redux/newMalariaSlice'
import { generateYearMonths } from '../../utils/format-time'
import { fetchAndFormat } from '../../utils/request'

const currentYear = new Date().getFullYear()
const lastThreeYears = [currentYear - 6, currentYear - 7, currentYear - 8]

const HistoricDataManager = ({
    caseType,
    adminLevel,
    orgUnitIds,
    dataElementId,
}) => {
    const engine = useDataEngine()
    const dispatch = useDispatch()
    const storedData = useSelector(
        (state) => state.newMalaria.historic[caseType]?.[adminLevel]
    )

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
            dispatch(
                setHistoricData({
                    caseType,
                    adminLevel,
                    data: combinedData,
                })
            )
        } catch (error) {
            console.error(`Error fetching ${adminLevel} historic data:`, error)
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

export default HistoricDataManager
