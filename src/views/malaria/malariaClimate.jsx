import React from 'react'
import { DiseaseClimate } from '@/components'
import COLORS from '@/constants/styles'
import { DiseaseClimateProvider } from '@/contexts'
import { setMalariaData } from '@/redux/malariaSlice'
import { sample } from '@/views/malaria/data/sample.jsx'
import getMalariaSimulation from '@/views/malaria/data/simulation'

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