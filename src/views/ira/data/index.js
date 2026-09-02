import { useSelector } from 'react-redux'
import {
    createForecastData,
    createHistoricData,
    createIndicatorData,
    createSimulationData
} from '@/utils/diseaseDataFactories'

const useDiseaseData = () => useSelector((state) => state.dataElements.ira)

export const getIraForecast = (IRA) => createForecastData(IRA)
export const getIraHistoric = (IRA) => createHistoricData(IRA)
export const getIraIndicator = (IRA) => createIndicatorData(IRA)
export const getIraSimulation = (IRA) => createSimulationData(IRA)

export const useIraForecast = () => {
    const IRA = useDiseaseData()
    return createForecastData(IRA)
}

export const useIraHistoric = () => {
    const IRA = useDiseaseData()
    return createHistoricData(IRA)
}

export const useIraIndicator = () => {
    const IRA = useDiseaseData()
    return createIndicatorData(IRA)
}

export const useIraSimulation = () => {
    const IRA = useDiseaseData()
    return createSimulationData(IRA)
}