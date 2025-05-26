import { useState, useEffect, useCallback, useMemo } from 'react'
import { Typography } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useDiseaseConfig } from '../../contexts/DiseaseContext'
import { useDiseaseData } from '../../hooks/useDiseaseData'
import DataTable from '../DataTable/index'
import HelpButton from '../HelpButton'
import TimeSeriesChart from '../TimeSeriesChart/index'
import Map from '../Map/index'
import Modal from '../Modal/index'
import CustomSlider from '../Slider'
import { sliderMarks } from '../../constants/config'
import COLORS from '../../constants/styles'
import DefaultLayout from '../../layout'
import style from './diseaseDashboard.module.scss'
import MetricsPanel from '../MetricsPanel'
import SelectionBar from './SelectionBar'
import { setSelectors } from '../../redux/tempSlice'

const currentYear = new Date().getFullYear()

// Helper functions moved outside component
const isObjectValid = (obj) => {
    if (!obj) return false
    return Object.values(obj).every(
        (value) => value !== null && value !== undefined
    )
}

const getLevelNames = (id, levels) => {
    const currentElement = levels.find((element) => element.id === id)
    if (currentElement) {
        const currentLevelName = currentElement.name
        const parentLevel = currentElement.level - 1
        const parentLevelElement = levels.find(
            (element) => element.level === parentLevel
        )
        const parentLevelName = parentLevelElement
            ? parentLevelElement.name
            : null
        return [parentLevelName, currentLevelName]
    }
    return null
}

const combineData = (orgUnits, statsData, adminLevel) => {
    if (!Array.isArray(orgUnits)) {
        console.error('Expected orgUnits to be an array, but got:', orgUnits)
        return []
    }

    const result = []
    let id = 1
    const orgUnitMap = {}

    orgUnits.forEach((orgUnit) => {
        orgUnitMap[orgUnit.id] = orgUnit
    })

    const monthFormatter = new Intl.DateTimeFormat('fr-FR', { month: 'long' })
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

    if (!isObjectValid(statsData)) {
        return []
    }

    for (const [orgUnitId, periods] of Object.entries(statsData.avg)) {
        const orgUnit = orgUnitMap[orgUnitId]
        if (!orgUnit) continue

        let parent
        if (orgUnit.parents) {
            parent = orgUnit.parents.find((p) => p.id === orgUnit.parent)
        }

        if (!periods) return []

        periods.forEach((periodData) => {
            const period = periodData.period
            const periodName = getPeriodName(period, monthFormatter, capitalize)
            const lowciValue = statsData.lowci[orgUnitId]?.find(
                (p) => p.period === period
            )?.value
            const uppciValue = statsData.uppci[orgUnitId]?.find(
                (p) => p.period === period
            )?.value
            const avgValue = periodData.value

            result.push({
                id: id++,
                period,
                periodName,
                orgUnit: orgUnitId,
                orgUnitName: orgUnit.name,
                adminLevel,
                parentName: parent?.name || '',
                parentAdminLevel: parent?.adminLevelName || '',
                parentId: orgUnit.parent,
                lowci: parseInt(lowciValue, 10) || null,
                avg: parseInt(avgValue, 10) || null,
                uppci: parseInt(uppciValue, 10) || null,
            })
        })
    }

    result.sort((a, b) => {
        if (a.orgUnitName < b.orgUnitName) return -1
        if (a.orgUnitName > b.orgUnitName) return 1
        return a.period.localeCompare(b.period)
    })

    result.forEach((item, index) => {
        item.id = index + 1
    })

    return result
}

const getPeriodName = (period, formatter, capitalize) => {
    const year = period.substring(0, 4)
    const month = parseInt(period.substring(4), 10) - 1
    const date = new Date(parseInt(year, 10), month, 1)
    const monthName = capitalize(formatter.format(date))
    return `${monthName} ${year}`
}

const replaceFirstNullWithRankValue = (data, reference) => {
    const maxArray = data?.max || []
    const minArray = data?.min || []
    const referenceArray = reference?.[currentYear] || []

    const replaceFirstNull = (arr) => {
        const newArray = [...arr]
        const index = arr.findIndex((value) => value !== null)
        if (index >= 0) {
            const rankValue = referenceArray[index - 1]
            newArray[index - 1] = rankValue
        }
        return newArray
    }

    const updatedMax = replaceFirstNull(maxArray)
    const updatedMin = replaceFirstNull(minArray)

    return {
        max: updatedMax,
        min: updatedMin,
    }
}

const DiseaseDashboard = () => {
    const dispatch = useDispatch()
    const { sample } = useDiseaseConfig()
    const {
        storePath,
        orgUnitLevels,
        features,
        historic,
        simulation,
        forecastLimits,
        forecast,
        currentOrgUnit,
        activeOrgUnits,
        adminLevelForecast,
        orgUnitForecast,
        alert,
        comparison,
    } = useDiseaseData()

    // Local state
    const [openModal, setOpenModal] = useState(false)
    const [openLocationModal, setOpenLocationModal] = useState(false)
    const [locationModalContent, setLocationModalContent] = useState({
        title: '',
        content: '',
    })
    const [modalContent, setModalContent] = useState('')
    const [mapPeriodId, setMapPeriodId] = useState(0)
    const [historicData, setHistoricData] = useState()
    const [alertData, setAlertData] = useState()
    const [comparisonData, setComparisonData] = useState()
    const [displayVisualization, setDisplayVisualization] = useState(false)

    // Computed values
    const dataTableData = useMemo(() => {
        if (!adminLevelForecast || !orgUnitForecast) return []
        const { orgUnit } = storePath || {}
        return orgUnit
            ? combineData(activeOrgUnits, orgUnitForecast)
            : combineData(activeOrgUnits, adminLevelForecast)
    }, [adminLevelForecast, orgUnitForecast, activeOrgUnits, storePath])

    const mapData = useMemo(() => {
        if (!adminLevelForecast) return []
        return combineData(activeOrgUnits, adminLevelForecast)
    }, [adminLevelForecast, activeOrgUnits])

    const adminLevelColumns = useMemo(() => {
        if (!storePath || !orgUnitLevels) return []
        const { adminLevel } = storePath
        return getLevelNames(adminLevel, orgUnitLevels)
    }, [storePath, orgUnitLevels])

    // Effects
    useEffect(() => {
        if (!historic || !forecast || !simulation || !forecastLimits) {
            setHistoricData(null)
            return
        }
        const newForecastLimits = replaceFirstNullWithRankValue(
            forecastLimits,
            simulation
        )
        const newHistoric = { ...historic, ...simulation, ...newForecastLimits }
        setHistoricData(newHistoric)
    }, [historic, forecast, alert, comparison, forecastLimits, simulation])

    useEffect(() => {
        if (!alert || !comparison) return
        setAlertData(alert)
        setComparisonData(comparison)
    }, [alert, comparison])

    useEffect(() => {
        const isValid = isObjectValid(storePath)
        setDisplayVisualization(isValid)
    }, [storePath])

    // Event handlers
    const handleHelpBtnClick = (value) => {
        setOpenModal(value.open)
        setModalContent(value.content)
    }

    const handleMapClick = useCallback(
        (event) => {
            const { orgUnitId } = event
            dispatch(setSelectors({ orgUnit: orgUnitId }))
        },
        [dispatch]
    )

    return (
        <DefaultLayout>
            <div>
                <div className={style.headerNav}>
                    <div className={style.title}>{sample.title}</div>
                    <SelectionBar
                        themeColor={sample.currentThemeColor}
                        sourceOptions={sample.healthMetrics}
                    />
                </div>
                <MetricsPanel
                    themeColor={sample.currentThemeColor}
                    alertData={alertData}
                    comparisonData={comparisonData}
                />
                <div className={style.visualization}>
                    <div className={style.chartSection}>
                        <div className={style.mapContainer}>
                            <div style={{ height: '550px', width: '100%' }}>
                                {features && mapData && (
                                    <Map
                                        data={mapData}
                                        colors={sample.mapColors}
                                        highlightedOrgUnitIds={[
                                            storePath?.['orgUnit'],
                                        ]}
                                        periodId={mapPeriodId}
                                        features={features}
                                        onClick={handleMapClick}
                                    />
                                )}
                            </div>
                            <div
                                style={{
                                    height: '10%',
                                    display: 'grid',
                                    alignContent: 'center',
                                }}
                            >
                                <CustomSlider
                                    color={COLORS.red_light}
                                    marks={sliderMarks}
                                    onChange={(event) => setMapPeriodId(event)}
                                />
                            </div>
                        </div>
                        <div className={style.lineChartContainer}>
                            <TimeSeriesChart
                                data={historicData}
                                showVisualization={displayVisualization}
                                title={`Nombre de cas pour ${currentOrgUnit}`}
                                xAxisText="Mois"
                                yAxisText="Nombre de cas"
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    right: '0.2rem',
                                    top: '0.25rem',
                                    zIndex: '990',
                                }}
                            >
                                <HelpButton
                                    bgColor={sample.currentThemeColor}
                                    text={sample.helpTexts.helpText_2}
                                    onClick={handleHelpBtnClick}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style.dataTableSection}>
                    <div className={style.dataTableHeaderSection}>
                        <div className={style.dataTableHeader}>
                            <Typography
                                style={{ fontWeight: 'bold', fontSize: '2rem' }}
                            >
                                Predictions et tendances
                            </Typography>
                        </div>
                        <HelpButton
                            bgColor={sample.currentThemeColor}
                            text={sample.helpTexts.helpText_3}
                            onClick={handleHelpBtnClick}
                        />
                    </div>
                    {dataTableData && (
                        <DataTable
                            data={dataTableData}
                            orgUnitColumns={adminLevelColumns}
                        />
                    )}
                    <Modal
                        open={openModal}
                        handleClose={() => setOpenModal(false)}
                        title="Aides"
                    >
                        <div
                            dangerouslySetInnerHTML={{ __html: modalContent }}
                        />
                    </Modal>
                    <Modal
                        open={openLocationModal}
                        handleClose={() => setOpenLocationModal(false)}
                        title={locationModalContent.title}
                    >
                        {locationModalContent.content}
                    </Modal>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default DiseaseDashboard
