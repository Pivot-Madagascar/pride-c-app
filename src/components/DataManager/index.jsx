import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useAnalyticsData from '../../hooks/useAnalyticsData.js'
// import { setFetching } from '../../redux/appSlice.js'
import { regroupData } from '../../utils/format.js'

const DataManager = ({
    adminLevel,
    orgUnits,
    dataElements,
    periods,
    dataType,
}) => {
    const dispatch = useDispatch()

    const { analyticsData, loading, error } = useAnalyticsData({
        dataElements: dataElements.map((el) => el.dataElement),
        orgUnits,
        periods,
    })

    useEffect(() => {
        console.log(dataElements, 'DATA ELEMENTS');
    }, [dataElements])

    useEffect(() => {
        if (analyticsData && !loading && !error && adminLevel) {
            // setFetching(true)
            if (dataType === 'indicator') {
                analyticsData.forEach((el) => {
                    const found = dataElements.find(
                        (e) => e.dataElement === el.dataElement
                    )
                    if (!found) {
                        console.log(dataElements.map(e => e.dataElement), 'e ty eh');
                        console.log(el, 'el ty eh');
                    }
                    const { path, action } = found
                    const newPath = [...path, adminLevel]
                    const { orgUnit, period, value } = el
                    const payload = {
                        path: newPath,
                        value: {
                            [orgUnit]: {
                                period,
                                value,
                            },
                        },
                    }
                    dispatch(action(payload))
                })
            } else if (dataType === 'forecast') {
                let reduxAction
                const newData = analyticsData.map((el) => {
                    const found = dataElements.find(
                        (e) => e.dataElement === el.dataElement
                    )

                    if (!found) {
                        console.log(dataElements.map(e => e.dataElement), 'e ty eh');
                        console.log(el, 'el ty eh');
                    }
                    const { path, action } = found
                    const newPath = [...path, adminLevel]
                    const { orgUnit, period, value } = el
                    // Update reduxAction to the last found action
                    reduxAction = action
                    return {
                        path: newPath,
                        value: {
                            [orgUnit]: {
                                period,
                                value,
                            },
                        },
                    }
                })
                const regroupedData = regroupData(newData)
                regroupedData.forEach((data) => dispatch(reduxAction(data)))
            }
            // setFetching(false)
        }
    }, [analyticsData, loading, error, adminLevel, dataType])

    return null
}

export default DataManager
