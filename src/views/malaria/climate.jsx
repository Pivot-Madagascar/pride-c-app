import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import DataManager from '../../components/DataManager'
import Loader from '../../components/Loader'
import COLORS from '../../constants/styles'
import { setClimateData } from '../../redux/climateSlice'
import { setMalariaData } from '../../redux/malariaSlice'
import getClimateHistoric from '../climate/climateData'
import ClimateDisplay from '../climate/ClimateDisplay'
import { sample } from './data'
import getMalariaSimulation from './data/simulation'

const MalariaClimate = () => {
    const [allDataFetched, setAllDataFetched] = useState(false)
    const [counter, setCounter] = useState(0)

    const { climateElements } = getClimateHistoric()
    const { simulationElements } = getMalariaSimulation()

    const elements = [
        {
            dataElements: simulationElements,
            reduxAction: setMalariaData,
        },
        {
            dataElements: climateElements,
            reduxAction: setClimateData,
        },
    ]

    const malariaState = useSelector((state) => state.malaria)

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
                    themeColor={COLORS.red_light}
                    activeState={malariaState}
                    sampleData={sample}
                    storeName={'malaria'}
                />
            )}
        </>
    )
}

export default MalariaClimate
