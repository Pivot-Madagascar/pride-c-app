const YEAR_KEY = /^\d{4}$/

/**
 * Returns the year keys of `data`, sorted from oldest to most recent.
 * Other keys (`min`, `max`…) are ignored.
 */
export const getYearKeys = (data) =>
    Object.keys(data || {})
        .filter((key) => YEAR_KEY.test(key))
        .sort()

/**
 * Keeps only the `maxYears` most recent years of `data`.
 * Non-year keys (`min`, `max`…) are preserved.
 * Does not mutate `data`.
 */
export const keepMostRecentYears = (data, maxYears) => {
    if (!data) {
        return data
    }
    const years = getYearKeys(data)
    const removed = new Set(years.slice(0, Math.max(0, years.length - maxYears)))
    return Object.fromEntries(
        Object.entries(data).filter(([key]) => !removed.has(key))
    )
}

/**
 * Assigns a color to each year starting from the end:
 * the most recent year gets the last color of `palette`,
 * the previous year the second-to-last, and so on.
 * Extra years (more years than colors) get `fallback`.
 */
export const getYearColors = (years, palette, fallback = 'transparent') => {
    const sorted = [...years].sort()
    const offset = palette.length - sorted.length
    return Object.fromEntries(
        sorted.map((year, index) => {
            const paletteIndex = offset + index
            return [year, paletteIndex >= 0 ? palette[paletteIndex] : fallback]
        })
    )
}
