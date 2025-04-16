import { Box } from '@mui/material'
import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NewDataManager from '../../components/DataManager/NewDataManager'
import HelpButton from '../../components/HelpButton'
import Modal from '../../components/Modal'
import useOrgUnitDetails from '../../hooks/useOrgUnitDetails'
import useOrgUnitLevels from '../../hooks/useOrgUnitLevels'
import useOrgUnits from '../../hooks/useOrgUnits'
import DefaultLayout from '../../layout'
import { setDiarrheaData } from '../../redux/diarrheaSlice'
import { setIraData } from '../../redux/iraSlice'
import { setMalariaData } from '../../redux/malariaSlice'
import { setOrgUnitLevels, setParentDetails } from '../../redux/orgUnitSlice'
import RouterLink from '../../routes/components/router-link'
import { convertToLocaleDate, getMonthYYYYMM } from '../../utils/format-time'
import cacheUtils from '../../utils/newCache'
import getDiarrheaIndicator from '../diarrhea/data/indicators'
import getIraIndicator from '../ira/data/indicators'
import getMalariaIndicator from '../malaria/data/indicators'
import StatisticCard from './components/StatisticCard'
import style from './dashboard.module.scss'
import useDashboardElements from './data/useDashboardData'
import { useDataEngine } from '@dhis2/app-runtime'
import { setPridecOrgUnits } from '../../redux/orgUnitSlice'

const fetchPridecOrgUnits = async (engine) => {
    const query = {
        dataSets: {
            resource: 'dataSets/QoreIzGWqtJ',
            params: {
                fields: 'organisationUnits[id,name,level]',
            },
        },
    }
    try {
        const response = await engine.query(query)
        const orgUnitsLevel5 = response.dataSets.organisationUnits.filter(
            (unit) => unit.level === 5
        )
        return orgUnitsLevel5
    } catch (error) {
        console.error('Error fetching data:', error)
        throw error 
    }
}

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
    cachedOrgUnits,
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

                if (adminLevel?.id && cachedOrgUnits[adminLevel.id]) {
                    parentData =
                        cachedOrgUnits[adminLevel.id].find(
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
    const dispatch = useDispatch()
    const parentId = 'VtP4BdCeXIo'

    const [levels, setLevels] = useState()
    const [orgUnitsAvailable, setOrgUnitsAvailable] = useState(false)

    const { orgUnitDetails } = useOrgUnitDetails(parentId)
    const { orgUnitLevels } = useOrgUnitLevels()

    const cachedOrgUnits = cacheUtils.get({
        path: ['orgUnits', 'details'],
        useSessionStorage: true,
    })

    useEffect(() => {
        if (orgUnitDetails) {
            dispatch(setParentDetails(orgUnitDetails))
        }
    }, [orgUnitDetails, dispatch])

    useEffect(() => {
        if (cachedOrgUnits && levels) {
            const keys = Object.keys(cachedOrgUnits)
            const adminLevelKeys = levels.map((level) => level.id)
            setOrgUnitsAvailable(haveSameElements(keys, adminLevelKeys))
        }
    }, [cachedOrgUnits, levels])

    useEffect(() => {
        if (orgUnitLevels.length > 0 && orgUnitDetails) {
            const { level } = orgUnitDetails
            const adminLevels = orgUnitLevels
                .filter((el) => el.level >= level)
                .sort((a, b) => a.level - b.level)
            setLevels(adminLevels)
            dispatch(setOrgUnitLevels(adminLevels))
        }
    }, [orgUnitLevels, dispatch, orgUnitDetails])

    const { orgUnits, features, adminlevel } = useOrgUnits({
        parent: parentId,
        adminLevels: levels,
    })

    const dataReady = useMemo(
        () => orgUnits && features && adminlevel,
        [orgUnits, features, adminlevel, levels]
    )

    useEffect(() => {
        const loadData = async () => {
            let result
            try {
                result = await fetchPridecOrgUnits(engine)
            } catch (err) {
                console.log(err)
            } finally {
                dispatch(setPridecOrgUnits(result))
            }
        }
        loadData()
    }, [engine])

    useEffect(() => {
        if (dataReady) {
            const payload = processOrgUnitOptions({
                orgUnitOptions: orgUnits,
                parentDetails,
                adminLevels: levels,
                cachedOrgUnits,
            })

            cacheUtils.set({
                path: ['orgUnits', 'details', adminlevel],
                value: payload,
                useSessionStorage: true,
            })

            cacheUtils.set({
                path: ['orgUnits', 'features', adminlevel],
                value: features,
                useSessionStorage: true,
            })
        }
    }, [dataReady])

    const [openModal, setOpenModal] = useState(false)
    const [modalContent, setModalContent] = useState('')

    const { indicatorElements: malariaIndicators } = getMalariaIndicator()
    const { indicatorElements: iraIndicators } = getIraIndicator()
    const { indicatorElements: diarrheaIndicators } = getDiarrheaIndicator()

    const { dashboardMetrics, helpText } = useDashboardElements()
    const parentDetails = useSelector((state) => state.orgUnit.parentDetails)

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
    ]

    const handleHelpBtnClick = (value) => {
        setOpenModal(value.open)
        setModalContent(value.content)
    }

    return (
        <DefaultLayout>
            {orgUnitsAvailable &&
                indicators.map(
                    ({ dataElements, reduxAction, store }, index) => (
                        <NewDataManager
                            key={index}
                            dataElements={dataElements}
                            reduxAction={reduxAction}
                            store={store}
                        />
                    )
                )}
            <div className={style.container}>
                <div
                    className={style.main}
                    style={{ marginTop: '20px', position: 'relative' }}
                >
                    <div className={style.title}>
                        Prédiction entre le mois de{' '}
                        <span className={style.subString}>
                            {convertToLocaleDate(getMonthYYYYMM())}
                        </span>{' '}
                        et{' '}
                        <span className={style.subString}>
                            {convertToLocaleDate(getMonthYYYYMM(2))}
                        </span>{' '}
                        <br /> dans le district de{' '}
                        <span className={style.subString}>Ifanadiana</span>
                    </div>
                    <HelpButton
                        bgColor="#D8D8D8"
                        sx={{
                            position: 'absolute',
                            top: '25px',
                            right: '25px',
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
                                        start: convertToLocaleDate(
                                            getMonthYYYYMM(),
                                            'fr-FR',
                                            { year: 'numeric', month: 'short' }
                                        ),
                                        end: convertToLocaleDate(
                                            getMonthYYYYMM(2),
                                            'fr-FR',
                                            { year: 'numeric', month: 'short' }
                                        ),
                                    }}
                                />
                            </Box>
                        ))}
                    </div>
                </div>
            </div>
            <Modal
                open={openModal}
                handleClose={() => setOpenModal(false)}
                title="Aide"
            >
                <div dangerouslySetInnerHTML={{ __html: modalContent }} />
            </Modal>
        </DefaultLayout>
    )
}

export default Dashboard
