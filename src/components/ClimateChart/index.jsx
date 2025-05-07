import { useEffect, useState } from 'react'
import COLORS from '../../constants/styles'
import ClimateLineChart from '../ClimateLineChart'
import ClimateStatisticCard from '../ClimateStatisticCard'
import style from './ClimateChart.module.scss'
import { climateData } from './data'

const ClimateChart = ({ colorTheme, labels, data, dataElement }) => {
    const [currentVariable, setCurrentVariable] = useState({
        title: '',
        value: '',
        id: '',
        percentage: 0,
        description: '',
        unit: '',
        icon: () => null,
    })

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

    useEffect(() => {
        if (dataElement) {
            const found = climateData.find(({ id }) => id === dataElement)
            setCurrentVariable(found)
        }
    }, [dataElement])

    return (
        <div className={style.climateTableRow}>
            <div className={style.statiticCardSection}>
                <ClimateStatisticCard
                    item={currentVariable}
                    bgColor={colorTheme}
                />
            </div>
            <div className={style.climateChartSection}>
                <ClimateLineChart
                    data={chartData}
                    title=""
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
