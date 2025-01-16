import { useDataEngine } from '@dhis2/app-runtime'
import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IndicatorsDataManager from '../../components/DataManager/IndicatorsDataManager'
import HelpButton from '../../components/HelpButton'
import CustomLoading from '../../components/Loading'
import Modal from '../../components/Modal'
import DefaultLayout from '../../layout'
import { setOrgUnits } from '../../redux/orgUnitSlice'
import RouterLink from '../../routes/components/router-link'
import { convertToLocaleDate, getMonthYYYYMM } from '../../utils/format-time'
import useDiarrheaData from '../diarrhea/DataGenerator'
import useIraData from '../ira/DataGenerator'
import useMalariaData from '../malaria/DataGenerator'
import StatisticCard from './components/StatisticCard'
import style from './dashboard.module.scss'
import useDashboardData from './data'

const orgUnitsQuery = {
    data: {
        resource: 'organisationUnitGroups',
        id: 'gVBjwejyOvf', // Ifanadiana fokontany group uid
        params: {
            fields: 'organisationUnits[id,displayName,parent[id,displayName,parent[id, displayName]]]',
            skipPaging: true,
        },
    },
}

const concatenateArrays = (...arrays) => {
    return arrays.flat()
}

const currentPeriod = { 
    start: convertToLocaleDate(getMonthYYYYMM()), 
    end: convertToLocaleDate(getMonthYYYYMM(2)) 
}
const shortCurrentPeriod = {
    start: convertToLocaleDate(getMonthYYYYMM(), 'fr-FR', { year: 'numeric', month: 'short' }),
    end: convertToLocaleDate(getMonthYYYYMM(2), 'fr-FR', { year: 'numeric', month: 'short' })
}

const Dashboard = () => {
    const fokontanyList = useSelector((state) => state.orgUnit.fokontanyList)
    const municipalities = useSelector((state) => state.orgUnit.municipalities)
    const fktToMunicipalities = useSelector(
        (state) => state.orgUnit.fktToMunicipalities
    )
    const orgUnitsId = useSelector((state) => state.orgUnit.orgUnitsId)
    const district = useSelector((state) => state.orgUnit.district)

    const engine = useDataEngine()
    const dispatch = useDispatch()

    const [openModal, setOpenModal] = useState(false)
    const [modalContent, setModalContent] = useState('')

    const { malariaIndicators } = useMalariaData()
    const { diarrheaIndicators } = useDiarrheaData()
    const { iraIndicators } = useIraData()
    const { dashboardMetrics, loaded, helpText } = useDashboardData()

    const indicators = concatenateArrays(
        malariaIndicators,
        diarrheaIndicators,
        iraIndicators
    )

    useEffect(() => {
        if (
            !fktToMunicipalities ||
            !municipalities ||
            !fokontanyList ||
            !orgUnitsId
        ) {
            engine.query(orgUnitsQuery).then(({ data }) => {
                const uniqueOrgUnits = [...new Set(data.organisationUnits)]
                dispatch(setOrgUnits(uniqueOrgUnits))
            })
        }
    })

    const handleHelpBtnClick = (value) => {
        setOpenModal(value.open)
        setModalContent(value.content)
    }

    return (
        <DefaultLayout>
            {indicators.map((element, index) => (
                <IndicatorsDataManager
                    key={index}
                    caseType={element.source}
                    adminLevel={element.adminLevel}
                    orgUnitIds={[district[0].id]}
                    storedValue={element.storedValue}
                    dataElementId={element.dataElementId}
                    onSetAlertData={element.action}
                />
            ))}
            {loaded ? (
                <div className={style.container}>
                    <div className={style.main} style={{ marginTop: '-60px', position: 'relative' }}>
                        <div className={style.title}>
                            Prédiction entre le mois de{' '}
                            <span className={style.subString}>{currentPeriod.start}</span> et{' '}
                            <span className={style.subString}>{currentPeriod.end}</span> <br /> dans le
                            district de <span className={style.subString}>{district[0].displayName}</span>
                        </div>
                        <HelpButton 
                            bgColor='#D8D8D8'
                            sx={{ position: 'absolute', top: '25px', right: '25px' }}
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
                                    <StatisticCard item={item} periods={shortCurrentPeriod} />
                                </Box>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <CustomLoading />
            )}
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
