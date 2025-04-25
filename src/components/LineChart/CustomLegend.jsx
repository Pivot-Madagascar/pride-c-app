import React, { useState, useEffect } from 'react'
import { Typography } from '@mui/material'
import PropTypes from 'prop-types'
import style from './LineChart.module.scss'

const hasPredictionTrue = (items) => {
    const hasMinimum = items.some(
        (item) => item.label === 'Minimum' && item.data.length > 0
    )
    const hasMaximum = items.some(
        (item) => item.label === 'Maximum' && item.data.length > 0
    )
    return hasMinimum && hasMaximum
}

const CustomLegend = ({ datasets, onClick, onShowPredictionChange }) => {
    const [showPrediction, setShowPrediction] = useState(false)

    useEffect(() => {
        if (datasets) {
            const checked = hasPredictionTrue(datasets)
            setShowPrediction(checked)
        }
    }, [datasets])

    useEffect(() => {
        onShowPredictionChange(showPrediction)
    }, [showPrediction])

    const handleShowPrediction = () => {
        setShowPrediction(!showPrediction)
    }

    return (
        <div className={style.legendsContainer}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'end',
                }}
            ></div>
            {datasets.length > 3 && (
                <>
                    <Typography sx={{ width: '100%', textAlign: 'start' }}>
                        Legendes:
                    </Typography>
                    <div className={style.listContainer}>
                        {datasets.slice(0, -4).map((dataset, index) => (
                            <div
                                className={style.list}
                                key={index}
                                onClick={() => onClick([index])}
                                role="button"
                            >
                                <span
                                    className={style.circle}
                                    style={{
                                        backgroundColor:
                                            dataset?.backgroundColor ||
                                            'defaultColor',
                                    }}
                                />
                                <span
                                    style={{
                                        textDecorationLine: dataset.hidden
                                            ? 'line-through'
                                            : 'none',
                                    }}
                                >
                                    {dataset.label}
                                </span>
                            </div>
                        ))}

                        <>
                            <div
                                className={style.list}
                                onClick={handleShowPrediction}
                                role="button"
                            >
                                <span
                                    className={style.circle}
                                    style={{
                                        backgroundColor: 'rgb(0, 0, 0, 0.2)',
                                    }}
                                />
                                <span
                                    style={{
                                        textDecorationLine: !showPrediction
                                            ? 'line-through'
                                            : 'none',
                                    }}
                                >
                                    Prediction
                                </span>
                            </div>
                        </>
                    </div>
                </>
            )}
        </div>
    )
}

CustomLegend.propTypes = {
    datasets: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            backgroundColor: PropTypes.string.isRequired,
            hidden: PropTypes.bool.isRequired,
        })
    ).isRequired,
    onClick: PropTypes.func.isRequired,
    onShowPredictionChange: PropTypes.func.isRequired,
}

export default CustomLegend
