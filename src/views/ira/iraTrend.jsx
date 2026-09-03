import React from 'react'
import { DiseaseTrend } from '@/components'
import { DiseaseProvider } from '@/contexts'
import { setData as setIraData } from '@/redux/iraSlice'
import { sample } from '@/views/ira/data/sample'

import {
    useIraForecast,
    useIraHistoric,
    useIraSimulation
} from '@/views/ira/data/index'

const iraConfig = {
    storeName: "ira",
    sample,
    getHistoric: useIraHistoric,
    getForecast: useIraForecast,
    getSimulation: useIraSimulation,
    reduxAction: setIraData
}

const IraTrend = () => (
    <DiseaseProvider config={iraConfig}>
        <DiseaseTrend />
    </DiseaseProvider>
)

export default IraTrend
