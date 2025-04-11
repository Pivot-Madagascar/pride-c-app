import { Typography } from '@mui/material'
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import DataTable from '../../components/DataTable/index'
import HelpButton from '../../components/HelpButton'
import LineChart from '../../components/LineChart/index'
import Map from '../../components/Map/index'
import Modal from '../../components/Modal/index'
import SearchInput from '../../components/SearchInput'
import CustomSlider from '../../components/Slider'
import ToggleButton from '../../components/ToggleButton'
import { sliderMarks } from '../../constants/config'
import COLORS from '../../constants/styles'
import DefaultLayout from '../../layout'
import { convertToLocaleDate } from '../../utils/format-time'
import style from './healthTrend.module.scss'
import { getCachedData } from '../../utils/cache'
import MetricsPanel from '../../components/MetricsPanel'
import SelectionBar from './SelectionBar'
import cacheUtils from '../../utils/newCache'
import { isEqual } from 'lodash'

const district = [{ id: 'VtP4BdCeXIo', displayName: 'Ifanadiana' }]
const currentYear = new Date().getFullYear()

const isObjectValid = (obj) => {
    if (!obj) return false
    return Object.values(obj).every(
        (value) => value !== null && value !== undefined
    )
}

const getLevelNames = (id, levels) => {
    // Find the current element by the provided id
    const currentElement = levels.find((element) => element.id === id)

    // If the current element is found, find the next level element
    if (currentElement) {
        const currentLevelName = currentElement.name // Get the current level name
        const parentLevel = currentElement.level - 1 // Determine the next level
        const parentLevelElement = levels.find(
            (element) => element.level === parentLevel
        )
        const parentLevelName = parentLevelElement
            ? parentLevelElement.name
            : null // Get the next level name or null if not found

        return [parentLevelName, currentLevelName]
    }
    return null // Return null if no element is found for the provided id
}

const regroupByYear = (data) => {
    const result = {}
    // Iterate through the input data
    data.forEach(({ period, value }) => {
        const year = period.substring(0, 4) // Extract the year
        const month = parseInt(period.substring(4, 6), 10) // Extract the month as a number
        // Initialize the year array if it doesn't exist
        if (!result[year]) {
            result[year] = new Array(12).fill(null) // Create an array of 12 nulls
        }
        // Assign the value to the corresponding month (month - 1 for zero-based indexing)
        result[year][month - 1] = Number(value)
    })
    return result // Return the result as an object
}

const fillMissingMonths = (data) => {
    const result = new Array(12).fill(null) // Initialize an array of 12 nulls for each month
    // Iterate through the input data
    data.forEach(({ period, value }) => {
        const year = period.substring(0, 4) // Extract the year
        const month = parseInt(period.substring(4, 6), 10) // Extract the month as a number
        // Assign the value to the corresponding month (month - 1 for zero-based indexing)
        result[month - 1] = Number(value) // Convert value to a Number
    })
    return result // Return the result array
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

const combineData = (orgUnits, statsData, adminLevel) => {
    // Check if orgUnits is an array
    if (!Array.isArray(orgUnits)) {
        console.error('Expected orgUnits to be an array, but got:', orgUnits)
        return [] // Return an empty array or handle the error as needed
    }
    const result = []
    let id = 1
    const orgUnitMap = {}
    // Create a map for quick orgUnit lookup
    orgUnits.forEach((orgUnit) => {
        orgUnitMap[orgUnit.id] = orgUnit
    })
    const monthFormatter = new Intl.DateTimeFormat('fr-FR', { month: 'long' })
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)
    // Process each orgUnit in the stats data
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
    // Sort by orgUnitName and then by period
    result.sort((a, b) => {
        if (a.orgUnitName < b.orgUnitName) return -1
        if (a.orgUnitName > b.orgUnitName) return 1
        return a.period.localeCompare(b.period)
    })
    // Reset IDs to be sequential after sorting
    result.forEach((item, index) => {
        item.id = index + 1
    })

    return result
}

const getPeriodName = (period, formatter, capitalize) => {
    const year = period.substring(0, 4)
    const month = parseInt(period.substring(4), 10) - 1 // Convert to 0-indexed

    // Create a date object for the month
    const date = new Date(parseInt(year, 10), month, 1)

    // Format the month name and capitalize it
    const monthName = capitalize(formatter.format(date))

    return `${monthName} ${year}`
}

const HealthTrend = ({
    storeName, // 'ira', 'malaria', or 'diarrhea'
    sample,
}) => {
    const [openModal, setOpenModal] = useState(false)
    const [openLocationModal, setOpenLocationModal] = useState(false)
    const [locationModalContent, setLocationModalContent] = useState({
        title: '',
        content: '',
    })
    const [modalContent, setModalContent] = useState('')
    const [mapPeriodId, setMapPeriodId] = useState(0)
    const [highlightedOrgUnits, setHighlightedOrgUnits] = useState([])

    const [storePath, setStorePath] = useState()
    const [historicData, setHistoricData] = useState()
    const [alertData, setAlertData] = useState()
    const [comparisonData, setComparisonData] = useState()
    const [displayVisualization, setDisplayVisualization] = useState(false)

    const healthState = useSelector((state) => state[storeName])
    const orgUnitLevels = useSelector((state) => state.orgUnit.orgUnitLevels)

    const cachedFeatures = cacheUtils.get({
        path: ['orgUnits', 'features'],
        useLocalStorage: true,
    })

    const orgUnits = cacheUtils.get({
        path: ['orgUnits', 'details'],
        useLocalStorage: true,
    })

    // Custom hook to get health data

    const features = useMemo(() => {
        if (!storePath || !cachedFeatures) return null
        const { adminLevel } = storePath
        return cachedFeatures?.[adminLevel]
    }, [storePath, cachedFeatures])

    const historic = useMemo(() => {
        if (!storePath || !healthState) return null
        const { source, adminLevel, orgUnit } = storePath
        const result =
            healthState?.['historic']?.[source]?.[adminLevel]?.[orgUnit]
        return result ? regroupByYear(result) : null
    }, [storePath, healthState])

    const simulation = useMemo(() => {
        if (!storePath || !healthState) return null
        const { adminLevel, orgUnit } = storePath
        const result =
            healthState?.['simulation']?.['current']?.[adminLevel]?.[orgUnit]
        return result ? regroupByYear(result) : null
    }, [storePath, healthState])

    const forecastLimits = useMemo(() => {
        if (!storePath || !healthState) return null
        const { source, adminLevel, orgUnit } = storePath
        const max = healthState?.['forecast']?.[source]?.['uppci']?.[adminLevel]?.[orgUnit] || null
        const min = healthState?.['forecast']?.[source]?.['lowci']?.[adminLevel]?.[orgUnit] || null
        return {
            max: max ? fillMissingMonths(max) : null,
            min: min ? fillMissingMonths(min) : null,
        }
    }, [storePath, healthState])

    const forecast = useMemo(() => {
        if (!storePath || !healthState) return null
        const { source, adminLevel, orgUnit } = storePath
        const forecastSource = healthState?.['forecast']?.[source]
        if (!forecastSource) return null
        return {
            avg: forecastSource?.['avg']?.[adminLevel]?.[orgUnit] || null,
            lowci: forecastSource?.['lowci']?.[adminLevel]?.[orgUnit] || null,
            uppci: forecastSource?.['uppci']?.[adminLevel]?.[orgUnit] || null,
        }
    }, [storePath, healthState])

    const currentOrgUnit = useMemo(() => {
        if (!storePath || !orgUnits || !orgUnitLevels) return null
        const { adminLevel, orgUnit } = storePath
        const levelName = orgUnitLevels.find((level) => level.id === adminLevel)?.name
        const orgUnitList = orgUnits?.[adminLevel]
        const orgUnitName = orgUnitList?.find((ou) => ou.id === orgUnit)?.name || ''
        return `${levelName} de ${orgUnitName}`
    }, [storePath, orgUnits, orgUnitLevels])

    const activeOrgUnits = useMemo(() => {
        if (!storePath || !orgUnits) return null
        const { adminLevel } = storePath
        return orgUnits?.[adminLevel]
    }, [storePath, orgUnits])

    const adminLevelForecast = useMemo(() => {
        if (!storePath || !healthState) return null
        const { source, adminLevel } = storePath
        const forecastSource = healthState?.['forecast']?.[source]
        if (!forecastSource) return null
        return {
            avg: forecastSource?.['avg']?.[adminLevel] || null,
            lowci: forecastSource?.['lowci']?.[adminLevel] || null,
            uppci: forecastSource?.['uppci']?.[adminLevel] || null,
        }
    })

    const orgUnitForecast = useMemo(() => {
        if (!storePath || !healthState) return null
        const { source, adminLevel, orgUnit } = storePath
        const forecastSource = healthState?.['forecast']?.[source]
        if (!forecastSource) return null
        return {
            avg: { [orgUnit]: forecastSource?.['avg']?.[adminLevel]?.[orgUnit] || null },
            lowci: { [orgUnit]: forecastSource?.['lowci']?.[adminLevel]?.[orgUnit] || null },
            uppci: { [orgUnit]: forecastSource?.['uppci']?.[adminLevel]?.[orgUnit] || null },
        }
    })

    const dataTableData = useMemo(() => {
        if (!adminLevelForecast || !orgUnitForecast) return [] // Ensure valid input
        const { orgUnit } = storePath
        return orgUnit ? combineData(activeOrgUnits, orgUnitForecast) : combineData(activeOrgUnits, adminLevelForecast)
    }, [adminLevelForecast, orgUnitForecast, activeOrgUnits, storePath])

    const mapData = useMemo(() => {
        if (!adminLevelForecast) return [] // Ensure valid input
        return combineData(activeOrgUnits, adminLevelForecast)
    }, [adminLevelForecast, activeOrgUnits, storePath])

    const adminLevelColumns = useMemo(() => {
        if (!storePath || !orgUnitLevels) return []
        const { adminLevel } = storePath
        return getLevelNames(adminLevel, orgUnitLevels)
    }, [storePath, orgUnitLevels])

    const alert = useMemo(() => {
        if (!storePath || !healthState) return null
        const { adminLevel, orgUnit } = storePath
        const alertSource = healthState?.['alert']
        if (!alertSource) return null
        return {
            incidence: alertSource?.['incidence']?.[adminLevel]?.[orgUnit]?.[0] || null,
            csb: alertSource?.['csb']?.[adminLevel]?.[orgUnit]?.[0] || null,
            comCases: alertSource?.['comCases']?.[adminLevel]?.[orgUnit]?.[0] || null,
            trend: healthState?.['compare']?.['trend']?.[adminLevel]?.[orgUnit]?.[0] || null,
        }
    }, [storePath, healthState])

    const comparison = useMemo(() => {
        if (!storePath || !healthState) return null
        const { adminLevel, orgUnit } = storePath
        const compareSource = healthState?.['compare']
        if (!compareSource) return null
        return {
            incidence: compareSource?.['incidence']?.[adminLevel]?.[orgUnit]?.[0] || null,
            csb: compareSource?.['csb']?.[adminLevel]?.[orgUnit]?.[0] || null,
            comCases: compareSource?.['comCases']?.[adminLevel]?.[orgUnit]?.[0] || null,
        }
    }, [storePath, healthState])

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
    }, [
        historic,
        forecast,
        alert,
        comparison,
        forecastLimits,
        simulation,
        setHistoricData,
    ])

    useEffect(() => {
        if (!alert || !comparison) {
            return
        }
        setAlertData(alert)
        setComparisonData(comparison)
    }, [alert, comparison, setAlertData, setComparisonData])

    useEffect(() => {
        const isValid = isObjectValid(storePath)
        setDisplayVisualization(isValid)
    }, [storePath])

    // Callback functions

    const handleHelpBtnClick = (value) => {
        setOpenModal(value.open)
        setModalContent(value.content)
    }

    const handleSelection = (value) => {
        const isValid = isObjectValid(value)
        setDisplayVisualization(isValid)
        const { orgUnit } = value
        orgUnit ? setHighlightedOrgUnits([orgUnit]) : setHighlightedOrgUnits([]) 
        setStorePath(value)
    }

    const handleMapClick = useCallback(
        (event) => {
            const { orgUnit_id } = event
            setHighlightedOrgUnits([orgUnit_id])
            const payload = { 
                ...storePath, 
                orgUnit: orgUnit_id 
            }
            setStorePath(payload)
        },
        [storePath]
    )

    return (
        <DefaultLayout>
            <div className="container">
                <div className={style.headerNav}>
                    <div className={style.title}>{sample.title}</div>
                    <SelectionBar
                        themeColor={sample.currentThemeColor}
                        sourceOptions={sample.healthMetrics}
                        storeName={storeName}
                        onSelect={handleSelection}
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
                            <div style={{ height: '90%' }}>
                                {features && mapData && (
                                    <Map
                                        data={mapData}
                                        colors={sample.mapColors}
                                        highlightedOrgUnitIds={highlightedOrgUnits}
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
                            <LineChart
                                data={historicData}
                                showVisualization={displayVisualization}
                                title={`Nombre de cas pour ${currentOrgUnit}`}
                                xAxisText="Mois"
                                yAxisText="Nombre de cas"
                            />
                        </div>
                    </div>
                    <HelpButton
                        bgColor={sample.currentThemeColor}
                        text={sample.helpTexts.helpText_2}
                        onClick={handleHelpBtnClick}
                    />
                </div>
                <div className={style.dataTableSection}>
                    <div className={style.dataTableHeaderSection}>
                        <div className={style.dataTableHeader}>
                            <Typography variant="h4">
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

export default HealthTrend
