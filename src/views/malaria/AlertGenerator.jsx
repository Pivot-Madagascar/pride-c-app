import { useMemo, useState } from 'react'
import MetricsCard from '../../components/Metrics'
import { getMonthYYYYMM, convertToLocaleDate } from '../../utils/format-time'
import { getStoredData } from '../../utils/storeHelper'
import style from './malariaDashboard.module.scss'

const currentPeriod = {
    start: convertToLocaleDate(getMonthYYYYMM(), 'fr-FR', { year: 'numeric', month: 'short' }),
    end: convertToLocaleDate(getMonthYYYYMM(2), 'fr-FR', { year: 'numeric', month: 'short' })
}

const initialIndicators = [
    { name: 'csb', label: 'cas aux CSB' },
    { name: 'incidence', label: 'Incidence (par 100 000)' },
    { name: 'comCases', label: 'Cas communautaire' },
    { name: 'trend', label: 'Tendance Générale' },
].map((indicator) => ({
    ...indicator,
    value: undefined,
    comparison: undefined,
    description: `Entre le mois de ${currentPeriod.start} et ${currentPeriod.end}`,
}))

const AlertDataHandler = ({
    adminLvl,
    orgUnit,
    store,
    themeColor,
}) => {
    const [indicators, setIndicators] = useState(initialIndicators)

    const alertKeys = useMemo(() => ['incidence', 'csb', 'comCases', 'csbVigilance', 'trend'], [])
    const compareKeys = useMemo(() => ['incidence', 'csb', 'comCases'], [])

    const updateIndicators = useMemo(
        () => (key, value, target) => {
            setIndicators((prevIndicators) =>
                prevIndicators.map((indicator) =>
                    indicator.name === key
                        ? { ...indicator, [target]: value }
                        : indicator
                )
            )
        },
        []
    )

    const generateList = useMemo(
        () => (keys, type, target) => {
            return keys.reduce((acc, key) => {
                const value = getStoredData({
                    data: store,
                    type,
                    source: key,
                    adminLvl,
                    orgUnit: String(orgUnit),
                })
                if (value) {
                    acc[key] = value[0]
                    updateIndicators(key, value[0].value, target)
                }
                return acc
            }, {})
        },
        [adminLvl, orgUnit, store, updateIndicators]
    )

    const alertList = useMemo(() => generateList(alertKeys, 'alert', 'value'), [generateList, alertKeys])
    const compareList = useMemo(() => generateList(compareKeys, 'compare', 'comparison'), [generateList, compareKeys])

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

export default AlertDataHandler
