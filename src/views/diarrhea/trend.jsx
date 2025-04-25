import NewDataManager from '../../components/DataManager/NewDataManager'
import HealthTrend from '../../components/HealthTrend'
import {
    setDiarrheaData,
    setCurrentOrgUnit
} from '../../redux/diarrheaSlice'
import { sample } from './data'
import getDiarrheaForecast from './data/forecast'
import getDiarrheaHistoric from './data/historics'
import getDiarrheaSimulation from './data/simulation'

const DiarrheaTrend = () => {

    const { historicElements } = getDiarrheaHistoric()
    const { forecastElements } = getDiarrheaForecast()
    const { simulationElements } = getDiarrheaSimulation()

    const elements = [
        {
            dataElements: historicElements,
            reduxAction: setDiarrheaData,
        },
        {
            dataElements: forecastElements,
            reduxAction: setDiarrheaData,
        },
        {
            dataElements: simulationElements,
            reduxAction: setDiarrheaData
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
                storeName="diarrhea"
                sample={sample}
                orgUnitSetter={setCurrentOrgUnit}
            />
        </>
    )
}

export default DiarrheaTrend
