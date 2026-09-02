const getLastThreeMonths = () => {
    const currentDate = new Date()
    const lastThreeMonths = []
    for (let i = 1; i < 4; i++) {
        const month = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + i,
            1
        )
        const yearMonth = month.toISOString().slice(0, 7).replace('-', '')
        lastThreeMonths.push(yearMonth)
    }
    return lastThreeMonths
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

export { getLastThreeMonths, generateSimulationPeriods }