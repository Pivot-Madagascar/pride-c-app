import { useDataEngine } from '@dhis2/app-runtime'
import { Box } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import COLORS from '../../constants/styles'
import { setOrgUnits } from '../../redux/orgUnitSlice'
import RouterLink from '../../routes/components/router-link'
import StatisticCard from './components/StatisticCard'
import style from './dashboard.module.scss'


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

const Dashboard = () => {
    const [loading, setLoading] = useState(false)

    const engine = useDataEngine()
    const dispatch = useDispatch()

    const items = [
        {
            title: 'Paludisme',
            incidences: 70000,
            totalCase: 86000,
            trend: 34,
            bgColor: COLORS.red,
            fontSize: 2,
            href: 'malaria-trend',
        },
        {
            title: 'Maladies diarrheiques',
            incidences: 50000,
            totalCase: 72500,
            trend: 7,
            bgColor: COLORS.green,
            fontSize: 1.5,
            href: 'diarrhea-trend',
        },
        {
            title: 'IRA',
            incidences: 15020,
            totalCase: 3150,
            trend: 58,
            bgColor: COLORS.blue,
            fontSize: 2,
            href: 'ira-trend',
        },
    ]

    useEffect(() => {
        engine.query(orgUnitsQuery).then(({ data }) => {
            console.error(data);
            const uniqueOrgUnits = [ ...new Set(data.organisationUnits) ]
            dispatch(setOrgUnits(uniqueOrgUnits))
        })
    })

    return (
        <div className={style.container}>
            <div className={style.main}>
                <div className={style.title}>
                    Prédiction entre le mois de <b>JANVIER 2024</b> et{' '}
                    <b>MARS 2024</b>
                </div>
                <div className={style.statistics}>
                    {items.map((item, index) => (
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
