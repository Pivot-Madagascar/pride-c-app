import React from 'react'
import ClimateLineChart from '../ClimateLineChart'
import ClimateStatisticCard from '../ClimateStatisticCard'
import style from './ClimateDataSection.module.scss'

const ClimateDataSection = ({
    item,
    bgColor,
    chartData,
    title,
    xAxisText,
    yAxisText,
    height,
}) => {
        return (
        <div className={style.climateTableRow}>
            <div className={style.statiticCardSection}>
                <ClimateStatisticCard item={item} bgColor={bgColor} />
            </div>
            <div className={style.climateChartSection}>
                <ClimateLineChart
                    data={chartData}
                    title={title}
                    xAxisText={xAxisText}
                    yAxisText={yAxisText}
                    height={height}
                />
            </div>
        </div>
    )
}

export default ClimateDataSection
