import { useMemo } from 'react'

export const useMinMaxValues = (geoData) => {
    return useMemo(() => {
        if (geoData) {
            const values = geoData.features
                .map((feature) => feature.properties.value)
                .filter((value) => typeof value === 'number' && !Number.isNaN(value))

            const min = Math.min(...values)
            const max = Math.max(...values)

            if (Number.isNaN(min) || Number.isNaN(max)) {
                return [0, 0]
            }

            return [min, max]
        }
        return [0, 0]
    }, [geoData])
}
