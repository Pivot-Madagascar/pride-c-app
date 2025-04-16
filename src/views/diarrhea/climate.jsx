import { useSelector } from 'react-redux'
import NewDataManager from '../../components/DataManager/NewDataManager'
import COLORS from '../../constants/styles'
import { setClimateData } from '../../redux/climateSlice'
import getClimateHistoric from '../climate/climateData'
import ClimateDisplay from '../climate/ClimateDisplay'
import { sample } from './data'

const DiarrheaClimate = () => {
    const { climateElements } = getClimateHistoric()

    const diarrheaState = useSelector((state) => state.diarrhea)

    return (
        <>
            <NewDataManager
                dataElements={climateElements}
                reduxAction={setClimateData}
            />
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
