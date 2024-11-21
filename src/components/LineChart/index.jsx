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
import { getStoredData } from '../../utils/storeHelper'
import CustomLegend from './CustomLegend'
import { options } from './data'
import style from './LineChart.module.scss'
import LineChartData from './LineChartData'

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

const LineChart = ({
    title,
    xAxisText,
    yAxisText,
    adminLvl,
    activeOrgUnit,
    data,
}) => {
    const chartRef = useRef(null)
    const [datasets, setDatasets] = useState([])

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

    const lineChartData = LineChartData({ data, adminLvl, activeOrgUnit })

    useEffect(() => {
        setDatasets(lineChartData.datasets)
    }, [lineChartData.datasets])

    const handleCaptureClick = async () => {
        const chartElement = document.querySelector('#chart-container')
        if (!chartElement) {
            return
        }
        exportToImage({ htmlElement: chartElement })
    }

    const handleShowPredictionChange = (newValue) => {
        const newDatasets = datasets.map((dataset) => {
            if (dataset.label === '2024') {
                if (!newValue) {
                    const updatedData = (
                        getStoredData({
                            data: data,
                            type: 'forecast',
                            source: 'adjusted',
                            statType: 'annualAvg',
                            adminLvl: adminLvl,
                            orgUnit: String(activeOrgUnit),
                        }) || []
                    )
                        .map((item) => item.value)
                        .slice(0, -2) 

                    return { ...dataset, prediction: false, data: updatedData }
                } else {
                    const originalData = (
                        getStoredData({
                            data: data,
                            type: 'forecast',
                            source: 'adjusted',
                            statType: 'annualAvg',
                            adminLvl: adminLvl,
                            orgUnit: String(activeOrgUnit),
                        }) || []
                    ).map((item) => item.value) 

                    return {
                        ...dataset,
                        prediction: true,
                        data: originalData,
                        hidden: false,
                    } 
                }
            }
            
            if (dataset.label === 'Maximum' || dataset.label === 'Minimum') {
                return { ...dataset, hidden: !newValue } 
            }
            return dataset
        })
        setDatasets(newDatasets)
        const chart = chartRef.current
        if (chart) {
            chart.data.datasets = newDatasets
            chart.update()
        }
    }

    return (
        <div className={style.chartContainer}>
            <IconButton
                onClick={handleCaptureClick}
                className={style.floatingButton}
            >
                <PhotoCamera sx={{ height: '30px', width: '35px' }} />
            </IconButton>
            <div id="chart-container">
                <div
                    className={style.lineChartTitle}
                    dangerouslySetInnerHTML={{ __html: title }}
                />
                <Line
                    ref={chartRef}
                    options={options(xAxisText, yAxisText)}
                    data={lineChartData}
                />
                <CustomLegend
                    datasets={datasets}
                    onClick={toggleDataset}
                    onShowPredictionChange={handleShowPredictionChange}
                />
            </div>
        </div>
    )
}

LineChart.propTypes = {
    title: PropTypes.string.isRequired,
    xAxisText: PropTypes.string.isRequired,
    yAxisText: PropTypes.string.isRequired,
    adminLvl: PropTypes.string.isRequired,
    activeOrgUnit: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
}

export default LineChart
