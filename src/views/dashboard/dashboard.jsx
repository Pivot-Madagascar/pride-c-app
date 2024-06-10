import { useDataEngine } from '@dhis2/app-runtime'
import { Box } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import COLORS from '../../constants/styles'
import { setAgeClasses } from '../../redux/appSettings'
import { setOrgUnits } from '../../redux/orgUnitSlice'
import RouterLink from '../../routes/components/router-link'
import {
    checkSessionStorage,
    getSessionStorageValue,
} from '../../utils/sessionStorage'
import StatisticCard from './components/StatisticCard'
import style from './dashboard.module.scss'
import { sampleData } from './data'

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

const categoryComboQuery = {
    categoryOptionCombos: {
        resource: 'categoryOptionCombos',
        params: {
            fields: 'id,displayName',
            paging: 'false',
            filter: 'displayName:ilike:PRIDEC',
        },
    },
}

const Dashboard = () => {
    const fokontanyList = useSelector((state) => state.orgUnit.fokontanyList)
    const municipalities = useSelector((state) => state.orgUnit.municipalities)
    const fktToMunicipalities = useSelector((state) => state.orgUnit.fktToMunicipalities)
    const orgUnitsId = useSelector((state) => state.orgUnit.orgUnitsId)
    const ageClasses = useSelector((state) => state.appSettings.ageClasses)

    const engine = useDataEngine()
    const dispatch = useDispatch()

    useEffect(() => {
        if (!fktToMunicipalities || !municipalities || !fokontanyList || !orgUnitsId) {
            engine.query(orgUnitsQuery).then(({ data }) => {
                const uniqueOrgUnits = [...new Set(data.organisationUnits)]
                dispatch(setOrgUnits(uniqueOrgUnits))
            })
        }
    })

    useEffect(() => {
        if (!ageClasses) {
            engine.query(categoryComboQuery).then(({ categoryOptionCombos }) => {
                const payload = categoryOptionCombos.categoryOptionCombos
                dispatch(setAgeClasses(payload))
            })
        }
    })

    return (
        <div className={style.container}>
            <div className={style.main}>
                <div className={style.title}>
                    Prédiction entre le mois de <b>Juin 2024</b> et{' '}
                    <b>Aout 2024</b>
                </div>
                <div className={style.statistics}>
                    {sampleData.healthMetrics.map((item, index) => (
                        <Box
                            component={RouterLink}
                            href={item.href}
                            key={index}
                            sx={{
                                color: '#333333',
                            }}
                        >
                            <StatisticCard item={item} />
                        </Box>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
