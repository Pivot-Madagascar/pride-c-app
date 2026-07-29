import { MALARIA } from '@/constants/mapping'
import { createIndicatorData } from '@/utils/diseaseDataFactories'

const getMalariaIndicator = () => createIndicatorData(MALARIA)

export default getMalariaIndicator