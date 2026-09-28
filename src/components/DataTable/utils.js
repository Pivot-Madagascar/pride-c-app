import { getBusinessDate } from '@/utils/timezone'

export const getNextThreeMonths = () => {
    const currentDate = getBusinessDate()
    const months = []

    for (let i = 0; i < 3; i++) {
        const month = new Date(Date.UTC(
            currentDate.year,
            currentDate.month - 1 + i,
            1
        ))
        const yearMonth = month.toISOString().slice(0, 7).replace('-', '')
        months.unshift(yearMonth)
    }

    return months
}

export const replaceNulls = (data) => {
    return data.map(item => ({
        ...item,
        lowci: item.lowci === null || Number.isNaN(item.lowci) || item.lowci === undefined ? 0 : item.lowci,
        avg: item.avg === null || Number.isNaN(item.avg) || item.avg === undefined ? 0 : item.avg,
        uppci: item.uppci === null || Number.isNaN(item.uppci) || item.uppci === undefined ? 0 : item.uppci
    }))
}
