import { IRA } from '@/constants/mapping'
import { createForecastData } from '@/utils/diseaseDataFactories'

const getIraForecast = () => createForecastData(IRA)

export default getIraForecast