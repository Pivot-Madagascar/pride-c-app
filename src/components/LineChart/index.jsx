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

const LineChart = ({ data, orgUnitDetails }) => {
    const chartRef = useRef(null)
    const [datasets, setDatasets] = useState([])

    useEffect(() => {
        setDatasets(data.datasets)
    }, [data.datasets])

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
                enabled: true, // TODO: like https://www.chartjs.org/docs/latest/samples/tooltip/html.html#external-html-tooltip
                mode: 'label',
            },
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Mois',
                    font: {
                        size: 24,
                        weight: 'bold',
                    },
                },
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Cas',
                    font: {
                        size: 24,
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
        labels: data.labels,
        datasets: datasets,
    }

    return (
        <div className={style.container}>
            <div className={style.lineChartTitle}>
                {orgUnitDetails.displayName === 'Ifanadiana' && (
                    <span>Cas détécté dans le district de IFANADIANA</span>
                )}
                {orgUnitDetails.displayName !== 'Ifanadiana' &&
                    orgUnitDetails.type === 'municipality' && (
                        <span>
                            Cas détécté dans la commune de{' '}
                            {orgUnitDetails.displayName}
                        </span>
                    )}
                {orgUnitDetails.displayName !== 'Ifanadiana' &&
                    orgUnitDetails.type === 'fokontany' && (
                        <span>
                            Cas détécté dans le fokontany de{' '}
                            {orgUnitDetails.displayName}
                        </span>
                    )}
            </div>
            <Line ref={chartRef} options={options} data={chartData} />
            <CustomLegend datasets={datasets} onClick={toggleDataset} />
        </div>
    )
}

LineChart.propTypes = {
    data: PropTypes.shape({
        labels: PropTypes.arrayOf(PropTypes.string).isRequired,
        datasets: PropTypes.arrayOf(
            PropTypes.shape({
                fill: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
                label: PropTypes.string.isRequired,
                data: PropTypes.arrayOf(PropTypes.number).isRequired,
                borderColor: PropTypes.string.isRequired,
                backgroundColor: PropTypes.string.isRequired,
                tension: PropTypes.number,
                hidden: PropTypes.bool,
            })
        ).isRequired,
    }).isRequired,
    orgUnitDetails: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
    }).isRequired,
}

export default LineChart
