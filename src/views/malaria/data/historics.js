import { MALARIA } from '@/constants/mapping'
import { createHistoricData } from '@/utils/diseaseDataFactories'

const getMalariaHistoric = () => createHistoricData(MALARIA)

export default getMalariaHistoric