import { useSelector } from 'react-redux'
import { createHistoricData } from '@/utils/diseaseDataFactories'

export const getDiarrheaHistoric = (DIARRHEA) => createHistoricData(DIARRHEA)

export const useDiarrheaHistoric = () => {
    const DIARRHEA = useSelector((state) => state.dataElements.diarrhea)
    return getDiarrheaHistoric(DIARRHEA)
}

export default useDiarrheaHistoric