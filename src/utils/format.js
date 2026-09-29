import { format, getTime, formatDistanceToNow } from 'date-fns'
import { useBusinessDate } from '@/utils/timezone'

// ---------------------------------------------------------------------------
// Strings
// ---------------------------------------------------------------------------

const capitalizeFirstLetter = (val) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1)
}

// ---------------------------------------------------------------------------
// Dates & periods
// ---------------------------------------------------------------------------

const toYYYYMM = (year, month) => `${year}${String(month).padStart(2, '0')}`

const fDate = (date, newFormat) => {
    const fm = newFormat || 'dd MMM yyyy'

    return date ? format(new Date(date), fm) : ''
}

const fDateTime = (date, newFormat) => {
    const fm = newFormat || 'dd MMM yyyy p'

    return date ? format(new Date(date), fm) : ''
}

const fTimestamp = (date) => {
    return date ? getTime(new Date(date)) : ''
}

const fToNow = (date) => {
    return date
        ? formatDistanceToNow(new Date(date), {
              addSuffix: true,
          })
        : ''
}

const generateYearMonths = (year) => {
    const months = []
    for (let month = 1; month <= 12; month++) {
        months.push(toYYYYMM(year, month))
    }
    return months
}

const generateYearMonthsRange = (startYear, endYear) => {
    const months = []
    for (let year = startYear; year <= endYear; year++) {
        months.push(...generateYearMonths(year))
    }
    return months
}

const generateYearArray = () => generateYearMonths(new Date().getFullYear())

const generateLabels = (startYear, endYear) => {
    const months = [
        'Janv',
        'Fev',
        'Mars',
        'Avr',
        'Mai',
        'Juin',
        'Juil',
        'Aout',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
    ]
    const labels = []

    for (let year = startYear; year <= endYear; year++) {
        months.forEach((month) => {
            labels.push(`${month}-${year}`)
        })
    }

    return labels
}

const useMonthYYYYMM = (offset = 0) => {
    const getBusinessDate = useBusinessDate()
    const businessDate = getBusinessDate()
    const date = new Date(
        Date.UTC(businessDate.year, businessDate.month - 1 + offset, 1)
    )
    return toYYYYMM(date.getUTCFullYear(), date.getUTCMonth() + 1)
}

const convertToLocaleDate = (
    dateString,
    locale = 'fr-FR',
    options = { year: 'numeric', month: 'long' }
) => {
    if (!/^\d{6}$/.test(dateString)) {
        throw new Error("Invalid date format. Please use 'YYYYMM'.")
    }

    const year = parseInt(dateString.slice(0, 4), 10)
    const month = parseInt(dateString.slice(4, 6), 10) - 1
    const date = new Date(year, month)
    const formatter = new Intl.DateTimeFormat(locale, options)

    return capitalizeFirstLetter(formatter.format(date))
}

const getPeriodName = (
    period,
    formatter = new Intl.DateTimeFormat('fr-FR', { month: 'long' }),
    capitalize = capitalizeFirstLetter
) => {
    const year = period.substring(0, 4)
    const month = parseInt(period.substring(4), 10) - 1
    const date = new Date(parseInt(year, 10), month, 1)
    const monthName = capitalize(formatter.format(date))
    return `${monthName} ${year}`
}

// ---------------------------------------------------------------------------
// Data grouping & aggregation
// ---------------------------------------------------------------------------

const groupByOrgUnit = (data) => {
    return data.reduce((acc, item) => {
        const { orgUnit, period, value } = item
        if (!acc[orgUnit]) {
            acc[orgUnit] = { orgUnit, values: [] }
        }
        acc[orgUnit].values.push({ period, value: parseFloat(value) })
        return acc
    }, {})
}

const sortValuesByPeriod = (groupedData) => {
    for (const key in groupedData) {
        groupedData[key].values.sort((a, b) => a.period.localeCompare(b.period))
    }
}

// Returns [{ orgUnit, values: [{ period, value }] }] sorted by period
const aggregateByOrgUnit = (data) => {
    const groupedData = groupByOrgUnit(data)
    sortValuesByPeriod(groupedData)
    return Object.values(groupedData)
}

// Returns [{ orgUnit, values: [value] }] sorted by period
const collectValuesByOrgUnit = (data) => {
    return aggregateByOrgUnit(data).map((item) => ({
        ...item,
        values: item.values.map(({ value }) => value),
    }))
}

// Returns { [orgUnit]: [{ period, value }] } sorted by period
const formatForecast = (data) => {
    return aggregateByOrgUnit(data).reduce((acc, { orgUnit, values }) => {
        acc[orgUnit] = values
        return acc
    }, {})
}

const regroupData = (data) => {
    const resultMap = new Map()

    // First pass: group by path
    data.forEach((item) => {
        const pathKey = JSON.stringify(item.path)

        if (!resultMap.has(pathKey)) {
            resultMap.set(pathKey, {
                path: item.path,
                value: {},
            })
        }

        const valueKey = Object.keys(item.value)[0]
        const valueObj = item.value[valueKey]
        const group = resultMap.get(pathKey)

        if (!group.value[valueKey]) {
            group.value[valueKey] = []
        }

        group.value[valueKey].push({
            period: valueObj.period,
            value: valueObj.value,
        })
    })

    // Convert map to array and sort the nested periods for each value key
    return Array.from(resultMap.values()).map((group) => {
        Object.keys(group.value).forEach((key) => {
            group.value[key].sort((a, b) => a.period.localeCompare(b.period))
        })
        return group
    })
}

const groupByPeriod = (data) => {
    const groupedData = data.reduce((acc, item) => {
        if (!acc[item.period]) {
            acc[item.period] = []
        }
        acc[item.period].push(item)
        return acc
    }, {})

    return Object.keys(groupedData)
        .sort()
        .map((period) => groupedData[period])
}

const combineData = (data, additionalData) => {
    const map = new Map()

    const additionalDataMap = new Map()
    additionalData.forEach((item) => {
        additionalDataMap.set(item.id, item)
    })

    data.forEach((item) => {
        const key = `${item.orgUnit}-${item.categoryOptionCombo}-${item.period}`

        const value = parseInt(item.value, 10)

        if (!map.has(key)) {
            const baseObject = {
                categoryOptionCombo: item.categoryOptionCombo,
                period: item.period,
                periodName: item.periodName,
                orgUnit: item.orgUnit,
                orgUnitName: item.orgUnitName,
                values: [value],
            }

            if (additionalDataMap.has(item.orgUnit)) {
                const additionalInfo = additionalDataMap.get(item.orgUnit)
                baseObject.municipality = additionalInfo.municipality
                baseObject.municipalityId = additionalInfo.municipalityId
            }

            map.set(key, baseObject)
        } else {
            map.get(key).values.push(value)
        }
    })

    let counter = 1

    return Array.from(map.values()).map((obj) => {
        obj.values.sort((a, b) => a - b)
        const [min, mean, max] = obj.values
        delete obj.values
        return {
            id: counter++,
            ...obj,
            min,
            mean,
            max,
        }
    })
}

const combineValuesByOrgUnits = (orgUnits, data) => {
    if (orgUnits.length === 1) {
        const item = data.find((item) => item.orgUnit === orgUnits[0])
        return item ? item.values : []
    }

    const combinedValues = Array(data[0].values.length).fill(null)

    data.forEach((item) => {
        if (orgUnits.includes(item.orgUnit)) {
            item.values.forEach((value, index) => {
                combinedValues[index] += value
            })
        }
    })

    return combinedValues
}

const addOrgUnitNameToFeatures = (features, supplementaryData) => {
    if (!supplementaryData) {
        return []
    }

    const orgUnitMap = new Map()
    supplementaryData.forEach((data) => {
        orgUnitMap.set(data.orgUnit, {
            orgUnitName: data.orgUnitName,
            value: parseInt(data.avg, 10),
            periodName: data.periodName,
            parentName: data.parentName,
        })
    })

    return features.map((feature) => {
        const orgUnitInfo = orgUnitMap.get(feature.properties.orgUnitId)
        if (!orgUnitInfo) {
            return feature
        }
        return {
            ...feature,
            properties: {
                ...feature.properties,
                ...orgUnitInfo,
            },
        }
    })
}

// ---------------------------------------------------------------------------
// Redux helpers
// ---------------------------------------------------------------------------

const updateDataReducer =
    (key) =>
    (state, { payload }) => {
        if (state[key] === null) {
            state[key] = {}
        }
        for (const itemKey in payload.data) {
            if (state[key][itemKey]) {
                state[key][itemKey] = {
                    ...state[key][itemKey],
                    ...payload.data[itemKey],
                }
            } else {
                state[key][itemKey] = payload.data[itemKey]
            }
        }
    }

export {
    // Strings
    capitalizeFirstLetter,
    // Dates & periods
    fDate,
    fDateTime,
    fTimestamp,
    fToNow,
    generateYearMonths,
    generateYearMonthsRange,
    generateYearArray,
    generateLabels,
    useMonthYYYYMM,
    convertToLocaleDate,
    getPeriodName,
    // Data grouping & aggregation
    aggregateByOrgUnit,
    collectValuesByOrgUnit,
    formatForecast,
    regroupData,
    groupByPeriod,
    combineData,
    combineValuesByOrgUnits,
    addOrgUnitNameToFeatures,
    // Redux helpers
    updateDataReducer,
}
