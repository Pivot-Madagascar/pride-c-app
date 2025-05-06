import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect, useRef, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useSequentialForecastElements from '../../hooks/useSequentialForecastElements'
import { fetchAnalyticsData } from '../../utils/request'
import isEqual from 'lodash/isEqual'
import { setFetchedDimensions } from '../../redux/appSlice'

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

    // Convert the map values to an array and assign to result.value
    result.value = Array.from(dataElementMap.values())

    return result
}

const createOrderedDxPathMapping = (dataElements) => {
    // Using Map to preserve insertion order
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

    // Stabilize dataElements input
    const stableDataElements = useMemo(
        () => dataElements,
        [JSON.stringify(dataElements)]
    )
    const stableStore = useMemo(() => store, [JSON.stringify(store)])

    const newDataElements = useSequentialForecastElements(
        stableDataElements,
        stableStore
    )

    // Stabilize orgUnitList
    const orgUnitList = useSelector((state) => state.orgUnit.orgUnits)
    const stableOrgUnitList = useMemo(
        () => orgUnitList,
        [JSON.stringify(orgUnitList)]
    )

    // Stabilize reduxAction
    const stableReduxAction = useCallback(
        (payload) => dispatch(reduxAction(payload)),
        [dispatch, reduxAction]
    )

    // Track previous data with deep comparison
    const prevData = useRef()
    const isFetching = useRef(false)

    useEffect(() => {
        console.log(onDataFetched, 'onDataFetched');
    }, [onDataFetched])

    useEffect(() => {
        console.log('fa nanalpopsad');
    })

    useEffect(() => {
        console.log('ino ty ry mec eh');
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
                const promises = newDataElements.map(async (element) => {
                    const { dataElements, adminLevel, periods } = element
                    const temp = dataElements.filter(
                        (el) => el.storedValue === undefined
                    )
                    const dx = temp.map((el) => el.dataElement)
                    const ou =
                        stableOrgUnitList?.[adminLevel]?.map((ou) => ou.id) ||
                        []
                    const dxPathMap = createOrderedDxPathMapping(temp)

                    const dimensions = [...dx, ...ou, ...periods]
                    const key = JSON.stringify(dimensions)
                    const isStored = cachedDimensions.includes(key)

                    if (dx.length > 0 && ou.length > 0 && !isStored) {
                        dispatch(setFetchedDimensions(key))
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
                        }
                    }

                    return null // if no fetch was made
                })

                const results = await Promise.all(promises)
                // Filter out nulls (no fetch)
                return results.filter(Boolean)
            }

            return []
        }

        // Usage
        fetchData().then((result) => {
            console.log('taoko d tsa nandalo leka zao');
            if (!result || result.length === 0) {
                console.log('mandalo atato leka');
                if (onDataFetched) {
                    onDataFetched({ success: false, data: null })
                }
                return
            }
            const tempResult = result.map(({ adminLevel, value }) =>
                groupAndSortData(value, adminLevel)
            )

            const final = tempResult.map((el) => transformData(el))

            final.forEach(({ value }) => {
                value.forEach(({ path, value }) => {
                    dispatch(
                        reduxAction({
                            path,
                            value,
                        })
                    )
                })
            })

            if (onDataFetched) {
                onDataFetched({ success: true, data: final })
            }
        })
    }, [newDataElements, stableOrgUnitList, engine, stableReduxAction])

    return null
}

export default DataManager
