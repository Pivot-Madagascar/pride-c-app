import { useDispatch, useSelector } from 'react-redux'
import COLORS from '../../constants/styles'
import { setHistoricData } from '../../redux/diarrheaSlice'
import ClimateDisplay from '../climate/ClimateDisplay'
import { sample } from './data'
import useDiarrheaData from './DataGenerator'

const DiarrheaClimate = () => {
    const dispatch = useDispatch()
    const { historicElementsSimulation } = useDiarrheaData()

    const handleSetDiseaseHistoricData = (data) => {
        dispatch(setHistoricData(data))
    }

    const diarrheaState = useSelector((state) => state.diarrhea)

    return (
        <ClimateDisplay
            themeColor={COLORS.green_lighter}
            diseaseHistoricData={historicElementsSimulation}
            onSetDiseaseHistoricData={handleSetDiseaseHistoricData}
            activeState={diarrheaState}
            sampleData={sample}
        />
    )
}

export default DiarrheaClimate
