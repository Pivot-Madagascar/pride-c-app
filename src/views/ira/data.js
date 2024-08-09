import BrightnessIcon from '../../components/Icons/Brightness'
import FireIcon from '../../components/Icons/Fire'
import FloodIcon from '../../components/Icons/Flood'
import HumidityIcon from '../../components/Icons/Humidity'
import LungVirusIcon from '../../components/Icons/LungsVirus'
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
            value: 15020,
            percentage: 58,
            description: 'Par rapport à l’année dernière',
        },
        {
            title: 'Cas total',
            value: 3150,
            percentage: 25,
            description: 'Par rapport à l’année dernière',
        },
        {
            title: 'Tendance générale',
            value: '+58%',
            percentage: 12,
            description: 'Par rapport à l’année dernière',
        },
        {
            title: 'Vigilance accrue',
            value: '7 CSB',
            percentage: 80,
            description: 'Par rapport à l’année dernière',
        },
    ],
    ira: {
        title: 'Nombre de cas de IRA',
        value: '',
        percentage: 0,
        description: '',
        icon: (props) => <LungVirusIcon {...props} />,
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
    currentThemeColor: COLORS.blue_lighter,
    mapColors: [
        '#a7e6ff',
        '#94d1f9',
        '#81bcf2',
        '#6ea8ec',
        '#5b93e5',
        '#487edd',
        '#3569d7',
        '#2254d0',
        '#0f40c9',
        '#052fae',
        '#042699',
        '#031e84',
        '#050c9c',
    ],
    trendsData: [
        1897, 2269, 2286, 2744, 2511, 2307, 2806, 2365, 2140, 2359, 1970, 1939,
        1867, 1923, 1773, 1879, 2533, 2557, 2778, 2326, 2142, 2158, 2112, 1987,
        1897, 2269, 2286, 2744, 2511, 2307, 2806, 2365, 2140, 2359, 1970, 1939,
    ],
}
