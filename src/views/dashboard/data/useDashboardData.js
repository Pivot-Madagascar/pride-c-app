import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import COLORS from '../../../constants/styles'
import { getElementFromStore } from '../../../utils/storeHelper'
import i18n from '../../../locales'

const useDashboardElements = () => {
    const parentId = 'VtP4BdCeXIo'
    const parentLvl = 'woudZdDWAgs'

    const malariaState = useSelector((state) => state.malaria)
    const iraState = useSelector((state) => state.ira)
    const diarrheaState = useSelector((state) => state.diarrhea)

    const dashboardMetrics = useMemo(
        () => [
            {
                title: i18n.t('Malaria'),
                indicators: [
                    {
                        name: 'incidence',
                        label: i18n.t('Incidence (per 100,000)'),
                        value: malariaState?.['alert']?.['incidence']?.[parentLvl]?.[parentId]?.[0]?.value || 0
                    },
                    {
                        name: 'csbCases',
                        label: i18n.t('CSB cases'),
                        value: malariaState?.['alert']?.['csb']?.[parentLvl]?.[parentId]?.[0]?.value || 0
                    },
                    {
                        name: 'comCases',
                        label: i18n.t('Community cases'),
                        value: malariaState?.['alert']?.['comCases']?.[parentLvl]?.[parentId]?.[0]?.value || 0
                    },
                    {
                        name: 'csbVigilance',
                        label: i18n.t('CSB on heightened vigilance'),
                        value: malariaState?.['alert']?.['csbVigilance']?.[parentLvl]?.[parentId]?.[0]?.value || 0
                    },
                ],
                bgColor: COLORS.red,
                fontSize: 2,
                href: 'malaria-trend',
            },
            {
                title: i18n.t('Diarrheal diseases'),
                indicators: [
                    {
                        name: 'incidence',
                        label: i18n.t('Incidence (per 100,000)'),
                        value:
                            getElementFromStore(diarrheaState, [
                                'alert',
                                'incidence',
                                parentLvl,
                                parentId,
                            ])?.[0]?.value || 0,
                    },
                    {
                        name: 'csbCases',
                        label: i18n.t('CSB cases'),
                        value:
                            getElementFromStore(diarrheaState, [
                                'alert',
                                'csb',
                                parentLvl,
                                parentId,
                            ])?.[0]?.value || 0,
                    },
                    {
                        name: 'comCases',
                        label: i18n.t('Community cases'),
                        value:
                            getElementFromStore(diarrheaState, [
                                'alert',
                                'comCases',
                                parentLvl,
                                parentId,
                            ])?.[0]?.value || 0,
                    },
                    {
                        name: 'csbVigilance',
                        label: i18n.t('CSB on heightened vigilance'),
                        value:
                            getElementFromStore(diarrheaState, [
                                'alert',
                                'csbVigilance',
                                parentLvl,
                                parentId,
                            ])?.[0]?.value || 0,
                    },
                ],
                bgColor: COLORS.green,
                fontSize: 1.5,
                href: 'diarrhea-trend',
            },
            {
                title: i18n.t('IRA'),
                indicators: [
                    {
                        name: 'incidence',
                        label: i18n.t('Incidence (per 100,000)'),
                        value:
                            getElementFromStore(iraState, [
                                'alert',
                                'incidence',
                                parentLvl,
                                parentId,
                            ])?.[0]?.value || 0,
                    },
                    {
                        name: 'csbCases',
                        label: i18n.t('CSB cases'),
                        value:
                            getElementFromStore(iraState, [
                                'alert',
                                'csb',
                                parentLvl,
                                parentId,
                            ])?.[0]?.value || 0,
                    },
                    {
                        name: 'comCases',
                        label: i18n.t('Community cases'),
                        value:
                            getElementFromStore(iraState, [
                                'alert',
                                'comCases',
                                parentLvl,
                                parentId,
                            ])?.[0]?.value || 0,
                    },
                    {
                        name: 'csbVigilance',
                        label: i18n.t('CSB on heightened vigilance'),
                        value:
                            getElementFromStore(iraState, [
                                'alert',
                                'csbVigilance',
                                parentLvl,
                                parentId,
                            ])?.[0]?.value || 0,
                    },
                ],
                bgColor: COLORS.blue,
                fontSize: 2,
                href: 'ira-trend',
            },
        ],
        [malariaState, iraState, diarrheaState]
    ) 

    const helpText = `
        Cette page affiche quatre indicateurs pour chacune des trois maladies au niveau du district d'Ifanadiana, Vatovavy, \
        tout basés sur des prévisions des modèles statistiques : 
        <br />
        <ul>
            <li><b>Incidence:</b>  Le taux d’incidence représente le nombre de nouveaux cas symptomatiques par \
                100,000 habitants. Ces données viennent des registres de CSBs qui sont digitalisés et localisés au \
                niveau de fokontany et corrigés pour les barrières géographiques.
 
            </li>
            <br />
            <li><b>Cas aux CSB:</b> Le nombre de nouveaux cas prévus dans les CSB d’Ifanadiana. \
                Ces données viennent du système de santé numérique du Ministère de la Santé Publique de Madagascar. \
                Ce chiffre correspond au total de tous les CSB du district.\
            </li>
            <br />
            <li><b>Cas communautaires:</b>  Le nombre de nouveaux cas prévus dans les sites communautaires d’Ifanadiana.\
                 Ces données viennent du système numérique de données communautaires de Pivot qui est collecté grâce à \
                 l’application commCare dans 80 fokontany dans le District. Ce nombre correspond au total de tous les sites \
                communautaires pour lesquels des données sont rapportées au niveau du fokontany (actuellement 88).\
            </li>
            <br />
            <li><b>CSB en vigilance accrue:</b> Le nombre de CSB qui sont prévus de prendre en charge plus de cas que \
                la moyenne historique pour la même période de l'année. La moyenne historique est basée sur les données \
                des trois années précédentes. Un nombre élevé de CSB en vigilance peut représenter un risque de \
                rupture de stock ou des recrudescences anormales.
            </li>
        </ul>
        <br />
        <b>Note :</b>
        Le mémoire cache est automatiquement géré par l'application pour optimiser les performances. 
        Cependant, si vous rencontrez des problèmes d'affichage ou de données obsolètes, vous pouvez effacer le cache en cliquant ce bouton.
        <br />
        <br />
    `

    return { dashboardMetrics, helpText }
}

export default useDashboardElements
