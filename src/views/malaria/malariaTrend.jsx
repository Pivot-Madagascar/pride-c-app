import DiseaseTrend from '../../components/DiseaseTrend'
import { setMalariaData } from '../../redux/malariaSlice'
import getMalariaForecast from './data/forecast'
import getMalariaHistoric from './data/historics'
import { sample } from './data/sample'
import getMalariaSimulation from './data/simulation'

const MalariaTrend = () => (
    <DiseaseTrend
        storeName="malaria"
        sample={sample}
        getHistoric={getMalariaHistoric}
        getForecast={getMalariaForecast}
        getSimulation={getMalariaSimulation}
        reduxAction={setMalariaData}
    />
)

export default MalariaTrend
