import { DiseaseClimateProvider } from '@/contexts'
import COLORS from '@/constants/styles'
import { setData as setIraData } from '@/redux/iraSlice'
import { sample } from '@/views/ira/data/sample'
import { useIraHistoric } from '@/views/ira/data/index'
import ClimateDisplay from '@/components/ClimateDisplay'
import { createDiseaseView } from '@/views/diseaseViewFactory'

export default createDiseaseView({
    storeName: 'ira',
    sample: sample,
    getSimulation: useIraHistoric,
    reduxAction: setIraData,
    themeColor: COLORS.blue_lighter,
    DiseaseComponent: ClimateDisplay,
    ProviderComponent: DiseaseClimateProvider
})