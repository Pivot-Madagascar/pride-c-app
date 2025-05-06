import { useState, useEffect } from 'react'
import DataManager from '../../components/DataManager'
import HealthTrend from '../../components/HealthTrend'
import Loader from '../../components/Loader'
import { setIraData } from '../../redux/iraSlice'
import { sample } from './data'
import getIraForecast from './data/forecast'
import getIraHistoric from './data/historics'
import getIraSimulation from './data/simulation'

const IraTrend = () => {
    const [allDataFetched, setAllDataFetched] = useState(false)
    const [counter, setCounter] = useState(0)

    const { historicElements } = getIraHistoric()
    const { forecastElements } = getIraForecast()
    const { simulationElements } = getIraSimulation()

    const elements = [
        {
            dataElements: historicElements,
            reduxAction: setIraData,
        },
        {
            dataElements: forecastElements,
            reduxAction: setIraData,
        },
        {
            dataElements: simulationElements,
            reduxAction: setIraData,
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
                <HealthTrend storeName="ira" sample={sample} />
            )}
        </>
    )
}

export default IraTrend
