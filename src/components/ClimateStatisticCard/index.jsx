import PropTypes from 'prop-types'
import React from 'react'
import style from '@/components/ClimateStatisticCard/climateStatisticCard.module.scss'

const ClimateStatisticCard = ({ item, bgColor }) => {
    return (
        <div className={style.card} style={{ backgroundColor: bgColor }}>
            <div
                className={style.header}
                data-testid="title"
                style={{
                    verticalAlign: 'top',
                    display: 'flex',
                }}
            >
                <div>
                    {item.icon({
                        width: 48,
                        height: 48,
                        color: '#343B4F',
                    })}
                </div>
                <div style={{ fontSize: 24, paddingLeft: 6, fontWeight: 500 }}>
                    {item.title}
                </div>
            </div>
            <div className={style.mainContent} data-testid="main-content">
                {item.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            </div>
        </div>
    )
}

ClimateStatisticCard.propTypes = {
    item: PropTypes.shape({
        title: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
            .isRequired,
    }).isRequired,
    bgColor: PropTypes.string.isRequired,
}

export default ClimateStatisticCard
