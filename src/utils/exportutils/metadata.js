import { getFormattedDate } from '@/utils/exportutils/date.js'

export const buildMetadataTable = ({ disease, dataSources, orgUnitLevel, dateRange, exportDate } = {}) => {
    const headers = []
    const values  = []

    const push = (header, value) => {
        headers.push(header)
        values.push(value)
    }

    if (disease)      push('Maladie',                             disease)
    if (dataSources)  push('Sources de données',                  dataSources)
    if (orgUnitLevel) push("Niveau de l'unité organisationnelle", orgUnitLevel)

    if (dateRange && (dateRange.start || dateRange.end)) {
        const dateText = dateRange.start && dateRange.end
            ? `${dateRange.start} - ${dateRange.end}`
            : dateRange.start ?? dateRange.end
        push('Période', dateText)
    }

    push("Date d'exportation", exportDate ?? getFormattedDate().label)

    return { headers, values }
}