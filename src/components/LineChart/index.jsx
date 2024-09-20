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
    labels,
    yearData,
    minMaxData,
    malaria_2016,
    malaria_2017,
    malaria_2018,
    upper_2016,
    lower_2016,
    orgUnits,
    title,
    xAxisText,
    yAxisText,
}) => {
    const chartRef = useRef(null)
    const [datasets, setDatasets] = useState([])

    const memoizedDatasets = useMemo(
        () => [
            {
                fill: false,
                label: '2024',
                data:
                    yearData[2021] ||
                    (malaria_2016 ? addValues(orgUnits, malaria_2016) : []),
                borderColor: COLORS.primary_text,
                backgroundColor: COLORS.primary_text,
                tension: 0.25,
                hidden: false,
            },
            {
                fill: false,
                label: '2022',
                data:
                    yearData[2022] ||
                    (malaria_2017 ? addValues(orgUnits, malaria_2017) : []),
                borderColor: COLORS.green,
                backgroundColor: COLORS.green,
                tension: 0.25,
                hidden: false,
            },
            {
                fill: false,
                label: '2023',
                data:
                    yearData[2023] ||
                    (malaria_2018 ? addValues(orgUnits, malaria_2018) : []),
                borderColor: COLORS.red_chart_line,
                backgroundColor: COLORS.red_chart_line,
                tension: 0.25,
                hidden: false,
            },
            {
                fill: 0,
                label: 'Maximum',
                data:
                    minMaxData.max ||
                    (upper_2016 ? addValues(orgUnits, upper_2016) : []),
                borderColor: 'transparent',
                backgroundColor: 'rgb(0, 0, 0, 0.2)',
                tension: 0.25,
                pointRadius: 0,
                type: 'line',
                hidden: false,
            },
            {
                fill: 0,
                label: 'Minimum',
                data:
                    minMaxData.min ||
                    (lower_2016 ? addValues(orgUnits, lower_2016) : []),
                borderColor: 'transparent',
                backgroundColor: 'rgb(0, 0, 0, 0.2)',
                tension: 0.25,
                pointRadius: 0,
                type: 'line',
                hidden: false,
            },
        ],
        [
            yearData,
            minMaxData,
            malaria_2016,
            malaria_2017,
            malaria_2018,
            upper_2016,
            lower_2016,
            orgUnits,
        ]
    )

    useEffect(() => {
        setDatasets(memoizedDatasets)
        console.log(yearData);
    }, [memoizedDatasets, yearData])

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

    const chartData = {
        labels: labels,
        datasets: datasets,
    }

    return (
        <div className={style.container}>
            <div className={style.lineChartTitle}>{title}</div>
            <Line ref={chartRef} options={options} data={chartData} />
            <CustomLegend datasets={datasets} onClick={toggleDataset} />
        </div>
    )
}

LineChart.propTypes = {
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    yearData: PropTypes.object.isRequired,
    minMaxData: PropTypes.object.isRequired,
    malaria_2016: PropTypes.array,
    malaria_2017: PropTypes.array,
    malaria_2018: PropTypes.array,
    upper_2016: PropTypes.array,
    lower_2016: PropTypes.array,
    orgUnits: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    xAxisText: PropTypes.string.isRequired,
    yAxisText: PropTypes.string.isRequired,
}

export default LineChart
