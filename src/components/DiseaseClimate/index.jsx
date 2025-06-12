import { useState, useEffect, useMemo, useCallback } from 'react'
import DataManager from '../../components/DataManager'
import Loader from '../../components/Loader'
import { useDiseaseClimate } from '../../contexts/DiseaseClimateContext'
import ClimateDisplay from '../ClimateDisplay'
import getClimateHistoric from '../ClimateDisplay/data/historic'

const DiseaseClimate = () => {
    const { getSimulation, reduxAction } = useDiseaseClimate()
    const [allDataFetched, setAllDataFetched] = useState(false)
    const [counter, setCounter] = useState(0)

    const { climateElements } = getClimateHistoric()
    const { simulationElements } = getSimulation()

    const elements = useMemo(
        () => [
            { 
                dataElements: simulationElements, 
                reduxAction 
            },
            {
                dataElements: climateElements,
                reduxAction: require('../../redux/climateSlice').setClimateData,
            },
        ],
        [simulationElements, reduxAction, climateElements]
    )

    useEffect(() => {
        const timer = setTimeout(() => {
            setAllDataFetched(elements.length === counter)
        }, 500)
        return () => clearTimeout(timer)
    }, [counter, elements.length])

    const handleDataFetched = useCallback(() => {
        setCounter((prev) => prev + 1)
    }, [])

    return (
        <>
            {elements.map(({ dataElements, reduxAction }, index) => (
                <DataManager
                    key={index}
                    dataElements={dataElements}
                    reduxAction={reduxAction}
                    onDataFetched={handleDataFetched}
                />
            ))}

            {!allDataFetched ? <Loader /> : <ClimateDisplay />}
        </>
    )
}

export default DiseaseClimate
