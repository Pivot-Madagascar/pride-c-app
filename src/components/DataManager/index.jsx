import { useDataEngine } from '@dhis2/app-runtime'
import React, { useEffect, useRef, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSequentialForecastElements } from '../../hooks'
import { fetchAnalyticsData } from '../../utils'
import { isEqual } from '../../utils'
import { setFetchedDimensions } from '../../redux/appSlice'

/** --- Constants --- */
const MAX_CONCURRENT_REQUESTS = 4

/** --- Process items with concurrency limit --- */
const processWithLimit = async (items, processor, limit) => {
    const results = []
    const executing = []

    for (const item of items) {
        const promise = processor(item).then((result) => {
            results.push(result)
            executing.splice(executing.indexOf(promise), 1)
        })

        executing.push(promise)

        if (executing.length >= limit) {
            await Promise.race(executing)
        }
    }

    // Wait for all remaining promises
    await Promise.all(executing)
    return results.filter(Boolean)
}

const groupAndSortData = (inputArray, adminLevelId) => {
    const groupedData = {}

    inputArray.forEach(({ dataElement, period, orgUnit, value, path }) => {
        const key = `${dataElement}-${orgUnit}`
        if (!groupedData[key]) {
            groupedData[key] = { dataElement, orgUnit, data: [], path }
        }
        groupedData[key].data.push({ period, value })
    })

    Object.values(groupedData).forEach((group) => {
        group.data.sort((a, b) => a.period.localeCompare(b.period))
    })

    return {
        adminLevel: adminLevelId,
        value: Object.values(groupedData),
    }
}

const transformData = ({ value, adminLevel }) => {
    const result = {
        adminLevel: adminLevel,
        value: [],
    }

    const dataElementMap = new Map()

    value.forEach((item) => {
        if (!dataElementMap.has(item.dataElement)) {
            dataElementMap.set(item.dataElement, {
                dataElement: item.dataElement,
                path: item.path,
                value: {},
            })
        }

        const group = dataElementMap.get(item.dataElement)
        group.value[item.orgUnit] = item.data
    })

    result.value = Array.from(dataElementMap.values())

    return result
}

const createOrderedDxPathMapping = (dataElements) => {
    const mapping = new Map()
    dataElements.forEach((el, index) => {
        mapping.set(el.dataElement, {
            path: el.path,
            originalIndex: index,
        })
    })
    return mapping
}

const DataManager = ({ dataElements, reduxAction, store, onDataFetched }) => {
    const engine = useDataEngine()
    const dispatch = useDispatch()

    const cachedDimensions = useSelector((state) => state.app.fetchedDimensions)
    
    // Use ref to avoid triggering effect on dimension changes
    const cachedDimensionsRef = useRef(new Set())
    useEffect(() => {
        cachedDimensionsRef.current = new Set(cachedDimensions)
    }, [cachedDimensions])

    const stableDataElements = useMemo(
        () => dataElements,
        [JSON.stringify(dataElements)]
    )
    const stableStore = useMemo(() => store, [JSON.stringify(store)])

    const newDataElements = useSequentialForecastElements(
        stableDataElements,
        stableStore
    )

    const orgUnitList = useSelector((state) => state.orgUnit.orgUnits)
    const stableOrgUnitList = useMemo(
        () => orgUnitList,
        [JSON.stringify(orgUnitList)]
    )

    const stableReduxAction = useCallback(
        (payload) => dispatch(reduxAction(payload)),
        [dispatch, reduxAction]
    )

    const prevData = useRef()
    const isFetching = useRef(false)

    // Use ref to store callback to avoid triggering effect on callback changes
    const onDataFetchedRef = useRef(onDataFetched)
    useEffect(() => {
        onDataFetchedRef.current = onDataFetched
    }, [onDataFetched])

    useEffect(() => {
        if (
            !newDataElements ||
            isFetching.current ||
            (prevData.current &&
                isEqual(prevData.current, {
                    newDataElements,
                    stableOrgUnitList,
                }))
        ) {
            return
        }

        isFetching.current = true
        prevData.current = { newDataElements, stableOrgUnitList }

        const fetchData = async () => {
            if (newDataElements) {
                const results = await processWithLimit(
                    newDataElements,
                    async (element) => {
                        const { dataElements, adminLevel, periods } = element

                        const temp = dataElements.filter((el) => el.storedValue === undefined)
                        const dx = temp.map((el) => el.dataElement)
                        const ou = stableOrgUnitList?.[adminLevel]?.map((ou) => ou.id) || []
                        const dxPathMap = createOrderedDxPathMapping(temp)
                        const dimensions = [...dx, ...ou, ...periods]
                        const key = JSON.stringify(dimensions)
                        const isStored = cachedDimensionsRef.current.has(key)

                        if (dx.length > 0 && ou.length > 0 && !isStored) {
                            const data = await fetchAnalyticsData({
                                dataElements: dx,
                                orgUnits: ou,
                                periods,
                                engine,
                            })

                            const enrichedData = data.map((item) => {
                                const pathInfo = dxPathMap.get(item.dataElement)
                                return pathInfo
                                    ? { ...item, path: pathInfo.path }
                                    : item
                            })

                            return {
                                adminLevel: adminLevel,
                                value: enrichedData,
                                key,
                            }
                        }

                        return null
                    },
                    MAX_CONCURRENT_REQUESTS
                )
                return results
            }

            return []
        }
        fetchData().then((result) => {
            isFetching.current = false
            
            if (!result || result.length === 0) {
                if (onDataFetchedRef.current) {
                    onDataFetchedRef.current({ success: false, data: null })
                }
                return
            }

            const tempResult = result.map(
                ({ adminLevel, value }) => groupAndSortData(value, adminLevel)
            )

            const final = tempResult.map((el) => transformData(el))

            final.forEach(({ value }) => {
                value.forEach(({ path, value }) => {
                    dispatch(reduxAction({ path, value }))
                })
            })

            if (onDataFetchedRef.current) {
                onDataFetchedRef.current({ success: true, data: final })
                result.forEach(({ key }) => dispatch(setFetchedDimensions(key)))
            }
        })
    }, [newDataElements, stableOrgUnitList, engine, stableReduxAction])
    
    return null
}

export default DataManager