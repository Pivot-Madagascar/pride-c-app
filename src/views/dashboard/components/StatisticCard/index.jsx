import PropTypes from 'prop-types'
import React from 'react'
import { MetricsCard } from '@/components'
import style from '@/views/dashboard/components/StatisticCard/statisticCard.module.scss'

const StatisticCard = ({ item, periods }) => {
    return (
        <div
            className={style.container}
            style={{ backgroundColor: item.bgColor }}
        >
            <div className={style.header} >
                <div
                    className={style.title}
                    style={{ fontSize: `${item.fontSize}em`, textAlign: 'center', paddingTop: '25px' }}
                    data-testid="main-title"
                >
                    {item.title}             
                </div>
                <div 
                    style={{fontSize: '11px', color: 'white', fontWeight: 'bold', marginTop: '-8px'}} 
                    data-testid="sub-title"
                >
                    Entre le mois de <span className={style.subString}>{periods.start}</span> et <span className={style.subString}>{periods.end}</span>
                </div>
            </div>
            <div className={style.statistics} style={{ paddingBottom: '8px' }}>
                {item.indicators.map((element, index) => (
                    <div className={style.incidences} key={`metrics-card-${index}`}>
                        <MetricsCard 
                            key={index} 
                            item={element} 
                            bgColor={'rgba(255, 255, 255, 0.75)'} 
                            textAlign='center'
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

StatisticCard.propTypes = {
    item: PropTypes.shape({
        bgColor: PropTypes.string.isRequired,
        fontSize: PropTypes.number.isRequired,
        href: PropTypes.string.isRequired,
        indicators: PropTypes.array.isRequired,
        title: PropTypes.string.isRequired,
    }).isRequired,
    periods: PropTypes.shape({
        start: PropTypes.string.isRequired,
        end: PropTypes.string.isRequired,
    }).isRequired
}

export default StatisticCard
