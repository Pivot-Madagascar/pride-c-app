import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import COLORS from '../../constants/styles'
import useDiarrheaData from '../diarrhea/DataGenerator'
import useIraData from '../ira/DataGenerator'
import useMalariaData from '../malaria/DataGenerator'

const getStoredValue = ({ indicators, indicatorType, source, orgUnit }) => {
    if (Array.isArray(indicators)) {
        const indicator = indicators.filter(
            (item) =>
                item.indicatorType === indicatorType &&
                item.source === source &&
                item.storedValue !== undefined
        )
        return indicator.length > 0
            ? indicator[0].storedValue[orgUnit][0]
            : undefined
    }
}

const isStoredValueValid = (indicators) => {
    return indicators.every((indicator) => indicator.storedValue !== undefined)
}

const useDashboardData = () => {
    const district = useSelector((state) => state.orgUnit.district)
    const activeOrgUnit = district[0].id // TODO: need to set activeOrgUnit dynamically later

    const alertKeys = ['incidence', 'csb', 'comCases', 'csbVigilance']

    const { malariaIndicators } = useMalariaData()
    const { iraIndicators } = useIraData()
    const { diarrheaIndicators } = useDiarrheaData()

    const [data, setData] = useState({
        malaria: {},
        ira: {},
        diarrhea: {},
    })

    const [loaded, setLoaded] = useState(false)

    const updateData = (type, newData) => {
        setData((prevData) => ({
            ...prevData,
            [type]: {
                ...prevData[type],
                ...newData,
            },
        }))
    }

    const fetchData = (indicators, type) => {
        const validData = isStoredValueValid(indicators)
        if (validData) {
            alertKeys.forEach((key) => {
                const storedValue = getStoredValue({
                    indicators,
                    indicatorType: 'alert',
                    source: key,
                    orgUnit: activeOrgUnit,
                })
                if (
                    storedValue !== undefined &&
                    data[type][key] !== storedValue.value
                ) {
                    updateData(type, {
                        [key]: storedValue.value,
                    })
                }
            })
        }
    }

    useEffect(() => {
        fetchData(malariaIndicators, 'malaria')
    }, [malariaIndicators, activeOrgUnit])

    useEffect(() => {
        fetchData(iraIndicators, 'ira')
    }, [iraIndicators, activeOrgUnit])

    useEffect(() => {
        fetchData(diarrheaIndicators, 'diarrhea')
    }, [diarrheaIndicators, activeOrgUnit])

    const dashboardMetrics = [
        {
            title: 'Paludisme',
            indicators: [
                {
                    name: 'incidence',
                    label: 'Incidence (par 100 000)',
                    value: data.malaria.incidence,
                },
                {
                    name: 'csbCases',
                    label: 'Cas aux CSB',
                    value: data.malaria.csb,
                },
                {
                    name: 'comCases',
                    label: 'Cas communautaires',
                    value: data.malaria.comCases,
                },
                {
                    name: 'csbVigilance',
                    label: 'CSB en vigilance accrue',
                    value: data.malaria.csbVigilance,
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
                    value: data.diarrhea.incidence,
                },
                {
                    name: 'csbCases',
                    label: 'Cas aux CSB',
                    value: data.diarrhea.csb,
                },
                {
                    name: 'comCases',
                    label: 'Cas communautaires',
                    value: data.diarrhea.comCases,
                },
                {
                    name: 'csbVigilance',
                    label: 'CSB en vigilance accrue',
                    value: data.diarrhea.csbVigilance,
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
                    value: data.ira.incidence,
                },
                {
                    name: 'csbCases',
                    label: 'Cas aux CSB',
                    value: data.ira.csb,
                },
                {
                    name: 'comCases',
                    label: 'Cas communautaires',
                    value: data.ira.comCases,
                },
                {
                    name: 'csbVigilance',
                    label: 'CSB en vigilance accrue',
                    value: data.ira.csbVigilance,
                },
            ],
            bgColor: COLORS.blue,
            fontSize: 2,
            href: 'ira-trend',
        },
    ]

    const checkDashboardMetrics = (metrics) => {
        if (Array.isArray(metrics)) {
            return metrics.every((metric) => {
                return metric.indicators.every(
                    (indicator) => indicator.value !== undefined
                )
            })
        }
        return false
    }

    useEffect(() => {
        const isLoaded = checkDashboardMetrics(dashboardMetrics)
        if (isLoaded) {
            if (!loaded) {
                setLoaded(isLoaded)
            }
        }
    }, [dashboardMetrics, loaded])

    const helpText = 
    `
        Cette page affiche quatre indicateurs d’alerte pour chaque maladie, \
        tout basés sur des prévisions des modèles statistiques : 
        <br />

        <ul>
            <li>
                <b>Incidence:</b> Le taux d’incidence représente le total de cas symptomatiques attendus \
                dans le district au cours des trois prochains mois, selon les modèles statistiques. \
                Ce nombre inclut également les cas symptomatiques qui ne sont pas traités par le \
                système de santé. Il est représenté par le nombre de cas pour 100 000 habitants. 
            </li>
            <li>
                <b>Cas aux CSB:</b> Le nombre de cas aux CSB représente le total de cas symptomatiques qui, \
                selon nos prévisions, sont prédit d’être traités dans un CSB au cours des trois prochains mois. \
                Ce chiffre correspond au total de tous les CSB du district, tous âges inclus.\
            </li>
            <li>
                <b>Cas communautaires:</b> Le nombre de cas prévus dans les centres de santé communautaires au cours \
                des trois prochains mois, selon nos prévisions. Ce nombre correspond au total de tous les sites \
                communautaires pour lesquels des données sont rapportées au niveau du fokontany (actuellement 88).\
            </li>
            <li>
                <b>CSB en vigilance accrue:</b> Le nombre de CSB qui prévoient recevoir plus de cas de maladie au cours \
                des trois prochains mois qu'au cours de la même période l'année précédente. Un nombre élevé de CSB en \
                vigilance peut représenter un risque de rupture de stock ou des recrudescences anormales.
            </li>
        </ul>
    `
    return {
        dashboardMetrics,
        loaded,
        helpText
    }
}

export default useDashboardData
