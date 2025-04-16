import { useSelector } from 'react-redux'
import NewDataManager from '../../components/DataManager/NewDataManager'
import COLORS from '../../constants/styles'
import { setClimateData } from '../../redux/climateSlice'
import getClimateHistoric from '../climate/climateData'
import ClimateDisplay from '../climate/ClimateDisplay'
import { sample } from './data'

const MalariaClimate = () => {
    const { climateElements } = getClimateHistoric()

    const malariaState = useSelector((state) => state.malaria)

    return (
        <>
            <NewDataManager 
                dataElements={climateElements}
                reduxAction={setClimateData}
            />
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
