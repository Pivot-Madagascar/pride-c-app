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

    return (
        <div className={style.container}>
            <div
                className={style.lineChartTitle}
                dangerouslySetInnerHTML={{ __html: title }}
            />
            <Line
                ref={chartRef}
                options={options(xAxisText, yAxisText)}
                data={lineChartData}
            />
            <CustomLegend datasets={datasets} onClick={toggleDataset} />
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
