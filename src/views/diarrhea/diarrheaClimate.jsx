import { DiseaseClimateProvider } from '@/contexts'
import COLORS from '@/constants/styles'
import { setData as setDiarrheaData } from '@/redux/diarrheaSlice'
import { sample } from '@/views/diarrhea/data/sample'
import { useDiarrheaHistoric } from '@/views/diarrhea/data/index'
import ClimateDisplay from '@/components/ClimateDisplay'
import { createDiseaseView } from '@/views/diseaseViewFactory'

export default createDiseaseView({
    storeName: 'diarrhea',
    sample: sample,
    getSimulation: useDiarrheaHistoric,
    reduxAction: setDiarrheaData,
    themeColor: COLORS.green_lighter,
    DiseaseComponent: (props) => <ClimateDisplay diseaseName="diarrhea" />,
    ProviderComponent: DiseaseClimateProvider
})