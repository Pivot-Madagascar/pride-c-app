import { useSelector } from 'react-redux'
import {
    createForecastData,
    createHistoricData,
    createIndicatorData,
    createSimulationData
} from '@/utils/diseaseDataFactories'

const useDiseaseData = () => useSelector((state) => state.dataElements.ira)

const createDiseaseHook = (createDataFn) => () => {
    const data = useDiseaseData()
    return createDataFn(data)
}

export const useIraForecast = createDiseaseHook(createForecastData)
export const useIraHistoric = createDiseaseHook(createHistoricData)
export const useIraIndicator = createDiseaseHook(createIndicatorData)
export const useIraSimulation = createDiseaseHook(createSimulationData)