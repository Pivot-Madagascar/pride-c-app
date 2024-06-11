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
import React from 'react'
import { Line } from 'react-chartjs-2'

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

const LineChart = ({ data }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                align: 'start',
                labels: {
                    usePointStyle: true
                }
            },
            title: {
                display: false,
                text: 'Cas détécté dans le district de IFANADIANA',
                align: 'start',
                font: {
                    size: 28,
                    family: 'Roboto',
                },
            },
            tooltips: {
                enabled: true, // TODO: liko https://www.chartjs.org/docs/latest/samples/tooltip/html.html#external-html-tooltip
                mode: 'label'
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
                        weight: 'bold'
                    }
                },
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Cas',
                    font: {
                        size: 24,
                        weight: 'bold'
                    }
                },
            },
        },
          
    }

    return <Line options={options} data={data} />
}

export default LineChart
