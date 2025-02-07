import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import style from './metricsCard.module.scss'

const MetricsCard = ({ item, bgColor, textAlign = 'start' }) => {
    const [animatedValue, setAnimatedValue] = useState(0)
    const isInteger = (num) => Math.floor(num) === num

    const counterUp = (targetNumber, duration) => {
        let start = 0
        const increment = targetNumber / (duration / 100)
        const interval = setInterval(() => {
            start += increment
            if (start >= targetNumber) {
                start = targetNumber
                clearInterval(interval)
            }
            setAnimatedValue(Math.floor(start))
        }, 25)
    }

    useEffect(() => {
        if (isInteger(item.value)) {
            if (item.value && item.value > 0) {
                counterUp(item.value, 2000)
            }
        } else {
            setAnimatedValue(item.value)
        }
    }, [item.value])

    return (
        <div
            className={style.card}
            style={{ backgroundColor: bgColor, textAlign: textAlign }}
        >
            <div className={style.header} data-testid="title">
                {item.label}
            </div>
            <div className={style.mainContent} data-testid="main-content">
                {item.value !== undefined ? (
                    <div style={{ fontWeight: 500 }}>
                        {animatedValue &&
                            animatedValue.toLocaleString('fr-FR', {
                                style: 'decimal',
                                useGrouping: true,
                                maximumFractionDigits: 2,
                            })}
                        {item.isPercent && '%'}
                    </div>
                ) : (
                    <div style={{ fontWeight: 200, color: 'transparent' }}> -- </div>
                )}
            </div>
            <div className={style.footer}>
                <div
                    className={style.comparisonData}
                    data-testid="comparison-data"
                    style={{ color: item.comparison > 0 ? 'red' : 'green' }}
                >
                    {(item.comparison || item.comparison === 0) && (
                        <>
                            {item.comparison.toLocaleString('fr-FR', {
                                style: 'decimal',
                                useGrouping: true,
                            })}
                            {item.comparison > 0 && (
                                <span style={{ fontSize: 12 }}> &#9650;</span>
                            )}
                            {item.comparison < 0 && (
                                <span style={{ fontSize: 12 }}> &#9660;</span>
                            )}
                        </>
                    )}
                </div>
                <div
                    className={style.comparisonDescription}
                    data-testid="comparison-description"
                >
                    {item.description}
                </div>
            </div>
            {item.value === undefined && (
                <div className={style.overlay}>
                    <span>Données non-disponible</span>
                </div>
            )}
        </div>
    )
}

MetricsCard.propTypes = {
    item: PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        comparison: PropTypes.number,
        description: PropTypes.string,
        isPercent: PropTypes.bool, 
    }).isRequired,
    bgColor: PropTypes.string.isRequired,
    textAlign: PropTypes.string,
}

export default MetricsCard
