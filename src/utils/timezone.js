const BUSINESS_TIMEZONE = 'Indian/Antananarivo'

export const getBusinessDate = () => {
    const now = new Date()
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: BUSINESS_TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour12: false,
    })
    const parts = formatter.formatToParts(now)
    const get = (type) => parts.find(p => p.type === type)?.value
    return {
        year: Number(get('year')),
        month: Number(get('month')),
        day: Number(get('day')),
    }
}

export const getCurrentPeriod = () => {
    const { year, month } = getBusinessDate()
    return `${year}${String(month).padStart(2, '0')}`
}

export const getMonthName = (period) => {
    const year = period.substring(0, 4)
    const month = parseInt(period.substring(4, 6), 10) - 1
    const date = new Date(year, month, 1)
    return new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(date)
}