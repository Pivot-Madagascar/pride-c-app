import { useSelector } from 'react-redux'
import { createHistoricData } from '@/utils/diseaseDataFactories'

export const getMalariaHistoric = (MALARIA) => createHistoricData(MALARIA)

export const useMalariaHistoric = () => {
    const MALARIA = useSelector((state) => state.dataElements.malaria)
    return getMalariaHistoric(MALARIA)
}

export default useMalariaHistoric