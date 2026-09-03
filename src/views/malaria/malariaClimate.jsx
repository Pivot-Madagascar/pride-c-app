import { DiseaseClimate } from '@/components'
import { DiseaseClimateProvider } from '@/contexts'
import COLORS from '@/constants/styles'
import { setData as setMalariaData } from '@/redux/malariaSlice'
import { sample } from '@/views/malaria/data/sample'
import { useMalariaHistoric } from '@/views/malaria/data/index'
import { createDiseaseView } from '@/views/diseaseViewFactory'

export default createDiseaseView({
    storeName: 'malaria',
    sample: sample,
    getSimulation: useMalariaHistoric,
    reduxAction: setMalariaData,
    themeColor: COLORS.red_light,
    DiseaseComponent: DiseaseClimate,
    ProviderComponent: DiseaseClimateProvider
})