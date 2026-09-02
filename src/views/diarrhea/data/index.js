import { useSelector } from 'react-redux'
import {
    createForecastData,
    createHistoricData,
    createIndicatorData,
    createSimulationData
} from '@/utils/diseaseDataFactories'

const useDiseaseData = () => useSelector((state) => state.dataElements.diarrhea)

export const getDiarrheaForecast = (DIARRHEA) => createForecastData(DIARRHEA)
export const getDiarrheaHistoric = (DIARRHEA) => createHistoricData(DIARRHEA)
export const getDiarrheaIndicator = (DIARRHEA) => createIndicatorData(DIARRHEA)
export const getDiarrheaSimulation = (DIARRHEA) => createSimulationData(DIARRHEA)

export const useDiarrheaForecast = () => {
    const DIARRHEA = useDiseaseData()
    return createForecastData(DIARRHEA)
}

export const useDiarrheaHistoric = () => {
    const DIARRHEA = useDiseaseData()
    return createHistoricData(DIARRHEA)
}

export const useDiarrheaIndicator = () => {
    const DIARRHEA = useDiseaseData()
    return createIndicatorData(DIARRHEA)
}

export const useDiarrheaSimulation = () => {
    const DIARRHEA = useDiseaseData()
    return createSimulationData(DIARRHEA)
}