import Box from '@mui/material/Box'
import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DataManager from '../../components/DataManager'
import HelpButton from '../../components/HelpButton'
import Modal from '../../components/Modal'
import useOrgUnitDetails from '../../hooks/useOrgUnitDetails'
import useOrgUnitLevels from '../../hooks/useOrgUnitLevels'
import useOrgUnits from '../../hooks/useOrgUnits'
import DefaultLayout from '../../layout'
import { setDiarrheaData } from '../../redux/diarrheaSlice'
import { setIraData } from '../../redux/iraSlice'
import { setMalariaData } from '../../redux/malariaSlice'
import {
    setOrgUnitLevels,
    setParentDetails,
    setOrgUnits,
} from '../../redux/orgUnitSlice'
import RouterLink from '../../routes/components/router-link'
import { convertToLocaleDate, getMonthYYYYMM } from '../../utils/format-time'
import getDiarrheaIndicator from '../diarrhea/data/indicators'
import getIraIndicator from '../ira/data/indicators'
import getMalariaIndicator from '../malaria/data/indicators'
import StatisticCard from './components/StatisticCard'
import style from './dashboard.module.scss'
import useDashboardElements from './data/useDashboardData'
import { useDataEngine } from '@dhis2/app-runtime'
import Loader from '../../components/Loader'
import usePridecOrgUnits from '../../hooks/usePridecOrgUnits'
import getClimateHistoric from '../../components/ClimateDisplay/data/historic'

import { setClimateData } from '../../redux/climateSlice'
import getDiarrheaForecast from '../diarrhea/data/forecast'
import getDiarrheaHistoric from '../diarrhea/data/historics'
import getDiarrheaSimulation from '../diarrhea/data/simulation'
import getIraForecast from '../ira/data/forecast'
import getIraHistoric from '../ira/data/historics'
import getIraSimulation from '../ira/data/simulation'
import getMalariaForecast from '../malaria/data/forecast'
import getMalariaHistoric from '../malaria/data/historics'
import getMalariaSimulation from '../malaria/data/simulation'
import { useNavigate } from 'react-router-dom'
import { format, addMonths } from 'date-fns'
import { fr } from 'date-fns/locale'

const currentDate = new Date()
const periodStart = format(currentDate, 'MMMM yyyy', { locale: fr })
const monthAfterNext = addMonths(currentDate, 2)
const periodEnd = format(monthAfterNext, 'MMMM yyyy', { locale: fr, })

const haveSameElements = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
        return false
    }

    const set1 = new Set(arr1)
    const set2 = new Set(arr2)

    if (set1.size !== set2.size) {
        return false
    }

    for (const item of set1) {
        if (!set2.has(item)) {
            return false
        }
    }

    return true
}

const processOrgUnitOptions = ({
    orgUnitOptions,
    parentDetails,
    adminLevels,
    storeOrgUnits,
}) =>
    orgUnitOptions.map((option) => {
        const { level, parentGraph } = option
        const graphArr = parentGraph.split('/')
        const { id: parentId } = parentDetails

        const index = graphArr.indexOf(parentId)
        if (index === -1) return option

        const currentAdminLevel = adminLevels.find(
            (el) => el.level === Number(level)
        )?.name
        let parentData = null

        const payload = graphArr
            .slice(index)
            .reverse()
            .map((t, i) => {
                const currentLevel = level - (i + 1)
                const adminLevel = adminLevels.find(
                    ({ level }) => level === currentLevel
                )

                if (adminLevel?.id && storeOrgUnits[adminLevel.id]) {
                    parentData =
                        storeOrgUnits[adminLevel.id].find(
                            ({ id }) => id === t
                        ) || parentData
                }

                return {
                    name: parentData?.name,
                    id: parentData?.id,
                    level: currentLevel,
                    adminLevelName: adminLevel?.name,
                    adminLevelId: adminLevel?.id,
                }
            })

        return { ...option, parents: payload, levelName: currentAdminLevel }
    })

const Dashboard = () => {
    const engine = useDataEngine()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const parentId = 'VtP4BdCeXIo'
    const pridecOUGroup = 'QoreIzGWqtJ'

    const [levels, setLevels] = useState()
    const [orgUnitsAvailable, setOrgUnitsAvailable] = useState(false)
    const [allDataFetched, setAllDataFetched] = useState(false)
    const [counter, setCounter] = useState(0)
    const [isSmallScreen, setIsSmallScreen] = useState(false)

    const { orgUnitDetails } = useOrgUnitDetails(parentId)
    const { orgUnitLevels } = useOrgUnitLevels()

    const storeOrgUnits = useSelector((state) => state.orgUnit.orgUnits)

    const { indicatorElements: malariaIndicators } = getMalariaIndicator()
    const { indicatorElements: iraIndicators } = getIraIndicator()
    const { indicatorElements: diarrheaIndicators } = getDiarrheaIndicator()

    const { forecastElements: malariaForecastElements } = getMalariaForecast()
    const { historicElements: malariaHistoricElements } = getMalariaHistoric()
    const { simulationElements: malariaSimulationElements } = getMalariaSimulation()

    const { forecastElements: iraForecastElements } = getIraForecast()
    const { historicElements: iraHistoricElements } = getIraHistoric()
    const { simulationElements: iraSimulationElements } = getIraSimulation()

    const { forecastElements: diarrheaForecastElements } = getDiarrheaForecast()
    const { historicElements: diarrheaHistoricElements } = getDiarrheaHistoric()
    const { simulationElements: diarrheaSimulationElements } =
        getDiarrheaSimulation()

    const { climateElements } = getClimateHistoric()

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
        if (orgUnitDetails) {
            dispatch(setParentDetails(orgUnitDetails))
        }
    }, [orgUnitDetails, dispatch])

    useEffect(() => {
        if (storeOrgUnits && levels) {
            const keys = Object.keys(storeOrgUnits)
            const adminLevelKeys = levels.map((level) => level.id)
            setOrgUnitsAvailable(haveSameElements(keys, adminLevelKeys))
        }
    }, [storeOrgUnits, levels])

    useEffect(() => {
        if (orgUnitLevels && orgUnitLevels.length > 0 && orgUnitDetails) {
            const { level } = orgUnitDetails
            const adminLevels = orgUnitLevels
                .filter((el) => el.level >= level)
                .sort((a, b) => a.level - b.level)
            setLevels(adminLevels)
            dispatch(setOrgUnitLevels(adminLevels))
        }
    }, [orgUnitLevels, dispatch, orgUnitDetails])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!allDataFetched) {
                navigate('/error')
            }
        }, 2 * 60 * 1000)

        return () => clearTimeout(timer)
    }, [allDataFetched])

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

    const { orgUnits, features, adminlevel } = useOrgUnits({
        parent: parentId,
        adminLevels: levels,
    })

    // const { pridecOrgUnits } = usePridecOrgUnits(pridecOUGroup)

    const dataReady = useMemo(
        () => orgUnits && features && adminlevel,
        [orgUnits, features, adminlevel, levels]
    )

    useEffect(() => {
        if (dataReady) {
            const payload = processOrgUnitOptions({
                orgUnitOptions: orgUnits,
                parentDetails,
                adminLevels: levels,
                storeOrgUnits,
            })

            dispatch(
                setOrgUnits({
                    path: ['orgUnits', adminlevel],
                    value: payload,
                })
            )

            dispatch(
                setOrgUnits({
                    path: ['features', adminlevel],
                    value: features,
                })
            )
        }
    }, [dataReady])

    useEffect(() => {
        const timer = setTimeout(() => {
            setAllDataFetched(indicators.length === counter)
        }, 500)
        return () => clearTimeout(timer)
    }, [counter])

    const [openModal, setOpenModal] = useState(false)
    const [modalContent, setModalContent] = useState('')

    const { dashboardMetrics, helpText } = useDashboardElements()
    const parentDetails = useSelector((state) => state.orgUnit.parentDetails)

    const handleHelpBtnClick = (value) => {
        setOpenModal(value.open)
        setModalContent(value.content)
    }

    return (
        <DefaultLayout>
            <>
                {orgUnitsAvailable &&
                    indicators.map(
                        ({ dataElements, reduxAction, store }, index) => (
                            <DataManager
                                key={index}
                                dataElements={dataElements}
                                reduxAction={reduxAction}
                                store={store}
                                onDataFetched={() =>
                                    setCounter((prev) => prev + 1)
                                }
                            />
                        )
                    )}
                {!allDataFetched ? (
                    <Loader />
                ) : (
                    <div className={style.container}>
                        <div
                            className={style.main}
                            style={{ marginTop: '60px', position: 'relative' }}
                        >
                            <div className={style.title} style={{ marginTop: isSmallScreen ? '20px' : '0px' }}>
                                Prédiction entre le mois de{' '}
                                <br style={{ display: isSmallScreen ? 'block' : 'none' }} />
                                <span className={style.subString}>
                                    {periodStart}
                                </span>{' '}
                                et{' '}
                                <span className={style.subString}>
                                    {periodEnd}
                                </span>{' '}
                                <br /> dans le district de{' '}
                                <span className={style.subString}>
                                    Ifanadiana
                                </span>
                            </div>
                            <HelpButton
                                bgColor="#D8D8D8"
                                sx={{
                                    position: 'absolute',
                                    top: isSmallScreen ? '-50px' : '25px',
                                    right: isSmallScreen ? '0px': '25px',
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
                                            periods={{
                                                start: periodStart,
                                                end: periodEnd,
                                            }}
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
                <div dangerouslySetInnerHTML={{ __html: modalContent }} />
            </Modal>
        </DefaultLayout>
    )
}

export default Dashboard
