import { useSelector } from 'react-redux'
import { createSimulationData } from '@/utils/diseaseDataFactories'

export const getMalariaSimulation = (MALARIA) => createSimulationData(MALARIA)

export const useMalariaSimulation = () => {
    const MALARIA = useSelector((state) => state.dataElements.malaria)
    return getMalariaSimulation(MALARIA)
}

export default useMalariaSimulation