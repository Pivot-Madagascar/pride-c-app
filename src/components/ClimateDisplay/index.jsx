import { useState, useMemo, useEffect , use } from 'react'
import { CLIMATE } from '../../constants/mapping'
import { useDiseaseClimate } from '../../contexts/DiseaseClimateContext'
import { useClimateData } from '../../hooks/useClimateData'
import DefaultLayout from '../../layout'
import { generateYearMonths } from '../../utils/format-time'
import ClimateChart from '../ClimateChart'
import ClimateDataSection from '../ClimateDataSection'
import Modal from '../Modal'
import style from './ClimateDisplay.module.scss'
import { climateVariables } from './data/variables'
import SelectionBar from './SelectionBar'

const helpText = `
    Utilisez cette page pour explorer les données climatiques et environnementales 
    et comparer la dynamique historique des maladies avec les variables climatiques. 
    Le nombre de cas correspond au taux d'incidence des cas symptomatiques des enfants 
    moins de cinq ans transformé en cas par l'unité organisationnelle. Vous pouvez 
    choisir jusqu'à deux variables à l'aide du menu déroulant à gauche.
`

const generateMonthYearArray = (startYear) => {
    const monthYearArray = []
    const options = { month: 'short', year: 'numeric' }
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()

    for (let year = startYear; year < currentYear; year++) {
        const lastMonth = year === currentYear ? currentMonth - 1 : 11
        for (let month = 0; month <= lastMonth; month++) {
            const date = new Date(year, month)
            const formattedDate = new Intl.DateTimeFormat(
                undefined,
                options
            ).format(date)
            monthYearArray.push(formattedDate.replace('.', ''))
        }
    }
    return monthYearArray
}

const labels = [...generateMonthYearArray(2022)]

// Climate chart configuration
const CLIMATE_CHARTS = [
    { 
        key: 'precipitation', 
        climate: CLIMATE.precipitation, 
        sampleIndex: 0 
    },
    { 
        key: 'temperature', 
        climate: CLIMATE.temperature, 
        sampleIndex: 1 
    },
    {
        key: 'vegetationIndex',
        climate: CLIMATE.vegetationIndex,
        sampleIndex: 2,
    },
    {
        key: 'waterSurfaceIndex',
        climate: CLIMATE.waterSurfaceIndex,
        sampleIndex: 3,
    },
    { 
        key: 'bushfireArea', 
        climate: CLIMATE.bushfireArea, 
        sampleIndex: 5 
    },
    {
        key: 'vegetativeWaterIndex',
        climate: CLIMATE.vegetativeWaterIndex,
        sampleIndex: 6,
    },
    { 
        key: 'aodAtmLevel', 
        climate: CLIMATE.aodAtmLevel, 
        sampleIndex: 7 
    },
    {
        key: 'floodedRiceFields',
        climate: CLIMATE.floodedRiceFields,
        sampleIndex: 8,
    },
    { 
        key: 'windSpeed', 
        climate: CLIMATE.windSpeed, 
        sampleIndex: 8 
    },
]

const ClimateDisplay = () => {
    const { themeColor, sampleData, climateState } = useDiseaseClimate()
    const [selected, setSelected] = useState([])
    const [modalData, setModalData] = useState({ title: 'Aides', content: '' })
    const [showModal, setShowModal] = useState(false)
    const [storePath, setStorePath] = useState()

    const climateData = useClimateData(storePath)

    const periods = useMemo(
        () => ({
            2022: generateYearMonths(2022)
        }),
        []
    )

    const handleHelpBtnClick = ({ showModal, title, content }) => {
        setShowModal(showModal)
        setModalData({ title, content })
    }

    const handleOrgUnitSelection = (value) => {
        setStorePath(value)
    }

    if (!climateState) {
        return null
    }

    return (
        <DefaultLayout>
            <div className={style.climateContainer}>
                <div className={style.climateHeader}>
                    <SelectionBar
                        themeColor={themeColor}
                        onOrgUnitSelected={handleOrgUnitSelection}
                        onClimateVarSelected={(event) => setSelected(event)}
                        onShowModal={handleHelpBtnClick}
                        helpText={helpText}
                        climateVariables={climateVariables}
                    />
                </div>
                <div className={style.climateContent}>
                    <ClimateDataSection
                        item={sampleData.statisticCard}
                        bgColor={themeColor}
                        data={climateData.diseaseHistoric}
                        labels={labels}
                        title={'Cas de paludisme'}
                        xAxisText="Mois"
                        yAxisText="Cas"
                        height="230px"
                    />

                    {CLIMATE_CHARTS.map(
                        ({ key, climate, sampleIndex }) =>
                            selected.includes(climate.id) && (
                                <ClimateChart
                                    key={key}
                                    periods={periods}
                                    item={sampleData.climate[sampleIndex]}
                                    data={climateData[key]}
                                    colorTheme={themeColor}
                                    labels={labels}
                                    dataElement={climate.id}
                                />
                            )
                    )}
                </div>
                <Modal
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    title={modalData.title}
                >
                    {modalData.content}
                </Modal>
            </div>
        </DefaultLayout>
    )
}

export default ClimateDisplay
