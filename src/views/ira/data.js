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
import { CLIMATE } from '../../constants/mapping'
import COLORS from '../../constants/styles'

export const sample = {
    title: 'Infections Respiratoires Aiguës',
    statisticCard: {
        title: 'Nombre de cas de IRA',
        value: '',
        percentage: 0,
        description: '',
        icon: (props) => <LungVirusIcon {...props} />,
    },
    climate: [
        {
            title: CLIMATE.precipitation.displayName,
            value: '',
            id: CLIMATE.precipitation.id,
            percentage: 0,
            description: '',
            icon: (props) => <PrecipitationIcon {...props} />,
        },
        {
            title: CLIMATE.temperature.displayName,
            value: '',
            id: CLIMATE.temperature.id,
            percentage: 0,
            description: '',
            icon: (props) => <TemperatureHotIcon {...props} />,
        },
        {
            title: CLIMATE.vegetationIndex.displayName,
            value: '',
            id: CLIMATE.vegetationIndex.id,
            percentage: 0,
            description: '',
            icon: (props) => <VegetationIcon {...props} />,
        },
        {
            title: CLIMATE.waterSurfaceIndex.displayName,
            value: '',
            id: CLIMATE.waterSurfaceIndex.id,
            percentage: 0,
            description: '',
            icon: (props) => <SurfaceWaterIcon {...props} />,
        },
        {
            title: CLIMATE.atmHumidity.displayName,
            value: '',
            id: CLIMATE.atmHumidity.id,
            percentage: 0,
            description: '',
            icon: (props) => <HumidityIcon {...props} />,
        },
        {
            title: CLIMATE.bushfireArea.displayName,
            value: '',
            id: CLIMATE.bushfireArea.id,
            percentage: 0,
            description: '',
            icon: (props) => <FireIcon {...props} />,
        },
        {
            title: CLIMATE.vegetativeWaterIndex.displayName,
            value: '',
            id: CLIMATE.vegetativeWaterIndex.id,
            percentage: 0,
            description: '',
            icon: (props) => <VegetativeWaterIcon {...props} />,
        },
        {
            title: CLIMATE.aodAtmLevel.displayName,
            value: '',
            id: CLIMATE.aodAtmLevel.id,
            percentage: 0,
            description: '',
            icon: (props) => <BrightnessIcon {...props} />,
        },
        {
            title: CLIMATE.floodedRiceFields.displayName,
            value: '',
            id: CLIMATE.floodedRiceFields.id,
            percentage: 0,
            description: '',
            icon: (props) => <FloodIcon {...props} />,
        },
        {
            title: CLIMATE.windSpeed.displayName,
            value: '',
            id: CLIMATE.windSpeed.id,
            percentage: 0,
            description: '',
            icon: (props) => <WindIcon {...props} />,
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
        { label: 'District', value: 'district', disabled: false },
        { label: 'Commune', value: 'municipal', disabled: false },
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
    helpTexts: {
        helpText_1 : `
            Utilisez ces boutons et le menu déroulant pour sélectionner les indicateurs, 
            les classes d'âge et les zones administratives qui vous intéressent. Le taux d'incidence est affiché 
            comme le nombre de cas pour 10 000 personnes. Seul le paludisme aura des données pour la classe d'âge 
            des plus de 5 ans.
        `,
        helpText_2: `
            L'indicateur que vous avez sélectionné est affiché dans ces visualisations.
            <br />
            <br />
            La carte de gauche affiche l'indicateur prédit par le fokontany pour les trois mois à venir. 
            Vous pouvez passer d'un mois à l'autre à l'aide de la barre de défilement située en bas.
            <br />
            <br />
            Le graphique montre une série temporel de l'indicateur pour la zone administrative choisie. 
            Les données historiques sont représentées par la ligne continue et la période de prévision 
            correspond aux trois mois à venir, avec un intervalle de confiance entourant les prévisions.
        `,
        helpText_3 :`
            Vous pouvez utiliser ce tableau pour explorer et télécharger les prévisions du modèle PRIDE-C pour les 
            trois mois prochains par fokontany. Les estimations minimales et maximales correspondent à l'intervalle 
            de prévision de 95 %, dans lequel nous sommes sûrs à 95 % de notre prévision. Utilisez les boutons 
            à gauche pour choisir les colonnes à afficher, lesquelles des trois prochains mois (périodes) à afficher 
            et pour télécharger les données sous forme de fichier PDF ou Excel.
        `,
        helpText_4: `
            Utilisez cette page pour explorer les données climatiques et environnementales et comparer la dynamique 
            historique des maladies avec les variables climatiques. Vous pouvez choisir jusqu'à deux variables 
            à l'aide du menu déroulant à gauche.
        `
    }
}