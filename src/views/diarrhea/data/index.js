import { useSelector } from 'react-redux'
import {
    createForecastData,
    createHistoricData,
    createIndicatorData,
    createSimulationData
} from '@/utils/diseaseDataFactories'

const useDiseaseData = () => useSelector((state) => state.dataElements.diarrhea)

const createDiseaseHook = (createDataFn) => () => {
    const data = useDiseaseData()
    return createDataFn(data)
}

export const useDiarrheaForecast = createDiseaseHook(createForecastData)
export const useDiarrheaHistoric = createDiseaseHook(createHistoricData)
export const useDiarrheaIndicator = createDiseaseHook(createIndicatorData)
export const useDiarrheaSimulation = createDiseaseHook(createSimulationData)