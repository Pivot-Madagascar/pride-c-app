import { PhotoCameraOutlined as PhotoCamera } from '@mui/icons-material'
import { IconButton } from '@mui/material'
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
        setDatasets(timeSeriesData.datasets)
    }, [timeSeriesData.datasets])

    useEffect(() => {
        if (!showVisualization || data === null || datasets.length < 3) {
            setShowOverlay(true)
        } else {
            setShowOverlay(false)
        }
    }, [showVisualization, data, datasets])

    const handleCaptureClick = async () => {
        const chartElement = document.querySelector('#chart-container')
        if (!chartElement) {
            return
        }
        exportToImage({ htmlElement: chartElement })
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
                        <PhotoCamera sx={{ height: '30px', width: '35px', color: showOverlay ? 'transparent' : 'inherit' }} />
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
