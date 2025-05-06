import { useState, useEffect } from 'react'
import DataManager from '../../components/DataManager'
import HealthTrend from '../../components/HealthTrend'
import Loader from '../../components/Loader'
import { setMalariaData } from '../../redux/malariaSlice'
import { sample } from './data'
import getMalariaForecast from './data/forecast'
import getMalariaHistoric from './data/historics'
import getMalariaSimulation from './data/simulation'

const MalariaTrend = () => {
    const [allDataFetched, setAllDataFetched] = useState(false)
    const [counter, setCounter] = useState(0)

    const { historicElements } = getMalariaHistoric()
    const { forecastElements } = getMalariaForecast()
    const { simulationElements } = getMalariaSimulation()

    const elements = [
        {
            dataElements: historicElements,
            reduxAction: setMalariaData,
        },
        {
            dataElements: forecastElements,
            reduxAction: setMalariaData,
        },
        {
            dataElements: simulationElements,
            reduxAction: setMalariaData,
        },
    ]

    useEffect(() => {
        const timer = setTimeout(() => {
            setAllDataFetched(elements.length === counter)
        }, 500) 
        return () => clearTimeout(timer)
    }, [counter])

    return (
        <>
            {elements.map(({ dataElements, reduxAction }, index) => (
                <DataManager
                    key={index}
                    dataElements={dataElements}
                    reduxAction={reduxAction}
                    onDataFetched={() => setCounter((prev) => prev + 1)}
                />
            ))}

            {!allDataFetched ? (
                <Loader />
            ) : (
                <HealthTrend storeName="malaria" sample={sample} />
            )}
        </>
    )
}

export default MalariaTrend
