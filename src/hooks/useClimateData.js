import { useMemo } from 'react'
import { useSelector } from 'react-redux'

export const useClimateData = (storePath, diseaseName) => {
    const climateState = useSelector((state) => state.climate)

    const diseaseState = useSelector((state) => state[diseaseName].historic.adjusted)

    const diseaseHistoric = useMemo(() => {
        if (storePath && diseaseState) {
            const { adminLevel, orgUnit } = storePath
            return (
                diseaseState?.[adminLevel]?.[orgUnit] || []
            )
        } 
        return []
    }, [storePath, diseaseState])


    const getClimateDataByType = useMemo(() => {
        if (!storePath || !climateState) {
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
    }, [storePath, climateState])

    return {
        diseaseHistoric,
        ...getClimateDataByType,
    }
}
