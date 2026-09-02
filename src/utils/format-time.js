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

const generateYearMonthsRange = (startYear, endYear) => {
    const months = []
    for (let year = startYear; year <= endYear; year++) {
        months.push(...generateYearMonths(year))
    }
    return months
}

const generateYearArray = () => {
    const currentYear = new Date().getFullYear()
    const yearArray = []
    for (let month = 0; month < 12; month++) {
        const yearMonth = `${currentYear}${String(month + 1).padStart(2, '0')}`
        yearArray.push(yearMonth)
    }
    return yearArray
}

const capitalizeFirstLetter = (val) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

const getMonthYYYYMM = (offset = 0) => {
    const date = new Date();
    date.setMonth(date.getMonth() + offset);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    return `${year}${month}`;
    }

const convertToLocaleDate = (dateString, locale='fr-FR', options = { year: 'numeric', month: 'long' }) => {
    if (!/^\d{6}$/.test(dateString)) {
        throw new Error("Invalid date format. Please use 'YYYYMM'.")
    }

    const year = parseInt(dateString.slice(0, 4), 10)
    const month = parseInt(dateString.slice(4, 6), 10) - 1

    const date = new Date(year, month)

    const formatter = new Intl.DateTimeFormat(locale, options)

    return capitalizeFirstLetter(formatter.format(date))
}

export {
    fDate,
    fDateTime,
    fTimestamp,
    fToNow,
    generateYearMonths,
    generateYearMonthsRange,
    generateYearArray,
    getMonthYYYYMM,
    convertToLocaleDate
}
