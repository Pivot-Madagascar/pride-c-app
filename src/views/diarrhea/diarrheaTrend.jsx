import DiseaseTrend from '../../components/DiseaseTrend'
import { setDiarrheaData } from '../../redux/diarrheaSlice'
import getDiarrheaForecast from './data/forecast'
import getDiarrheaHistoric from './data/historics'
import { sample } from './data/sample'
import getDiarrheaSimulation from './data/simulation'

const DiarrheaTrend = () => (
    <DiseaseTrend
        storeName="diarrhea"
        sample={sample}
        getHistoric={getDiarrheaHistoric}
        getForecast={getDiarrheaForecast}
        getSimulation={getDiarrheaSimulation}
        reduxAction={setDiarrheaData}
    />
)

export default DiarrheaTrend
