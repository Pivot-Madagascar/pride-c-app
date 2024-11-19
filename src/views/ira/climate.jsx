import { useDispatch, useSelector } from 'react-redux'
import COLORS from '../../constants/styles'
import { setHistoricData } from '../../redux/newIraSlice'
import ClimateDisplay from '../climate/ClimateDisplay'
import useIraData from './DataGenerator'

const IraClimate = () => {
    const dispatch = useDispatch()
    const { historicElementsSimulation } = useIraData()

    const handleSetDiseaseHistoricData = (data) => {
        dispatch(setHistoricData(data))
    }

    const iraState = useSelector((state) => state.newIra)

    return (
        <ClimateDisplay
            themeColor={COLORS.blue_lighter}
            diseaseHistoricData={historicElementsSimulation}
            onSetDiseaseHistoricData={handleSetDiseaseHistoricData}
            activeState={iraState}
        />
    )
}

export default IraClimate
