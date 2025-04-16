import { useSelector } from 'react-redux'
import NewDataManager from '../../components/DataManager/NewDataManager'
import COLORS from '../../constants/styles'
import { setClimateData } from '../../redux/climateSlice'
import getClimateHistoric from '../climate/climateData'
import ClimateDisplay from '../climate/ClimateDisplay'
import { sample } from './data'

const IraClimate = () => {
    const { climateElements } = getClimateHistoric()

    const iraState = useSelector((state) => state.ira)

    return (
        <>
            <NewDataManager 
                dataElements={climateElements}
                reduxAction={setClimateData}
            />
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
