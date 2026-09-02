import { useSelector } from 'react-redux'
import { createSimulationData } from '@/utils/diseaseDataFactories'

export const getDiarrheaSimulation = (DIARRHEA) => createSimulationData(DIARRHEA)

export const useDiarrheaSimulation = () => {
    const DIARRHEA = useSelector((state) => state.dataElements.diarrhea)
    return getDiarrheaSimulation(DIARRHEA)
}

export default useDiarrheaSimulation