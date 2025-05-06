import { useState, useEffect } from 'react'
import DataManager from '../../components/DataManager'
import HealthTrend from '../../components/HealthTrend'
import Loader from '../../components/Loader'
import { setDiarrheaData } from '../../redux/diarrheaSlice'
import { sample } from './data'
import getDiarrheaForecast from './data/forecast'
import getDiarrheaHistoric from './data/historics'
import getDiarrheaSimulation from './data/simulation'

const DiarrheaTrend = () => {
    const [allDataFetched, setAllDataFetched] = useState(false)
    const [counter, setCounter] = useState(0)

    const { historicElements } = getDiarrheaHistoric()
    const { forecastElements } = getDiarrheaForecast()
    const { simulationElements } = getDiarrheaSimulation()

    const elements = [
        {
            dataElements: historicElements,
            reduxAction: setDiarrheaData,
        },
        {
            dataElements: forecastElements,
            reduxAction: setDiarrheaData,
        },
        {
            dataElements: simulationElements,
            reduxAction: setDiarrheaData,
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
                <HealthTrend storeName="diarrhea" sample={sample} />
            )}
        </>
    )
}

export default DiarrheaTrend
