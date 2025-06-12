import { useMemo } from 'react'
import { addOrgUnitNameToFeatures, groupByPeriod } from '../utils/formatting'

export const useGeoData = (data, periodId, features) => {
    return useMemo(() => {
        if (data && features) {
            const newFeatures = addOrgUnitNameToFeatures(
                features,
                groupByPeriod(data)[periodId]
            )
            return {
                type: 'FeatureCollection',
                features: newFeatures,
            }
        }
        return null
    }, [data, periodId, features])
}
