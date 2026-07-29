import { IRA } from '@/constants/mapping'
import { createHistoricData } from '@/utils/diseaseDataFactories'

const getIraHistoric = () => createHistoricData(IRA)

export default getIraHistoric