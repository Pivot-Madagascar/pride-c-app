import { useMemo } from 'react'
import COLORS from '../../constants/styles'
import { generateQuarterlyForecastChart } from '../../utils/lineChartHelper'
import { getStoredData } from '../../utils/storeHelper'

const generateMonthLabels = (locale = 'fr', monthFormat = 'short') => {
    const formatter = new Intl.DateTimeFormat(locale, { month: monthFormat })
    const labels = []

    for (let i = 0; i < 12; i++) {
        const date = new Date(2024, i, 1)
        const monthName = formatter.format(date)
        labels.push(monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase())
    }

    return labels
}

const computeMinMaxData = (data, adminLvl, activeOrgUnit, limitType) => {
    const threeMonthData = getStoredData({
        data: data,
        type: 'forecast',
        source: 'adjusted',
        statType: limitType,
        adminLvl: adminLvl,
        orgUnit: String(activeOrgUnit),
    })

    const annualData = getStoredData({
        data: data,
        type: 'forecast',
        source: 'adjusted',
        statType: 'annualAvg',
        adminLvl: adminLvl,
        orgUnit: String(activeOrgUnit),
    })

    if (threeMonthData && annualData) {
        return generateQuarterlyForecastChart(threeMonthData, annualData)
    }
    return []
}

const LineChartData = ({ data, adminLvl, activeOrgUnit }) => {
    const lineChartData = useMemo(() => {
        const labels = generateMonthLabels()

        const maximumData = computeMinMaxData(
            data,
            adminLvl,
            activeOrgUnit,
            'uppci'
        )
        const minimumData = computeMinMaxData(
            data,
            adminLvl,
            activeOrgUnit,
            'lowci'
        )

        return {
            labels,
            datasets: [
                {
                    fill: false,
                    label: '2016',
                    data:
                        getStoredData({
                            data: data,
                            type: 'historic',
                            source: 'adjusted',
                            adminLvl: adminLvl,
                            orgUnit: String(activeOrgUnit),
                            period: '2016',
                        }) || [],
                    borderColor: COLORS.green,
                    backgroundColor: COLORS.green,
                    tension: 0.25,
                    hidden: false,
                },
                {
                    fill: false,
                    label: '2017',
                    data:
                        getStoredData({
                            data: data,
                            type: 'historic',
                            source: 'adjusted',
                            adminLvl: adminLvl,
                            orgUnit: String(activeOrgUnit),
                            period: '2017',
                        }) || [],
                    borderColor: COLORS.blue,
                    backgroundColor: COLORS.blue,
                    tension: 0.25,
                    hidden: false,
                },
                {
                    fill: false,
                    label: '2018',
                    data:
                        getStoredData({
                            data: data,
                            type: 'historic',
                            source: 'adjusted',
                            adminLvl: adminLvl,
                            orgUnit: String(activeOrgUnit),
                            period: '2018',
                        }) || [],
                    borderColor: COLORS.red_chart_line,
                    backgroundColor: COLORS.red_chart_line,
                    tension: 0.25,
                    hidden: false,
                },
                {
                    fill: false,
                    label: '2024',
                    data: (
                        getStoredData({
                            data: data,
                            type: 'forecast',
                            source: 'adjusted',
                            statType: 'annualAvg',
                            adminLvl: adminLvl,
                            orgUnit: String(activeOrgUnit),
                        }) || []
                    ).map((item) => item.value),
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                },
                {
                    fill: 3,
                    label: 'Maximum',
                    data: maximumData,
                    borderColor: 'transparent',
                    backgroundColor: 'rgb(0, 0, 0, 0.2)',
                    tension: 0.25,
                    pointRadius: 0,
                    type: 'line',
                    hidden: false,
                },
                {
                    fill: 3,
                    label: 'Minimum',
                    data: minimumData,
                    borderColor: 'transparent',
                    backgroundColor: 'rgb(0, 0, 0, 0.2)',
                    tension: 0.25,
                    pointRadius: 0,
                    type: 'line',
                    hidden: false,
                },
            ],
        }
    }, [data, adminLvl, activeOrgUnit])

    return lineChartData
}

export default LineChartData
