import React from 'react'
import { DiseaseTrend } from '../../components'
import { DiseaseProvider } from '../../contexts'
import { setMalariaData } from '../../redux/malariaSlice'
import getMalariaForecast from './data/forecast'
import getMalariaHistoric from './data/historics'
import { sample } from './data/sample.jsx'
import getMalariaSimulation from './data/simulation'

const malariaConfig = {
    storeName: "malaria",
    sample,
    getHistoric: getMalariaHistoric,
    getForecast: getMalariaForecast,
    getSimulation: getMalariaSimulation,
    reduxAction: setMalariaData
}

const MalariaTrend = () => (
    <DiseaseProvider config={malariaConfig}>
        <DiseaseTrend />
    </DiseaseProvider>
)

export default MalariaTrend