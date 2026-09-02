import { useSelector } from 'react-redux'
import { createIndicatorData } from '@/utils/diseaseDataFactories'

export const getIraIndicator = (IRA) => createIndicatorData(IRA)

export const useIraIndicator = () => {
    const IRA = useSelector((state) => state.dataElements.ira)
    return getIraIndicator(IRA)
}

export default useIraIndicator