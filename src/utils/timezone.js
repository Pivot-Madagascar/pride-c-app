import { useTimeZoneConversion } from '@dhis2/app-runtime'

export const useBusinessDate = () => {
    const { fromClientDate } = useTimeZoneConversion()
    return () => {
        const [year, month, day] = fromClientDate()
            .getServerZonedISOString()
            .slice(0, 10)
            .split('-')
            .map(Number)

        return { year, month, day }
    }
}

export const getMonthName = (period) => {
    const year = period.substring(0, 4)
    const month = parseInt(period.substring(4, 6), 10) - 1
    const date = new Date(year, month, 1)
    return new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(date)
}