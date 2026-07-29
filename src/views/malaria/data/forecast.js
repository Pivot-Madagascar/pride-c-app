import { MALARIA } from '@/constants/mapping'
import { createForecastData } from '@/utils/diseaseDataFactories'

const getMalariaForecast = () => createForecastData(MALARIA)

export default getMalariaForecast