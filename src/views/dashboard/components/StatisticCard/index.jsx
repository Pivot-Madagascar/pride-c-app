import PropTypes from 'prop-types'
import React from 'react'
import style from './statisticCard.module.scss'

const StatisticCardItem = ({ item }) => {
    return (
        <div
            className={style.container}
            style={{ backgroundColor: item.bgColor }}
        >
            <div className={style.header}>
                <p
                    className={style.title}
                    style={{ fontSize: `${item.fontSize}em` }}
                    data-testid="title"
                >
                    {item.title}
                </p>
            </div>
            <div className={style.statistics} style={{ paddingBottom: '40px' }}>
                {item.indicators.map((element, index) => (
                    <div className={style.incidences} key={index}>
                        <h1 className={style.number}>
                            {element.value && element.value.toLocaleString('fr-FR', {
                                style: 'decimal',
                                useGrouping: true,
                            })}
                        </h1>
                        <p className={style.description}>
                            {element.label}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

StatisticCardItem.propTypes = {
    item: PropTypes.shape({
        bgColor: PropTypes.string.isRequired,
        fontSize: PropTypes.number.isRequired,
        href: PropTypes.string.isRequired,
        indicators: PropTypes.array.isRequired,
        title: PropTypes.string.isRequired,
    }).isRequired,
}

export default StatisticCardItem
