import { useDataEngine } from '@dhis2/app-runtime'
import Box from '@mui/material/Box'
import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { format, addMonths } from 'date-fns'
import { fr } from 'date-fns/locale'
import getClimateHistoric from '../../components/ClimateDisplay/data/historic'
import DataManager from '../../components/DataManager'
import HelpButton from '../../components/HelpButton'
import Loader from '../../components/Loader'
import Modal from '../../components/Modal'
import DefaultLayout from '../../layout'
import RouterLink from '../../routes/components/router-link'
 
import { setDiarrheaData } from '../../redux/diarrheaSlice'
import { setIraData } from '../../redux/iraSlice'
import { setMalariaData } from '../../redux/malariaSlice'
import { setClimateData } from '../../redux/climateSlice'
 
import { fetchOrgUnitFlow } from '../../thunks/FetchOrgUnitFlow'
 
import { convertToLocaleDate, getMonthYYYYMM } from '../../utils/format-time'
import { fullReset } from '../../utils/dataManagement'
 
import getDiarrheaIndicator from '../diarrhea/data/indicators'
import getIraIndicator from '../ira/data/indicators'
import getMalariaIndicator from '../malaria/data/indicators'
import getMalariaForecast from '../malaria/data/forecast.js'
import getMalariaHistoric from '../malaria/data/historics.js'
import getMalariaSimulation from '../malaria/data/simulation.js'
import getIraForecast from '../ira/data/forecast.js'
import getIraHistoric from '../ira/data/historics.js'
import getIraSimulation from '../ira/data/simulation.js'
import getDiarrheaForecast from '../diarrhea/data/forecast.js'
import getDiarrheaHistoric from '../diarrhea/data/historics.js'
import getDiarrheaSimulation from '../diarrhea/data/simulation.js'
import StatisticCard from './components/StatisticCard'
import style from './dashboard.module.scss'
import useDashboardElements from './data/useDashboardData'
 
const PARENT_ID = 'VtP4BdCeXIo'
 
const currentDate = new Date()
const periodStart = format(currentDate, 'MMMM yyyy', { locale: fr })
const monthAfterNext = addMonths(currentDate, 2)
const periodEnd = format(monthAfterNext, 'MMMM yyyy', { locale: fr })
 
// Helpers
 
const haveSameElements = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {return false}
    const set1 = new Set(arr1)
    for (const item of set1) {
        if (!new Set(arr2).has(item)) {return false}
    }
    return true
}
 
// Component
 
const Dashboard = () => {
    const engine = useDataEngine() 
    const navigate = useNavigate()
    const dispatch = useDispatch()
 
    const [counter, setCounter] = useState(0)
    const [allDataFetched, setAllDataFetched] = useState(false)
    const [isSmallScreen, setIsSmallScreen] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [modalContent, setModalContent] = useState('')
 
    // Redux Selectors 
    const storeOrgUnits = useSelector((state) => state.orgUnit.orgUnits)
    const orgUnitFlowStatus = useSelector((state) => state.orgUnit.flowStatus) 
    const orgUnitLevels = useSelector((state) => state.orgUnit.orgUnitLevels)
 
    // Indicators 
    const { indicatorElements: malariaIndicators } = getMalariaIndicator()
    const { indicatorElements: iraIndicators } = getIraIndicator()
    const { indicatorElements: diarrheaIndicators } = getDiarrheaIndicator()
    const { climateElements } = getClimateHistoric()

    const { forecastElements: malariaForecastElements } = getMalariaForecast()
    const { historicElements: malariaHistoricElements } = getMalariaHistoric()
    const { simulationElements: malariaSimulationElements } = getMalariaSimulation()
    const { forecastElements: iraForecastElements } = getIraForecast()
    const { historicElements: iraHistoricElements } = getIraHistoric()
    const { simulationElements: iraSimulationElements } = getIraSimulation()
    const { forecastElements: diarrheaForecastElements } = getDiarrheaForecast()
    const { historicElements: diarrheaHistoricElements } = getDiarrheaHistoric()
    const { simulationElements: diarrheaSimulationElements } = getDiarrheaSimulation()
 
    const indicators = [
        {
            dataElements: malariaIndicators,
            reduxAction: setMalariaData,
            store: useSelector((state) => state.malaria),
        },
        {
            dataElements: diarrheaIndicators,
            reduxAction: setDiarrheaData,
            store: useSelector((state) => state.diarrhea),
        },
        {
            dataElements: iraIndicators,
            reduxAction: setIraData,
            store: useSelector((state) => state.ira),
        },
        {
            dataElements: [
                ...malariaForecastElements,
                ...malariaHistoricElements,
                ...malariaSimulationElements,
            ],
            reduxAction: setMalariaData,
            store: useSelector((state) => state.malaria),
        },
        {
            dataElements: [
                ...iraForecastElements,
                ...iraHistoricElements,
                ...iraSimulationElements,
            ],
            reduxAction: setIraData,
            store: useSelector((state) => state.ira),
        },
        {
            dataElements: [
                ...diarrheaForecastElements,
                ...diarrheaHistoricElements,
                ...diarrheaSimulationElements,
            ],
            reduxAction: setDiarrheaData,
            store: useSelector((state) => state.diarrhea),
        },
        {
            dataElements: climateElements,
            reduxAction: setClimateData,
            store: useSelector((state) => state.climate),
        },
    ]
 
    useEffect(() => {
        const run = async () => {
            try {
                await dispatch(
                    fetchOrgUnitFlow({ engine, parentId: PARENT_ID })
                ).unwrap()
                // After unwrap(): parentDetails, orgUnitLevels and orgUnits
                // are all in Redux — DataManagers can start
            } catch (err) {
                console.error('[Dashboard] fetchOrgUnitFlow failed:', err)
                navigate('/error')
            }
        }
 
        run()
    }, [engine]) 
 
    // Detect when all orgUnits are available 
    const orgUnitsAvailable = useMemo(() => {
        if (!storeOrgUnits || !orgUnitLevels) {return false}
        const keys = Object.keys(storeOrgUnits)
        const adminLevelKeys = orgUnitLevels.map((level) => level.id)
        return haveSameElements(keys, adminLevelKeys)
    }, [storeOrgUnits, orgUnitLevels])
 
    // Safety timeout 
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!allDataFetched) {navigate('/error')}
        }, 2 * 60 * 1000)
        return () => clearTimeout(timer)
    }, [allDataFetched])
 
    // Responsive
    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 900)
        window.addEventListener('resize', handleResize)
        handleResize()
        return () => window.removeEventListener('resize', handleResize)
    }, [])
 
    // DataManager counter
    useEffect(() => {
        const timer = setTimeout(() => {
            setAllDataFetched(indicators.length === counter)
        }, 500)
        return () => clearTimeout(timer)
    }, [counter])
 
    const { dashboardMetrics, helpText } = useDashboardElements()
    const parentDetails = useSelector((state) => state.orgUnit.parentDetails)
 
    const handleHelpBtnClick = (value) => {
        setOpenModal(value.open)
        setModalContent(value.content)
    }
 
    const handleClearCache = async () => {
        await fullReset()
        navigate('/')
    }
 
    return (
        <DefaultLayout>
            <>
                {orgUnitsAvailable &&
                    indicators.map(({ dataElements, reduxAction, store }, index) => (
                        <DataManager
                            key={index}
                            dataElements={dataElements}
                            reduxAction={reduxAction}
                            store={store}
                            onDataFetched={() => setCounter((prev) => prev + 1)}
                        />
                    ))}
 
                {!allDataFetched ? (
                    <Loader />
                ) : (
                    <div className={style.container}>
                        <div
                            className={style.main}
                            style={{ marginTop: '60px', position: 'relative' }}
                        >
                            <div
                                className={style.title}
                                style={{ marginTop: isSmallScreen ? '20px' : '0px' }}
                            >
                                Prédiction entre le mois de{' '}
                                <br style={{ display: isSmallScreen ? 'block' : 'none' }} />
                                <span className={style.subString}>{periodStart}</span>{' '}
                                et{' '}
                                <span className={style.subString}>{periodEnd}</span>{' '}
                                <br /> dans le district de{' '}
                                <span className={style.subString}>Ifanadiana</span>
                            </div>
                            <HelpButton
                                bgColor="#D8D8D8"
                                sx={{
                                    position: 'absolute',
                                    top: isSmallScreen ? '-50px' : '25px',
                                    right: isSmallScreen ? '0px' : '25px',
                                }}
                                text={helpText}
                                onClick={handleHelpBtnClick}
                            />
                            <div className={style.statistics}>
                                {dashboardMetrics.map((item, index) => (
                                    <Box
                                        component={RouterLink}
                                        href={item.href}
                                        key={index}
                                        sx={{ color: '#333333' }}
                                    >
                                        <StatisticCard
                                            item={item}
                                            periods={{ start: periodStart, end: periodEnd }}
                                        />
                                    </Box>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </>
 
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                title="Aide"
            >
                <div>
                    <div dangerouslySetInnerHTML={{ __html: modalContent }} />
                    <div className={style.button} onClick={handleClearCache}>
                        Effacer le cache
                    </div>
                </div>
            </Modal>
        </DefaultLayout>
    )
}
 
export default Dashboard