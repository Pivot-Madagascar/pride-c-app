import { useSelector } from 'react-redux'
import {
    createForecastData,
    createHistoricData,
    createIndicatorData,
    createSimulationData
} from '@/utils/diseaseDataFactories'

export const getMalariaForecast = (MALARIA) => createForecastData(MALARIA)
export const getMalariaHistoric = (MALARIA) => createHistoricData(MALARIA)
export const getMalariaIndicator = (MALARIA) => createIndicatorData(MALARIA)
export const getMalariaSimulation = (MALARIA) => createSimulationData(MALARIA)

export const useMalariaForecast = () => {
    const MALARIA = useSelector((state) => state.dataElements.malaria)
    return getMalariaForecast(MALARIA)
}

export const useMalariaHistoric = () => {
    const MALARIA = useSelector((state) => state.dataElements.malaria)
    return getMalariaHistoric(MALARIA)
}

export const useMalariaIndicator = () => {
    const MALARIA = useSelector((state) => state.dataElements.malaria)
    return getMalariaIndicator(MALARIA)
}

export const useMalariaSimulation = () => {
    const MALARIA = useSelector((state) => state.dataElements.malaria)
    return getMalariaSimulation(MALARIA)
}