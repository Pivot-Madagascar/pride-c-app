import { useSelector } from 'react-redux'
import { generateYearMonthsRange } from '@/utils/format-time'

const climateVariableNames = [
    'precipitation',
    'temperature', 
    'vegetationIndex',
    'waterSurfaceIndex',
    'bushfireArea',
    'vegetativeWaterIndex',
    'aodAtmLevel',
    'floodedRiceFields',
    'windSpeed',
]

const getClimateHistoric = (CLIMATE) => {
    const climateElements = climateVariableNames
        .map((name) => {
            const item = CLIMATE[name]
            if (!item || !item.id) {
                return null
            }
            return {
                dataElement: item.id,
                path: [name],
                periods: generateYearMonthsRange(2022, 2024)
            }
        })
        .filter(Boolean)
    return { climateElements }
}

export const useClimateHistoric = () => {
    const CLIMATE = useSelector((state) => state.dataElements.climate)
    return getClimateHistoric(CLIMATE)
}

export default useClimateHistoric