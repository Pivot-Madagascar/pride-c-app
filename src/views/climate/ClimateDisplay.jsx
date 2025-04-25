import { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import NewDataManager from '../../components/DataManager/NewDataManager'
import Modal from '../../components/Modal'
import MultiSelect from '../../components/MultiSelect'
import SearchInput from '../../components/SearchInput'
import ToggleButton from '../../components/ToggleButton'
import { CLIMATE } from '../../constants/mapping'
import COLORS from '../../constants/styles'
import DefaultLayout from '../../layout'
import { setClimateData } from '../../redux/climateSlice'
import { sample } from '../malaria/data'
import style from './ClimateChart.module.scss'
import getClimateHistoric from './climateData'
import SelectionBar from './SelectionBar'
import { generateYearMonths } from '../../utils/format-time'
import ClimateChart from './ClimateChart'
import ClimateDataSection from '../../components/ClimateDataSection'
import MultiChart from '../../components/MultiChart'

const climateVariables = [
    {
        label: CLIMATE.precipitation.displayName,
        value: CLIMATE.precipitation.id,
    },
    { 
        label: CLIMATE.temperature.displayName, 
        value: CLIMATE.temperature.id 
    },
    {
        label: CLIMATE.vegetationIndex.displayName,
        value: CLIMATE.vegetationIndex.id,
    },
    {
        label: CLIMATE.waterSurfaceIndex.displayName,
        value: CLIMATE.waterSurfaceIndex.id,
    },
    { 
        label: CLIMATE.bushfireArea.displayName, 
        value: CLIMATE.bushfireArea.id 
    },
    {
        label: CLIMATE.vegetativeWaterIndex.displayName,
        value: CLIMATE.vegetativeWaterIndex.id,
    },
    { 
        label: CLIMATE.aodAtmLevel.displayName, 
        value: CLIMATE.aodAtmLevel.id 
    },
    {
        label: CLIMATE.floodedRiceFields.displayName,
        value: CLIMATE.floodedRiceFields.id,
    },
    { 
        label: CLIMATE.windSpeed.displayName, 
        value: CLIMATE.windSpeed.id 
    },
]

const isObjectValid = (obj) => {
    if (!obj) {
        return false
    }
    return Object.values(obj).every(
        (value) => value !== null && value !== undefined
    )
}

const generateMonthYearArray = (startYear) => {
    const monthYearArray = []
    const options = { month: 'short', year: 'numeric' }

    // Get the current date
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() // 0 (Jan) to 11 (Dec)

    // Loop through the years from the start year to the current year
    for (let year = startYear; year < currentYear; year++) {
        // Determine the last month to include
        const lastMonth = year === currentYear ? currentMonth - 1 : 11 // Stop at the current month - 1 for the current year

        for (let month = 0; month <= lastMonth; month++) {
            const date = new Date(year, month)
            const formattedDate = new Intl.DateTimeFormat(
                'fr-FR',
                options
            ).format(date)
            monthYearArray.push(formattedDate.replace('.', '')) // Remove the dot from the short month name
        }
    }

    return monthYearArray
}

const labels = [
    ...generateMonthYearArray(2022),
    // ...generateMonthYearArray(2023),
    // ...generateMonthYearArray(2024)
]

const defaultChartData = {
    labels,
    datasets: [
        {
            fill: false,
            label: 'Cas',
            data: [],
            borderColor: COLORS.primary_text,
            backgroundColor: COLORS.primary_text,
            tension: 0.2,
            hidden: false,
            pointStyle: false,
        },
    ],
}

const ClimateDisplay = ({ themeColor, storeName, sampleData }) => {
    // const { climateElements } = getClimateHistoric()

    const [selected, setSelected] = useState([])
    const [modalData, setModalData] = useState({ title: 'Aides', content: '' })
    const [showModal, setShowModal] = useState(false)
    const [chartData, setChartData] = useState(defaultChartData)
    const [storePath, setStorePath] = useState()

    const handleSelect = (value) => {
        setSelected(value)
    }

    const diseaseState = useSelector((state) => state[storeName])
    const climateState = useSelector((state) => state.climate)

    const diseaseHistoric = useMemo(() => {
        if (storePath && diseaseState) {
            const { adminLevel, orgUnit } = storePath
            return diseaseState?.['simulation']?.['historic']?.[adminLevel]?.[orgUnit] || []
        } else {
            return []
        }
    }, [storePath, diseaseState])

    const precipitationData = useMemo(() => { 
        if (storePath && isObjectValid(storePath) && isObjectValid(climateState)) {
            const { adminLevel, orgUnit } = storePath 
            return climateState?.['precipitation']?.[adminLevel]?.[orgUnit] || []
        } else {
            return []
        }
    }, [storePath, climateState]) 

    const temperatureData = useMemo(() => { 
        if (storePath && isObjectValid(storePath) && isObjectValid(climateState)) {
            const { adminLevel, orgUnit } = storePath 
            return climateState?.['temperature']?.[adminLevel]?.[orgUnit] || []
        } else {
            return []
        }
    }, [storePath, climateState]) 

    const vegetationIndexData = useMemo(() => { 
        if (storePath && isObjectValid(storePath) && isObjectValid(climateState)) {
            const { adminLevel, orgUnit } = storePath 
            return climateState?.['vegetationIndex']?.[adminLevel]?.[orgUnit] || []
        } else {
            return []
        }
    }, [storePath, climateState]) 

    const waterSurfaceIndexData = useMemo(() => { 
        if (storePath && isObjectValid(storePath) && isObjectValid(climateState)) {
            const { adminLevel, orgUnit } = storePath 
            return climateState?.['waterSurfaceIndex']?.[adminLevel]?.[orgUnit] || []
        } else {
            return []
        }
    }, [storePath, climateState]) 

    const bushfireAreaData = useMemo(() => { 
        if (storePath && isObjectValid(storePath) && isObjectValid(climateState)) {
            const { adminLevel, orgUnit } = storePath 
            return climateState?.['bushfireArea']?.[adminLevel]?.[orgUnit] || []
        } else {
            return []
        }
    }, [storePath, climateState]) 

    const vegetativeWaterIndexData = useMemo(() => { 
        if (storePath && isObjectValid(storePath) && isObjectValid(climateState)) {
            const { adminLevel, orgUnit } = storePath 
            return climateState?.['vegetativeWaterIndex']?.[adminLevel]?.[orgUnit] || []
        } else {
            return []
        }
    }, [storePath, climateState]) 

    const aodAtmLevelData = useMemo(() => { 
        if (storePath && isObjectValid(storePath) && isObjectValid(climateState)) {
            const { adminLevel, orgUnit } = storePath 
            return climateState?.['aodAtmLevel']?.[adminLevel]?.[orgUnit] || []
        } else {
            return []
        }
    }, [storePath, climateState]) 

    const floodedRiceFieldsData = useMemo(() => { 
        if (storePath && isObjectValid(storePath) && isObjectValid(climateState)) {
            const { adminLevel, orgUnit } = storePath 
            return climateState?.['floodedRiceFields']?.[adminLevel]?.[orgUnit] || []
        } else {
            return []
        }
    }, [storePath, climateState]) 

    const windSpeedData = useMemo(() => { 
        if (storePath && isObjectValid(storePath) && isObjectValid(climateState)) {
            const { adminLevel, orgUnit } = storePath 
            return climateState?.['windSpeed']?.[adminLevel]?.[orgUnit] || []
        } else {
            return []
        }
    }, [storePath, climateState]) 

    const diseaseChartData = {
        labels,
        datasets: [
            {
                fill: false,
                label: 'Cas',
                data: diseaseHistoric.length > 0 ? diseaseHistoric.map(({value}) => value) : [],
                borderColor: COLORS.primary_text,
                backgroundColor: COLORS.primary_text,
                tension: 0.2,
                hidden: false,
                pointStyle: false,
            },
        ],
    }

    const periods = useMemo(
        () => ({
            2022: generateYearMonths(2022),
            2023: generateYearMonths(2023),
            2024: generateYearMonths(2024),
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

    return (
        <DefaultLayout>
            {   climateState && (
                <div className={style.climateContainer}>
                    <div className={style.climateHeader}>
                        <SelectionBar
                            themeColor={themeColor}
                            onOrgUnitSelected={handleOrgUnitSelection}
                            onClimateVarSelected={(event) => setSelected(event)}
                            onShowModal={handleHelpBtnClick}
                            helpText={sample.helpTexts.helpText_4}
                            climateVariables={climateVariables} 
                        />
                    </div>
                    <div className={style.climateContent}>
                        
                            <ClimateDataSection
                                item={sampleData.statisticCard}
                                bgColor={themeColor}
                                data={diseaseHistoric}
                                labels={labels}
                                title={'Cas de paludisme'}
                                xAxisText="Mois"
                                yAxisText="Cas"
                                height="230px"
                            />  
                       
                        {selected.includes(CLIMATE.precipitation.id) && (
                            <ClimateChart
                                periods={periods}
                                data={precipitationData}
                                colorTheme={themeColor}
                                labels={labels}
                                dataElement={CLIMATE.precipitation.id}
                            />
                        )}
                        {selected.includes(CLIMATE.temperature.id) && (
                            <ClimateChart
                                periods={periods}
                                item={sampleData.climate[1]}
                                data={temperatureData}
                                colorTheme={themeColor}
                                labels={labels} 
                                dataElement={CLIMATE.temperature.id}
                            />
                        )}
                        {selected.includes(CLIMATE.vegetationIndex.id) && (
                            <ClimateChart
                                periods={periods}
                                item={sampleData.climate[2]}
                                data={vegetationIndexData}
                                colorTheme={themeColor}
                                labels={labels} 
                                dataElement={CLIMATE.vegetationIndex.id}
                            />
                        )}
                        {selected.includes(CLIMATE.waterSurfaceIndex.id) && (
                            <ClimateChart
                                periods={periods}
                                item={sampleData.climate[3]}
                                data={waterSurfaceIndexData}
                                colorTheme={themeColor}
                                labels={labels} 
                                dataElement={CLIMATE.waterSurfaceIndex.id}
                            />
                        )}

                        {selected.includes(CLIMATE.bushfireArea.id) && (
                            <ClimateChart
                                periods={periods}
                                item={sampleData.climate[5]}
                                data={bushfireAreaData}
                                colorTheme={themeColor}
                                labels={labels} 
                                dataElement={CLIMATE.bushfireArea.id}
                            />
                        )}
                        {selected.includes(CLIMATE.vegetativeWaterIndex.id) && (
                            <ClimateChart
                                periods={periods}
                                item={sampleData.climate[6]}
                                data={vegetativeWaterIndexData}
                                colorTheme={themeColor}
                                labels={labels} 
                                dataElement={CLIMATE.vegetativeWaterIndex.id}
                            />
                        )}
                        {selected.includes(CLIMATE.aodAtmLevel.id) && (
                            <ClimateChart
                                periods={periods}
                                item={sampleData.climate[7]}
                                data={aodAtmLevelData}
                                colorTheme={themeColor}
                                labels={labels} 
                                dataElement={CLIMATE.aodAtmLevel.id}
                            />
                        )}
                        {selected.includes(CLIMATE.floodedRiceFields.id) && (
                            <ClimateChart
                                periods={periods}
                                item={sampleData.climate[8]}
                                data={floodedRiceFieldsData}
                                colorTheme={themeColor}
                                labels={labels} 
                                dataElement={CLIMATE.floodedRiceFields.id}
                            />
                        )}
                        {selected.includes(CLIMATE.windSpeed.id) && (
                            <ClimateChart
                                periods={periods}
                                item={sampleData.climate[8]}
                                data={windSpeedData}
                                colorTheme={themeColor}
                                labels={labels} 
                                dataElement={CLIMATE.windSpeed.id}
                            />
                        )}
                    </div>
                    <Modal
                        open={showModal}
                        handleClose={() => setShowModal(false)}
                        title={modalData.title}
                    >
                        {modalData.content}
                    </Modal>
                </div>
                )
            }
            
        </DefaultLayout>
    )
}

export default ClimateDisplay
