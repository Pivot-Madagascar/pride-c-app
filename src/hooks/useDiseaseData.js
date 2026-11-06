import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useDiseaseConfig } from '@/contexts/DiseaseContext'

// ---------------------------------------------------------------------------
// Pure helpers (module scope: not recreated on each render)
// ---------------------------------------------------------------------------

const regroupByYear = (data) => {
    const result = {}
    data.forEach(({ period, value }) => {
        const year = period.substring(0, 4)
        const month = parseInt(period.substring(4, 6), 10)
        if (!result[year]) { result[year] = new Array(12).fill(null) }
        result[year][month - 1] = Number(value)
    })
    return result
}

const regroupByYearExtended = (data) => {
    const result = {}
    const currentYear = new Date().getFullYear().toString()

    data.forEach(({ period, value }) => {
        const year = period.substring(0, 4)
        const month = parseInt(period.substring(4, 6), 10)

        if (!result[year]) {
            result[year] = new Array(12).fill(null)
        }
        result[year][month - 1] = Number(value)
    })

    // If current year exists and has a next year, combine them
    const years = Object.keys(result).sort()
    if (years.length > 1 && years[0] === currentYear) {
        const nextYear = years[1]
        // Append next year's values to current year (filter out nulls)
        result[currentYear] = [
            ...result[currentYear],
            ...result[nextYear].filter(v => v !== null)
        ]
        // Remove the next year
        delete result[nextYear]
    }

    return result
}

const fillMissingMonths = (data) => {
    if (!data || data.length === 0) return new Array(12).fill(null)

    const now = new Date()
    const currentYear = now.getFullYear().toString()
    const currentMonth = now.getMonth() + 1 // 1-12

    // Only concatenate if we're in November (11) or December (12)
    const shouldConcatenate = currentMonth >= 11

    const result = new Array(12).fill(null)

    data.forEach(({ period, value }) => {
        const year = period.substring(0, 4)
        const month = parseInt(period.substring(4, 6), 10)

        if (year === currentYear) {
            // Current year months go in their normal positions (0-11)
            result[month - 1] = Number(value)
        } else if (shouldConcatenate) {
            // Next year months get appended only if we're in Nov/Dec
            result.push(Number(value))
        } else {
            // If not concatenating, treat next year as the main year
            result[month - 1] = Number(value)
        }
    })
    return result
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
//
// Every useSelector below returns either a primitive or the exact sub-tree
// that is needed. Redux only re-renders when that value changes, and each
// useMemo only recomputes when its own inputs change:
//   - selecting another org unit does not recompute map data
//     (features, activeOrgUnits, adminLevelForecast),
//   - storing data for another source / level / org unit does not
//     recompute anything displayed here.

export const useDiseaseData = () => {
    const { storeName } = useDiseaseConfig()

    // --- Selection (temp slice): primitives, stable across identical updates
    const source = useSelector((state) => state.temp.selectors?.source)
    const adminLevel = useSelector((state) => state.temp.selectors?.adminLevel)
    const orgUnit = useSelector((state) => state.temp.selectors?.orgUnit)

    const storePath = useMemo(
        () => ({ source, adminLevel, orgUnit }),
        [source, adminLevel, orgUnit]
    )

    // --- Org unit data
    const orgUnitLevels = useSelector((state) => state.orgUnit.orgUnitLevels)
    const features = useSelector(
        (state) => state.orgUnit.features?.[adminLevel]
    )
    const hasOrgUnits = useSelector((state) => !!state.orgUnit.orgUnits)
    const activeOrgUnits = useSelector(
        (state) => state.orgUnit.orgUnits?.[adminLevel]
    )

    // --- Disease data: only the branches matching the current selection
    const historicRaw = useSelector(
        (state) => state[storeName]?.historic?.[source]?.[adminLevel]?.[orgUnit]
    )
    const simulationRaw = useSelector(
        (state) => state[storeName]?.simulation?.[source]?.[adminLevel]?.[orgUnit]
    )

    const hasForecastSource = useSelector(
        (state) => !!state[storeName]?.forecast?.[source]
    )
    const avgLevel = useSelector(
        (state) => state[storeName]?.forecast?.[source]?.avg?.[adminLevel]
    )
    const lowciLevel = useSelector(
        (state) => state[storeName]?.forecast?.[source]?.lowci?.[adminLevel]
    )
    const uppciLevel = useSelector(
        (state) => state[storeName]?.forecast?.[source]?.uppci?.[adminLevel]
    )

    const alertState = useSelector((state) => state[storeName]?.alert)
    const compareState = useSelector((state) => state[storeName]?.compare)

    // --- Derived values
    const historic = useMemo(
        () => (historicRaw ? regroupByYear(historicRaw) : null),
        [historicRaw]
    )

    const simulation = useMemo(
        () => (simulationRaw ? regroupByYearExtended(simulationRaw) : null),
        [simulationRaw]
    )

    const uppciOrgUnit = uppciLevel?.[orgUnit]
    const lowciOrgUnit = lowciLevel?.[orgUnit]
    const avgOrgUnit = avgLevel?.[orgUnit]

    const forecastLimits = useMemo(() => {
        const max = uppciOrgUnit || null
        const min = lowciOrgUnit || null
        return {
            max: max ? fillMissingMonths(max) : null,
            min: min ? fillMissingMonths(min) : null,
        }
    }, [uppciOrgUnit, lowciOrgUnit])

    const forecast = useMemo(() => {
        if (!hasForecastSource) return null
        return {
            avg: avgOrgUnit || null,
            lowci: lowciOrgUnit || null,
            uppci: uppciOrgUnit || null,
        }
    }, [hasForecastSource, avgOrgUnit, lowciOrgUnit, uppciOrgUnit])

    // Independent of the selected org unit (used by the map)
    const adminLevelForecast = useMemo(() => {
        if (!hasForecastSource) return null
        return {
            avg: avgLevel || null,
            lowci: lowciLevel || null,
            uppci: uppciLevel || null,
        }
    }, [hasForecastSource, avgLevel, lowciLevel, uppciLevel])

    const orgUnitForecast = useMemo(() => {
        if (!hasForecastSource) return null
        return {
            avg: { [orgUnit]: avgOrgUnit || null },
            lowci: { [orgUnit]: lowciOrgUnit || null },
            uppci: { [orgUnit]: uppciOrgUnit || null },
        }
    }, [hasForecastSource, orgUnit, avgOrgUnit, lowciOrgUnit, uppciOrgUnit])

    const currentOrgUnit = useMemo(() => {
        if (!hasOrgUnits || !orgUnitLevels) return null
        const levelName = orgUnitLevels.find(
            (level) => level.id === adminLevel
        )?.name
        const orgUnitName =
            activeOrgUnits?.find((ou) => ou.id === orgUnit)?.name || ''
        return `${levelName} de ${orgUnitName}`
    }, [hasOrgUnits, orgUnitLevels, activeOrgUnits, adminLevel, orgUnit])

    const alert = useMemo(() => {
        if (!alertState) return null
        return {
            incidence: alertState?.['incidence']?.[adminLevel]?.[orgUnit]?.[0] || null,
            csb: alertState?.['csb']?.[adminLevel]?.[orgUnit]?.[0] || null,
            comCases: alertState?.['comCases']?.[adminLevel]?.[orgUnit]?.[0] || null,
            trend: compareState?.['trend']?.[adminLevel]?.[orgUnit]?.[0] || null,
        }
    }, [alertState, compareState, adminLevel, orgUnit])

    const comparison = useMemo(() => {
        if (!compareState) return null
        return {
            incidence: compareState?.['incidence']?.[adminLevel]?.[orgUnit]?.[0] || null,
            csb: compareState?.['csb']?.[adminLevel]?.[orgUnit]?.[0] || null,
            comCases: compareState?.['comCases']?.[adminLevel]?.[orgUnit]?.[0] || null,
        }
    }, [compareState, adminLevel, orgUnit])

    return {
        orgUnitLevels,
        storePath,
        features: features ?? null,
        historic,
        simulation,
        forecastLimits,
        forecast,
        currentOrgUnit,
        activeOrgUnits: activeOrgUnits ?? null,
        adminLevelForecast,
        orgUnitForecast,
        alert,
        comparison,
    }
}
