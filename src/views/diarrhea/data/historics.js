import { DIARRHEA } from '../../../constants/mapping'
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

const getDiarrheaHistoric = () => {
    const historicElements = [
        {
            dataElement: DIARRHEA.historic.adjusted.id,
            path: ['historic', 'adjusted'],
            periods: [
                ...generateYearMonths(2016),
                ...generateYearMonths(2017),
                ...generateYearMonths(2018),
            ],
        },
        {
            dataElement: DIARRHEA.historic.csbCases.id,
            path: ['historic', 'csbCases'],
            periods: [
                ...generateYearMonths(2021),
                ...generateYearMonths(2022),
                ...generateYearMonths(2023),
            ],
        },
        {
            dataElement: DIARRHEA.historic.comCases.id,
            path: ['historic', 'comCases'],
            periods: [
                ...generateYearMonths(2020),
                ...generateYearMonths(2021),
                ...generateYearMonths(2022),
            ],
        },
    ]

    return { historicElements }
}

export default getDiarrheaHistoric
