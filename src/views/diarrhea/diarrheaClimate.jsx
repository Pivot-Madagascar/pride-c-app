import DiseaseClimate from '../../components/DiseaseClimate'
import COLORS from '../../constants/styles'
import { DiseaseClimateProvider } from '../../contexts/DiseaseClimateContext'
import { setDiarrheaData } from '../../redux/diarrheaSlice'
import { sample } from './data/sample'
import getDiarrheaSimulation from './data/simulation'

const diarrheaClimateConfig = {
    storeName: 'diarrhea',
    sampleData: sample,
    getSimulation: getDiarrheaSimulation,
    reduxAction: setDiarrheaData,
    themeColor: COLORS.green_lighter
}

const DiarrheaClimate = () => (
    <DiseaseClimateProvider config={diarrheaClimateConfig}>
        <DiseaseClimate />
    </DiseaseClimateProvider>
)

export default DiarrheaClimate
