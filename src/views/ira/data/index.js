import { useSelector } from 'react-redux'
import {
    useNextThreeMonths,
    useMonthYYYYMM
} from '@/utils'
import {
    createForecastData,
    createHistoricData,
    createIndicatorData,
    createSimulationData
} from '@/utils/diseaseDataFactories'

const useDiseaseData = () => useSelector((state) => state.dataElements.ira)

const createDiseaseHook = (createDataFn) => () => {
    const data = useDiseaseData()
    const nextThreeMonths = useNextThreeMonths()
    const currentPeriod = useMonthYYYYMM()
    return createDataFn(data, nextThreeMonths, currentPeriod)
}

export const useIraForecast = createDiseaseHook(createForecastData)
export const useIraHistoric = createDiseaseHook(createHistoricData)
export const useIraIndicator = createDiseaseHook(createIndicatorData)
export const useIraSimulation = createDiseaseHook(createSimulationData)