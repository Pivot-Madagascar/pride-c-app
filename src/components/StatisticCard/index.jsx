import PropTypes from 'prop-types'
import React from 'react'
import style from './statisticCard.module.scss'

const StatisticCard = ({ item, bgColor }) => {
    return (
        <div className={style.card} style={{ backgroundColor: bgColor }}>
            <div className={style.header} data-testid="title">
                {item.title}
            </div>
            <div className={style.mainContent} data-testid="main-content">
                {item.value.toLocaleString('fr-FR', {
                    style: 'decimal',
                    useGrouping: true,
                })}
            </div>
            <div className={style.footer}>
                {(item.percentage || item.percentage === 0) && (
                    <>
                        <div
                            className={style.comparisonData}
                            data-testid="comparison-data"
                            style={{ color: item.percentage > 0 ? 'red' : 'green'}}
                        >
                            {item.percentage.toLocaleString('fr-FR', {
                                style: 'decimal',
                                useGrouping: true,
                            })}
                            %
                            {item.percentage > 0 && <span style={{ fontSize: 12 }}> &#9650;</span>}
                            {item.percentage < 0 && <span style={{ fontSize: 12 }}> &#9660;</span>}
                        </div>
                        <div
                            className={style.comparisonDescription}
                            data-testid="comparison-description"
                        >
                            {item.description}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

StatisticCard.propTypes = {
    item: PropTypes.shape({
        title: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
            .isRequired,
        percentage: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
    }).isRequired,
    bgColor: PropTypes.string.isRequired,
}

export default StatisticCard
