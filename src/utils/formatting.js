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

    const result = Array.from(map.values()).map((obj) => {
        obj.values.sort((a, b) => a - b)
        const min = obj.values[0]
        const mean = obj.values[1]
        const max = obj.values[2]
        delete obj.values
        return {
            id: counter++,
            ...obj,
            min,
            mean,
            max,
        }
    })

    return result
}

const addValues = (orgUnitArray, data) => {
    const selectedUnits = data.filter((item) =>
        orgUnitArray.includes(item.orgUnit)
    )

    if (selectedUnits.length !== orgUnitArray.length) {
        throw new Error('One or more orgUnit values are invalid.')
    }

    const result = new Array(selectedUnits[0].values.length).fill(null)

    selectedUnits.forEach((unit) => {
        unit.values.forEach((value, index) => {
            result[index] += value
        })
    })

    return result
}

const combineValuesByOrgUnits = (orgUnits, data) => {
    if (orgUnits.length === 1) {
        const orgUnit = orgUnits[0]
        const item = data.find((item) => item.orgUnit === orgUnit)
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

const addOrgUnitNameToFeatures = (featuresData, supplementaryData, sectoAdminLvl) => {
    const orgUnitMap = new Map()
    supplementaryData.forEach((data) => {
        orgUnitMap.set(data.orgUnit, {
            name: data.orgUnitName,
            value: parseInt(data.mean, 10),
            municipality: data.municipality,
        })
    })

    featuresData.forEach((feature) => {
        const orgUnitId = feature.properties.orgUnit_id
        if (orgUnitMap.has(orgUnitId)) {
            feature.properties.orgUnit_name = orgUnitMap.get(orgUnitId).name
            feature.properties.value = orgUnitMap.get(orgUnitId).value
            feature.properties.municipality =
                orgUnitMap.get(orgUnitId).municipality
            feature.properties.sectoAdminLvl = sectoAdminLvl
        }
    })

    return featuresData
}

const groupByPeriod = (data) => {
    const groupedData = data.reduce((acc, item) => {
        if (!acc[item.period]) {
            acc[item.period] = []
        }
        acc[item.period].push(item)
        return acc
    }, {})

    const result = Object.keys(groupedData)
        .sort()
        .map((period) => groupedData[period])

    return result
}

const regroupData = (data) => {
    const result = {}

    data.forEach((item) => {
        const { orgUnit, period, value } = item
        if (!result[orgUnit]) {
            result[orgUnit] = { orgUnit, values: [] }
        }

        result[orgUnit].values.push({ period, value: parseFloat(value) })
    })

    for (const key in result) {
        result[key].values.sort((a, b) => a.period.localeCompare(b.period))
        result[key].values = result[key].values.map((item) => item.value)
    }

    return Object.values(result)
}

const newRegroupData = (data) => {
    const result = {}
    data.forEach((item) => {
        const { orgUnit, period, value } = item
        if (!result[orgUnit]) {
            result[orgUnit] = { orgUnit, values: [] }
        }
        result[orgUnit].values.push({ period, value: parseFloat(value) })
    })

    for (const key in result) {
        result[key].values.sort((a, b) => a.period.localeCompare(b.period))
    }

    return Object.values(result)
}

const getOrgUnitIndex = (data, targetOrgUnit) => {
    return data.findIndex((item) => item.orgUnit === targetOrgUnit)
}

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
    combineData,
    addValues,
    combineValuesByOrgUnits,
    addOrgUnitNameToFeatures,
    groupByPeriod,
    regroupData,
    getOrgUnitIndex,
    generateLabels,
    updateDataReducer,
    newRegroupData,
}
