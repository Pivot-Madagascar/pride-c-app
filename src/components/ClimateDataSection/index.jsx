import { useState, useEffect } from 'react'
import COLORS from '../../constants/styles'
import ClimateLineChart from '../ClimateLineChart'
import ClimateStatisticCard from '../ClimateStatisticCard'
import style from './ClimateDataSection.module.scss'

const ClimateDataSection = ({
    item,
    bgColor,
    title,
    xAxisText,
    yAxisText,
    height,
    data,
    labels,
}) => {
    const [isSmallScreen, setIsSmallScreen] = useState(false)

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

    const chartData = {
        labels,
        datasets: [
            {
                fill: false,
                label: '',
                data: data.length > 0 ? data.map(({ value }) => value) : [],
                borderColor: COLORS.primary_text,
                backgroundColor: COLORS.primary_text,
                tension: 0.25,
                hidden: false,
                pointStyle: false,
            },
        ],
    }

    return (
        <div className={style.climateTableRow}>
            {!isSmallScreen && (<div className={style.statiticCardSection}>
                <ClimateStatisticCard item={item} bgColor={bgColor} />
            </div>)}
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
