import BrightnessIcon from '../../../components/Icons/Brightness'
import FireIcon from '../../../components/Icons/Fire'
import FloodIcon from '../../../components/Icons/Flood'
import HumidityIcon from '../../../components/Icons/Humidity'
import MosquitoIcon from '../../../components/Icons/Mosquito'
import PrecipitationIcon from '../../../components/Icons/Precipitation'
import SurfaceWaterIcon from '../../../components/Icons/SurfaceWater'
import TemperatureHotIcon from '../../../components/Icons/TemperatureHot'
import VegetationIcon from '../../../components/Icons/Vegetation'
import VegetativeWaterIcon from '../../../components/Icons/VegetativeWater'
import WindIcon from '../../../components/Icons/Wind'
import { CLIMATE } from '../../../constants/mapping'
import COLORS from '../../../constants/styles'
import i18n from '../../../locales'

export const sample = {
    title: i18n.t('Malaria'),
    statisticCard: {
        title: i18n.t('Number of adjusted malaria cases, according to forecasts'),
        value: '',
        comparison: 0,
        description: '',
        icon: (props) => <MosquitoIcon {...props} />,
    },
    climate: [
        {
            title: CLIMATE.precipitation.displayName,
            value: '',
            id: CLIMATE.precipitation.id,
            comparison: 0,
            description: '',
            icon: (props) => <PrecipitationIcon {...props} />,
        },
        {
            title: CLIMATE.temperature.displayName,
            value: '',
            id: CLIMATE.temperature.id,
            comparison: 0,
            description: '',
            icon: (props) => <TemperatureHotIcon {...props} />,
        },
        {
            title: CLIMATE.vegetationIndex.displayName,
            value: '',
            id: CLIMATE.vegetationIndex.id,
            comparison: 0,
            description: '',
            icon: (props) => <VegetationIcon {...props} />,
        },
        {
            title: CLIMATE.waterSurfaceIndex.displayName,
            value: '',
            id: CLIMATE.waterSurfaceIndex.id,
            comparison: 0,
            description: '',
            icon: (props) => <SurfaceWaterIcon {...props} />,
        },
        {
            title: CLIMATE.atmHumidity.displayName,
            value: '',
            id: CLIMATE.atmHumidity.id,
            comparison: 0,
            description: '',
            icon: (props) => <HumidityIcon {...props} />,
        },
        {
            title: CLIMATE.bushfireArea.displayName,
            value: '',
            id: CLIMATE.bushfireArea.id,
            comparison: 0,
            description: '',
            icon: (props) => <FireIcon {...props} />,
        },
        {
            title: CLIMATE.vegetativeWaterIndex.displayName,
            value: '',
            id: CLIMATE.vegetativeWaterIndex.id,
            comparison: 0,
            description: '',
            icon: (props) => <VegetativeWaterIcon {...props} />,
        },
        {
            title: CLIMATE.aodAtmLevel.displayName,
            value: '',
            id: CLIMATE.aodAtmLevel.id,
            comparison: 0,
            description: '',
            icon: (props) => <BrightnessIcon {...props} />,
        },
        {
            title: CLIMATE.floodedRiceFields.displayName,
            value: '',
            id: CLIMATE.floodedRiceFields.id,
            comparison: 0,
            description: '',
            icon: (props) => <FloodIcon {...props} />,
        },
        {
            title: CLIMATE.windSpeed.displayName,
            value: '',
            id: CLIMATE.windSpeed.id,
            comparison: 0,
            description: '',
            icon: (props) => <WindIcon {...props} />,
        },
    ],
    healthMetrics: [
        { label: i18n.t('Incidence'), value: 'adjusted', disabled: false },
        { label: i18n.t('Community cases'), value: 'comCases', disabled: false },
        { label: i18n.t('CSB cases'), value: 'csbCases', disabled: false }
    ],
    ageClasses: [
        { label: i18n.t('Under 5 years'), value: 'under-5', disabled: false },
        { label: i18n.t('Over 5 years'), value: 'plus-5', disabled: true },
    ],
    adminLevel: [
        { label: i18n.t('District'), value: 'district', level: 3, disabled: false },
        { label: i18n.t('Municipal'), value: 'municipal', level: 4, disabled: false },
        { label: i18n.t('Health facility'), value: 'csb', level: 5, disabled: false },
        { label: i18n.t('Fokontany'), value: 'fokontany', level: 6, disabled: false },
    ],
    visualizationType: [
        { label: i18n.t('Map'), value: 'map', disabled: true },
        { label: i18n.t('Series'), value: 'line', disabled: false },
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
    helpTexts: {
        helpText_1 : `
            Utilisez ces boutons et le menu déroulant pour sélectionner les indicateurs, 
            l'agregation spatiale et l'unité organisationelle qui vous intéressent. 
        `,
        helpText_2: `
            L'indicateur que vous avez sélectionné est affiché dans ces visualisations.
            <br />
            <br />
            La carte de gauche affiche l'indicateur prédit pour les trois mois à venir. Vous pouvez 
            passer d'un mois à l'autre à l'aide de la barre de défilement située en bas. Vous pouvez 
            choisir une nouvelle unité organisationnelle en cliquant sur son polygon sur la carte.
            <br />
            <br />
            Le graphique montre une série temporelle de l'indicateur pour l’unité organisationnelle 
            sélectionnée. Les données historiques sont représentées par la ligne continue et la période 
            de prévision correspond aux trois mois à venir, avec un intervalle de prédiction de 95%. 
            Un intervalle de prédiction représente la plage de valeurs dans laquelle nous sommes à 95 % 
            de la valeur réelle.
        `,
        helpText_3 :`
            Vous pouvez utiliser ce tableau pour explorer et télécharger les prévisions du modèle PRIDE-C 
            pour les trois mois prochains pour l’unité organisationnelle sélectionnée. Les estimations 
            minimales et maximales correspondent à l'intervalle de prévision de 95 %, dans lequel nous sommes 
            sûrs à 95 % de notre prévision. Les données peuvent être téléchargées sous forme de fichier PDF ou Excel.
        `,
        helpText_4: `
            Utilisez cette page pour explorer les données climatiques et environnementales et comparer la 
            dynamique historique des maladies avec les variables climatiques. Le nombre de cas correspond 
            au taux d’incidence des cas symptomatiques des enfants moins de cinq ans transformé en cas par 
            l’unité organisationnelle. Vous pouvez choisir jusqu'à deux variables à l'aide du menu 
            déroulant à gauche.
        `
    }
}