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

export { getStoredData }
