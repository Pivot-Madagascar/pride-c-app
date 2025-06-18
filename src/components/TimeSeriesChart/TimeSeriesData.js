import { useMemo } from 'react'
import COLORS from '../../constants/styles'

const COLOR_PALETTE = [
    COLORS.green,
    COLORS.blue,
    COLORS.red,
    COLORS.primary_text,
    'transparent',
    'transparent',
    'transparent',
]


const forceTransparentForMinMax = (dataArray) => {
    return dataArray.map((item) => {
        if (item.label === 'max' || item.label === 'min') {
            return {
                ...item,
                borderColor: 'transparent',
                backgroundColor: 'transparent',
            }
        }
        return item
    })
}


const generateMonthLabels = (locale = 'fr', monthFormat = 'short') => {
    const formatter = new Intl.DateTimeFormat(locale, { month: monthFormat })
    const labels = []

    for (let i = 0; i < 12; i++) {
        const date = new Date(2025, i, 1)
        const monthName = formatter.format(date)
        labels.push(monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase())
    }

    return labels
}

const TimeSeriesData = ({ data }) => {
    const lineChartData = useMemo(() => {
        const labels = generateMonthLabels()

        const yearKeys = Object.keys(data || {})

        const historic = yearKeys.map((year, index) => {
            const color = COLOR_PALETTE[index % COLOR_PALETTE.length]

            if (year !== 'min' || year !== 'max') {
                return {
                    fill: false,
                    label: year,
                    data: data[year] || [],
                    borderColor: color,
                    backgroundColor: color,
                    tension: 0.25,
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

    }, [data])

    return lineChartData
}

export default TimeSeriesData
