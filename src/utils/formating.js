const combineData = (data, additionalData) => {
    // Create a map to store combined objects
    const map = new Map()

    // Create a lookup map for additional data by id
    const additionalDataMap = new Map()
    additionalData.forEach((item) => {
        additionalDataMap.set(item.id, item)
    })

    // Iterate through each object in the data array
    data.forEach((item) => {
        // Create a unique key based on orgUnit, categoryOptionCombo, and period
        const key = `${item.orgUnit}-${item.categoryOptionCombo}-${item.period}`

        // Parse the value to an integer
        const value = parseInt(item.value, 10)

        // If the key doesn't exist in the map, create a new entry
        if (!map.has(key)) {
            const baseObject = {
                categoryOptionCombo: item.categoryOptionCombo,
                period: item.period,
                periodName: item.periodName,
                orgUnit: item.orgUnit,
                orgUnitName: item.orgUnitName,
                values: [value], // Renamed to values for clarity
            }

            // Add municipality and municipalityId if available
            if (additionalDataMap.has(item.orgUnit)) {
                const additionalInfo = additionalDataMap.get(item.orgUnit)
                baseObject.municipality = additionalInfo.municipality
                baseObject.municipalityId = additionalInfo.municipalityId
            }

            map.set(key, baseObject)
        } else {
            // If the key exists, push the value to the existing array
            map.get(key).values.push(value)
        }
    })

    let counter = 1

    // Convert the map back to an array and replace values with min, mean, max
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

export { combineData, addValues }
