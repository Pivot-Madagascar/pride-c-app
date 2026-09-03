import React from 'react'
import { DiseaseTrend } from '@/components'
import { DiseaseProvider } from '@/contexts'
import { setData as setDiarrheaData } from '@/redux/diarrheaSlice'
import { sample } from '@/views/diarrhea/data/sample'

import {
    useDiarrheaForecast,
    useDiarrheaHistoric,
    useDiarrheaSimulation
} from '@/views/diarrhea/data/index'

const diarrheaConfig = {
    storeName: "diarrhea",
    sample,
    getHistoric: useDiarrheaHistoric,
    getForecast: useDiarrheaForecast,
    getSimulation: useDiarrheaSimulation,
    reduxAction: setDiarrheaData
}

const DiarrheaTrend = () => (
    <DiseaseProvider config={diarrheaConfig}>
        <DiseaseTrend />
    </DiseaseProvider>
)

export default DiarrheaTrend
