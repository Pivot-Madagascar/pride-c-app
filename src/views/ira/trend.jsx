import React from 'react'
import HealthTrend from '../../components/HealthTrend'
import { setForecastData, setHistoricData } from '../../redux/iraSlice'
import { sample } from './data'
import useIraData from './DataGenerator'

const IraTrend = () => {
    return (
        <HealthTrend
            trendType="ira"
            dataGeneratorHook={useIraData}
            reduxSetForecastData={setForecastData}
            reduxSetHistoricData={setHistoricData}
            sample={sample}
        />
    )
}

export default IraTrend
