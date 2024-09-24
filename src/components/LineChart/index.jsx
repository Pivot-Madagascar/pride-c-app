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
import React, { useRef, useState, useEffect, useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import COLORS from '../../constants/styles'
import { addValues } from '../../utils/formatting'
import CustomLegend from './CustomLegend'
import style from './LineChart.module.scss'

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
    data,
    title,
    xAxisText,
    yAxisText,
}) => {
    const chartRef = useRef(null)

    // useEffect(() => {
    //     setDatasets(memoizedDatasets)
    //     console.log(yearData);
    // }, [memoizedDatasets, yearData])
    useEffect(() => {
        console.log(data);
    }, [data])

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
                text: '',
                align: 'start',
                font: {
                    size: 28,
                    family: 'Roboto',
                },
            },
            tooltips: {
                enabled: true,
                mode: 'label',
            },
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: xAxisText,
                    font: {
                        size: 20,
                        weight: 'bold',
                    },
                },
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: yAxisText,
                    font: {
                        size: 20,
                        weight: 'bold',
                    },
                },
            },
        },
    }

    const toggleDataset = (indices) => {
        let newDatasets = [...data.datasets]
        indices.forEach((index) => {
            newDatasets = newDatasets.map((dataset, i) => {
                if (i === index) {
                    return { ...dataset, hidden: !dataset.hidden }
                }
                return dataset
            })
        })

        // setDatasets(newDatasets)
        // const chart = chartRef.current
        // if (chart) {
        //     chart.data.datasets = newDatasets
        //     chart.update()
        // }
    }

    const chartData = {
        labels: data.labels,
        datasets: data.datasets,
    }

    return (
        <div className={style.container}>
            <div className={style.lineChartTitle}>{title}</div>
            {data && <Line ref={chartRef} options={options} data={chartData} />}
            <CustomLegend datasets={data.datasets} onClick={toggleDataset} />
        </div>
    )
}

export default LineChart
