import React from 'react'
import { DiseaseClimate } from '../../components'
import COLORS from '../../constants/styles'
import { DiseaseClimateProvider } from '../../contexts'
import { setIraData } from '../../redux/iraSlice'
import { sample } from './data/sample.jsx'
import getIraSimulation from './data/simulation'

const iraClimateConfig = {
    storeName: 'ira',
    sampleData: sample,
    getSimulation: getIraSimulation,
    reduxAction: setIraData,
    themeColor: COLORS.blue_lighter
}

const IraClimate = () => (
    <DiseaseClimateProvider config={iraClimateConfig}>
        <DiseaseClimate />
    </DiseaseClimateProvider>
)

export default IraClimate