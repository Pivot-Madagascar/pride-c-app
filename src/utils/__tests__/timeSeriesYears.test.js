import {
    getYearColors,
    getYearKeys,
    keepMostRecentYears,
} from '@/utils/timeSeriesYears'

const PALETTE = ['green', 'blue', 'red', 'dark']

const buildData = (years) => ({
    ...Object.fromEntries(years.map((y) => [y, [y]])),
    max: [1],
    min: [0],
})

describe('getYearKeys', () => {
    it('returns sorted years, without min/max', () => {
        expect(getYearKeys(buildData(['2024', '2022', '2023']))).toEqual([
            '2022',
            '2023',
            '2024',
        ])
    })

    it('handles null data', () => {
        expect(getYearKeys(null)).toEqual([])
    })
})

describe('keepMostRecentYears', () => {
    it('removes the oldest year when there are 5 years', () => {
        const data = buildData(['2022', '2023', '2024', '2025', '2026'])
        const result = keepMostRecentYears(data, 4)
        expect(Object.keys(result)).toEqual([
            '2023',
            '2024',
            '2025',
            '2026',
            'max',
            'min',
        ])
    })

    it('removes several years when needed', () => {
        const data = buildData(['2021', '2022', '2023', '2024', '2025', '2026'])
        expect(getYearKeys(keepMostRecentYears(data, 4))).toEqual([
            '2023',
            '2024',
            '2025',
            '2026',
        ])
    })

    it('changes nothing with 4 years or fewer', () => {
        const data = buildData(['2025', '2026'])
        expect(keepMostRecentYears(data, 4)).toEqual(data)
    })

    it('keeps years when min/max are missing', () => {
        const data = { 2022: [], 2023: [], 2024: [], 2025: [], 2026: [] }
        expect(Object.keys(keepMostRecentYears(data, 4))).toEqual([
            '2023',
            '2024',
            '2025',
            '2026',
        ])
    })

    it('does not mutate the input object', () => {
        const data = buildData(['2022', '2023', '2024', '2025', '2026'])
        keepMostRecentYears(data, 4)
        expect(Object.keys(data)).toContain('2022')
    })

    it('returns null/undefined as is', () => {
        expect(keepMostRecentYears(null, 4)).toBeNull()
        expect(keepMostRecentYears(undefined, 4)).toBeUndefined()
    })
})

describe('getYearColors', () => {
    it('gives the last color to the most recent year', () => {
        expect(getYearColors(['2023', '2024', '2025', '2026'], PALETTE)).toEqual({
            2023: 'green',
            2024: 'blue',
            2025: 'red',
            2026: 'dark',
        })
    })

    it('starts from the end of the palette when there are fewer years', () => {
        expect(getYearColors(['2026', '2025'], PALETTE)).toEqual({
            2025: 'red',
            2026: 'dark',
        })
    })

    it('gives the fallback color to extra years', () => {
        expect(
            getYearColors(['2022', '2023', '2024', '2025', '2026'], PALETTE)
        ).toEqual({
            2022: 'transparent',
            2023: 'green',
            2024: 'blue',
            2025: 'red',
            2026: 'dark',
        })
    })
})
