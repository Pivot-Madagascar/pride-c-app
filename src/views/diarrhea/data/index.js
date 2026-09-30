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

const useDiseaseData = () => useSelector((state) => state.dataElements.diarrhea)

const createDiseaseHook = (createDataFn) => () => {
    const data = useDiseaseData()
    const nextThreeMonths = useNextThreeMonths()
    const currentPeriod = useMonthYYYYMM()
    return createDataFn(data, nextThreeMonths, currentPeriod)
}

export const useDiarrheaForecast = createDiseaseHook(createForecastData)
export const useDiarrheaHistoric = createDiseaseHook(createHistoricData)
export const useDiarrheaIndicator = createDiseaseHook(createIndicatorData)
export const useDiarrheaSimulation = createDiseaseHook(createSimulationData)