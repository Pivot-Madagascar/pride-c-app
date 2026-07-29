import React from 'react'
import { DiseaseClimate } from '@/components'
import COLORS from '@/constants/styles'
import { DiseaseClimateProvider } from '@/contexts'
import { setData as setDiarrheaData } from '@/redux/diarrheaSlice'
import { sample } from '@/views/diarrhea/data/sample.jsx'
import getDiarrheaSimulation from '@/views/diarrhea/data/simulation'

const diarrheaClimateConfig = {
    storeName: 'diarrhea',
    sampleData: sample,
    getSimulation: getDiarrheaSimulation,
    reduxAction: setDiarrheaData,
    themeColor: COLORS.green_lighter
}

const DiarrheaClimate = () => (
    <DiseaseClimateProvider config={diarrheaClimateConfig}>
        <DiseaseClimate />
    </DiseaseClimateProvider>
)

export default DiarrheaClimate
