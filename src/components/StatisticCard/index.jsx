import PropTypes from 'prop-types'
import React from 'react'
import style from './statisticCard.module.scss'

const StatisticCard = ({ item }) => {
    return (
        <div className={style.card}>
            <div className={style.header} data-testid="title">
                {item.title}
            </div>
            <div className={style.mainContent} data-testid="main-content">
                {item.value.toLocaleString('fr-FR', { style: 'decimal', useGrouping: true })}
            </div>
            <div className={style.footer}>
                <div className={style.comparisonData} data-testid="comparison-data">
                    {item.percentage.toLocaleString('fr-FR', { style: 'decimal', useGrouping: true })}%
                </div>
                <div className={style.comparisonDescription} data-testid="comparison-description">
                    {item.description}
                </div>
            </div>
        </div>
    )
}

StatisticCard.propTypes = {
    item: PropTypes.shape({
        title: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        percentage: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired
    }).isRequired
}

export default StatisticCard
