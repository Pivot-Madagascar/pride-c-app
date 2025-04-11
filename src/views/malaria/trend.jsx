import { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import DataManager from '../../components/DataManager'
import NewDataManager from '../../components/DataManager/NewDataManager'
import HealthTrend from '../../components/HealthTrend'
import useSequentialForecastElements from '../../hooks/useSequentialForecastElements'
import {
    setForecastData,
    setHistoricData,
    setMalariaData,
} from '../../redux/malariaSlice'
import cacheUtils from '../../utils/newCache'
import { sample } from './data'
import useMalariaForecast from './data/forecast'
import getMalariaForecast from './data/forecast'
import useMalariaHistoric from './data/historics'
import getMalariaHistoric from './data/historics'
import useMalariaData from './DataGenerator'

const MalariaTrend = () => {
    const malariaState = useSelector((state) => state.malaria)

    const [orgUnits, setOrgUnits] = useState()
    const [adminLevel, setAdminLevel] = useState()
    const [periods, setPeriods] = useState()
    const [dataElements, setDataElements] = useState()
    const [forecastGroup, setForecastGroup] = useState()
    const [dataType, setDataType] = useState('forecast')

    const { historicElements } = getMalariaHistoric()
    const { forecastElements } = getMalariaForecast()

    const elements = [
        {
            dataElements: historicElements,
            reduxAction: setMalariaData,
        },
        {
            dataElements: forecastElements,
            reduxAction: setMalariaData,
        },
    ]

    return (
        <>
            {elements.map(({ dataElements, reduxAction }, index) => (
                <NewDataManager
                    key={index}
                    dataElements={dataElements}
                    reduxAction={reduxAction}
                />
            ))}

            <HealthTrend
                storeName="malaria"
                sample={sample}
            />
        </>
    )
}

export default MalariaTrend
