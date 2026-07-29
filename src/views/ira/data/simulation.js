import { IRA } from '@/constants/mapping'
import { createSimulationData } from '@/utils/diseaseDataFactories'

const getIraSimulation = () => createSimulationData(IRA)

export default getIraSimulation