import NewDataManager from '../../components/DataManager/NewDataManager'
import HealthTrend from '../../components/HealthTrend'
import {
    setIraData,
    setCurrentOrgUnit
} from '../../redux/iraSlice'
import { sample } from './data'
import getIraForecast from './data/forecast'
import getIraHistoric from './data/historics'
import getIraSimulation from './data/simulation'

const IraTrend = () => {

    const { historicElements } = getIraHistoric()
    const { forecastElements } = getIraForecast()
    const { simulationElements } = getIraSimulation()

    const elements = [
        {
            dataElements: historicElements,
            reduxAction: setIraData,
        },
        {
            dataElements: forecastElements,
            reduxAction: setIraData,
        },
        {
            dataElements: simulationElements,
            reduxAction: setIraData
        }
    ]

    return (
        <>
            {elements.map(({ dataElements, reduxAction }, index) => (
                <NewDataManager
                    key={index}
                    dataElements={dataElements}
                    reduxAction={reduxAction}
                />
            ))}

            <HealthTrend
                storeName="ira"
                sample={sample}
                orgUnitSetter={setCurrentOrgUnit}
            />
        </>
    )
}

export default IraTrend
