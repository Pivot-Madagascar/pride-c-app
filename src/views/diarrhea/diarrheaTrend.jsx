import React from 'react'
import { DiseaseTrend } from '../../components'
import { DiseaseProvider } from '../../contexts'
import { setDiarrheaData } from '../../redux/diarrheaSlice'
import getDiarrheaForecast from './data/forecast'
import getDiarrheaHistoric from './data/historics'
import { sample } from './data/sample.jsx'
import getDiarrheaSimulation from './data/simulation'

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
