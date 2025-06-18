import PhotoCamera from '@mui/icons-material/PhotoCameraOutlined'
import IconButton from '@mui/material/IconButton'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js'
import PropTypes from 'prop-types'
import React, { useRef, useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { exportToImage } from '../../utils/export'
import { options } from './data'
import style from './TimeSeriesChart.module.scss'
import TimeSeriesData from './TimeSeriesData'
import TimeSeriesLegend from './TimeSeriesLegend'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
)

const TimeSeriesChart = ({
    title,
    xAxisText,
    yAxisText,
    data,
    showVisualization,
}) => {
    const chartRef = useRef(null)
    const [datasets, setDatasets] = useState([])
    const [showOverlay, setShowOverlay] = useState(false)
    const [showCaptureBtn, setShowCaptureBtn] = useState(true)

    const toggleDataset = (indices) => {
        let newDatasets = [...datasets]
        indices.forEach((index) => {
            newDatasets = newDatasets.map((dataset, i) => {
                if (i === index) {
                    return { ...dataset, hidden: !dataset.hidden }
                }
                return dataset
            })
        })
        setDatasets(newDatasets)
        const chart = chartRef.current
        if (chart) {
            chart.data.datasets = newDatasets
            chart.update()
        }
    }

    const timeSeriesData = TimeSeriesData({ data })

    useEffect(() => {
        if (timeSeriesData.datasets) {
            setDatasets(timeSeriesData.datasets)
        }
        
    }, [JSON.stringify(timeSeriesData.datasets)])

    useEffect(() => {
        if (!showVisualization || data === null || datasets.length < 3) {
            setShowOverlay(true)
        } else {
            setShowOverlay(false)
        }
    }, [showVisualization, data, datasets])

    const handleCaptureClick = async () => {
        setShowCaptureBtn(false)
        // Add a timeout of, for example, 1000 milliseconds (1 second)
        setTimeout(async () => {
            const chartElement = document.querySelector('#chart-container')
            if (!chartElement) {
                return
            }

            const { success, error } = await exportToImage({
                htmlElement: chartElement,
            })

            success ? setShowCaptureBtn(success) : console.log(error)
        }, 1000) // Adjust the timeout duration as needed
    }

    const updateHiddenvalues = (data, hiddenValue = false) => {
        const labelsToCheck = ['Minimum', 'Maximum', 'min', 'max']
        data.forEach((item) => {
            if (labelsToCheck.includes(item.label)) {
                item.hidden = hiddenValue
            }
        })
        return data
    }

    const handleShowPredictionChange = (hidePrediction) => {
        if (datasets.length !== 0) {
            const newDatasets = updateHiddenvalues(datasets, !hidePrediction)
            setDatasets(newDatasets)
            const chart = chartRef.current
            if (chart) {
                chart.data.datasets = newDatasets
                chart.update()
            }
        }
    }

    return (
        <div className={style.chartContainer}>
            {showOverlay && (
                <div className={style.overlay}>
                    <span>Information non disponible</span>
                </div>
            )}
            <div
                id="chart-container"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '600px',
                }}
            >
                <div
                    className={style.lineChartTitle}
                    dangerouslySetInnerHTML={{
                        __html: !showOverlay ? title : '---',
                    }}
                    style={{
                        color: !showOverlay ? 'inherit' : 'transparent',
                        flex: '0 0 80px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                />
                <div
                    style={{
                        position: 'relative',
                        height: '400px',
                        width: '',
                        marginTop: '-2rem',
                    }}
                >
                    <IconButton
                        onClick={handleCaptureClick}
                        className={style.floatingButton}
                    >
                        {showCaptureBtn ? (
                            <PhotoCamera
                                sx={{
                                    height: '30px',
                                    width: '35px',
                                    color: showOverlay
                                        ? 'transparent'
                                        : 'inherit',
                                }}
                            />
                        ) : (
                            <div style={{ height: '30px' }} />
                        )}
                    </IconButton>

                    <Line
                        ref={chartRef}
                        options={options(xAxisText, yAxisText)}
                        data={timeSeriesData}
                        height={350}
                    />
                </div>
                <div
                    style={{
                        flex: '0 0 120px',
                        marginTop: '2rem',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <TimeSeriesLegend
                        datasets={datasets}
                        onClick={toggleDataset}
                        onShowPredictionChange={handleShowPredictionChange}
                        hideForCapture={!showCaptureBtn}
                    />
                </div>
            </div>
        </div>
    )
}

TimeSeriesChart.propTypes = {
    title: PropTypes.string.isRequired,
    xAxisText: PropTypes.string.isRequired,
    yAxisText: PropTypes.string.isRequired,
    data: PropTypes.object,
    showVisualization: PropTypes.bool,
}

export default TimeSeriesChart
