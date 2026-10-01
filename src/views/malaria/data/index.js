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

const useDiseaseData = () => useSelector((state) => state.dataElements.malaria)

const createDiseaseHook = (createDataFn) => () => {
    const data = useDiseaseData()
    const nextThreeMonths = useNextThreeMonths()
    const currentPeriod = useMonthYYYYMM()
    return createDataFn(data, nextThreeMonths, currentPeriod)
}

export const useMalariaForecast = createDiseaseHook(createForecastData)
export const useMalariaHistoric = createDiseaseHook(createHistoricData)
export const useMalariaIndicator = createDiseaseHook(createIndicatorData)
export const useMalariaSimulation = createDiseaseHook(createSimulationData)