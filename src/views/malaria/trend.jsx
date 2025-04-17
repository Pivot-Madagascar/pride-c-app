import NewDataManager from '../../components/DataManager/NewDataManager'
import HealthTrend from '../../components/HealthTrend'
import {
    setMalariaData,
    setCurrentOrgUnit
} from '../../redux/malariaSlice'
import { sample } from './data'
import getMalariaForecast from './data/forecast'
import getMalariaHistoric from './data/historics'
import getMalariaSimulation from './data/simulation'

const MalariaTrend = () => {

    const { historicElements } = getMalariaHistoric()
    const { forecastElements } = getMalariaForecast()
    const { simulationElements } = getMalariaSimulation()

    const elements = [
        {
            dataElements: historicElements,
            reduxAction: setMalariaData,
        },
        {
            dataElements: forecastElements,
            reduxAction: setMalariaData,
        },
        {
            dataElements: simulationElements,
            reduxAction: setMalariaData
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
                storeName="malaria"
                sample={sample}
                orgUnitSetter={setCurrentOrgUnit}
            />
        </>
    )
}

export default MalariaTrend
