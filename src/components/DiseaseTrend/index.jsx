import { useState, useEffect } from 'react'
import DataManager from '../../components/DataManager'
import Loader from '../../components/Loader'
import DiseaseDashboard from '../DiseaseDashboard'

const DiseaseTrend = ({
    storeName,
    sample,
    getHistoric,
    getForecast,
    getSimulation,
    reduxAction,
}) => {
    const [allDataFetched, setAllDataFetched] = useState(false)
    const [counter, setCounter] = useState(0)

    const { historicElements } = getHistoric()
    const { forecastElements } = getForecast()
    const { simulationElements } = getSimulation()

    const elements = [
        { dataElements: historicElements, reduxAction },
        { dataElements: forecastElements, reduxAction },
        { dataElements: simulationElements, reduxAction },
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
                <DiseaseDashboard storeName={storeName} sample={sample} />
            )}
        </>
    )
}

export default DiseaseTrend
