import { useSelector } from 'react-redux'
import NewDataManager from '../../components/DataManager/NewDataManager'
import COLORS from '../../constants/styles'
import { setClimateData } from '../../redux/climateSlice'
import { setDiarrheaData } from '../../redux/diarrheaSlice'
import getClimateHistoric from '../climate/climateData'
import ClimateDisplay from '../climate/ClimateDisplay'
import { sample } from './data'
import getDiarrheaSimulation from './data/simulation'

const DiarrheaClimate = () => {
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
                themeColor={COLORS.green_lighter}
                activeState={diarrheaState}
                sampleData={sample}
                storeName={'diarrhea'}
            />
        </>
    )
}

export default DiarrheaClimate
