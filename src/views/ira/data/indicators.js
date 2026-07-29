import { IRA } from '@/constants/mapping'
import { createIndicatorData } from '@/utils/diseaseDataFactories'

const getIraIndicator = () => createIndicatorData(IRA)

export default getIraIndicator