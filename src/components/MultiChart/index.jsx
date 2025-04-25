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
} from 'chart.js';
import PropTypes from 'prop-types';
import React, { useRef, useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
// import style from './ClimateLineChart.module.scss';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);
const MultiChart = ({ data, titles, xAxisText, height }) => {
    const containerRef = useRef(null);
    const [chartWidth] = useState('1000px'); // Set a default width
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: xAxisText,
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Y-Axis',
                },
                ticks: {
                    // Set consistent font size and padding
                    font: {
                        size: 14,
                    },
                    padding: 10, // Adjust padding for better alignment
                },
            },
        },
    };
    return (
        <div ref={containerRef} style={{ width: chartWidth }}>
            {data.map((dataset, index) => (
                <div key={index} style={{ height: height }}>
                    <h3>{titles[index]}</h3>
                    <Line
                        options={{
                            ...options,
                            scales: {
                                ...options.scales,
                                y: {
                                    ...options.scales.y,
                                    min: Math.min(...dataset.data) - 1, // Set min based on data
                                    max: Math.max(...dataset.data) + 1, // Set max based on data
                                },
                            },
                        }}
                        data={{
                            labels: dataset.labels,
                            datasets: [{
                                label: dataset.label,
                                data: dataset.data,
                                borderColor: dataset.borderColor,
                                backgroundColor: dataset.backgroundColor,
                                fill: false,
                            }],
                        }}
                    />
                </div>
            ))}
        </div>
    );
};
MultiChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            labels: PropTypes.arrayOf(PropTypes.string).isRequired,
            label: PropTypes.string.isRequired,
            data: PropTypes.arrayOf(PropTypes.number).isRequired,
            borderColor: PropTypes.string.isRequired,
            backgroundColor: PropTypes.string.isRequired,
        })
    ).isRequired,
    titles: PropTypes.arrayOf(PropTypes.string).isRequired,
    xAxisText: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
};
export default MultiChart;