import React, { useState, useEffect } from 'react'
import { Typography } from '@mui/material'
import PropTypes from 'prop-types'
import style from './LineChart.module.scss'

const hasPredictionTrue = (items) => {
    return items.some((item) => item.prediction === true)
}

const CustomLegend = ({ datasets, onClick, onShowPredictionChange }) => {
    const [showPrediction, setShowPrediction] = useState(false)

    useEffect(() => {
        if (datasets) {
            const checked = hasPredictionTrue(datasets)
            setShowPrediction(checked)
        }
    }, [datasets])

    const handleShowPrediction = () => {
        setShowPrediction((prev) => {
            const newValue = !prev
            onShowPredictionChange(newValue)
            return newValue
        })
    }

    return (
        <div className={style.legendsContainer}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'end',
                }}
            ></div>
            <Typography sx={{ width: '100%', textAlign: 'start' }}>
                Legendes:
            </Typography>
            <div className={style.listContainer}>
                {datasets.slice(0, -2).map((dataset, index) => (
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
                                    dataset?.backgroundColor || 'defaultColor',
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
                {datasets.length > 1 && (
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
                )}
            </div>
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
