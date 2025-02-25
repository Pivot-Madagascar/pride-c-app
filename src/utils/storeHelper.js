const getValueFromStore = (state, keys) => {
    return keys.reduce((acc, key) => {
        if (acc && acc[key] !== undefined) {
            return acc[key]
        }
        return undefined
    }, state)
}

const getStoredData = (value) => {
    const { data } = value
    const path = []
    const keys = Object.keys(value)
    keys.forEach((key) => {
        if (key !== 'data' && value[key] !== undefined) {
            path.push(value[key])
        }
    })

    return getValueFromStore(data, path)
}

const areAllKeysPresent = (section, keysToCheck) => {
    return Object.values(section).every((element) =>
        keysToCheck.every((key) => key in element)
    )
}

const checkKeysInState = (state, sectionsToCheck, keysToCheck) => {
    const checkSectionKeys = (section) =>
        section ? areAllKeysPresent(section, keysToCheck) : false
    return sectionsToCheck.every((section) => checkSectionKeys(state[section]))
}

export { getStoredData, checkKeysInState }
