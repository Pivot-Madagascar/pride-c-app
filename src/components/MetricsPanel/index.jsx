import { useMemo, useState, useEffect } from 'react'
import MetricsCard from '../../components/Metrics'
import { getMonthYYYYMM, convertToLocaleDate } from '../../utils/format-time'
import { getStoredData } from '../../utils/storeHelper'
import style from './metricsPanel.module.scss'

const currentPeriod = {
    start: convertToLocaleDate(getMonthYYYYMM(), 'fr-FR', {
        year: 'numeric',
        month: 'short',
    }),
    end: convertToLocaleDate(getMonthYYYYMM(2), 'fr-FR', {
        year: 'numeric',
        month: 'short',
    }),
}

const initialIndicators = [
    { name: 'csb', label: 'Cas aux CSB', inPercent: false },
    { name: 'incidence', label: 'Incidence (par 100 000)', isPercent: false },
    { name: 'comCases', label: 'Cas communautaire', isPercent: false },
    { name: 'trend', label: 'Tendance Générale', isPercent: true },
].map((indicator) => ({
    ...indicator,
    value: undefined,
    comparison: undefined,
    description: `Entre le mois de ${currentPeriod.start} et ${currentPeriod.end}`,
}))

const MetricsPanel = ({
    adminLvl,
    orgUnit,
    themeColor,
    alertData,
    comparisonData,
}) => {
    const [indicators, setIndicators] = useState(initialIndicators)

    const alertKeys = useMemo(
        () => ['incidence', 'csb', 'comCases', 'csbVigilance', 'trend'],
        []
    )
    const compareKeys = useMemo(() => ['incidence', 'csb', 'comCases'], [])

    const updateIndicators = (key, value, target) => {
        setIndicators((prevIndicators) =>
            prevIndicators.map((indicator) =>
                indicator.name === key
                    ? { ...indicator, [target]: value }
                    : indicator
            )
        )
    }

    const generateList = (keys, data, target) => {
        return keys.reduce((acc, key) => {
            const value = getStoredData({
                data,
                source: key,
                adminLvl,
                orgUnit: String(orgUnit),
            })
            if (value) {
                acc[key] = value[0]
                updateIndicators(key, value[0].value, target)
            } else {
                acc[key] = value
                updateIndicators(key, value, target)
            }
            return acc
        }, {})
    }

    const alertList = useMemo(
        () => generateList(alertKeys, alertData, 'value'),
        [alertData, adminLvl, orgUnit]
    )
    const compareList = useMemo(
        () => generateList(compareKeys, comparisonData, 'comparison'),
        [comparisonData, adminLvl, orgUnit]
    )

    // Effect to update indicators when alertList or compareList change
    useEffect(() => {
        if (orgUnit && adminLvl && alertList && compareList) {
            alertKeys.forEach((key) => {
                if (alertList[key]) {
                    updateIndicators(key, alertList[key].value, 'value')
                }
            })
            compareKeys.forEach((key) => {
                if (compareList[key]) {
                    updateIndicators(
                        key,
                        compareList[key].value,
                        'comparison'
                    )
                }
            })
        }
    }, [orgUnit, adminLvl, alertList, compareList, alertKeys, compareKeys])

    return (
        <div className={style.statisticsSection}>
            {indicators.map((item) => (
                <MetricsCard
                    key={item.name}
                    item={item}
                    bgColor={themeColor}
                    className={style.singleCard}
                />
            ))}
        </div>
    )
}

export default MetricsPanel
