import PropTypes from 'prop-types'
import React from 'react'
import style from './metricsCard.module.scss'

const MetricsCard = ({ item, bgColor, textAlign = 'start' }) => {
    return (
        <div className={style.card} style={{ backgroundColor: bgColor, textAlign: textAlign }}>
            <div className={style.header} data-testid="title">
                {item.label}
            </div>
            <div className={style.mainContent} data-testid="main-content">
                {item.value && item.value.toLocaleString('fr-FR', {
                    style: 'decimal',
                    useGrouping: true,
                })}
            </div>
            <div className={style.footer}>
                {(item.comparison || item.comparison === 0) && (
                    <>
                        <div
                            className={style.comparisonData}
                            data-testid="comparison-data"
                            style={{ color: item.comparison > 0 ? 'red' : 'green'}}
                        >
                            {item.comparison.toLocaleString('fr-FR', {
                                style: 'decimal',
                                useGrouping: true,
                            })}
                            {item.comparison > 0 && <span style={{ fontSize: 12 }}> &#9650;</span>}
                            {item.comparison < 0 && <span style={{ fontSize: 12 }}> &#9660;</span>}
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

MetricsCard.propTypes = {
    item: PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
            .isRequired,
        percentage: PropTypes.number,
        description: PropTypes.string,
    }).isRequired,
    bgColor: PropTypes.string.isRequired,
    textAlign: PropTypes.string
}

export default MetricsCard
