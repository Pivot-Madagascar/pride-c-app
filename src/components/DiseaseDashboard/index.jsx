import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Typography from '@mui/material/Typography'
import { useDispatch } from 'react-redux'
import { useDiseaseConfig } from '../../contexts/DiseaseContext.jsx'
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
import { isObjectValid } from '../../utils/validation'
import {
    combineData,
    replaceFirstNullWithRankValue,
} from '../../utils/dataProcessing'
import { getLevelNames } from '../../utils/adminLevelHelpers'

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
    const [isSmallScreen, setIsSmallScreen] = useState(false)

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

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 900)
        }

        window.addEventListener('resize', handleResize)
        handleResize()

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

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
                            {!isSmallScreen && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        right: '0.2rem',
                                        top: '0.25rem',
                                        zIndex: '700',
                                    }}
                                >
                                    <HelpButton
                                        bgColor={sample.currentThemeColor}
                                        text={sample.helpTexts.helpText_2}
                                        onClick={handleHelpBtnClick}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div
                    className={style.dataTableSection}
                    style={{
                        marginTop:
                            isSmallScreen && !displayVisualization
                                ? '-6rem'
                                : '-2rem',
                    }}
                >
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
                        onClose={() => setOpenModal(false)}
                        title="Aides"
                    >
                        <div
                            dangerouslySetInnerHTML={{ __html: modalContent }}
                        />
                    </Modal>
                    <Modal
                        open={openLocationModal}
                        onClose={() => setOpenLocationModal(false)}
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
