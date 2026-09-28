import { useSelector } from 'react-redux'
import { useClimateHistoric } from '@/components/ClimateDisplay/data/historic'

import {
    useMalariaForecast,
    useMalariaHistoric,
    useMalariaIndicator,
    useMalariaSimulation,
} from '@/views/malaria/data/index'

import {
    useIraForecast,
    useIraHistoric,
    useIraIndicator,
    useIraSimulation,
} from '@/views/ira/data/index'

import {
    useDiarrheaForecast,
    useDiarrheaHistoric,
    useDiarrheaIndicator,
    useDiarrheaSimulation,
} from '@/views/diarrhea/data/index'

import { setClimateData } from '@/redux/climateSlice'
import { setData as setDiarrheaData } from '@/redux/diarrheaSlice'
import { setData as setIraData } from '@/redux/iraSlice'
import { setData as setMalariaData } from '@/redux/malariaSlice'

const useDashboardIndicators = () => {
    const malariaIndicatorsResult = useMalariaIndicator()
    const malariaForecastResult = useMalariaForecast()
    const malariaHistoricResult = useMalariaHistoric()
    const malariaSimulationResult = useMalariaSimulation()

    const malariaForecastElements = malariaForecastResult?.forecastElements || []
    const malariaHistoricElements = malariaHistoricResult?.historicElements || []
    const malariaSimulationElements = malariaSimulationResult?.simulationElements || []
    const malariaIndicators = malariaIndicatorsResult?.indicatorElements || []

    const iraIndicatorsResult = useIraIndicator()
    const iraForecastResult = useIraForecast()
    const iraHistoricResult = useIraHistoric()
    const iraSimulationResult = useIraSimulation()

    const iraForecastElements = iraForecastResult?.forecastElements || []
    const iraHistoricElements = iraHistoricResult?.historicElements || []
    const iraSimulationElements = iraSimulationResult?.simulationElements || []
    const iraIndicators = iraIndicatorsResult?.indicatorElements || []

    const diarrheaIndicatorsResult = useDiarrheaIndicator()
    const diarrheaForecastResult = useDiarrheaForecast()
    const diarrheaHistoricResult = useDiarrheaHistoric()
    const diarrheaSimulationResult = useDiarrheaSimulation()

    const diarrheaIndicators = diarrheaIndicatorsResult?.indicatorElements || []
    const diarrheaForecastElements = diarrheaForecastResult?.forecastElements || []
    const diarrheaHistoricElements = diarrheaHistoricResult?.historicElements || []
    const diarrheaSimulationElements = diarrheaSimulationResult?.simulationElements || []

    const climateResult = useClimateHistoric()

    const climateElements = climateResult?.climateElements || []

    const indicators = [
        {
            dataElements: malariaIndicators,
            reduxAction: setMalariaData,
            store: useSelector((state) => state.malaria),
        },
        {
            dataElements: diarrheaIndicators,
            reduxAction: setDiarrheaData,
            store: useSelector((state) => state.diarrhea),
        },
        {
            dataElements: iraIndicators,
            reduxAction: setIraData,
            store: useSelector((state) => state.ira),
        },
        {
            dataElements: [
                ...malariaForecastElements,
                ...malariaHistoricElements,
                ...malariaSimulationElements,
            ],
            reduxAction: setMalariaData,
            store: useSelector((state) => state.malaria),
        },
        {
            dataElements: [
                ...iraForecastElements,
                ...iraHistoricElements,
                ...iraSimulationElements,
            ],
            reduxAction: setIraData,
            store: useSelector((state) => state.ira),
        },
        {
            dataElements: [
                ...diarrheaForecastElements,
                ...diarrheaHistoricElements,
                ...diarrheaSimulationElements,
            ],
            reduxAction: setDiarrheaData,
            store: useSelector((state) => state.diarrhea),
        },
        {
            dataElements: climateElements,
            reduxAction: setClimateData,
            store: useSelector((state) => state.climate),
        },
    ]

    return { indicators }
}

export default useDashboardIndicators
