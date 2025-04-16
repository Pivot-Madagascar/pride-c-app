import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import style from './metricsCard.module.scss'
const MetricsCard = ({
    item: { label, value, comparison, periods, isPercent },
    bgColor,
    textAlign = 'start',
}) => {
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
        return interval 
    }
    const renderComparisonIcon = (comparison) => {
        if (comparison > 0)
            {return (<span style={{ fontSize: 12 }}> &#9650;</span>)}
        if (comparison < 0)
            {return <span style={{ fontSize: 12 }}> &#9660;</span>}
        return null
    }
    const toCleanNumber = (num) => {
        return Number.isInteger(num)
            ? num
            : num % 1 === 0
            ? Math.trunc(num)
            : num
    }
    useEffect(() => {
        const newValue = toCleanNumber(value)
        if (newValue) {
            if (isInteger(newValue) && newValue > 0) {
                const interval = counterUp(newValue, 2000)
                return () => clearInterval(interval) 
            } else {
                setAnimatedValue(newValue)
            }
        }
    }, [value]) 
    const formattedValue = animatedValue.toLocaleString('fr-FR', {
        style: 'decimal',
        useGrouping: true,
        maximumFractionDigits: 2,
    })
    return (
        <div
            className={style.card}
            style={{ backgroundColor: bgColor, textAlign }}
        >
            <div className={style.header} data-testid="title">
                {label}
            </div>
            <div className={style.mainContent} data-testid="main-content">
                {value ? (
                    <div style={{ fontWeight: 500 }}>
                        {formattedValue}
                        {isPercent && '%'}
                    </div>
                ) : (
                    <div style={{ fontWeight: 200, color: 'transparent' }}>
                        --
                    </div>
                )}
            </div>
            <div className={style.footer}>
                {(comparison || comparison === 0) && (
                    <div
                        className={style.comparisonData}
                        data-testid="comparison-data"
                        style={{ color: comparison > 0 ? 'red' : 'green' }}
                    >
                        {comparison.toLocaleString('fr-FR', {
                            style: 'decimal',
                            useGrouping: true,
                        })}
                        {renderComparisonIcon(comparison)}
                    </div>
                )}
                {periods && (
                    <div
                        className={style.comparisonDescription}
                        data-testid="comparison-description"
                        style={{ color: value ? 'inherit' : 'transparent' }}
                    >
                        <span>
                            Entre {periods.current.start} et{' '}
                            {periods.current.end},
                        </span>
                        <span>
                            par rapport à {periods.comparison.start} et{' '}
                            {periods.comparison.end}
                        </span>
                    </div>
                )}
            </div>
            {!value && (
                <div className={style.overlay}>
                    <span>Information non disponible</span>
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
        periods: PropTypes.shape({
            current: PropTypes.object.isRequired,
            comparison: PropTypes.object.isRequired,
        }),
        isPercent: PropTypes.bool,
    }).isRequired,
    bgColor: PropTypes.string.isRequired,
    textAlign: PropTypes.string,
}
export default MetricsCard
