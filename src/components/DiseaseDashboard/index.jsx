import React, { useState, useEffect, useMemo, useRef } from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useDiseaseConfig } from '@/contexts'
import { useDiseaseData } from '@/hooks'
import useHistoricData from '@/hooks/useHistoricData'
import useAlertData from '@/hooks/useAlertData'
import useExportRefs from '@/hooks/useExportRefs'
import useMapInteraction from '@/hooks/useMapInteraction'
import useMetaData from '@/hooks/useMetaData'
import DataTable from '@/components/DataTable/index'
import HelpButton from '@/components/HelpButton'
import TimeSeriesChart from '@/components/TimeSeriesChart/index'
import Map from '@/components/Map/index'
import Modal from '@/components/Modal/index'
import CustomSlider from '@/components/Slider'
import { sliderMarks } from '@/constants/config'
import COLORS from '@/constants/styles'
import DefaultLayout from '@/layout'
import MetricsPanel from '@/components/MetricsPanel'
import SelectionBar from '@/components/DiseaseDashboard/SelectionBar'
import { isObjectValid } from '@/utils/validation'
import { combineData } from '@/utils/dataProcessing'
import { Thumbtack, UnThumbtack } from '@/components/Icons'
import { getLevelNames } from '@/utils/adminLevelHelpers'
import FloatingActionButton from '@/components/FloatingActionButton'
import { useSelector } from 'react-redux'
import fabStyle from '../FloatingActionButton/FloatingActionButton.module.scss'
import style from './diseaseDashboard.module.scss'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import PushPinIcon from '@mui/icons-material/PushPin'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'

const DiseaseDashboard = () => {
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

    // Extracted hooks
    const historicData = useHistoricData({
        historic,
        forecast,
        simulation,
        forecastLimits,
    })
    const { alertData, comparisonData } = useAlertData({ alert, comparison })
    const { mapPeriodId, setMapPeriodId, handleMapClick } = useMapInteraction()
    const metaData = useMetaData({ storePath, sample })
    const exports = useExportRefs()

    // Redux state
    const selectedOrgUnit = useSelector(
        (state) => state.temp.selectors?.orgUnit
    )

    // Local state
    const [openModal, setOpenModal] = useState(false)
    const [openLocationModal, setOpenLocationModal] = useState(false)
    const [locationModalContent, setLocationModalContent] = useState({
        title: '',
        content: '',
    })
    const [modalContent, setModalContent] = useState('')
    const [isSmallScreen, setIsSmallScreen] = useState(false)
    const [isSticky, setIsSticky] = useState(false)
    const metricsPanelRef = useRef(null)
    const [topPosition, setTopPosition] = useState(null)

    // Computed values
    const dataTableData = useMemo(() => {
        if (!adminLevelForecast || !orgUnitForecast) {
            return []
        }
        const { orgUnit } = storePath || {}
        return orgUnit
            ? combineData(activeOrgUnits, orgUnitForecast)
            : combineData(activeOrgUnits, adminLevelForecast)
    }, [adminLevelForecast, orgUnitForecast, activeOrgUnits, storePath])

    const mapData = useMemo(() => {
        if (!adminLevelForecast) {
            return []
        }
        return combineData(activeOrgUnits, adminLevelForecast)
    }, [adminLevelForecast, activeOrgUnits])

    const adminLevelColumns = useMemo(() => {
        if (!storePath || !orgUnitLevels) {
            return []
        }
        const { adminLevel } = storePath
        return getLevelNames(adminLevel, orgUnitLevels)
    }, [storePath, orgUnitLevels])

    const displayVisualization = useMemo(
        () => isObjectValid(storePath),
        [storePath]
    )

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

    const [isPanelVisible, setIsPanelVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const panel = metricsPanelRef.current
            if (!panel) return

            const rect = panel.getBoundingClientRect()
            const windowHeight =
                window.innerHeight || document.documentElement.clientHeight

            const isVisible = rect.top < windowHeight && rect.bottom > 0
            setIsPanelVisible(isVisible)
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll() 

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <DefaultLayout>
            <div style={{ position: 'relative' }}>
                <div className={style.headerNav}>
                    <div className={style.title}>{sample.title}</div>
                    <SelectionBar
                        themeColor={sample.themeColor}
                        sourceOptions={sample.healthMetrics}
                    />
                </div>
                <div
                    ref={metricsPanelRef}
                    style={{
                        position: isSticky ? 'sticky' : 'relative',
                        top: isSticky ? 116 : 'auto',
                        zIndex: isSticky ? 777 : 10,
                    }}
                >
                    <MetricsPanel
                        themeColor={sample.themeColor}
                        alertData={alertData}
                        comparisonData={comparisonData}
                    />
                </div>
                {selectedOrgUnit && (
                    <div
                        style={{
                            position: 'fixed',
                            right: '35px',
                            top: metricsPanelRef.current
                                ? metricsPanelRef.current.getBoundingClientRect()
                                      .top +
                                  metricsPanelRef.current.offsetHeight / 2 -
                                  68
                                : 'auto',
                            zIndex: 1000,
                            // invisible si panel pas visible ET pas sticky
                            opacity: isSticky || isPanelVisible ? 1 : 0,
                            pointerEvents:
                                isSticky || isPanelVisible ? 'auto' : 'none',
                            transition: 'opacity 0.2s ease',
                        }}
                    >
                        <ToggleButtonGroup
                            value={isSticky ? 'pinned' : 'unpinned'}
                            exclusive
                            onChange={(event, newValue) => {
                                if (newValue !== null)
                                    setIsSticky(newValue === 'pinned')
                            }}
                            aria-label="sticky panel"
                        >
                            <ToggleButton value="pinned" aria-label="pin panel">
                                <PushPinIcon />
                            </ToggleButton>
                            <ToggleButton
                                value="unpinned"
                                aria-label="unpin panel"
                            >
                                <PushPinOutlinedIcon />
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                )}
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
                                onCaptureClick={
                                    exports.handleCaptureClickCallback
                                }
                                metaData={metaData}
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
                                        bgColor={sample.themeColor}
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
                            bgColor={sample.themeColor}
                            text={sample.helpTexts.helpText_3}
                            onClick={handleHelpBtnClick}
                        />
                    </div>
                    {dataTableData && (
                        <DataTable
                            data={dataTableData}
                            orgUnitColumns={adminLevelColumns}
                            onExcelExport={exports.handleExcelExportCallback}
                            onPdfExport={exports.handlePdfExportCallback}
                            metaData={metaData}
                            themeColor={sample.themeColor}
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
                    fabColor={sample.themeColor}
                    modalContent={(onClose) => (
                        <div className={fabStyle.modalContent}>
                            {selectedOrgUnit && (
                                <div
                                    className={fabStyle.button}
                                    style={{
                                        backgroundColor: sample.themeColor,
                                    }}
                                    onClick={() => {
                                        exports.handleLineChartCapture()
                                        onClose()
                                    }}
                                >
                                    Serie temporelle
                                </div>
                            )}
                            <div
                                className={fabStyle.button}
                                style={{ backgroundColor: sample.themeColor }}
                                onClick={() => {
                                    exports.handleTableExport()
                                    onClose()
                                }}
                            >
                                Tableau de donnees (Format excel)
                            </div>
                            <div
                                className={fabStyle.button}
                                style={{ backgroundColor: sample.themeColor }}
                                onClick={() => {
                                    exports.handlePdfExport()
                                    onClose()
                                }}
                            >
                                Tableau de donnees (Format PDF)
                            </div>
                        </div>
                    )}
                />
            </div>
        </DefaultLayout>
    )
}

export default DiseaseDashboard
