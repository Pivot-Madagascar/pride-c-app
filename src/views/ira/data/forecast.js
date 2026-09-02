import { useSelector } from 'react-redux'
import { createForecastData } from '@/utils/diseaseDataFactories'

export const getIraForecast = (IRA) => createForecastData(IRA)

export const useIraForecast = () => {
    const IRA = useSelector((state) => state.dataElements.ira)
    return getIraForecast(IRA)
}

export default useIraForecast