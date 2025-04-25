import { useSelector } from 'react-redux'
import NewDataManager from '../../components/DataManager/NewDataManager'
import COLORS from '../../constants/styles'
import { setClimateData } from '../../redux/climateSlice'
import { setIraData } from '../../redux/iraSlice'
import getClimateHistoric from '../climate/climateData'
import ClimateDisplay from '../climate/ClimateDisplay'
import { sample } from './data'
import getIraSimulation from './data/simulation'

const IraClimate = () => {
    const { climateElements } = getClimateHistoric()
    const { simulationElements } = getIraSimulation()

    const elements = [
        {
            dataElements: simulationElements,
            reduxAction: setIraData
        },
        {
            dataElements: climateElements,
            reduxAction: setClimateData
        }
    ]

    const iraState = useSelector((state) => state.ira)

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
                themeColor={COLORS.blue_lighter}
                activeState={iraState}
                sampleData={sample}
                storeName={'ira'}
            />
        </>
    )
}

export default IraClimate
