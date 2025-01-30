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
        id: 'gVBjwejyOvf',
        params: {
            fields: 'organisationUnits[id,displayName,parent[id,displayName,parent[id, displayName]]]',
            skipPaging: true,
        },
    },
}

const concatenateArrays = (...arrays) => arrays.flat()

const currentPeriod = { 
    start: convertToLocaleDate(getMonthYYYYMM()), 
    end: convertToLocaleDate(getMonthYYYYMM(2)) 
}

const shortCurrentPeriod = {
    start: convertToLocaleDate(getMonthYYYYMM(), 'fr-FR', { year: 'numeric', month: 'short' }),
    end: convertToLocaleDate(getMonthYYYYMM(2), 'fr-FR', { year: 'numeric', month: 'short' })
}

const Dashboard = () => {
    const dispatch = useDispatch()
    const engine = useDataEngine()
    
    const fokontanyList = useSelector((state) => state.orgUnit.fokontanyList)
    const municipalities = useSelector((state) => state.orgUnit.municipalities)
    const fktToMunicipalities = useSelector((state) => state.orgUnit.fktToMunicipalities)
    const orgUnitsId = useSelector((state) => state.orgUnit.orgUnitsId)
    const district = useSelector((state) => state.orgUnit.district)
    
    const [orgUnitIds, setOrgUnitIds] = useState({ fokontany: [], municipality: [], district: [] })
    const [openModal, setOpenModal] = useState(false)
    const [modalContent, setModalContent] = useState('')
    
    const { malariaIndicators } = useMalariaData()
    const { diarrheaIndicators } = useDiarrheaData()
    const { iraIndicators } = useIraData()
    const { dashboardMetrics, loaded, helpText } = useDashboardData()

    const indicators = concatenateArrays(malariaIndicators, diarrheaIndicators, iraIndicators)

    useEffect(() => {
        if (!fktToMunicipalities || !municipalities || !fokontanyList || !orgUnitsId) {
            engine.query(orgUnitsQuery).then(({ data }) => {
                const uniqueOrgUnits = [...new Set(data.organisationUnits)]
                dispatch(setOrgUnits(uniqueOrgUnits))
            })
        }
    }, [dispatch, engine, fktToMunicipalities, municipalities, fokontanyList, orgUnitsId])

    useEffect(() => {
        if (fokontanyList && municipalities && district) {
            setOrgUnitIds({
                fokontany: fokontanyList.map(fokontany => fokontany.id),
                municipality: municipalities.map(municipality => municipality.id),
                district: district.map(district => district.id)
            })
        }
    }, [fokontanyList, municipalities, district])

    const handleHelpBtnClick = (value) => {
        setOpenModal(value.open)
        setModalContent(value.content)
    }

    const renderIndicatorsDataManager = (adminLevel, orgUnitIds) => (
        indicators.map((element, index) => (
            <IndicatorsDataManager
                key={index}
                caseType={element.source}
                adminLevel={adminLevel}
                orgUnitIds={orgUnitIds}
                storedValue={element.storedValue}
                dataElementId={element.dataElementId}
                onSetAlertData={element.action}
            />
        ))
    )

    const adminLevels = [
        { level: 'district', ids: orgUnitIds.district },
        { level: 'municipal', ids: orgUnitIds.municipality },
        { level: 'fokontany', ids: orgUnitIds.fokontany },
    ]
    
    return (
        <DefaultLayout>
            {adminLevels.map(({ level, ids }) => (
                ids.length > 0 && renderIndicatorsDataManager(level, ids)
            ))}
            {loaded ? (
                <div className={style.container}>
                    <div className={style.main} style={{ marginTop: '20px', position: 'relative' }}>
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
