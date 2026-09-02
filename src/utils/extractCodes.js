export const extractCodesRecursive = (obj, dataElements = [], indicators = []) => {
    if (!obj || typeof obj !== 'object') {
        return { dataElements, indicators }
    }

    if (obj.code && obj.id === undefined) {
        const target =
            obj.type === 'dataElement'
                ? dataElements
                : obj.type === 'indicator'
                ? indicators
                : null
        if (target) {
            target.push(obj.code)
        } else {
            console.error(`unknown type: ${obj.type}`)
        }
    }

    for (const key of Object.keys(obj)) {
        const value = obj[key]
        if (value && typeof value === 'object' && !(value instanceof Array)) {
            extractCodesRecursive(value, dataElements, indicators)
        }
    }

    return { dataElements, indicators }
}

export const extractCodesForCategory = (mapping) => {
    const { dataElements, indicators } = extractCodesRecursive(mapping)
    return {
        dataElements: [...new Set(dataElements)],
        indicators: [...new Set(indicators)],
    }
}

export const findElementByCode = (code, CLIMATE, MALARIA, IRA, DIARRHEA) => {
    for (const [key, element] of Object.entries(CLIMATE)) {
        if (element.code === code) {
            return {
                category: 'climate',
                subcategory: undefined,
                elementKey: key,
            }
        }
    }

    const categories = [
        { name: 'malaria', data: MALARIA },
        { name: 'ira', data: IRA },
        { name: 'diarrhea', data: DIARRHEA },
    ]

    for (const cat of categories) {
        for (const [subcatKey, subcat] of Object.entries(cat.data)) {
            if (subcat && typeof subcat === 'object') {
                for (const [elementKey, element] of Object.entries(subcat)) {
                    if (element && typeof element === 'object' && element.code === code) {
                        return {
                            category: cat.name,
                            subcategory: subcatKey,
                            elementKey: elementKey,
                        }
                    }
                    if (element && typeof element === 'object') {
                        for (const [subElementKey, subElement] of Object.entries(element)) {
                            if (
                                subElement &&
                                typeof subElement === 'object' &&
                                subElement.code === code
                            ) {
                                return {
                                    category: cat.name,
                                    subcategory: subcatKey,
                                    elementKey: `${elementKey}.${subElementKey}`,
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return null
}