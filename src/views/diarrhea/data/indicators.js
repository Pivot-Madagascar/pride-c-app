import { useSelector } from 'react-redux'
import { createIndicatorData } from '@/utils/diseaseDataFactories'

export const getDiarrheaIndicator = (DIARRHEA) => createIndicatorData(DIARRHEA)

export const useDiarrheaIndicator = () => {
    const DIARRHEA = useSelector((state) => state.dataElements.diarrhea)
    return getDiarrheaIndicator(DIARRHEA)
}