import React from 'react'
import DiseaseClimate from '../../components/DiseaseClimate'
import COLORS from '../../constants/styles'
import { DiseaseClimateProvider } from '../../contexts/DiseaseClimateContext'
import { setMalariaData } from '../../redux/malariaSlice'
import { sample } from './data/sample'
import getMalariaSimulation from './data/simulation'

const malariaClimateConfig = {
    storeName: 'malaria',
    sampleData: sample,
    getSimulation: getMalariaSimulation,
    reduxAction: setMalariaData,
    themeColor: COLORS.red_light,
}

const MalariaClimate = () => (
    <DiseaseClimateProvider config={malariaClimateConfig}>
        <DiseaseClimate />
    </DiseaseClimateProvider>
)

export default MalariaClimate