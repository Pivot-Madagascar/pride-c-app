import { DIARRHEA } from '@/constants/mapping'
import { createIndicatorData } from '@/utils/diseaseDataFactories'

const getDiarrheaIndicator = () => createIndicatorData(DIARRHEA)

export default getDiarrheaIndicator