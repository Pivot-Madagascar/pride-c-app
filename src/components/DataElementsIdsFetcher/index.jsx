import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setDataIds } from '@/redux/dataElementsSlice'
import { setFetchedDataElementKeys, setFetchedIndicatorKeys } from '@/redux/appSlice'
import { CLIMATE, MALARIA, IRA, DIARRHEA } from '@/constants/new_mapping'

const BATCH_SIZE = 100

const recordCode = (
    index,
    codeSets,
    code,
    type,
    category,
    subcategory,
    elementKey
) => {
    index.set(code, { category, subcategory, elementKey })

    if (type === 'dataElement') {
        codeSets.dataElements.add(code)
    } else if (type === 'indicator') {
        codeSets.indicators.add(code)
    } else {
        console.error(`unknown type: ${type} for code ${code}`)
    }
}

const indexClimate = (data, index, codeSets) => {
    for (const [key, element] of Object.entries(data)) {
        if (element && typeof element === 'object' && element.code) {
            recordCode(
                index,
                codeSets,
                element.code,
                element.type,
                'climate',
                undefined,
                key
            )
        }
    }
}

const indexCategory = (data, categoryName, index, codeSets) => {
    for (const [subcategory, subcat] of Object.entries(data)) {
        if (!subcat || typeof subcat !== 'object') {
            continue
        }

        for (const [elementKey, element] of Object.entries(subcat)) {
            if (!element || typeof element !== 'object') {
                continue
            }

            if (element.code) {
                recordCode(
                    index,
                    codeSets,
                    element.code,
                    element.type,
                    categoryName,
                    subcategory,
                    elementKey
                )
            }

            for (const [subElementKey, subElement] of Object.entries(element)) {
                if (subElement && typeof subElement === 'object' && subElement.code) {
                    recordCode(
                        index,
                        codeSets,
                        subElement.code,
                        subElement.type,
                        categoryName,
                        subcategory,
                        `${elementKey}.${subElementKey}`
                    )
                }
            }
        }
    }
}

const buildIndex = () => {
    const index = new Map() // code -> { category, subcategory, elementKey }
    const codeSets = { dataElements: new Set(), indicators: new Set() }

    indexClimate(CLIMATE, index, codeSets)
    indexCategory(MALARIA, 'malaria', index, codeSets)
    indexCategory(IRA, 'ira', index, codeSets)
    indexCategory(DIARRHEA, 'diarrhea', index, codeSets)

    return {
        codeToElement: index,
        dataElementCodes: [...codeSets.dataElements],
        indicatorCodes: [...codeSets.indicators],
    }
}

const { codeToElement, dataElementCodes, indicatorCodes } = buildIndex()

const chunk = (arr, size) => {
    const chunks = []
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size))
    }
    return chunks
}

const fetchByCodes = async (engine, resource, codes) => {
    const batches = chunk(codes.filter(Boolean), BATCH_SIZE)

    const batchResults = await Promise.all(
        batches.map(async (batch) => {
            try {
                const result = await engine.query({
                    data: {
                        resource,
                        params: {
                            fields: 'id,code,name',
                            filter: `code:in:[${batch.join(',')}]`,
                        },
                    },
                })
                return {
                    items: result?.data?.[resource] ?? [],
                    hasError: false,
                }
            } catch (err) {
                console.error(`Failed to fetch ${resource} batch`, err)
                return { items: [], hasError: true }
            }
        })
    )

    return {
        items: batchResults.flatMap((r) => r.items),
        hasError: batchResults.some((r) => r.hasError),
    }
}

const mapItemsToUpdates = (items) => {
    const updates = []
    for (const item of items) {
        const found = codeToElement.get(item.code)
        if (found) {
            updates.push({ ...found, id: item.id })
        }
    }
    return updates
}

const DataElementsIdsFetcher = ({ onError }) => {
    const engine = useDataEngine()
    const dispatch = useDispatch()
    const hasFetched = useRef(false)

    const fetchedDataElementKeys = useSelector((state) => state.app.fetchedDataElementKeys)
    const fetchedIndicatorKeys = useSelector((state) => state.app.fetchedIndicatorKeys)

    useEffect(() => {
        if (hasFetched.current) {
            return
        }

        hasFetched.current = true

        const fetchData = async () => {
            const uncachedDataElementCodes = dataElementCodes.filter(
                (code) => !fetchedDataElementKeys.includes(code)
            )
            const uncachedIndicatorCodes = indicatorCodes.filter(
                (code) => !fetchedIndicatorKeys.includes(code)
            )

            const hasUncachedDataElements = uncachedDataElementCodes.length > 0
            const hasUncachedIndicators = uncachedIndicatorCodes.length > 0

            const [dataElements, indicators] = await Promise.all([
                hasUncachedDataElements
                    ? fetchByCodes(engine, 'dataElements', uncachedDataElementCodes)
                    : { items: [], hasError: false },
                hasUncachedIndicators
                    ? fetchByCodes(engine, 'indicators', uncachedIndicatorCodes)
                    : { items: [], hasError: false },
            ])

            const updates = [
                ...mapItemsToUpdates(dataElements.items),
                ...mapItemsToUpdates(indicators.items),
            ]

            if (updates.length > 0) {
                dispatch(setDataIds(updates))
            }

            uncachedDataElementCodes.forEach((code) =>
                dispatch(setFetchedDataElementKeys(code))
            )
            uncachedIndicatorCodes.forEach((code) =>
                dispatch(setFetchedIndicatorKeys(code))
            )

            const fetchHasError = dataElements.hasError || indicators.hasError

            onError?.(fetchHasError)
        }

        fetchData()
    }, [engine, dispatch, onError, fetchedDataElementKeys, fetchedIndicatorKeys])

    return null
}

export default DataElementsIdsFetcher
