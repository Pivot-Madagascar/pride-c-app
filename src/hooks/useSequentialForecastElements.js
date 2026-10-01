import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { getElementFromStore } from '@/utils/storeHelper'

const useSequentialForecastElements = (dataElements = [], store = []) => {
    const adminLevels = useSelector((state) => state.orgUnit.orgUnitLevels)
    const grouped = useMemo(() => {
        const updatedElements = dataElements.flatMap((element) => {
            return adminLevels.map((adminLevel) => {
                const newPath = [...element.path, adminLevel.id]
                return {
                    ...element,
                    path: newPath,
                    adminLevel: adminLevel.id,
                    storedValue: getElementFromStore(store, newPath),
                }
            })
        })

        const grouped = updatedElements.reduce((acc, item) => {
            const key = `${item.adminLevel}-${JSON.stringify(item.periods)}`
            if (!acc[key]) {
                acc[key] = {
                    adminLevel: item.adminLevel,
                    periods: item.periods,
                    dataElements: [],
                }
            }
            acc[key].dataElements.push(item)
            return acc
        }, {})

        return Object.values(grouped)
    }, [dataElements, adminLevels])

    return grouped
}

export default useSequentialForecastElements
