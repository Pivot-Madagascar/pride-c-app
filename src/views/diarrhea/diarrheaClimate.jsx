import DiseaseClimate from '../../components/DiseaseClimate'
import COLORS from '../../constants/styles'
import { setDiarrheaData } from '../../redux/diarrheaSlice'
import { sample } from './data/sample'
import getDiarrheaSimulation from './data/simulation'

const DiarrheaClimate = () => (
    <DiseaseClimate
        storeName="diarrhea"
        sampleData={sample}
        getSimulation={getDiarrheaSimulation}
        reduxAction={setDiarrheaData}
        themeColor={COLORS.green_lighter}
    />
)

export default DiarrheaClimate
