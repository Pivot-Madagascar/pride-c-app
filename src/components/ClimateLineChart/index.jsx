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
import style from './ClimateLineChart.module.scss'

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

const ClimateLineChart = ({ data, title, xAxisText, yAxisText }) => {
    const chartRef = useRef(null)
    const containerRef = useRef(null)
    const [datasets, setDatasets] = useState([])
    const [chartWidth, setChartWidth] = useState('1000px')
    const [showOverlay, setShowOverlay] = useState(false)
    const [isSmallScreen, setIsSmallScreen] = useState(false)

    useEffect(() => {
        setDatasets(data.datasets)
    }, [data.datasets])

    useEffect(() => {
        if (data.datasets[0]?.data.length === 0) {
            setShowOverlay(true)
        } else {
            setShowOverlay(false)
        }
    }, [data])

    useEffect(() => {
        const updateChartWidth = () => {
            if (containerRef.current) {
                setChartWidth(containerRef.current.clientWidth)
            }
        }

        updateChartWidth()
        window.addEventListener('resize', updateChartWidth)

        return () => {
            window.removeEventListener('resize', updateChartWidth)
        }
    }, [])

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 900)
        }

        window.addEventListener('resize', handleResize)
        handleResize()

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
                text: title,
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
                    display: false,
                    text: xAxisText,
                    font: {
                        size: 20,
                        weight: 'bold',
                    },
                },
                ticks: {
                    display: true,
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

    const chartData = {
        labels: data.labels,
        datasets: datasets,
    }

    return (
        <div
            ref={containerRef}
            className={style.container}
            style={{ width: '100%' }}
            data-testid="line-chart"
        >
            {isSmallScreen && (<span
                style={{
                    fontSize: '20px',
                    display: 'block',
                    marginBottom: '5px',
                    fontWeight: 'bold',
                }}
            >
                {title}
            </span>)}
            <div
                style={{
                    width: '100%',
                    height: '85%',
                    position: 'relative',
                    borderRadius: '8px',
                    overflow: 'hidden',
                }}
            >
                {showOverlay && (
                    <div className={style.overlay}>
                        <span>Information non disponible</span>
                    </div>
                )}
                <Line ref={chartRef} options={options} data={chartData} />
            </div>
        </div>
    )
}

ClimateLineChart.propTypes = {
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
    title: PropTypes.string.isRequired,
    xAxisText: PropTypes.string.isRequired,
    yAxisText: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
}

export default ClimateLineChart
