import { useDataEngine } from '@dhis2/app-runtime'
import Box from '@mui/material/Box'
import { format, addMonths } from 'date-fns'
import { fr } from 'date-fns/locale'
import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { DataManager, DataElementsIdsFetcher, HelpButton, Loader, Modal } from '@/components'
import { useClimateHistoric } from '@/components/ClimateDisplay/data/historic'
import DefaultLayout from '@/layout'
import { setClimateData } from '@/redux/climateSlice'
import { setData as setDiarrheaData } from '@/redux/diarrheaSlice'
import { setData as setIraData } from '@/redux/iraSlice'
import { setData as setMalariaData } from '@/redux/malariaSlice'
import RouterLink from '@/routes/components/router-link'
import { fetchOrgUnitFlow } from '@/thunks/FetchOrgUnitFlow'
import { convertToLocaleDate, getMonthYYYYMM } from '@/utils'
import { fullReset } from '@/utils/dataManagement'

import {
    useMalariaForecast,
    useMalariaHistoric,
    useMalariaIndicator,
    useMalariaSimulation,
} from '@/views/malaria/data/index'

import {
    useIraForecast,
    useIraHistoric,
    useIraIndicator,
    useIraSimulation,
} from '@/views/ira/data/index'

import {
    useDiarrheaForecast,
    useDiarrheaHistoric,
    useDiarrheaIndicator,
    useDiarrheaSimulation,
} from '@/views/diarrhea/data/index'

import StatisticCard from '@/views/dashboard/components/StatisticCard'
import style from '@/views/dashboard/dashboard.module.scss'
import useDashboardElements from '@/views/dashboard/data/useDashboardData'
  
const PARENT_ID = 'VtP4BdCeXIo'
  
const currentDate = new Date()
const periodStart = format(currentDate, 'MMMM yyyy', { locale: fr })
const monthAfterNext = addMonths(currentDate, 2)
const periodEnd = format(monthAfterNext, 'MMMM yyyy', { locale: fr })
  
const haveSameElements = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {return false}
    const set1 = new Set(arr1)
    for (const item of set1) {
        if (!new Set(arr2).has(item)) {return false}
    }
    return true
}
  
const Dashboard = () => {
    const engine = useDataEngine() 
    const navigate = useNavigate()
    const dispatch = useDispatch()
  
    const [counter, setCounter] = useState(0)
    const [dataElementError, setDataElementError] = useState(true)
    const [allDataFetched, setAllDataFetched] = useState(false)
    const [isSmallScreen, setIsSmallScreen] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [modalContent, setModalContent] = useState('')
  
    const storeOrgUnits = useSelector((state) => state.orgUnit.orgUnits)
    const orgUnitFlowStatus = useSelector((state) => state.orgUnit.flowStatus) 
    const orgUnitLevels = useSelector((state) => state.orgUnit.orgUnitLevels)

    const malariaIndicatorsResult = useMalariaIndicator()
    const iraIndicatorsResult = useIraIndicator()
    const diarrheaIndicatorsResult = useDiarrheaIndicator()
    const climateResult = useClimateHistoric()

    const malariaForecastResult = useMalariaForecast()
    const malariaHistoricResult = useMalariaHistoric()
    const malariaSimulationResult = useMalariaSimulation()
    const iraForecastResult = useIraForecast()
    const iraHistoricResult = useIraHistoric()
    const iraSimulationResult = useIraSimulation()
    const diarrheaForecastResult = useDiarrheaForecast()
    const diarrheaHistoricResult = useDiarrheaHistoric()
    const diarrheaSimulationResult = useDiarrheaSimulation()

    const malariaIndicators = malariaIndicatorsResult?.indicatorElements || []
    const iraIndicators = iraIndicatorsResult?.indicatorElements || []
    const diarrheaIndicators = diarrheaIndicatorsResult?.indicatorElements || []
    const climateElements = climateResult?.climateElements || []

    const malariaForecastElements = malariaForecastResult?.forecastElements || []
    const malariaHistoricElements = malariaHistoricResult?.historicElements || []
    const malariaSimulationElements = malariaSimulationResult?.simulationElements || []
    const iraForecastElements = iraForecastResult?.forecastElements || []
    const iraHistoricElements = iraHistoricResult?.historicElements || []
    const iraSimulationElements = iraSimulationResult?.simulationElements || []
    const diarrheaForecastElements = diarrheaForecastResult?.forecastElements || []
    const diarrheaHistoricElements = diarrheaHistoricResult?.historicElements || []
    const diarrheaSimulationElements = diarrheaSimulationResult?.simulationElements || []

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
            } catch (err) {
                console.error('[Dashboard] fetchOrgUnitFlow failed:', err)
                navigate('/error')
            }
        }

        run()
    }, [engine, dispatch])

    const orgUnitsAvailable = useMemo(() => {
        if (!storeOrgUnits || !orgUnitLevels) {return false}
        const keys = Object.keys(storeOrgUnits)
        const adminLevelKeys = orgUnitLevels.map((level) => level.id)
        return haveSameElements(keys, adminLevelKeys)
    }, [storeOrgUnits, orgUnitLevels])
  
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!allDataFetched) {navigate('/error')}
        }, 2 * 60 * 1000)
        return () => clearTimeout(timer)
    }, [allDataFetched])
  
    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 900)
        window.addEventListener('resize', handleResize)
        handleResize()
        return () => window.removeEventListener('resize', handleResize)
    }, [])
  
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

    const dataElementOnError = (e) => {
        setDataElementError(e)
    }
  
    return (
        <DefaultLayout>
            <>
                <DataElementsIdsFetcher onError={dataElementOnError} />
                {orgUnitsAvailable && !dataElementError &&
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