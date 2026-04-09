import React from 'react'
import BrightnessIcon from '@/components/Icons/Brightness'
import FireIcon from '@/components/Icons/Fire'
import FloodIcon from '@/components/Icons/Flood'
import HumidityIcon from '@/components/Icons/Humidity'
import LungVirusIcon from '@/components/Icons/LungsVirus'
import PrecipitationIcon from '@/components/Icons/Precipitation'
import SurfaceWaterIcon from '@/components/Icons/SurfaceWater'
import TemperatureHotIcon from '@/components/Icons/TemperatureHot'
import VegetationIcon from '@/components/Icons/Vegetation'
import VegetativeWaterIcon from '@/components/Icons/VegetativeWater'
import WindIcon from '@/components/Icons/Wind'
import { CLIMATE } from '@/constants/mapping'
import COLORS from '@/constants/styles'

export const sample = {
    title: 'Infections Respiratoires Aiguës',
    statisticCard: {
        title: 'Nombre de cas ajustés de IRA, selon les prévisions',
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
        { label: 'Incidence', value: 'adjusted', disabled: false, metaLabel: 'Incidence (pour 100K)' },
        { label: 'Cas communautaire', value: 'comCases', disabled: false, metaLabel: 'Cas communautaire' },
        { label: 'Cas aux CSB', value: 'csbCases', disabled: false, metaLabel: 'Cas aux CSB' }
    ],
    ageClasses: [
        { label: '- 5 ans', value: 'under-5', disabled: false },
        { label: '+ 5 ans', value: 'plus-5', disabled: true },
    ],
    adminLevel: [
        { label: 'District', value: 'district', level: 3, disabled: false },
        { label: 'Commune', value: 'municipal', level: 4, disabled: false },
        { label: 'Formation sanitaire', value: 'csb', level: 5, disabled: false },
        { label: 'Fokontany', value: 'fokontany', level: 6, disabled: false },
    ],
    visualizationType: [
        { label: 'Carte', value: 'map', disabled: true },
        { label: 'Series', value: 'line', disabled: false },
    ],
    currentThemeColor: COLORS.blue_lighter,
    darkerCurrentColors: {bgColor: COLORS.blue, textColor: 'white'},
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