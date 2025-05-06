import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import DataManager from '../../components/DataManager'
import Loader from '../../components/Loader'
import COLORS from '../../constants/styles'
import { setClimateData } from '../../redux/climateSlice'
import { setIraData } from '../../redux/iraSlice'
import getClimateHistoric from '../climate/climateData'
import ClimateDisplay from '../climate/ClimateDisplay'
import { sample } from './data'
import getIraSimulation from './data/simulation'

const IraClimate = () => {
    const [allDataFetched, setAllDataFetched] = useState(false)
    const [counter, setCounter] = useState(0)

    const { climateElements } = getClimateHistoric()
    const { simulationElements } = getIraSimulation()

    const elements = [
        {
            dataElements: simulationElements,
            reduxAction: setIraData,
        },
        {
            dataElements: climateElements,
            reduxAction: setClimateData,
        },
    ]

    const iraState = useSelector((state) => state.ira)

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
                    themeColor={COLORS.blue_lighter}
                    activeState={iraState}
                    sampleData={sample}
                    storeName={'ira'}
                />
            )}
        </>
    )
}

export default IraClimate
