import { useState, useEffect } from 'react'
import { useDiseaseConfig } from '@/contexts/DiseaseContext'

export const useDiseaseTrend = () => {
    const config = useDiseaseConfig()
    const [allDataFetched, setAllDataFetched] = useState(false)
    const [counter, setCounter] = useState(0)

    const { getHistoric, getForecast, getSimulation, reduxAction } = config

    const { historicElements } = getHistoric()
    const { forecastElements } = getForecast()
    const { simulationElements } = getSimulation()

    const elements = [
        { dataElements: historicElements, reduxAction },
        { dataElements: forecastElements, reduxAction },
        { dataElements: simulationElements, reduxAction },
    ]

    useEffect(() => {
        const timer = setTimeout(() => {
            setAllDataFetched(elements.length === counter)
        }, 500)
        return () => clearTimeout(timer)
    }, [counter, elements.length])

    const handleDataFetched = () => setCounter((prev) => prev + 1)

    return {
        elements,
        allDataFetched,
        handleDataFetched,
    }
}
