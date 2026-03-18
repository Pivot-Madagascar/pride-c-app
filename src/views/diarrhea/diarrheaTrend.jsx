import React from 'react'
import DiseaseTrend from '../../components/DiseaseTrend'
import { DiseaseProvider } from '../../contexts/DiseaseContext'
import { setDiarrheaData } from '../../redux/diarrheaSlice'
import getDiarrheaForecast from './data/forecast'
import getDiarrheaHistoric from './data/historics'
import { sample } from './data/sample'
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
