import { IRA } from '../../../constants/mapping'
import { generateYearMonths } from '../../../utils/format-time'

const generateSimulationPeriods = () => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()
    const periods = []
    for (let monthOffset = 0; monthOffset <= 2; monthOffset++) {
        const monthIndex = currentMonth + monthOffset
        const year = currentYear + Math.floor(monthIndex / 12)
        const month = monthIndex % 12

        const formattedMonth = String(month + 1).padStart(2, '0')
        const period = `${year}${formattedMonth}`
        periods.push(period)
    }

    for (let monthOffset = 0; monthOffset < currentMonth; monthOffset++) {
        const monthIndex = monthOffset
        const year = currentYear
        const month = monthIndex

        const formattedMonth = String(month + 1).padStart(2, '0')
        const period = `${year}${formattedMonth}`
        periods.push(period)
    }
    return periods
}

const getIraHistoric = () => {
    const historicElements = [
        {
            dataElement: IRA.historic.adjusted.id,
            path: ['historic', 'adjusted'],
            periods: [
                ...generateYearMonths(2016),
                ...generateYearMonths(2017),
                ...generateYearMonths(2018),
            ],
        },
        {
            dataElement: IRA.historic.csbCases.id,
            path: ['historic', 'csbCases'],
            periods: [
                ...generateYearMonths(2021),
                ...generateYearMonths(2022),
                ...generateYearMonths(2023),
            ],
        },
        {
            dataElement: IRA.historic.comCases.id,
            path: ['historic', 'comCases'],
            periods: [
                ...generateYearMonths(2020),
                ...generateYearMonths(2021),
                ...generateYearMonths(2022),
            ],
        },
        // simulation (from 2022 to 2024) -- fake data
        {
            dataElement: IRA.forecast.adjusted.avg.id,
            path: ['simulation', 'historic'],
            periods: [
                ...generateYearMonths(2022),
                ...generateYearMonths(2023),
                ...generateYearMonths(2024),
            ],
        },
        {
            dataElement: IRA.forecast.adjusted.avg.id,
            path: ['simulation', 'adjusted'],
            periods: [...generateSimulationPeriods()],
        },
        {
            dataElement: IRA.forecast.comCases.avg.id,
            path: ['simulation', 'comCases'],
            periods: [...generateSimulationPeriods()],
        },
        {
            dataElement: IRA.forecast.csbCases.avg.id,
            path: ['simulation', 'csbCases'],
            periods: [...generateSimulationPeriods()],
        },
    ]

    return { historicElements }
}

export default getIraHistoric
