import { useMemo } from 'react'
import { replaceFirstNullWithRankValue } from '@/utils/dataProcessing'

const useHistoricData = ({ historic, forecast, simulation, forecastLimits }) => {
  return useMemo(() => {
    if (!historic || !forecast || !simulation || !forecastLimits) {
      return null
    }
    const newForecastLimits = replaceFirstNullWithRankValue(forecastLimits, simulation)
    return { ...historic, ...simulation, ...newForecastLimits }
  }, [historic, forecast, simulation, forecastLimits])
}

export default useHistoricData