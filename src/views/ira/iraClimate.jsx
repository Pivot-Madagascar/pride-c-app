import DiseaseClimate from '../../components/DiseaseClimate'
import COLORS from '../../constants/styles'
import { setIraData } from '../../redux/iraSlice'
import { sample } from './data/sample'
import getIraSimulation from './data/simulation'

const IraClimate = () => (
    <DiseaseClimate
        storeName="ira"
        sampleData={sample}
        getSimulation={getIraSimulation}
        reduxAction={setIraData}
        themeColor={COLORS.blue_lighter}
    />
)

export default IraClimate