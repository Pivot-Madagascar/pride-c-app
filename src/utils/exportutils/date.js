const MONTH_NAMES_FR = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]

export const getFormattedDate = () => {
    const d = new Date()
    const day   = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year  = d.getFullYear()
    return { day, month, year, label: `${day}-${month}-${year}` }
}

const parseFrenchPeriod = (period) => {
    const parts = period.split(' ')
    if (parts.length !== 2) return null
    const monthIndex = MONTH_NAMES_FR.findIndex(m =>
        parts[0].toLowerCase().startsWith(m.toLowerCase())
    )
    if (monthIndex === -1) return null
    const year = parseInt(parts[1], 10)
    return isNaN(year) ? null : new Date(year, monthIndex, 1)
}

export const detectDateRange = (rows, visibleColumns) => {
    const hasPeriodCol = visibleColumns.some(col => col.accessorKey === 'periodName')
    if (!hasPeriodCol || rows.length === 0) return null

    const periods = rows
        .map(row => row.original.periodName)
        .filter(Boolean)

    if (periods.length === 0) return null

    const sorted = [...periods].sort((a, b) => {
        const da = parseFrenchPeriod(a) ?? new Date(a)
        const db = parseFrenchPeriod(b) ?? new Date(b)
        return da - db
    })

    return { start: sorted[0], end: sorted[sorted.length - 1] }
}