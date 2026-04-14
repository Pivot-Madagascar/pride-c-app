import React, { useEffect, useState } from 'react'
import COLORS from '@/constants/styles'
import ClimateLineChart from '@/components/ClimateLineChart'
import ClimateStatisticCard from '@/components/ClimateStatisticCard'
import { climateData } from '@/components/ClimateChart/data.jsx'
import style from './ClimateChart.module.scss'

const ClimateChart = ({ colorTheme, labels, data, dataElement, title }) => {
    const [currentVariable, setCurrentVariable] = useState({
        title: '',
        value: '',
        id: '',
        percentage: 0,
        description: '',
        unit: '',
        icon: () => null,
    })

    const [isSmallScreen, setIsSmallScreen] = useState(false)

    const chartData = {
        labels,
        datasets: [
            {
                fill: false,
                label: '',
                data:
                    data && data.length > 0
                        ? data.map(({ value }) => value)
                        : [],
                borderColor: COLORS.primary_text,
                backgroundColor: COLORS.primary_text,
                tension: 0.25,
                hidden: false,
                pointStyle: false,
            },
        ],
    }

    useEffect(() => {
        if (dataElement) {
            const found = climateData.find(({ id }) => id === dataElement)
            setCurrentVariable(found)
        }
    }, [dataElement])

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

    return (
        <div className={style.climateTableRow}>
            {!isSmallScreen && (
                <div className={style.statiticCardSection}>
                    <ClimateStatisticCard
                        item={currentVariable}
                        bgColor={colorTheme}
                    />
                </div>
            )}
            <div className={style.climateChartSection} style={{ paddingTop: isSmallScreen ? '15px' : '0px' }}>
                <ClimateLineChart
                    data={chartData}
                    title={title}
                    xAxisText="Mois"
                    yAxisText={currentVariable.unit ? currentVariable.unit : ''}
                    height="230px"
                    unit={currentVariable.unit}
                />
            </div>
        </div>
    )
}

export default ClimateChart
