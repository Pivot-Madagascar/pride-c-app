import React from 'react'
import { DiseaseTrend } from '@/components'
import { DiseaseProvider } from '@/contexts'
import { setDiarrheaData } from '@/redux/diarrheaSlice'
import getDiarrheaForecast from '@/views/diarrhea/data/forecast'
import getDiarrheaHistoric from '@/views/diarrhea/data/historics'
import { sample } from '@/views/diarrhea/data/sample.jsx'
import getDiarrheaSimulation from '@/views/diarrhea/data/simulation'

const diarrheaConfig = {
    storeName: "diarrhea",
    sample,
    getHistoric: getDiarrheaHistoric,
    getForecast: getDiarrheaForecast,
    getSimulation: getDiarrheaSimulation,
    reduxAction: setDiarrheaData
}

const DiarrheaTrend = () => (
    <DiseaseProvider config={diarrheaConfig}>
        <DiseaseTrend />
    </DiseaseProvider>
)

export default DiarrheaTrend
