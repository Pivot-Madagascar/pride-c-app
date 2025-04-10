import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getMonthYYYYMM } from '../../utils/format-time'
import { aggregateByOrgUnit } from '../../utils/formatting'
import { fetchAnalyticsData } from '../../utils/request'

const IndicatorsDataManager = ({
    adminLevel,
    orgUnitIds,
    onSetAlertData,
    indicators,
}) => {
    const engine = useDataEngine()
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)
    const period = getMonthYYYYMM()

    const formatData = (data) => {
        const aggregatedData = aggregateByOrgUnit(data)
        const object = {}
        aggregatedData.forEach((item) => {
            object[item.orgUnit] = item.values
        })
        return object
    }

    const fetchData = async () => {

        const dataElements = indicators.map((el) => el.dataElementId)
        setLoading(true)
        try {
            // const data = await fetchAnalyticsData({
            //     dataElement: indicator.dataElementId,
            //     engine: engine,
            //     periods: [String(period)],
            //     orgUnits: orgUnitIds,
            // })

            const data = await fetchAnalyticsData({
                dataElements,
                engine: engine,
                periods: [String(period)],
                orgUnits: orgUnitIds,
            })

            console.log(data, 'data data data');
            
            // if (onSetAlertData) {
            //     dispatch(
            //         onSetAlertData({
            //             caseType: indicator.source,
            //             adminLevel,
            //             data: formatData(data),
            //         })
            //     )
            // }
        } catch (error) {
            console.error(`Error fetching ${adminLevel} indicator data:`, error)
        } finally {
            setLoading(false)
        }
    }

    // useEffect(() => {
    //     if (!indicator.storedValue && !loading) {
    //         fetchData()
    //     }
    // }, [indicator.storedValue, orgUnitIds, loading])

    useEffect(() => {
        if(indicators && indicators.length > 0) {
            fetchData()
        }
        
    }, [indicators])

    return null
}

export default IndicatorsDataManager
