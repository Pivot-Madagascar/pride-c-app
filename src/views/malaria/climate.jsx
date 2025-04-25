import { useSelector } from 'react-redux'
import NewDataManager from '../../components/DataManager/NewDataManager'
import COLORS from '../../constants/styles'
import { setClimateData } from '../../redux/climateSlice'
import { setMalariaData } from '../../redux/malariaSlice'
import getClimateHistoric from '../climate/climateData'
import ClimateDisplay from '../climate/ClimateDisplay'
import { sample } from './data'
import getMalariaSimulation from './data/simulation'

const MalariaClimate = () => {
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

    return (
        <>
            {elements.map(({ dataElements, reduxAction }, index) => (
                <NewDataManager
                    key={index}
                    dataElements={dataElements}
                    reduxAction={reduxAction}
                />
            ))}
            <ClimateDisplay
                themeColor={COLORS.red_light}
                activeState={malariaState}
                sampleData={sample}
                storeName={'malaria'}
            />
        </>
    )
}

export default MalariaClimate
