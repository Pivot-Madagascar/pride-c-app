import { useMemo, useState, useEffect } from 'react'
import MetricsCard from '../../components/Metrics'
import { getMonthYYYYMM, convertToLocaleDate } from '../../utils/format-time'
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

const comparisonPeriod = {
    start: convertToLocaleDate(getMonthYYYYMM(-12), 'fr-FR', {
        year: 'numeric',
        month: 'short',
    }),
    end: convertToLocaleDate(getMonthYYYYMM(-10), 'fr-FR', {
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
    periods: { current: currentPeriod, comparison: comparisonPeriod },
}))

const MetricsPanel = ({ themeColor, alertData, comparisonData }) => {
    const [indicators, setIndicators] = useState(initialIndicators)

    const alertKeys = useMemo(
        () => ['incidence', 'csb', 'comCases', 'trend'],
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
            const value = Number(data[key]?.['value'])
            if (!isNaN(value)) {
                acc[key] = value
                updateIndicators(key, value, target)
            } else {
                acc[key] = null
                updateIndicators(key, null, target)
            }
            return acc
        }, {})
    }

    const alertList = useMemo(() => {
        if (alertData) {
            return generateList(alertKeys, alertData, 'value')
        }
    }, [alertData])

    const compareList = useMemo(() => {
        if (comparisonData) {
            return generateList(compareKeys, comparisonData, 'comparison')
        }
    }, [comparisonData])

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
