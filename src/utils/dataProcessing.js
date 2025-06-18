import { isObjectValid } from './validation'
import { getPeriodName } from './formatters'

const parseOrNull = (value) => {
    const parsed = parseInt(value, 10)
    return Number.isNaN(parsed) ? null : parsed
}

export const combineData = (orgUnits, statsData, adminLevel) => {
    if (!Array.isArray(orgUnits)) {
        console.error('Expected orgUnits to be an array, but got:', orgUnits)
        return []
    }

    const result = []
    let id = 1
    const orgUnitMap = {}

    orgUnits.forEach((orgUnit) => {
        orgUnitMap[orgUnit.id] = orgUnit
    })

    const monthFormatter = new Intl.DateTimeFormat('fr-FR', { month: 'long' })
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

    if (!isObjectValid(statsData)) {
        return []
    }

    for (const [orgUnitId, periods] of Object.entries(statsData.avg)) {
        const orgUnit = orgUnitMap[orgUnitId]
        if (!orgUnit) continue

        let parent
        if (orgUnit.parents) {
            parent = orgUnit.parents.find((p) => p.id === orgUnit.parent)
        }

        if (!periods) return []

        periods.forEach((periodData) => {
            const period = periodData.period
            const periodName = getPeriodName(period, monthFormatter, capitalize)
            const lowciValue = statsData.lowci[orgUnitId]?.find((p) => p.period === period)?.value
            const uppciValue = statsData.uppci[orgUnitId]?.find((p) => p.period === period)?.value
            const avgValue = periodData.value

            result.push({
                id: id++,
                period,
                periodName,
                orgUnit: orgUnitId,
                orgUnitName: orgUnit.name,
                adminLevel,
                parentName: parent?.name || '',
                parentAdminLevel: parent?.adminLevelName || '',
                parentId: orgUnit.parent,
                lowci: parseOrNull(lowciValue),
                avg: parseOrNull(avgValue),
                uppci: parseOrNull(uppciValue),
            })
        })
    }

    result.sort((a, b) => {
        if (a.orgUnitName < b.orgUnitName) return -1
        if (a.orgUnitName > b.orgUnitName) return 1
        return a.period.localeCompare(b.period)
    })

    result.forEach((item, index) => {
        item.id = index + 1
    })

    return result
}

export const replaceFirstNullWithRankValue = (data, reference) => {
    const currentYear = new Date().getFullYear()
    const maxArray = data?.max || []
    const minArray = data?.min || []
    const referenceArray = reference?.[currentYear] || []

    const replaceFirstNull = (arr) => {
        const newArray = [...arr]
        const index = arr.findIndex((value) => value !== null)
        if (index >= 0) {
            const rankValue = referenceArray[index - 1]
            newArray[index - 1] = rankValue
        }
        return newArray
    }

    const updatedMax = replaceFirstNull(maxArray)
    const updatedMin = replaceFirstNull(minArray)

    return {
        max: updatedMax,
        min: updatedMin,
    }
}

export const processOrgUnitOptions = ({
    orgUnitOptions,
    parentDetails,
    adminLevels,
    storeOrgUnits,
}) =>
    orgUnitOptions.map((option) => {
        const { level, parentGraph } = option
        const graphArr = parentGraph.split('/')
        const { id: parentId } = parentDetails

        const index = graphArr.indexOf(parentId)
        if (index === -1) return option

        const currentAdminLevel = adminLevels.find(
            (el) => el.level === Number(level)
        )?.name
        let parentData = null

        const payload = graphArr
            .slice(index)
            .reverse()
            .map((t, i) => {
                const currentLevel = level - (i + 1)
                const adminLevel = adminLevels.find(
                    ({ level }) => level === currentLevel
                )

                if (adminLevel?.id && storeOrgUnits[adminLevel.id]) {
                    parentData =
                        storeOrgUnits[adminLevel.id].find(
                            ({ id }) => id === t
                        ) || parentData
                }

                return {
                    name: parentData?.name,
                    id: parentData?.id,
                    level: currentLevel,
                    adminLevelName: adminLevel?.name,
                    adminLevelId: adminLevel?.id,
                }
            })

        return { ...option, parents: payload, levelName: currentAdminLevel }
    })
