import { useMemo } from 'react'
import COLORS from '@/constants/styles'
import {
    getYearColors,
    getYearKeys,
    keepMostRecentYears,
} from '@/utils/timeSeriesYears'

// Assignment order: the most recent year gets the last color,
// the previous year the second-to-last, and so on.
const COLOR_PALETTE = [
    COLORS.green,
    COLORS.blue,
    COLORS.red,
    COLORS.primary_text,
]

// One color per displayed year (excluding min/max)
const MAX_DISPLAYED_YEARS = COLOR_PALETTE.length


const forceTransparentForMinMax = (dataArray) => {
    return dataArray.map((item) => {
        if (item.label === 'min' || item.label === 'max') {
            return {
                ...item,
                borderColor: 'transparent',
                backgroundColor: 'transparent',
            }
        }
        return item
    })
}


const generateMonthLabels = ({ locale = 'fr', monthFormat = 'short', length = 12 }) => {
    const currentYear = new Date().getFullYear()
    const formatter = new Intl.DateTimeFormat(locale, { month: monthFormat })
    const labels = []

    for (let i = 0; i < length; i++) {
        const date = new Date(currentYear, i, 1)
        const monthName = formatter.format(date)
        labels.push(monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase())
    }

    return labels
}

const TimeSeriesData = ({ data: rawData }) => {
    const length = rawData?.max?.length || 12
    const lineChartData = useMemo(() => {
        const labels = generateMonthLabels({ length })

        const data = keepMostRecentYears(rawData, MAX_DISPLAYED_YEARS)
        const yearKeys = Object.keys(data || {})
        const yearColors = getYearColors(getYearKeys(data), COLOR_PALETTE)

        const historic = yearKeys.map((year) => {
            const color = yearColors[year]

            if (year !== 'min' && year !== 'max') {
                return {
                    fill: false,
                    year,
                    data: data[year] || [],
                    borderColor: color,
                    backgroundColor: color,
                    tension: 0.25,
                    pointRadius: 2,
                    hidden: false,
                }
            } else {
                return {
                    fill: false,
                    year,
                    data: data[year] || [],
                    borderColor: 'transparent',
                    backgroundColor: 'rgb(0, 0, 0, 0.2)',
                    tension: 0.25,
                    pointRadius: 0,
                    type: 'line',
                    hidden: false,
                }
            }
        })

        const forecastMaxLimit = {
            fill: 3,
            label: 'Maximum',
            data: data?.['max'] || [],
            borderColor: 'transparent',
            backgroundColor: 'rgb(0, 0, 0, 0.2)',
            tension: 0.25,
            pointRadius: 0,
            type: 'line',
            hidden: false,
        }

        const forecastMinLimit = {
            fill: 3,
            label: 'Minimum',
            data: data?.['min'] || [],
            borderColor: 'transparent',
            backgroundColor: 'rgb(0, 0, 0, 0.2)',
            tension: 0.25,
            pointRadius: 0,
            type: 'line',
            hidden: false,
        }

        const datasets = [...historic, forecastMaxLimit, forecastMinLimit]
        return { labels, datasets: forceTransparentForMinMax(datasets), yearKeys }

    }, [rawData, length])

    return lineChartData
}

export default TimeSeriesData
