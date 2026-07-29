import { DIARRHEA } from '@/constants/mapping'
import { createSimulationData } from '@/utils/diseaseDataFactories'

const getDiarrheaSimulation = () => createSimulationData(DIARRHEA)

export default getDiarrheaSimulation