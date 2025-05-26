import DiseaseTrend from '../../components/DiseaseTrend'
import { DiseaseProvider } from '../../contexts/DiseaseContext'
import { setIraData } from '../../redux/iraSlice'
import getIraForecast from './data/forecast'
import getIraHistoric from './data/historics'
import { sample } from './data/sample'
import getIraSimulation from './data/simulation'

const iraConfig = {
    storeName: "ira",
    sample,
    getHistoric: getIraHistoric,
    getForecast: getIraForecast,
    getSimulation: getIraSimulation,
    reduxAction: setIraData
}

const IraTrend = () => (
    <DiseaseProvider config={iraConfig}>
        <DiseaseTrend />
    </DiseaseProvider>
)

export default IraTrend
