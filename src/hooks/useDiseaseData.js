import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useDiseaseConfig } from '../contexts/DiseaseContext'

export const useDiseaseData = () => {
    const { storeName } = useDiseaseConfig()
    const healthState = useSelector((state) => state[storeName])
    const orgUnitLevels = useSelector((state) => state.orgUnit.orgUnitLevels)
    const storePath = useSelector((state) => state.temp.selectors)
    const featuresList = useSelector((state) => state.orgUnit.features)
    const orgUnits = useSelector((state) => state.orgUnit.orgUnits)

    // Helper functions (moved from component)
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

    const fillMissingMonths = (data) => {
        const result = new Array(12).fill(null)
        data.forEach(({ period, value }) => {
            const month = parseInt(period.substring(4, 6), 10)
            result[month - 1] = Number(value)
        })
        return result
    }

    const features = useMemo(() => {
        if (!storePath || !featuresList) return null
        const { adminLevel } = storePath
        return featuresList?.[adminLevel]
    }, [storePath, featuresList])

    const historic = useMemo(() => {
        if (!storePath || !healthState) return null
        const { source, adminLevel, orgUnit } = storePath
        const result = healthState?.['historic']?.[source]?.[adminLevel]?.[orgUnit]
        return result ? regroupByYear(result) : null
    }, [storePath, healthState])

    const simulation = useMemo(() => {
        if (!storePath || !healthState) return null
        const { source, adminLevel, orgUnit } = storePath
        const result = healthState?.['simulation']?.[source]?.[adminLevel]?.[orgUnit]
        return result ? regroupByYear(result) : null
    }, [storePath, healthState])

    const forecastLimits = useMemo(() => {
        if (!storePath || !healthState) return null
        const { source, adminLevel, orgUnit } = storePath
        const max = healthState?.['forecast']?.[source]?.['uppci']?.[adminLevel]?.[orgUnit] || null
        const min = healthState?.['forecast']?.[source]?.['lowci']?.[adminLevel]?.[orgUnit] || null
        return {
            max: max ? fillMissingMonths(max) : null,
            min: min ? fillMissingMonths(min) : null,
        }
    }, [storePath, healthState])

    const forecast = useMemo(() => {
        if (!storePath || !healthState) return null
        const { source, adminLevel, orgUnit } = storePath
        const forecastSource = healthState?.['forecast']?.[source]
        if (!forecastSource) return null
        return {
            avg: forecastSource?.['avg']?.[adminLevel]?.[orgUnit] || null,
            lowci: forecastSource?.['lowci']?.[adminLevel]?.[orgUnit] || null,
            uppci: forecastSource?.['uppci']?.[adminLevel]?.[orgUnit] || null,
        }
    }, [storePath, healthState])

    const currentOrgUnit = useMemo(() => {
        if (!storePath || !orgUnits || !orgUnitLevels) return null
        const { adminLevel, orgUnit } = storePath
        const levelName = orgUnitLevels.find(
            (level) => level.id === adminLevel
        )?.name
        const orgUnitList = orgUnits?.[adminLevel]
        const orgUnitName =
            orgUnitList?.find((ou) => ou.id === orgUnit)?.name || ''
        return `${levelName} de ${orgUnitName}`
    }, [storePath, orgUnits, orgUnitLevels])

    const activeOrgUnits = useMemo(() => {
        if (!storePath || !orgUnits) return null
        const { adminLevel } = storePath
        return orgUnits?.[adminLevel]
    }, [storePath, orgUnits])

    const adminLevelForecast = useMemo(() => {
        if (!storePath || !healthState) return null
        const { source, adminLevel } = storePath
        const forecastSource = healthState?.['forecast']?.[source]
        if (!forecastSource) return null
        return {
            avg: forecastSource?.['avg']?.[adminLevel] || null,
            lowci: forecastSource?.['lowci']?.[adminLevel] || null,
            uppci: forecastSource?.['uppci']?.[adminLevel] || null,
        }
    }, [storePath, healthState])

    const orgUnitForecast = useMemo(() => {
        if (!storePath || !healthState) return null
        const { source, adminLevel, orgUnit } = storePath
        const forecastSource = healthState?.['forecast']?.[source]
        if (!forecastSource) return null
        return {
            avg: { [orgUnit]: forecastSource?.['avg']?.[adminLevel]?.[orgUnit] || null },
            lowci: { [orgUnit]: forecastSource?.['lowci']?.[adminLevel]?.[orgUnit] || null },
            uppci: { [orgUnit]: forecastSource?.['uppci']?.[adminLevel]?.[orgUnit] || null },
        }
    }, [storePath, healthState])

    const alert = useMemo(() => {
        if (!storePath || !healthState) return null
        const { adminLevel, orgUnit } = storePath
        const alertSource = healthState?.['alert']
        if (!alertSource) return null
        return {
            incidence: alertSource?.['incidence']?.[adminLevel]?.[orgUnit]?.[0] || null,
            csb: alertSource?.['csb']?.[adminLevel]?.[orgUnit]?.[0] || null,
            comCases: alertSource?.['comCases']?.[adminLevel]?.[orgUnit]?.[0] || null,
            trend: healthState?.['compare']?.['trend']?.[adminLevel]?.[orgUnit]?.[0] || null,
        }
    }, [storePath, healthState])

    const comparison = useMemo(() => {
        if (!storePath || !healthState) return null
        const { adminLevel, orgUnit } = storePath
        const compareSource = healthState?.['compare']
        if (!compareSource) return null
        return {
            incidence: compareSource?.['incidence']?.[adminLevel]?.[orgUnit]?.[0] || null,
            csb: compareSource?.['csb']?.[adminLevel]?.[orgUnit]?.[0] || null,
            comCases: compareSource?.['comCases']?.[adminLevel]?.[orgUnit]?.[0] || null,
        }
    }, [storePath, healthState])

    return {
        healthState,
        orgUnitLevels,
        storePath,
        features,
        historic,
        simulation,
        forecastLimits,
        forecast,
        currentOrgUnit,
        activeOrgUnits,
        adminLevelForecast,
        orgUnitForecast,
        alert,
        comparison,
    }
}
