import React, { useMemo, useState, useEffect } from 'react'
import { MetricsCard } from '@/components'
import { getMonthYYYYMM, convertToLocaleDate } from '@/utils'
import style from './metricsPanel.module.scss'
import { format, addMonths } from 'date-fns'
import { fr } from 'date-fns/locale'

const currentDate = new Date()
const periodStart = format(currentDate, 'MMMM yyyy', { locale: fr })
const monthAfterCurrent = addMonths(currentDate, 1)
const nextMonth = format(monthAfterCurrent, 'MMMM yyyy', { locale: fr })
const monthAfterNext = addMonths(currentDate, 2)
const periodEnd = format(monthAfterNext, 'MMMM yyyy', { locale: fr })
const lastYearStart = format(addMonths(currentDate, -12), 'MMMM yyyy', { locale: fr })
const lastYearEnd = format(addMonths(currentDate, -10), 'MMMM yyyy', { locale: fr })

const currentPeriod = {
    start: periodStart,
    end: periodEnd,
}

const trendPeriod = {
    start: periodStart,
    end: nextMonth,
}

const comparisonPeriod = {
    start: lastYearStart,
    end: lastYearEnd,
}

const initialIndicators = [
    {
        name: 'incidence',
        label: 'Incidence (par 100 000)',
        isPercent: false,
        description: `Entre ${currentPeriod.start} et ${currentPeriod.end}, par rapport à ${comparisonPeriod.start} et ${comparisonPeriod.end}`,
    },
    {
        name: 'comCases',
        label: 'Cas communautaire',
        isPercent: false,
        description: `Entre ${currentPeriod.start} et ${currentPeriod.end}, par rapport à ${comparisonPeriod.start} et ${comparisonPeriod.end}`,
    },
    {
        name: 'csb',
        label: 'Cas aux CSB',
        inPercent: false,
        description: `Entre ${currentPeriod.start} et ${currentPeriod.end}, par rapport à ${comparisonPeriod.start} et ${comparisonPeriod.end}`,
    },
    {
        name: 'trend',
        label: 'Tendance Générale',
        isPercent: true,
        description: `Entre ${trendPeriod.start} et ${trendPeriod.end}`,
    },
].map((indicator) => ({
    ...indicator,
    value: undefined,
    comparison: undefined,
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
