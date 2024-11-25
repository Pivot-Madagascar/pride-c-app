import { useDataEngine } from '@dhis2/app-runtime'
import { Box } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AlertDataManager from '../../components/DataManager/AlertDataManager'
import COLORS from '../../constants/styles'
import { setAgeClasses } from '../../redux/appSettings'
import {
    setMalariaAlertData,
    setMalariaCompareData,
} from '../../redux/malariaSlice'
import { setOrgUnits } from '../../redux/orgUnitSlice'
import RouterLink from '../../routes/components/router-link'
import {
    checkSessionStorage,
    getSessionStorageValue,
} from '../../utils/sessionStorage'
import useDiarrheaData from '../diarrhea/DataGenerator'
import useIraData from '../ira/DataGenerator'
import useMalariaData from '../malaria/DataGenerator'
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

const concatenateArrays = (...arrays) => {
    return arrays.flat()
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

    const { malariaAlertElements, malariaComparisonElements } = useMalariaData()
    const { diarrheaAlertElements, diarrheaComparisonElements } =
        useDiarrheaData()
    const { iraAlertElements, iraComparisonElements } = useIraData()

    const alertElements = concatenateArrays(
        malariaAlertElements,
        diarrheaAlertElements,
        iraAlertElements
    )
    const comparisonElements = concatenateArrays(
        malariaComparisonElements,
        diarrheaComparisonElements,
        iraComparisonElements
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

    const handleSetAlertData = (data) => {
        dispatch(setMalariaAlertData(data))
    }

    const handleSetCompareData = (data) => {
        console.log(data)
        dispatch(setMalariaCompareData(data))
    }

    return (
        <div className={style.container}>
            <div className={style.main}>
                <div className={style.title}>
                    Prédiction entre le mois de <b>Octobre 2024</b> et{' '}
                    <b>Decembre 2024</b> <br />
                    dans le district d' Ifanadiana
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
                    {alertElements.map((element, index) => (
                        <AlertDataManager
                            key={index}
                            caseType={element.alertType}
                            adminLevel={element.adminLevel}
                            orgUnitIds={[district[0].id]}
                            storedValue={element.storedValue}
                            dataElementId={element.dataElementId}
                            onSetAlertData={handleSetAlertData}
                        />
                    ))}
                    {comparisonElements.map((element, index) => (
                        <AlertDataManager
                            key={index}
                            caseType={element.alertType}
                            adminLevel={element.adminLevel}
                            orgUnitIds={[district[0].id]}
                            storedValue={element.storedValue}
                            dataElementId={element.dataElementId}
                            onSetAlertData={handleSetCompareData}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
