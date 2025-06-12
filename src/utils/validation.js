export const isObjectValid = (obj) => {
    if (!obj) {
        return false
    }
    return Object.values(obj).every(
        (value) => value !== null && value !== undefined
    )
}

export const haveSameElements = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
        return false
    }

    const set1 = new Set(arr1)
    const set2 = new Set(arr2)

    if (set1.size !== set2.size) {
        return false
    }

    for (const item of set1) {
        if (!set2.has(item)) {
            return false
        }
    }

    return true
}
