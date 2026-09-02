import { useSelector } from 'react-redux'
import { createIndicatorData } from '@/utils/diseaseDataFactories'

export const getMalariaIndicator = (MALARIA) => createIndicatorData(MALARIA)

export const useMalariaIndicator = () => {
    const MALARIA = useSelector((state) => state.dataElements.malaria)
    return getMalariaIndicator(MALARIA)
}

export default useMalariaIndicator