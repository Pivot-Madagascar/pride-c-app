import React from 'react'
import HealthTrend from '../../components/HealthTrend'
import { setForecastData, setHistoricData } from '../../redux/malariaSlice'
import { sample } from './data'
import useMalariaData from './DataGenerator'

const MalariaTrend = () => {
    return (
        <HealthTrend
            trendType="malaria"
            dataGeneratorHook={useMalariaData}
            reduxSetForecastData={setForecastData}
            reduxSetHistoricData={setHistoricData}
            sample={sample}
        />
    )
}

export default MalariaTrend
