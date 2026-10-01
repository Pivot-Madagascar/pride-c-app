import { DiseaseProvider } from '@/contexts'
import { setData as setDiarrheaData } from '@/redux/diarrheaSlice'
import { sample } from '@/views/diarrhea/data/sample'
import {
    useDiarrheaForecast,
    useDiarrheaHistoric,
    useDiarrheaSimulation
} from '@/views/diarrhea/data/index'
import DiseaseDashboard from '@/components/DiseaseDashboard'
import { createDiseaseView } from '@/views/diseaseViewFactory'

export default createDiseaseView({
    storeName: 'diarrhea',
    sample: sample,
    getHistoric: useDiarrheaHistoric,
    getForecast: useDiarrheaForecast,
    getSimulation: useDiarrheaSimulation,
    reduxAction: setDiarrheaData,
    DiseaseComponent: DiseaseDashboard,
    ProviderComponent: DiseaseProvider
})