import { useSelector } from 'react-redux'
import { createHistoricData } from '@/utils/diseaseDataFactories'

export const getIraHistoric = (IRA) => createHistoricData(IRA)

export const useIraHistoric = () => {
    const IRA = useSelector((state) => state.dataElements.ira)
    return getIraHistoric(IRA)
}

export default useIraHistoric