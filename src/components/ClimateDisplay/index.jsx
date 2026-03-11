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
import i18n from '../../locales'

const helpText = i18n.t('Use this page to explore climate and environmental data and compare the historical dynamics of diseases with climate variables. The number of cases corresponds to the incidence rate of symptomatic cases of children under five years transformed into cases per organizational unit. You can choose up to two variables using the dropdown menu on the left.')

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
    const [modalData, setModalData] = useState({ title: i18n.t('Help'), content: '' })
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
                        title={i18n.t('Malaria cases')}
                        xAxisText={i18n.t('Month')}
                        yAxisText={i18n.t('Cases')}
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
                                    title={climate['displayName']}
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
