import { Box } from '@mui/system'
import React from 'react'
import COLORS from '../../constants/styles'
import RouterLink from '../../routes/components/router-link'
import StatisticCard from './components/StatisticCard'
import style from './dashboard.module.scss'

const Dashboard = () => {
    const items = [
        {
            title: 'Paludisme',
            incidences: 70000,
            totalCase: 86000,
            trend: 34,
            bgColor: COLORS.red,
            fontSize: 2,
            href: 'malaria-trend'
        },
        {
            title: 'Maladies diarrheiques',
            incidences: 50000,
            totalCase: 72500,
            trend: 7,
            bgColor: COLORS.green,
            fontSize: 1.5,
            href: 'diarrhea-trend'
        },
        {
            title: 'IRA',
            incidences: 15020,
            totalCase: 3150,
            trend: 58,
            bgColor: COLORS.blue,
            fontSize: 2,
            href: 'ira-trend'
        }
    ]
    return (
        <div className={style.container}>
            <div className={style.main}>
                <div className={style.title}>
                    Prédiction entre le mois de <b>JANVIER 2024</b> et <b>MARS 2024</b>
                </div>
                <div className={style.statistics}>
                    { items.map((item, index) => (
                        <Box
                            component={RouterLink}
                            href={item.href}
                            key={index} 
                            sx={{
                                color: '#333333'
                            }}
                        >
                            <StatisticCard item={item} />
                        </Box>
                        
                    )) }
                </div>
            </div>
        </div>
    )
}
    

export default Dashboard
