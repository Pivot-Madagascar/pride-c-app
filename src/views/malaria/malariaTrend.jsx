import React from 'react'
import { DiseaseTrend } from '@/components'
import { DiseaseProvider } from '@/contexts'
import { setData as setMalariaData } from '@/redux/malariaSlice'
import getMalariaForecast from '@/views/malaria/data/forecast'
import getMalariaHistoric from '@/views/malaria/data/historics'
import { sample } from '@/views/malaria/data/sample.jsx'
import getMalariaSimulation from '@/views/malaria/data/simulation'

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