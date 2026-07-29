import { DIARRHEA } from '@/constants/mapping'
import { createForecastData } from '@/utils/diseaseDataFactories'

const getDiarrheaForecast = () => createForecastData(DIARRHEA)

export default getDiarrheaForecast