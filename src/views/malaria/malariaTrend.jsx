import React from 'react'
import { DiseaseTrend } from '@/components'
import { DiseaseProvider } from '@/contexts'
import { setData as setMalariaData } from '@/redux/malariaSlice'
import { sample } from '@/views/malaria/data/sample'

import {
    useMalariaForecast,
    useMalariaHistoric,
    useMalariaSimulation 
} from '@/views/malaria/data/index'

const malariaConfig = {
    storeName: "malaria",
    sample,
    getHistoric: useMalariaHistoric,
    getForecast: useMalariaForecast,
    getSimulation: useMalariaSimulation,
    reduxAction: setMalariaData
}

const MalariaTrend = () => (
    <DiseaseProvider config={malariaConfig}>
        <DiseaseTrend />
    </DiseaseProvider>
)

export default MalariaTrend