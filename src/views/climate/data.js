import BrightnessIcon from '../../components/Icons/Brightness'
import FireIcon from '../../components/Icons/Fire'
import FloodIcon from '../../components/Icons/Flood' 
import HumidityIcon from '../../components/Icons/Humidity'
import MosquitoIcon from '../../components/Icons/Mosquito'
import PrecipitationIcon from '../../components/Icons/Precipitation'
import SurfaceWaterIcon from '../../components/Icons/SurfaceWater'
import TemperatureHotIcon from '../../components/Icons/TemperatureHot'
import VegetationIcon from '../../components/Icons/Vegetation'
import VegetativeWaterIcon from '../../components/Icons/VegetativeWater'
import WindIcon from '../../components/Icons/Wind'
import { CLIMATE } from '../../constants/mapping'

export const climateData = [
    {
        title: CLIMATE.precipitation.displayName,
        value: '',
        id: CLIMATE.precipitation.id,
        percentage: 0,
        description: '',
        unit: CLIMATE.precipitation.unit,
        name: CLIMATE.precipitation.name,
        icon: (props) => <PrecipitationIcon {...props} />,
    },
    {
        title: CLIMATE.temperature.displayName,
        value: '',
        id: CLIMATE.temperature.id,
        percentage: 0,
        description: '',
        unit: CLIMATE.temperature.unit,
        name: CLIMATE.temperature.name,
        icon: (props) => <TemperatureHotIcon {...props} />,
    },
    {
        title: CLIMATE.vegetationIndex.displayName,
        value: '',
        id: CLIMATE.vegetationIndex.id,
        percentage: 0,
        description: '',
        unit: CLIMATE.vegetationIndex.unit,
        name: CLIMATE.vegetationIndex.name,
        icon: (props) => <VegetationIcon {...props} />,
    },
    {
        title: CLIMATE.waterSurfaceIndex.displayName,
        value: '',
        id: CLIMATE.waterSurfaceIndex.id,
        percentage: 0,
        description: '',
        unit: CLIMATE.waterSurfaceIndex.unit,
        name: CLIMATE.waterSurfaceIndex.name,
        icon: (props) => <SurfaceWaterIcon {...props} />,
    },
    {
        title: CLIMATE.atmHumidity.displayName,
        value: '',
        id: CLIMATE.atmHumidity.id,
        percentage: 0,
        description: '',
        unit: CLIMATE.atmHumidity.unit,
        name: CLIMATE.atmHumidity.name,
        icon: (props) => <HumidityIcon {...props} />,
    },
    {
        title: CLIMATE.bushfireArea.displayName,
        value: '',
        id: CLIMATE.bushfireArea.id,
        percentage: 0,
        description: '',
        unit: CLIMATE.bushfireArea.unit,
        name: CLIMATE.bushfireArea.name,
        icon: (props) => <FireIcon {...props} />,
    },
    {
        title: CLIMATE.vegetativeWaterIndex.displayName,
        value: '',
        id: CLIMATE.vegetativeWaterIndex.id,
        percentage: 0,
        description: '',
        unit: CLIMATE.vegetativeWaterIndex.unit,
        name: CLIMATE.vegetativeWaterIndex.name,
        icon: (props) => <VegetativeWaterIcon {...props} />
    },
    {
        title: CLIMATE.aodAtmLevel.displayName,
        value: '',
        id: CLIMATE.aodAtmLevel.id,
        percentage: 0,
        description: '',
        unit: CLIMATE.aodAtmLevel.unit,
        name: CLIMATE.aodAtmLevel.name,
        icon: (props) => <BrightnessIcon {...props} />
    },
    {
        title: CLIMATE.floodedRiceFields.displayName,
        value: '',
        id: CLIMATE.floodedRiceFields.id,
        percentage: 0,
        description: '',
        unit: CLIMATE.floodedRiceFields.unit,
        name: CLIMATE.floodedRiceFields.name,
        icon: (props) => <FloodIcon {...props} />
    },
    {
        title: CLIMATE.windSpeed.displayName,
        value: '',
        id: CLIMATE.windSpeed.id,
        percentage: 0,
        description: '',
        unit: CLIMATE.windSpeed.unit,
        name: CLIMATE.windSpeed.name,
        icon: (props) => <WindIcon {...props} />

    }
]