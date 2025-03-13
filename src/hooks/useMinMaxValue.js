import { useMemo } from 'react'

export const useMinMaxValues = (geoData) => {
    return useMemo(() => {
        if (geoData) {
            const values = geoData.features
                .filter((feature) => feature.properties.value !== undefined)
                .map((feature) => feature.properties.value)
            return [Math.min(...values), Math.max(...values)]
        }
        return [0, 0]
    }, [geoData])
}
