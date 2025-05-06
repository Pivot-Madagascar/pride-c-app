import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import DataManager from '../../components/DataManager'
import Loader from '../../components/Loader'
import COLORS from '../../constants/styles'
import { setClimateData } from '../../redux/climateSlice'
import { setDiarrheaData } from '../../redux/diarrheaSlice'
import getClimateHistoric from '../climate/climateData'
import ClimateDisplay from '../climate/ClimateDisplay'
import { sample } from './data'
import getDiarrheaSimulation from './data/simulation'

const DiarrheaClimate = () => {
    const [allDataFetched, setAllDataFetched] = useState(false)
    const [counter, setCounter] = useState(0)

    const { climateElements } = getClimateHistoric()
    const { simulationElements } = getDiarrheaSimulation()

    const elements = [
        {
            dataElements: simulationElements,
            reduxAction: setDiarrheaData,
        },
        {
            dataElements: climateElements,
            reduxAction: setClimateData,
        },
    ]

    const diarrheaState = useSelector((state) => state.diarrhea)

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
                    themeColor={COLORS.green_lighter}
                    activeState={diarrheaState}
                    sampleData={sample}
                    storeName={'diarrhea'}
                />
            )}
        </>
    )
}

export default DiarrheaClimate
