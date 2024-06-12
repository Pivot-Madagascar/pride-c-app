import { format, getTime, formatDistanceToNow } from 'date-fns'

const fDate = (date, newFormat) => {
    const fm = newFormat || 'dd MMM yyyy'

    return date ? format(new Date(date), fm) : ''
}

const fDateTime = (date, newFormat) => {
    const fm = newFormat || 'dd MMM yyyy p'

    return date ? format(new Date(date), fm) : ''
}

const fTimestamp = (date) => {
    return date ? getTime(new Date(date)) : ''
}

const fToNow = (date) => {
    return date
        ? formatDistanceToNow(new Date(date), {
              addSuffix: true,
          })
        : ''
}

const generateYearMonths = (year) => {
    const months = []
    for (let i = 1; i <= 12; i++) {
        const month = i < 10 ? `0${i}` : i
        months.push(`${year}${month}`)
    }
    return months
}

export { fDate, fDateTime, fTimestamp, fToNow, generateYearMonths }
