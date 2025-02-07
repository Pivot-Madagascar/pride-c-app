import React from 'react'
import HealthTrend from '../../components/HealthTrend'
import { setForecastData, setHistoricData } from '../../redux/diarrheaSlice'
import { sample } from './data'
import useDiarrheaData from './DataGenerator'

const DiarrheaTrend = () => {
    return (
        <HealthTrend
            trendType="diarrhea"
            dataGeneratorHook={useDiarrheaData}
            reduxSetForecastData={setForecastData}
            reduxSetHistoricData={setHistoricData}
            sample={sample}
        />
    )
}

export default DiarrheaTrend
