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
    malaria: {
        title: 'Nombre de cas de paludisme',
        value: '',
        percentage: 0,
        description: '',
        icon: (props) => <MosquitoIcon {...props} />,
    },
    climate: [
        {
            title: 'Precipitation Totale',
            value: '',
            percentage: 0,
            description: '',
            icon: (props) => <PrecipitationIcon {...props} />,
        },
        {
            title: 'Température Moyenne',
            value: '',
            percentage: 0,
            description: '',
            icon: (props) => <TemperatureHotIcon {...props} />,
        },
        {
            title: 'Indicateur de vegetation ',
            value: '',
            percentage: 0,
            description: '',
            icon: (props) => <VegetationIcon {...props} />,
        },
        {
            title: "Indicateur de l'eau de surface",
            value: '',
            percentage: 0,
            description: '',
            icon: (props) => <SurfaceWaterIcon {...props} />,
        },
        {
            title: 'Humidité atmosphérique',
            value: '',
            percentage: 0,
            description: '',
            icon: (props) => <HumidityIcon {...props} />,
        },
        {
            title: 'Proportion de superficie avec un feu de brousse',
            value: '',
            percentage: 0,
            description: '',
            icon: (props) => <FireIcon {...props} />,
        },
        {
            title: "Indicateur de l'eau vegetative",
            value: '',
            percentage: 0,
            description: '',
            icon: (props) => <VegetativeWaterIcon {...props} />
        },
        {
            title: "Niveau moyen de la profondeur optique des aérosols",
            value: '',
            percentage: 0,
            description: '',
            icon: (props) => <BrightnessIcon {...props} />
        },
        {
            title: "Proportion moyenne de rizières inondé",
            value: '',
            percentage: 0,
            description: '',
            icon: (props) => <FloodIcon {...props} />
        },
        {
            title: "Vitesse moyenne du vent",
            value: '',
            percentage: 0,
            description: '',
            icon: (props) => <WindIcon {...props} />

        }
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
    visualizationType: [
        { label: 'Carte', value: 'map', disabled: true },
        { label: 'Series', value: 'line', disabled: false },
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
    trendsData: [
        2435, 2124, 3237, 2225, 1627, 917, 485, 293, 281, 576, 1317, 2133, 2996,
        2889, 4448, 3705, 1975, 1114, 621, 372, 342, 698, 1564, 2476, 2435,
        2124, 3237, 2225, 1627, 917, 485, 293, 281, 576, 1317, 2133,
    ],
}
