import React from 'react'
import { DiseaseClimate } from '@/components'
import COLORS from '@/constants/styles'
import { DiseaseClimateProvider } from '@/contexts'
import { setData as setMalariaData } from '@/redux/malariaSlice'
import { sample } from '@/views/malaria/data/sample'
import { useMalariaHistoric } from '@/views/malaria/data/index'

const malariaClimateConfig = {
    storeName: 'malaria',
    sampleData: sample,
    getSimulation: useMalariaHistoric,
    reduxAction: setMalariaData,
    themeColor: COLORS.red_light,
}

const MalariaClimate = () => (
    <DiseaseClimateProvider config={malariaClimateConfig}>
        <DiseaseClimate />
    </DiseaseClimateProvider>
)

export default MalariaClimate
