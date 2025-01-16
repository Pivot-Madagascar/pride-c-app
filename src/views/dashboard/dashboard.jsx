import { useDataEngine } from '@dhis2/app-runtime'
import { Box } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IndicatorsDataManager from '../../components/DataManager/IndicatorsDataManager'
import CustomLoading from '../../components/Loading'
import DefaultLayout from '../../layout'
import { setOrgUnits } from '../../redux/orgUnitSlice'
import RouterLink from '../../routes/components/router-link'
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

const getCurrentAndThirdMonth = () => {
    const currentDate = new Date()
    const months = []
    const currentMonth = new Date(currentDate)
    months.push(currentMonth)
    const thirdMonth = new Date(currentDate)
    thirdMonth.setMonth(currentDate.getMonth() + 2)
    months.push(thirdMonth)
    return months
}

const months = getCurrentAndThirdMonth()

const formattedMonths = months.map((date) => {
    return new Intl.DateTimeFormat('fr-FR', {
        month: 'long',
        year: 'numeric',
    }).format(date)
})

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

    const { malariaIndicators } = useMalariaData()
    const { diarrheaIndicators } = useDiarrheaData()
    const { iraIndicators } = useIraData()
    const { dashboardMetrics, loaded } = useDashboardData()

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
                    <div className={style.main} style={{ marginTop: '-60px' }}>
                        <div className={style.title}>
                            Prédiction entre le mois de{' '}
                            <span className={style.subString}>{formattedMonths[0]}</span> et{' '}
                            <span className={style.subString}>{formattedMonths[1]}</span> <br /> dans le
                            district de <span className={style.subString}>{district[0].displayName}</span>
                        </div>
                        <div className={style.statistics}>
                            {dashboardMetrics.map((item, index) => (
                                <Box
                                    component={RouterLink}
                                    href={item.href}
                                    key={index}
                                    sx={{ color: '#333333' }}
                                >
                                    <StatisticCard item={item} periods={formattedMonths} />
                                </Box>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <CustomLoading />
            )}
        </DefaultLayout>
    )
}

export default Dashboard
