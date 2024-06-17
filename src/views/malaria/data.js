import FireIcon from '../../components/Icons/Fire'
import HumidityIcon from '../../components/Icons/Humidity'
import PrecipitationIcon from '../../components/Icons/Precipitation'
import SurfaceWaterIcon from '../../components/Icons/SurfaceWater'
import TemperatureHotIcon from '../../components/Icons/TemperatureHot'
import VegetationIcon from '../../components/Icons/Vegetation'
import COLORS from '../../constants/styles'

export const sample = {
    trends: [
        {
            title: 'Incidence (par 100K)',
            value: 70000,
            percentage: 11.1,
            description: 'Par rapport à l’année dernière',
        },
        {
            title: 'Cas total',
            value: 86000,
            percentage: 11.1,
            description: 'Par rapport à l’année dernière',
        },
        {
            title: 'Tendance générale',
            value: '+34%',
            percentage: 34.1,
            description: 'Par rapport à l’année dernière',
        },
        {
            title: 'Vigilance accrue',
            value: '3 CSB',
            percentage: 56,
            description: 'Par rapport à l’année dernière',
        },
    ],
    climate: [
        {
            title: 'Précipitation',
            value: '8 000 mm',
            percentage: 11.1,
            description: 'Par rapport à l’année dernière',
            icon: (props) => <PrecipitationIcon {...props} />
        },
        {
            title: 'Temperature',
            value: '+0.25°C',
            percentage: 0.9,
            description: 'Par rapport à l’année dernière',
            icon: (props) => <TemperatureHotIcon {...props} />
        },
        {
            title: 'Végetation',
            value: '970 ha',
            percentage: 3,
            description: 'Par rapport à l’année dernière',
            icon: (props) => <VegetationIcon {...props} />
        },
        {
            title: "Indicateur de l'eau de surface",
            value: '-0.53 m',
            percentage: 2,
            description: 'Par rapport à l’année dernière',
            icon: (props) => <SurfaceWaterIcon {...props} />
        },
        {
            title: 'Humidité atmosphérique',
            value: '90%',
            percentage: 1.1,
            description: 'Par rapport à l’année dernière',
            icon: (props) => <HumidityIcon {...props} />
        },
        {
            title: 'Feux de brousses',
            value: '75 ha',
            percentage: 6,
            description: 'Par rapport à l’année dernière',
            icon: (props) => <FireIcon {...props} />
        },
        
    ],
    healthMetrics: [
        { label: 'Incidence', value: 'incidence', disabled: true },
        { label: 'Cas', value: 'case', disabled: false },
    ],
    ageClasses: [
        { label: '- 5 ans', value: 'under-5', disabled: false },
        { label: '+ 5 ans', value: 'plus-5', disabled: true },
    ],
    adminitrativeDivisions: [
        { label: 'District', value: 'district', disabled: true },
        { label: 'Commune', value: 'municipality', disabled: false },
        { label: 'Fokontany', value: 'fokontany', disabled: false },
    ],
    currentThemeColor: COLORS.red_light,
    mapColors: [
        '#f5e0e4',
        '#ecc1c9',
        '#e7b1bb',
        '#e2a1ad',
        '#dd92a0',
        '#d98292',
        '#d47384',
        '#cf6377',
        '#ca5369',
        '#c5445c',
        '#bb3a51',
        '#ac354b',
        '#9c3044',
    ],
}
