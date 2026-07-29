import { MALARIA } from '@/constants/mapping'
import { createSimulationData } from '@/utils/diseaseDataFactories'

const getMalariaSimulation = () => createSimulationData(MALARIA)

export default getMalariaSimulation