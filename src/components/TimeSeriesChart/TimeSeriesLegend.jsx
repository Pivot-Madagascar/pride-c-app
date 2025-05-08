import {
    CheckCircle as CheckedIcon,
    RadioButtonUnchecked as UncheckedIcon,
} from '@mui/icons-material'
import { Typography } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import style from './TimeSeriesChart.module.scss'

const hasPredictionTrue = (items) => {
    const hasMinimum = items.some(
        (item) => item.label === 'Minimum' && item.data.length > 0
    )
    const hasMaximum = items.some(
        (item) => item.label === 'Maximum' && item.data.length > 0
    )
    return hasMinimum && hasMaximum
}

const TimeSeriesLegend = ({ datasets, onClick, onShowPredictionChange }) => {
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
                                <Checkbox
                                    icon={<UncheckedIcon />}
                                    checkedIcon={<CheckedIcon />}
                                    checked={!dataset.hidden}
                                    onChange={() => onClick([index])}
                                    sx={{
                                        color: dataset?.backgroundColor,
                                        '&.Mui-checked': {
                                            color: dataset?.backgroundColor,
                                        },
                                    }}
                                />

                                <span>{dataset.label}</span>
                            </div>
                        ))}

                        <>
                            <div
                                className={style.list}
                                onClick={handleShowPrediction}
                                role="button"
                            >
                                <Checkbox
                                    icon={<UncheckedIcon />}
                                    checkedIcon={<CheckedIcon />}
                                    checked={showPrediction}
                                    // onChange={handleShowPrediction}
                                    sx={{
                                        color: 'rgb(0, 0, 0, 0.2)',
                                        '&.Mui-checked': {
                                            color: 'rgb(0, 0, 0, 0.2)',
                                        },
                                    }}
                                />
                                <span>Prediction</span>
                            </div>
                        </>
                    </div>
                </>
            )}
        </div>
    )
}

TimeSeriesLegend.propTypes = {
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

export default TimeSeriesLegend
