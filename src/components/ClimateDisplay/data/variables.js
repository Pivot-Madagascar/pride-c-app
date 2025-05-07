import { CLIMATE } from "../../../constants/mapping";

export const climateVariables = [
    {
        label: CLIMATE.precipitation.displayName,
        value: CLIMATE.precipitation.id,
    },
    { 
        label: CLIMATE.temperature.displayName, 
        value: CLIMATE.temperature.id 
    },
    {
        label: CLIMATE.vegetationIndex.displayName,
        value: CLIMATE.vegetationIndex.id,
    },
    {
        label: CLIMATE.waterSurfaceIndex.displayName,
        value: CLIMATE.waterSurfaceIndex.id,
    },
    { 
        label: CLIMATE.bushfireArea.displayName, 
        value: CLIMATE.bushfireArea.id 
    },
    {
        label: CLIMATE.vegetativeWaterIndex.displayName,
        value: CLIMATE.vegetativeWaterIndex.id,
    },
    { 
        label: CLIMATE.aodAtmLevel.displayName, 
        value: CLIMATE.aodAtmLevel.id 
    },
    {
        label: CLIMATE.floodedRiceFields.displayName,
        value: CLIMATE.floodedRiceFields.id,
    },
    { 
        label: CLIMATE.windSpeed.displayName, 
        value: CLIMATE.windSpeed.id 
    },
]
