import { CLIMATE } from '@/constants/mapping'
import { generateYearMonths } from '@/utils/format-time'

const getClimateHistoric = () => {
    const climateElements = [
        {
            dataElement: CLIMATE.precipitation.id,
            path: ['precipitation'],
            periods: [
                ...generateYearMonths(2022),
                ...generateYearMonths(2023),
                ...generateYearMonths(2024),
                ...generateYearMonths(2025),
            ],
        },
        {
            dataElement: CLIMATE.temperature.id,
            path: ['temperature'],
            periods: [
                ...generateYearMonths(2022),
                ...generateYearMonths(2023),
                ...generateYearMonths(2024),
                ...generateYearMonths(2025),
            ],
        },
        {
            dataElement: CLIMATE.vegetationIndex.id,
            path: ['vegetationIndex'],
            periods: [
                ...generateYearMonths(2022),
                ...generateYearMonths(2023),
                ...generateYearMonths(2024),
                ...generateYearMonths(2025),
            ],
        },
        {
            dataElement: CLIMATE.waterSurfaceIndex.id,
            path: ['waterSurfaceIndex'],
            periods: [
                ...generateYearMonths(2022),
                ...generateYearMonths(2023),
                ...generateYearMonths(2024),
                ...generateYearMonths(2025),
            ],
        },
        {
            dataElement: CLIMATE.bushfireArea.id,
            path: ['bushfireArea'],
            periods: [
                ...generateYearMonths(2022),
                ...generateYearMonths(2023),
                ...generateYearMonths(2024),
                ...generateYearMonths(2025),
            ],
        },
        {
            dataElement: CLIMATE.vegetativeWaterIndex.id,
            path: ['vegetativeWaterIndex'],
            periods: [
                ...generateYearMonths(2022),
                ...generateYearMonths(2023),
                ...generateYearMonths(2024),
                ...generateYearMonths(2025),
            ],
        },
        {
            dataElement: CLIMATE.aodAtmLevel.id,
            path: ['aodAtmLevel'],
            periods: [
                ...generateYearMonths(2022),
                ...generateYearMonths(2023),
                ...generateYearMonths(2024),
                ...generateYearMonths(2025),
            ],
        },
        {
            dataElement: CLIMATE.floodedRiceFields.id,
            path: ['floodedRiceFields'],
            periods: [
                ...generateYearMonths(2022),
                ...generateYearMonths(2023),
                ...generateYearMonths(2024),
                ...generateYearMonths(2025),
            ],
        },
        {
            dataElement: CLIMATE.windSpeed.id,
            path: ['windSpeed'],
            periods: [
                ...generateYearMonths(2022),
                ...generateYearMonths(2023),
                ...generateYearMonths(2024),
                ...generateYearMonths(2025),
            ],
        },
    ]
    return {
        climateElements,
    }
}

export default getClimateHistoric
