import PropTypes from 'prop-types'
import React from 'react'
import MetricsCard from '../../../../components/Metrics'
import style from './statisticCard.module.scss'

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
                <div style={{fontSize: '11px', color: 'white', fontWeight: 'bold'}}>
                    Entre le mois de <span className={style.subString}>{periods[0]}</span> et <span className={style.subString}>{periods[1]}</span>
                </div>
            </div>
            <div className={style.statistics} style={{ paddingBottom: '8px' }}>
                {item.indicators.map((element, index) => (
                    <div className={style.incidences} key={index}>
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
    periods: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default StatisticCard
