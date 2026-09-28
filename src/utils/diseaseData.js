import { getBusinessDate } from '@/utils/timezone'

const getNextThreeMonths = () => {
    const currentDate = getBusinessDate()
    const months = []
    for (let i = 0; i < 3; i++) {
        const month = new Date(Date.UTC(
            currentDate.year,
            currentDate.month - 1 + i,
            1
        ))
        const yearMonth = month.toISOString().slice(0, 7).replace('-', '')
        months.push(yearMonth)
    }

    return months
}

const generateSimulationPeriods = () => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()
    const periods = []
    for (let monthOffset = 0; monthOffset < currentMonth; monthOffset++) {
        const monthIndex = monthOffset
        const year = currentYear
        const month = monthIndex

        const formattedMonth = String(month + 1).padStart(2, '0')
        const period = `${year}${formattedMonth}`
        periods.push(period)
    }

    for (let monthOffset = 0; monthOffset <= 2; monthOffset++) {
        const monthIndex = currentMonth + monthOffset
        const year = currentYear + Math.floor(monthIndex / 12)
        const month = monthIndex % 12

        const formattedMonth = String(month + 1).padStart(2, '0')
        const period = `${year}${formattedMonth}`
        periods.push(period)
    }
    return periods
}

export { getNextThreeMonths, generateSimulationPeriods }