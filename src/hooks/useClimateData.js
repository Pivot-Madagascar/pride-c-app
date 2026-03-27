import { useMemo } from 'react'
import { useDiseaseClimate } from '@/contexts/DiseaseClimateContext'

export const useClimateData = (storePath) => {
    const { diseaseState, climateState, isObjectValid } = useDiseaseClimate()

    const diseaseHistoric = useMemo(() => {
        if (storePath && diseaseState) {
            const { adminLevel, orgUnit } = storePath
            return (
                diseaseState?.['simulation']?.['historic']?.[adminLevel]?.[
                    orgUnit
                ] || []
            )
        }
        return []
    }, [storePath, diseaseState])

    const getClimateDataByType = useMemo(() => {
        if (
            !storePath ||
            !isObjectValid(storePath) ||
            !isObjectValid(climateState)
        ) {
            return {}
        }

        const { adminLevel, orgUnit } = storePath
        const climateTypes = [
            'precipitation',
            'temperature',
            'vegetationIndex',
            'waterSurfaceIndex',
            'bushfireArea',
            'vegetativeWaterIndex',
            'aodAtmLevel',
            'floodedRiceFields',
            'windSpeed',
        ]

        return climateTypes.reduce((acc, type) => {
            acc[type] = climateState?.[type]?.[adminLevel]?.[orgUnit] || []
            return acc
        }, {})
    }, [storePath, climateState, isObjectValid])

    return {
        diseaseHistoric,
        ...getClimateDataByType,
    }
}
