export const getPeriodName = (period, formatter, capitalize) => {
    const year = period.substring(0, 4)
    const month = parseInt(period.substring(4), 10) - 1
    const date = new Date(parseInt(year, 10), month, 1)
    const monthName = capitalize(formatter.format(date))
    return `${monthName} ${year}`
}
