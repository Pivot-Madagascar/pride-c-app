import { DiseaseProvider } from '@/contexts'
import { setData as setIraData } from '@/redux/iraSlice'
import { sample } from '@/views/ira/data/sample'
import {
    useIraForecast,
    useIraHistoric,
    useIraSimulation
} from '@/views/ira/data/index'
import DiseaseDashboard from '@/components/DiseaseDashboard'
import { createDiseaseView } from '@/views/diseaseViewFactory'

export default createDiseaseView({
    storeName: 'ira',
    sample: sample,
    getHistoric: useIraHistoric,
    getForecast: useIraForecast,
    getSimulation: useIraSimulation,
    reduxAction: setIraData,
    DiseaseComponent: DiseaseDashboard,
    ProviderComponent: DiseaseProvider
})