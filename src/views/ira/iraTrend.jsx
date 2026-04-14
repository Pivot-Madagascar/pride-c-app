import React from 'react'
import { DiseaseTrend } from '@/components'
import { DiseaseProvider } from '@/contexts'
import { setIraData } from '@/redux/iraSlice'
import getIraForecast from '@/views/ira/data/forecast'
import getIraHistoric from '@/views/ira/data/historics'
import { sample } from '@/views/ira/data/sample.jsx'
import getIraSimulation from '@/views/ira/data/simulation'

const iraConfig = {
    storeName: "ira",
    sample,
    getHistoric: getIraHistoric,
    getForecast: getIraForecast,
    getSimulation: getIraSimulation,
    reduxAction: setIraData
}

const IraTrend = () => (
    <DiseaseProvider config={iraConfig}>
        <DiseaseTrend />
    </DiseaseProvider>
)

export default IraTrend
