import { CircularProgress, Button, Typography, Box } from '@mui/material'
import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import fokontanyGeoData from '../../assets/geoData/fokontany-geojson.json'
import munipalityGeoData from '../../assets/geoData/municipalities-geojson.json'
import ForecastDataManager from '../../components/DataManager/ForecastDataManager'
import HistoricDataManager from '../../components/DataManager/HistoricDataManager'
import DataTable from '../../components/DataTable/index'
import HelpButton from '../../components/HelpButton'
import LineChart from '../../components/LineChart/index'
import Map from '../../components/Map/index'
import MetricsCard from '../../components/Metrics'
import Modal from '../../components/Modal/index'
import SearchInput from '../../components/SearchInput'
import CustomSlider from '../../components/Slider'
import ToggleButton from '../../components/ToggleButton'
import { sliderMarks } from '../../constants/config'
import COLORS from '../../constants/styles'
import DefaultLayout from '../../layout'
import { setForecastData, setHistoricData } from '../../redux/iraSlice'
import { convertToLocaleDate } from '../../utils/format-time'
import { sample } from './data'
import useIraData from './DataGenerator'
import style from './iraDashboard.module.scss'

const district = [{ id: 'VtP4BdCeXIo', displayName: 'Ifanadiana' }]

const currentYear = new Date().getFullYear()
const lastThreeYears = [currentYear - 6, currentYear - 7, currentYear - 8]

const IraTrend = () => {
    const dispatch = useDispatch()

    // State variables
    const [locationList, setLocationList] = useState([])
    const [adminLvl, setAdminLvl] = useState('district')
    const [activeGeoData, setActiveGeoData] = useState(undefined)
    const [lineChartTitle, setLineChartTitle] = useState('')
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

    // Redux state selectors
    const districtOrgUnitIds = district.map((element) => element.id)
    const municipalOrgUnitIds = useSelector(
        (state) => state.orgUnit.municipalities || []
    ).map((element) => element.id)
    const fokontanyOrgUnitIds = useSelector(
        (state) => state.orgUnit.fokontanyList || []
    ).map((element) => element.id)
    const iraState = useSelector((state) => state.ira)
    const fokontanyList = useSelector((state) => state.orgUnit.fokontanyList)
    const municipalities = useSelector((state) => state.orgUnit.municipalities)

    // Custom hook to get ira data
    const {
        forecastAdjustedAvgMunicipal,
        forecastAdjustedLowciMunicipal,
        forecastAdjustedUpperciMunicipal,
        forecastAdjustedAvgFokontany,
        forecastAdjustedLowciFokontany,
        forecastAdjustedUpperciFokontany,
        forecastDataTableMunicipal,
        forecastDataTableFokontany,
        forecastElements,
        historicElements,
    } = useIraData()

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
        [fokontanyList, municipalities]
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
            if (event.sectoAdminLvl === 'district') {
                setAdminLvl('fokontany')
            }
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
            if (adminLvl === 'municipal' && value) {
                setActiveOrgUnit(String(value.id))
                setHighlightedOrgUnits([value.id])
            } else if (adminLvl === 'fokontany' && value) {
                setActiveOrgUnit(String(value.id))
                setHighlightedOrgUnits([value.id])
            } else {
                if (!value) {
                    const orgUnitId = districtOrgUnitIds[0]
                    setActiveOrgUnit(String(orgUnitId))
                    setHighlightedOrgUnits([])
                } else {
                    console.error(
                        `adminDivisionType as ${adminLvl} is not available`
                    )
                }
            }
        },
        [adminLvl, districtOrgUnitIds]
    )

    // Effects
    useEffect(() => {
        const isDataAvailable =
            fokontanyGeoData &&
            munipalityGeoData &&
            forecastDataTableMunicipal &&
            forecastDataTableFokontany
        if (isDataAvailable) {
            setActiveGeoData(
                adminLvl === 'fokontany'
                    ? forecastDataTableFokontany
                    : adminLvl === 'municipal'
                    ? forecastDataTableMunicipal
                    : forecastDataTableFokontany
            )
            setActiveSectoData(
                adminLvl === 'fokontany'
                    ? fokontanyGeoData
                    : adminLvl === 'municipal'
                    ? munipalityGeoData
                    : fokontanyGeoData
            )
        }
    }, [
        adminLvl,
        fokontanyGeoData,
        munipalityGeoData,
        forecastDataTableMunicipal,
        forecastDataTableFokontany,
    ])

    useEffect(() => {
        if (activeOrgUnit && adminLvl) {
            const orgUnit = locationList.find(
                (element) => element.id === activeOrgUnit
            )
            if (orgUnit) {
                setLineChartTitle(
                    getLineChartTitle(adminLvl, orgUnit.displayName)
                )
            } else {
                setLineChartTitle(getLineChartTitle('district'))
            }
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
            const payload = {
                forecastType: 'adjusted',
                caseType: 'dataTable',
                adminLevel: 'fokontany',
                data: formattedData,
            }
            dispatch(setForecastData(payload))
        }
    }, [
        fokontanyList,
        forecastAdjustedAvgFokontany,
        forecastAdjustedLowciFokontany,
        forecastAdjustedUpperciFokontany,
        dispatch,
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
            const payload = {
                forecastType: 'adjusted',
                caseType: 'dataTable',
                adminLevel: 'municipal',
                data: data,
            }
            dispatch(setForecastData(payload))
        }
    }, [
        municipalities,
        forecastAdjustedAvgMunicipal,
        forecastAdjustedLowciMunicipal,
        forecastAdjustedUpperciMunicipal,
        dispatch,
    ])

    useEffect(() => {
        if (locationList.length !== 0) {
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
                    const minValue = minValues[index]
                        ? minValues[index].value
                        : null
                    const maxValue = maxValues[index]
                        ? maxValues[index].value
                        : null
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

    const getLineChartTitle = (adminLvl, orgUnitName = undefined) => {
        const defaultTitle = "Cas détecté dans le district d'Ifanadiana"
        const titles = {
            fokontany: `Cas détecté dans le fokontany de ${orgUnitName}`,
            municipal: `Cas détecté dans la commune de ${orgUnitName}`,
        }
        if (adminLvl !== 'district') {
            if (orgUnitName) {
                return titles[adminLvl]
            } else {
                return ''
            }
        } else {
            return defaultTitle
        }
    }

    const handleSetForecastData = (data) => {
        dispatch(setForecastData(data))
    }

    const handleSetHistoricData = (data) => {
        dispatch(setHistoricData(data))
    }

    return (
        <DefaultLayout>
            <div className="container" style={{ marginTop: -80 }}>
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
                <div className={style.statisticsSection}>
                    {sample.trends.map((item, index) => (
                        <MetricsCard
                            key={index}
                            item={item}
                            className={style.singleCard}
                            bgColor={sample.currentThemeColor}
                        />
                    ))}
                </div>
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
                        options={sample.adminitrativeDivisions}
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
                <div className={style.visualization}>
                    <div className={style.chartSection}>
                        <div className={style.mapContainer}>
                            <div style={{ height: '90%' }}>
                                <Map
                                    data={activeGeoData}
                                    sectoGeoData={activeSectoData}
                                    colors={sample.mapColors}
                                    highlightedOrgUnitIds={highlightedOrgUnits}
                                    periodId={mapPeriodId}
                                    adminLvl={adminLvl}
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
                                data={iraState}
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
                        title="Aide"
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

export default IraTrend
