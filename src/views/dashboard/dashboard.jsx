import { useDataEngine } from '@dhis2/app-runtime'
import { Box } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CustomLoading as Loading } from '../../components'
import IndicatorsDataManager from '../../components/DataManager/IndicatorsDataManager'
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
                    <div className={style.main}>
                        <div className={style.title}>
                            Prédiction entre le mois de{' '}
                            <b>{formattedMonths[0]}</b> et{' '}
                            <b>{formattedMonths[1]}</b> <br /> dans le
                            district de {district[0].displayName}
                        </div>
                        <div className={style.statistics}>
                            {dashboardMetrics.map((item, index) => (
                                <Box
                                    component={RouterLink}
                                    href={item.href}
                                    key={index}
                                    sx={{ color: '#333333' }}
                                >
                                    <StatisticCard item={item} />
                                </Box>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <Loading />
            )}
        </DefaultLayout>
    )
}

export default Dashboard
