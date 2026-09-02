import { useSelector } from 'react-redux'
import { createForecastData } from '@/utils/diseaseDataFactories'

export const getDiarrheaForecast = (DIARRHEA) => createForecastData(DIARRHEA)

export const useDiarrheaForecast = () => {
    const DIARRHEA = useSelector((state) => state.dataElements.diarrhea)
    return getDiarrheaForecast(DIARRHEA)
}

export default useDiarrheaForecast