import { useSelector } from 'react-redux'
import { createSimulationData } from '@/utils/diseaseDataFactories'

export const getIraSimulation = (IRA) => createSimulationData(IRA)

export const useIraSimulation = () => {
    const IRA = useSelector((state) => state.dataElements.ira)
    return getIraSimulation(IRA)
}

export default useIraSimulation