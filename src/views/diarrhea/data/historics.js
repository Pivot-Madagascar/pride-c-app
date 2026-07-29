import { DIARRHEA } from '@/constants/mapping'
import { createHistoricData } from '@/utils/diseaseDataFactories'

const getDiarrheaHistoric = () => createHistoricData(DIARRHEA)

export default getDiarrheaHistoric