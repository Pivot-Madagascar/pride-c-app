import { useMemo } from 'react'
import { addOrgUnitNameToFeatures, groupByPeriod } from '../utils/formatting'

export const useGeoData = (data, periodId, features, adminLvl) => {
    return useMemo(() => {
        if (data && features) {
            const newFeatures = addOrgUnitNameToFeatures(
                features,
                groupByPeriod(data)[periodId],
                adminLvl
            )
            return {
                type: 'FeatureCollection',
                features: newFeatures,
            }
        }
        return null
    }, [data, periodId, features, adminLvl])
}
