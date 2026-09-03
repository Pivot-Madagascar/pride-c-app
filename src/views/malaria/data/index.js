import { useSelector } from 'react-redux'
import {
    createForecastData,
    createHistoricData,
    createIndicatorData,
    createSimulationData
} from '@/utils/diseaseDataFactories'

const useDiseaseData = () => useSelector((state) => state.dataElements.malaria)

const createDiseaseHook = (createDataFn) => () => {
    const data = useDiseaseData()
    return createDataFn(data)
}

export const useMalariaForecast = createDiseaseHook(createForecastData)
export const useMalariaHistoric = createDiseaseHook(createHistoricData)
export const useMalariaIndicator = createDiseaseHook(createIndicatorData)
export const useMalariaSimulation = createDiseaseHook(createSimulationData)