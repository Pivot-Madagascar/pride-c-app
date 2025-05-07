import DiseaseTrend from '../../components/DiseaseTrend'
import { setIraData } from '../../redux/iraSlice'
import getIraForecast from './data/forecast'
import getIraHistoric from './data/historics'
import { sample } from './data/sample'
import getIraSimulation from './data/simulation'

const IraTrend = () => (
    <DiseaseTrend
        storeName="ira"
        sample={sample}
        getHistoric={getIraHistoric}
        getForecast={getIraForecast}
        getSimulation={getIraSimulation}
        reduxAction={setIraData}
    />
)

export default IraTrend
