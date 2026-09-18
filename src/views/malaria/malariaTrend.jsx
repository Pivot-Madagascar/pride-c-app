import { DiseaseProvider } from '@/contexts'
import { setData as setMalariaData } from '@/redux/malariaSlice'
import { sample } from '@/views/malaria/data/sample'
import {
    useMalariaForecast,
    useMalariaHistoric,
    useMalariaSimulation 
} from '@/views/malaria/data/index'
import DiseaseDashboard from '@/components/DiseaseDashboard'
import { createDiseaseView } from '@/views/diseaseViewFactory'

export default createDiseaseView({
    storeName: 'malaria',
    sample: sample,
    getHistoric: useMalariaHistoric,
    getForecast: useMalariaForecast,
    getSimulation: useMalariaSimulation,
    reduxAction: setMalariaData,
    DiseaseComponent: DiseaseDashboard,
    ProviderComponent: DiseaseProvider
})