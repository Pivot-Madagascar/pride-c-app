import DiseaseClimate from '../../components/DiseaseClimate'
import COLORS from '../../constants/styles'
import { setMalariaData } from '../../redux/malariaSlice'
import { sample } from './data/sample'
import getMalariaSimulation from './data/simulation'

const MalariaClimate = () => (
    <DiseaseClimate
        storeName="malaria"
        sampleData={sample}
        getSimulation={getMalariaSimulation}
        reduxAction={setMalariaData}
        themeColor={COLORS.red_light}
    />
)

export default MalariaClimate
