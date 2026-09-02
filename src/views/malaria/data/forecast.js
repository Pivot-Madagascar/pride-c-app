import { useSelector } from 'react-redux'
import { createForecastData } from '@/utils/diseaseDataFactories'

export const getMalariaForecast = (MALARIA) => createForecastData(MALARIA)

export const useMalariaForecast = () => {
    const malariaData = useSelector((state) => state.dataElements.malaria)
    return getMalariaForecast(malariaData)
}

export default useMalariaForecast