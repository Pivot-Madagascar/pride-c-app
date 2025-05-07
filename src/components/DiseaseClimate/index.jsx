import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import DataManager from '../../components/DataManager'
import Loader from '../../components/Loader'
import ClimateDisplay from '../ClimateDisplay'
import getClimateHistoric from '../ClimateDisplay/data/historic'

const DiseaseClimate = ({
    storeName,
    sampleData,
    getSimulation,
    reduxAction,
    themeColor,
}) => {
    const [allDataFetched, setAllDataFetched] = useState(false)
    const [counter, setCounter] = useState(0)

    const { climateElements } = getClimateHistoric()
    const { simulationElements } = getSimulation()

    const elements = [
        { dataElements: simulationElements, reduxAction },
        {
            dataElements: climateElements,
            reduxAction: require('../../redux/climateSlice').setClimateData,
        },
    ]

    const diseaseState = useSelector((state) => state[storeName])

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
                <ClimateDisplay
                    themeColor={themeColor}
                    activeState={diseaseState}
                    sampleData={sampleData}
                    storeName={storeName}
                />
            )}
        </>
    )
}

export default DiseaseClimate
