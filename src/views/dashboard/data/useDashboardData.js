import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import COLORS from '../../../constants/styles'
import { getElementFromStore } from '../../../utils/storeHelper'

const useDashboardElements = () => {
    const parentId = 'VtP4BdCeXIo'
    const parentLvl = 'woudZdDWAgs'

    const malariaState = useSelector((state) => state.malaria)
    const iraState = useSelector((state) => state.ira)
    const diarrheaState = useSelector((state) => state.diarrhea)

    const dashboardMetrics = useMemo(
        () => [
            {
                title: 'Paludisme',
                indicators: [
                    {
                        name: 'incidence',
                        label: 'Incidence (par 100 000)',
                        value: malariaState?.['alert']?.['incidence']?.[parentLvl]?.[parentId]?.[0]?.value || 0
                    },
                    {
                        name: 'csbCases',
                        label: 'Cas aux CSB',
                        value: malariaState?.['alert']?.['csb']?.[parentLvl]?.[parentId]?.[0]?.value || 0
                    },
                    {
                        name: 'comCases',
                        label: 'Cas communautaires',
                        value: malariaState?.['alert']?.['comCases']?.[parentLvl]?.[parentId]?.[0]?.value || 0
                    },
                    {
                        name: 'csbVigilance',
                        label: 'CSB en vigilance accrue',
                        value: malariaState?.['alert']?.['csbVigilance']?.[parentLvl]?.[parentId]?.[0]?.value || 0
                    },
                ],
                bgColor: COLORS.red,
                fontSize: 2,
                href: 'malaria-trend',
            },
            {
                title: 'Maladies diarrheiques',
                indicators: [
                    {
                        name: 'incidence',
                        label: 'Incidence (par 100 000)',
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
                        label: 'Cas aux CSB',
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
                        label: 'Cas communautaires',
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
                        label: 'CSB en vigilance accrue',
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
                title: 'IRA',
                indicators: [
                    {
                        name: 'incidence',
                        label: 'Incidence (par 100 000)',
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
                        label: 'Cas aux CSB',
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
                        label: 'Cas communautaires',
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
                        label: 'CSB en vigilance accrue',
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
        Cette page affiche quatre indicateurs d’alerte pour chaque maladie, \
        tout basés sur des prévisions des modèles statistiques : 
        <br />
        <ul>
            <li><b>Incidence:</b> Le taux d’incidence représente le total de cas symptomatiques attendus \
                dans le district au cours des trois prochains mois, selon les modèles statistiques. \
                Ce nombre inclut également les cas symptomatiques qui ne sont pas traités par le \
                système de santé. Il est représenté par le nombre de cas pour 100 000 habitants. 
            </li>
            <li><b>Cas aux CSB:</b> Le nombre de cas aux CSB représente le total de cas symptomatiques qui, \
                selon nos prévisions, sont prédit d’être traités dans un CSB au cours des trois prochains mois. \
                Ce chiffre correspond au total de tous les CSB du district, tous âges inclus.\
            </li>
            <li><b>Cas communautaires:</b> Le nombre de cas prévus dans les centres de santé communautaires au cours \
                des trois prochains mois, selon nos prévisions. Ce nombre correspond au total de tous les sites \
                communautaires pour lesquels des données sont rapportées au niveau du fokontany (actuellement 88).\
            </li>
            <li><b>CSB en vigilance accrue:</b> Le nombre de CSB qui prévoient recevoir plus de cas de maladie au cours \
                des trois prochains mois qu'au cours de la même période l'année précédente. Un nombre élevé de CSB en \
                vigilance peut représenter un risque de rupture de stock ou des recrudescences anormales.
            </li>
        </ul>
    `

    return { dashboardMetrics, helpText }
}

export default useDashboardElements
