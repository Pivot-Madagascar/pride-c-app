import PropTypes from 'prop-types'
import React from 'react'
import style from './Map.module.scss'

const MapLegend = ({ colors, minValue, maxValue }) => {
    const gradientColors = colors.join(', ')

    return (
        <div className={style.legendContainer}>
            <div className={style.legendTitle}>Nombre de cas mensuel</div>
            <div
                className={style.colorBar}
                style={{
                    background: `linear-gradient(to right, ${gradientColors})`,
                }}
            ></div>
            <div className={style.labels}>
                <span className={style.minLabel}>{minValue.toFixed(0)}</span>
                <span className={style.maxLabel}>{maxValue.toFixed(0)}</span>
            </div>
        </div>
    )
}

MapLegend.propTypes = {
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    minValue: PropTypes.number.isRequired,
    maxValue: PropTypes.number.isRequired,
}

export default MapLegend
