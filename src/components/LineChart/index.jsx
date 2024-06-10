import { faker } from '@faker-js/faker'
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

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'TITLE',
        },
    },
}

const labels = [
    'Jan',
    'Fev',
    'Mars',
    'Avr',
    'Mai',
    'Juin',
    'Juil',
    'Aout',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
]

export const data = {
    labels,
    datasets: [
        {
            fill: false,
            label: '2023',
            data: labels.map(() =>
                faker.datatype.number({ min: 0, max: 1000 })
            ),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
            fill: false,
            label: '2024',
            data: labels.map(() =>
                faker.datatype.number({ min: 0, max: 1000 })
            ),
            borderColor: 'rgb(153, 162, 235)',
            backgroundColor: 'rgba(153, 162, 235, 0.5)',
        },
        {
            fill: false,
            label: '2024',
            data: labels.map(() =>
                faker.datatype.number({ min: 0, max: 1000 })
            ),
            borderColor: 'rgb(153, 162, 235)',
            backgroundColor: 'rgba(153, 162, 235, 0.5)',
        },
    ],
}

const LineChart = () => {
    return <Line options={options} data={data} />
}

export default LineChart
