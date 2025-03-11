import { Typography } from '@mui/material'
import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useOrgUnits from '../../hooks/useOrgUnits'
import ForecastDataManager from '../../components/DataManager/ForecastDataManager'
import HistoricDataManager from '../../components/DataManager/HistoricDataManager'
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

const district = [{ id: 'VtP4BdCeXIo', displayName: 'Ifanadiana' }]
const currentYear = new Date().getFullYear()
const lastThreeYears = [currentYear - 7, currentYear - 8, currentYear - 9]

const HealthTrend = ({
    trendType, // 'ira', 'malaria', or 'diarrhea'
    dataGeneratorHook, // Custom hook for fetching data
    reduxSetForecastData, // Redux action for setting forecast data
    reduxSetHistoricData, // Redux action for setting historic data
    sample,
}) => {
    const dispatch = useDispatch()
    const [locationList, setLocationList] = useState(district)
    const [adminLvl, setAdminLvl] = useState('district')
    const [activeGeoData, setActiveGeoData] = useState(undefined)
    const [lineChartTitle, setLineChartTitle] = useState('')
    const [currentAdminLvl, setCurrentAdminLvl] = useState(3)
    const [activeSectoData, setActiveSectoData] = useState(undefined)
    const [activeOrgUnit, setActiveOrgUnit] = useState('VtP4BdCeXIo')
    const [openModal, setOpenModal] = useState(false)
    const [openLocationModal, setOpenLocationModal] = useState(false)
    const [locationModalContent, setLocationModalContent] = useState({
        title: '',
        content: '',
    })
    const [modalContent, setModalContent] = useState('')
    const [mapPeriodId, setMapPeriodId] = useState(0)
    const [highlightedOrgUnits, setHighlightedOrgUnits] = useState([])
    const [alertCachedData, setAlertCachedData] = useState()
    const [comparisonCachedData, setComparisonCachedData] = useState()
    const [mapFeatures, setMapFeatures] = useState([]) 

    // Redux state selectors
    const districtOrgUnitIds = district.map((element) => element.id)
    const municipalOrgUnitIds = useSelector(
        (state) => state.orgUnit.municipalities || []
    ).map((element) => element.id)
    const fokontanyOrgUnitIds = useSelector(
        (state) => state.orgUnit.fokontanyList || []
    ).map((element) => element.id)

    const healthState = useSelector((state) => state[trendType]) 
    
    const fokontanyList = useSelector((state) => state.orgUnit.fokontanyList)
    const municipalities = useSelector((state) => state.orgUnit.municipalities)

    // Custom hook to get health data
    const {
        forecastAdjustedAvgDistrict,
        forecastAdjustedLowciDistrict,
        forecastAdjustedUpperciDistrict,
        forecastAdjustedAvgMunicipal,
        forecastAdjustedLowciMunicipal,
        forecastAdjustedUpperciMunicipal,
        forecastAdjustedAvgFokontany,
        forecastAdjustedLowciFokontany,
        forecastAdjustedUpperciFokontany,
        forecastDataTableDistrict,
        forecastDataTableMunicipal,
        forecastDataTableFokontany,
        forecastElements,
        historicElements,
    } = dataGeneratorHook()

    const { features, orgUnits, loading } = useOrgUnits({
        parent: 'VtP4BdCeXIo',
        level: currentAdminLvl,
    })

    useEffect(() => {
        if (features) {
            setMapFeatures(features)
        }
    }, [features])

    useEffect(() => {
        sample.adminLevel.find((element) => {
            if (element.value === adminLvl) {
                setCurrentAdminLvl(element.level)
            }
        })
    }, [adminLvl, currentAdminLvl])

    // Callback functions
    const setHealthMetric = useCallback((value) => {
        console.log(`Health Metric: ${value}`)
    }, [])

    const setAgeClass = useCallback((value) => {
        console.log(`Age Class: ${value}`)
    }, [])

    const handleAdminLvl = useCallback(
        (value) => {
            setAdminLvl(value)
            setLocationList(
                value === 'fokontany'
                    ? fokontanyList
                    : value === 'municipal'
                    ? municipalities
                    : district
            )
        },
        [fokontanyList, municipalities, district]
    )

    const handleHelpBtnClick = (value) => {
        setOpenModal(value.open)
        setModalContent(value.content)
    }

    const handleMapClick = useCallback(
        (event) => {
            const orgUnitId = event.orgUnit_id
            setHighlightedOrgUnits([orgUnitId])
            setActiveOrgUnit(String(orgUnitId))
            setAdminLvl(
                event.sectoAdminLvl === 'district'
                    ? 'district'
                    : event.sectoAdminLvl
            )
            setLocationList(
                event.sectoAdminLvl === 'fokontany'
                    ? fokontanyList
                    : event.sectoAdminLvl === 'municipal'
                    ? municipalities
                    : district
            )
        },
        [fokontanyList, municipalities]
    )

    const setCurrentLocation = useCallback(
        (value) => {
            if (value && ['municipal', 'fokontany'].includes(adminLvl)) {
                setActiveOrgUnit(String(value.id))
                setHighlightedOrgUnits([value.id])
            } else if (!value) {
                const orgUnitId = districtOrgUnitIds[0]
                setActiveOrgUnit(String(orgUnitId))
                setHighlightedOrgUnits([])
            } else {
                console.error(
                    `adminDivisionType as ${adminLvl} is not available`
                )
            }
        },
        [adminLvl, districtOrgUnitIds]
    )

    // Effects
    useEffect(() => {
        const isDataAvailable =
            forecastDataTableMunicipal &&
            forecastDataTableFokontany
        if (isDataAvailable) {
            setActiveGeoData(
                adminLvl === 'fokontany'
                    ? forecastDataTableFokontany
                    : adminLvl === 'municipal'
                    ? forecastDataTableMunicipal
                    : forecastDataTableDistrict
            )
        }
    }, [
        adminLvl,
        forecastDataTableMunicipal,
        forecastDataTableFokontany,
        forecastAdjustedAvgDistrict
    ])

    useEffect(() => {
        if (activeOrgUnit && adminLvl) {
            const orgUnit = locationList.find(
                (element) => element.id === activeOrgUnit
            )
            setLineChartTitle(
                orgUnit
                    ? getLineChartTitle(adminLvl, orgUnit.displayName)
                    : getLineChartTitle('district')
            )
        } else {
            setLineChartTitle(getLineChartTitle('district'))
        }
    }, [activeOrgUnit, adminLvl, locationList])

    useEffect(() => {
        const isDataAvailable =
            fokontanyList &&
            forecastAdjustedAvgFokontany &&
            forecastAdjustedLowciFokontany &&
            forecastAdjustedUpperciFokontany
        if (isDataAvailable && !forecastDataTableFokontany) {
            const formattedData = handleGeoData(
                fokontanyList,
                forecastAdjustedAvgFokontany,
                forecastAdjustedLowciFokontany,
                forecastAdjustedUpperciFokontany
            )
            dispatch(
                reduxSetForecastData({
                    forecastType: 'adjusted',
                    caseType: 'dataTable',
                    adminLevel: 'fokontany',
                    data: formattedData,
                })
            )
        }
    }, [
        fokontanyList,
        forecastAdjustedAvgFokontany,
        forecastAdjustedLowciFokontany,
        forecastAdjustedUpperciFokontany,
        dispatch,
        forecastDataTableFokontany,
    ])

    useEffect(() => {
        const isDataAvailable =
            municipalities &&
            forecastAdjustedAvgMunicipal &&
            forecastAdjustedLowciMunicipal &&
            forecastAdjustedUpperciMunicipal
        if (isDataAvailable && !forecastDataTableMunicipal) {
            const data = handleGeoData(
                municipalities,
                forecastAdjustedAvgMunicipal,
                forecastAdjustedLowciMunicipal,
                forecastAdjustedUpperciMunicipal
            )
            dispatch(
                reduxSetForecastData({
                    forecastType: 'adjusted',
                    caseType: 'dataTable',
                    adminLevel: 'municipal',
                    data: data,
                })
            )
        }
    }, [
        municipalities,
        forecastAdjustedAvgMunicipal,
        forecastAdjustedLowciMunicipal,
        forecastAdjustedUpperciMunicipal,
        dispatch,
        forecastDataTableMunicipal,
    ])

    useEffect(() => {
        const isDataAvailable =
            district &&
            forecastAdjustedAvgDistrict &&
            forecastAdjustedLowciDistrict &&
            forecastAdjustedUpperciDistrict
        if (isDataAvailable && !forecastDataTableDistrict) {
            const data = handleGeoData(
                district,
                forecastAdjustedAvgDistrict,
                forecastAdjustedLowciDistrict,
                forecastAdjustedUpperciDistrict
            )
            dispatch(
                reduxSetForecastData({
                    forecastType: 'adjusted',
                    caseType: 'dataTable',
                    adminLevel: 'district',
                    data: data,
                })
            )
        }
    }, [
        district,
        forecastAdjustedAvgDistrict,
        forecastAdjustedLowciDistrict,
        forecastAdjustedUpperciDistrict,
        dispatch,
        forecastDataTableDistrict,
    ])

    useEffect(() => {
        if (locationList.length > 1) {
            setOpenLocationModal(true)
            setLocationModalContent({
                title: 'Localisation',
                content: (
                    <SearchInput
                        borderColor={sample.currentThemeColor}
                        options={locationList}
                        adminDivisionType={adminLvl}
                        onSelect={setCurrentLocation}
                        width={'80%'}
                        disabled={locationList.length === 0}
                    />
                ),
            })
        }
    }, [adminLvl, locationList])

    const loadCachedData = async () => {
        const alertData = await getCachedData(`${trendType}_alert`)
        const comparisonData = await getCachedData(`${trendType}_compare`)
        setAlertCachedData(alertData)
        setComparisonCachedData(comparisonData)
    }

    useEffect(() => {
        loadCachedData()
    }, [])

    // Helper functions
    const handleGeoData = (orgUnits, mean, min, max) => {
        const newArray = []
        let idCounter = 1
        orgUnits.forEach((orgUnit) => {
            const {
                id,
                displayName,
                municipality = '',
                municipalityId = null,
            } = orgUnit
            if (mean[id] && min[id] && max[id]) {
                const meanValues = mean[id]
                const minValues = min[id]
                const maxValues = max[id]
                meanValues.forEach((meanEntry, index) => {
                    const period = meanEntry.period
                    const minValue = minValues[index]?.value || null
                    const maxValue = maxValues[index]?.value || null
                    newArray.push({
                        id: idCounter++,
                        period: period,
                        periodName: convertToLocaleDate(period),
                        orgUnit: id,
                        orgUnitName: displayName,
                        municipality: municipality,
                        municipalityId: municipalityId,
                        min: minValue,
                        mean: meanEntry.value,
                        max: maxValue,
                    })
                })
            }
        })
        return newArray
    }
    const getLineChartTitle = (adminLvl, orgUnitName) => {
        const defaultTitle = `Cas détecté dans le district d'Ifanadiana`
        const titles = {
            fokontany: `Cas détecté dans le fokontany de ${orgUnitName}`,
            municipal: `Cas détecté dans la commune de ${orgUnitName}`,
        }
        return adminLvl !== 'district' && orgUnitName
            ? titles[adminLvl]
            : defaultTitle
    }
    const handleSetForecastData = (data) => {
        dispatch(reduxSetForecastData(data))
    }
    const handleSetHistoricData = (data) => {
        dispatch(reduxSetHistoricData(data))
    }
    return (
        <DefaultLayout>
            <div className="container">
                {forecastElements.map((element, index) => (
                    <ForecastDataManager
                        key={index}
                        forecastType={element.forecastType}
                        caseType={element.caseType}
                        adminLevel={element.adminLevel}
                        orgUnitIds={
                            element.adminLevel === 'district'
                                ? districtOrgUnitIds
                                : element.adminLevel === 'municipal'
                                ? municipalOrgUnitIds
                                : fokontanyOrgUnitIds
                        }
                        dataElementId={element.dataElementId}
                        periods={element.periods}
                        onSetForecastData={handleSetForecastData}
                        storedValue={element.storedValue}
                    />
                ))}
                {historicElements.map((element, index) => (
                    <HistoricDataManager
                        key={index}
                        caseType={element.caseType}
                        adminLevel={element.adminLevel}
                        orgUnitIds={
                            element.adminLevel === 'district'
                                ? districtOrgUnitIds
                                : element.adminLevel === 'municipal'
                                ? municipalOrgUnitIds
                                : fokontanyOrgUnitIds
                        }
                        dataElementId={element.dataElementId}
                        onSetHistoricData={handleSetHistoricData}
                        storedValue={element.storedValue}
                        periods={lastThreeYears}
                    />
                ))}
                <div className={style.headerNav}>
                    <div className={style.title}>{sample.title}</div>
                    <div className={style.filterSection}>
                        <ToggleButton
                            options={sample.healthMetrics}
                            bgColor={sample.currentThemeColor}
                            onSelect={setHealthMetric}
                        />
                        <ToggleButton
                            options={sample.ageClasses}
                            bgColor={sample.currentThemeColor}
                            onSelect={setAgeClass}
                        />
                        <ToggleButton
                            options={sample.adminLevel}
                            bgColor={sample.currentThemeColor}
                            onSelect={handleAdminLvl}
                        />
                        <SearchInput
                            borderColor={sample.currentThemeColor}
                            options={locationList}
                            adminDivisionType={adminLvl}
                            onSelect={setCurrentLocation}
                        />
                        <HelpButton
                            bgColor={sample.currentThemeColor}
                            text={sample.helpTexts.helpText_1}
                            onClick={handleHelpBtnClick}
                        />
                    </div>
                </div>
                <MetricsPanel
                    adminLvl={adminLvl}
                    orgUnit={activeOrgUnit}
                    store={healthState}
                    themeColor={sample.currentThemeColor}
                    alertData={alertCachedData}
                    comparisonData={comparisonCachedData}
                />
                <div className={style.visualization}>
                    <div className={style.chartSection}>
                        <div className={style.mapContainer}>
                            <div style={{ height: '90%' }}>
                                <Map
                                    data={activeGeoData}
                                    colors={sample.mapColors}
                                    highlightedOrgUnitIds={highlightedOrgUnits}
                                    periodId={mapPeriodId}
                                    adminLvl={adminLvl}
                                    features={mapFeatures}
                                    onClick={handleMapClick}
                                />
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
                                data={healthState}
                                title={lineChartTitle}
                                xAxisText="Mois"
                                yAxisText="Nombre de cas"
                                adminLvl={adminLvl}
                                activeOrgUnit={activeOrgUnit}
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
                    {forecastDataTableFokontany && (
                        <DataTable
                            data={forecastDataTableFokontany}
                            orgUnitList={fokontanyList}
                        />
                    )}
                    <Modal
                        open={openModal}
                        handleClose={() => setOpenModal(false)}
                        title="Help"
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