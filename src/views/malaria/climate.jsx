import { useDispatch, useSelector } from 'react-redux'
import COLORS from '../../constants/styles'
import { setHistoricData } from '../../redux/newMalariaSlice'
import ClimateDisplay from '../climate/ClimateDisplay'
import useMalariaData from './DataGenerator'

const MalariaClimate = () => {
    const dispatch = useDispatch()
    const { historicElementsSimulation } = useMalariaData()

    const handleSetDiseaseHistoricData = (data) => {
        dispatch(setHistoricData(data))
    }

    const malariaState = useSelector((state) => state.newMalaria)

    return (
        <ClimateDisplay
            themeColor={COLORS.red_light}
            diseaseHistoricData={historicElementsSimulation}
            onSetDiseaseHistoricData={handleSetDiseaseHistoricData}
            activeState={malariaState}
        />
    )
}

export default MalariaClimate
