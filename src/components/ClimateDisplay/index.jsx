import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import COLORS from '../../constants/styles'
import DefaultLayout from '../../layout'
import { generateYearMonths } from '../../utils/format-time'
import ClimateDataSection from '../ClimateDataSection'
import Modal from '../Modal'
import style from './ClimateDisplay.module.scss'
import { climateVariables } from './data/variables'
import SelectionBar from './SelectionBar'
import ClimateChart from '../ClimateChart'
import { CLIMATE } from '../../constants/mapping'

const helpText = `
            Utilisez cette page pour explorer les données climatiques et environnementales 
            et comparer la dynamique historique des maladies avec les variables climatiques. 
            Le nombre de cas correspond au taux d’incidence des cas symptomatiques des enfants 
            moins de cinq ans transformé en cas par l’unité organisationnelle. Vous pouvez 
            choisir jusqu'à deux variables à l'aide du menu déroulant à gauche.
        `

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


const ClimateDisplay = ({ themeColor, storeName, sampleData }) => {
    const [selected, setSelected] = useState([])
    const [modalData, setModalData] = useState({ title: 'Aides', content: '' })
    const [showModal, setShowModal] = useState(false)
    const [storePath, setStorePath] = useState()

    const diseaseState = useSelector((state) => state[storeName])
    const climateState = useSelector((state) => state.climate)

    const diseaseHistoric = useMemo(() => {
        if (storePath && diseaseState) {
            const { adminLevel, orgUnit } = storePath
            return (
                diseaseState?.['simulation']?.['historic']?.[adminLevel]?.[
                    orgUnit
                ] || []
            )
        } else {
            return []
        }
    }, [storePath, diseaseState])

    const precipitationData = useMemo(() => {
        if (
            storePath &&
            isObjectValid(storePath) &&
            isObjectValid(climateState)
        ) {
            const { adminLevel, orgUnit } = storePath
            return (
                climateState?.['precipitation']?.[adminLevel]?.[orgUnit] || []
            )
        } else {
            return []
        }
    }, [storePath, climateState])

    const temperatureData = useMemo(() => {
        if (
            storePath &&
            isObjectValid(storePath) &&
            isObjectValid(climateState)
        ) {
            const { adminLevel, orgUnit } = storePath
            return climateState?.['temperature']?.[adminLevel]?.[orgUnit] || []
        } else {
            return []
        }
    }, [storePath, climateState])

    const vegetationIndexData = useMemo(() => {
        if (
            storePath &&
            isObjectValid(storePath) &&
            isObjectValid(climateState)
        ) {
            const { adminLevel, orgUnit } = storePath
            return (
                climateState?.['vegetationIndex']?.[adminLevel]?.[orgUnit] || []
            )
        } else {
            return []
        }
    }, [storePath, climateState])

    const waterSurfaceIndexData = useMemo(() => {
        if (
            storePath &&
            isObjectValid(storePath) &&
            isObjectValid(climateState)
        ) {
            const { adminLevel, orgUnit } = storePath
            return (
                climateState?.['waterSurfaceIndex']?.[adminLevel]?.[orgUnit] ||
                []
            )
        } else {
            return []
        }
    }, [storePath, climateState])

    const bushfireAreaData = useMemo(() => {
        if (
            storePath &&
            isObjectValid(storePath) &&
            isObjectValid(climateState)
        ) {
            const { adminLevel, orgUnit } = storePath
            return climateState?.['bushfireArea']?.[adminLevel]?.[orgUnit] || []
        } else {
            return []
        }
    }, [storePath, climateState])

    const vegetativeWaterIndexData = useMemo(() => {
        if (
            storePath &&
            isObjectValid(storePath) &&
            isObjectValid(climateState)
        ) {
            const { adminLevel, orgUnit } = storePath
            return (
                climateState?.['vegetativeWaterIndex']?.[adminLevel]?.[
                    orgUnit
                ] || []
            )
        } else {
            return []
        }
    }, [storePath, climateState])

    const aodAtmLevelData = useMemo(() => {
        if (
            storePath &&
            isObjectValid(storePath) &&
            isObjectValid(climateState)
        ) {
            const { adminLevel, orgUnit } = storePath
            return climateState?.['aodAtmLevel']?.[adminLevel]?.[orgUnit] || []
        } else {
            return []
        }
    }, [storePath, climateState])

    const floodedRiceFieldsData = useMemo(() => {
        if (
            storePath &&
            isObjectValid(storePath) &&
            isObjectValid(climateState)
        ) {
            const { adminLevel, orgUnit } = storePath
            return (
                climateState?.['floodedRiceFields']?.[adminLevel]?.[orgUnit] ||
                []
            )
        } else {
            return []
        }
    }, [storePath, climateState])

    const windSpeedData = useMemo(() => {
        if (
            storePath &&
            isObjectValid(storePath) &&
            isObjectValid(climateState)
        ) {
            const { adminLevel, orgUnit } = storePath
            return climateState?.['windSpeed']?.[adminLevel]?.[orgUnit] || []
        } else {
            return []
        }
    }, [storePath, climateState])

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
            {climateState && (
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
            )}
        </DefaultLayout>
    )
}

export default ClimateDisplay
