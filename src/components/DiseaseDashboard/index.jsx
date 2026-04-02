import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useDispatch, useSelector } from 'react-redux'
import { useDiseaseConfig } from '@/contexts'
import { useDiseaseData } from '@/hooks'
import DataTable from '@/components/DataTable/index'
import HelpButton from '@/components/HelpButton'
import TimeSeriesChart from '@/components/TimeSeriesChart/index'
import Map from '@/components/Map/index'
import Modal from '@/components/Modal/index'
import CustomSlider from '@/components/Slider'
import { sliderMarks } from '@/constants/config'
import COLORS from '@/constants/styles'
import DefaultLayout from '@/layout'
import style from '@/components/DiseaseDashboard/diseaseDashboard.module.scss'
import MetricsPanel from '@/components/MetricsPanel'
import SelectionBar from '@/components/DiseaseDashboard/SelectionBar'
import { setSelectors } from '@/redux/tempSlice'
import { isObjectValid } from '@/utils/validation'
import {
    combineData,
    replaceFirstNullWithRankValue,
} from '@/utils/dataProcessing'
import { getLevelNames } from '@/utils/adminLevelHelpers'
import FloatingActionButton from '@/components/FloatingActionButton'
import fabStyle from '@/components/FloatingActionButton/FloatingActionButton.module.scss'

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

    // Redux selectors with memoization
    const adminLevels = useSelector((state) => state.orgUnit.orgUnitLevels)

    // Refs for export functions
    const excelExportRef = useRef(null)
    const captureClickRef = useRef(null)

    // Computed values
    const dataTableData = useMemo(() => {
        if (!adminLevelForecast || !orgUnitForecast) { return [] }
        const { orgUnit } = storePath || {}
        return orgUnit
            ? combineData(activeOrgUnits, orgUnitForecast)
            : combineData(activeOrgUnits, adminLevelForecast)
    }, [adminLevelForecast, orgUnitForecast, activeOrgUnits, storePath])

    const mapData = useMemo(() => {
        if (!adminLevelForecast) { return [] }
        return combineData(activeOrgUnits, adminLevelForecast)
    }, [adminLevelForecast, activeOrgUnits])

    const adminLevelColumns = useMemo(() => {
        if (!storePath || !orgUnitLevels) { return [] }
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
        if (!alert || !comparison) { return }
        setAlertData(alert)
        setComparisonData(comparison)
    }, [alert, comparison])

    const metaData = useMemo(() => {
        const foundMetric = sample.healthMetrics.find(({ value }) => value === storePath['source'])
        const source = foundMetric ? foundMetric.label : ''
        
        const disease = sample.title ? sample.title: ''

        const foundAdminLevel = adminLevels.find(({ id }) => id === storePath['adminLevel'] )
        const adminLevel = foundAdminLevel ? foundAdminLevel.name : ''

        return { source, disease, adminLevel }
    }, [storePath, adminLevels, sample])

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

    const handleExcelExportCallback = useCallback((fn) => {
        excelExportRef.current = fn
    }, [])

    const handleTableExport = useCallback(() => {
        if (excelExportRef.current) {
            excelExportRef.current()
        }
    }, [])

    const handleCaptureClickCallback = useCallback((fn) => {
        captureClickRef.current = fn
    }, [])

    const handleLineChartCapture = useCallback(() => {
        if (captureClickRef.current) {
            captureClickRef.current()
        }
    }, [])

    return (
        <DefaultLayout>
            <div style={{position: 'relative'}}>
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
                                            (storePath || {}).orgUnit,
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
                                onCaptureClick={handleCaptureClickCallback}
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
                            onExcelExport={handleExcelExportCallback}
                            metaData={metaData}
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
                <FloatingActionButton
                    modalTitle="Telecharger"
                    fabLabel="Telecharger"
                    fabColor={sample.currentThemeColor}
                    fabHoverColors={sample.darkerCurrentColors}
                    modalContent={
                        <div className={fabStyle.modalContent}>
                            <div
                                className={fabStyle.button}
                                style={{ backgroundColor: sample.currentThemeColor }}
                                onClick={() => {}}
                            >
                                Carte 
                            </div>
                            <div
                                className={fabStyle.button}
                                style={{ backgroundColor: sample.currentThemeColor }}
                                onClick={handleLineChartCapture}
                            >
                                Serie temporelle
                            </div>
                            <div
                                className={fabStyle.button}
                                style={{ backgroundColor: sample.currentThemeColor }}
                                onClick={handleTableExport}
                            >
                                Tableau de donnees
                            </div>
                        </div>
                    }
                />
            </div>
        </DefaultLayout>
    )
}

export default DiseaseDashboard
