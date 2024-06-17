import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ClimateDataSection from '../../components/ClimateDataSection'
import COLORS from '../../constants/styles'
import { setTemperature } from '../../redux/climateSlice'
import { generateLabels , getOrgUnitIndex } from '../../utils/formating'
import { fetchAndFormat, getValuesForYear } from '../../utils/request'

const TemperatureChart = ({ periods, engine, orgUnits, item, dataElement }) => {
    const dispatch = useDispatch()
    const [temperatureTargetOrgUnit, setTemperatureTargetOrgUnit] =
        useState(null)

    const temperatureData = useSelector(state => state.climate.temperature)

    const years = [2020, 2021, 2022]

    useEffect(() => {
        if (temperatureData) {
            const keys = Object.keys(temperatureData)
            if (keys.length === 3 && orgUnits && orgUnits.length > 0) {
                const targetOrgUnit = 'nqQz5XyejUS' // Replace with your actual target orgUnit
                const ids = years.map((year) =>
                    getOrgUnitIndex(temperatureData[year], targetOrgUnit)
                )
                setTemperatureTargetOrgUnit(ids)
            }
        }
    }, [orgUnits, temperatureData])

    useEffect(() => {
        const fetchTemperatureData = async () => {
            if (!temperatureData && orgUnits) {
                const promises = years.map(async year => {
                    const temperature = await fetchAndFormat(
                        dataElement,
                        engine,
                        periods[year],
                        orgUnits
                    )
                    dispatch(setTemperature({ year, temperature }))
                })
                await Promise.all(promises)
            }
        }
        fetchTemperatureData()
    }, [dispatch, periods, engine, temperatureData, orgUnits])

    const labels = useMemo(() => generateLabels(2020, 2022), [])
    const temperatureChartData = useMemo(() => {
        if (!temperatureData || !temperatureTargetOrgUnit) {
            return {
                labels,
                datasets: [
                    {
                        fill: false,
                        label: 'Temperature',
                        data: [],
                        borderColor: COLORS.primary_text,
                        backgroundColor: COLORS.primary_text,
                        tension: 0.25,
                        hidden: false,
                    },
                ],
            }
        }

        const combinedValues = [
            ...getValuesForYear(2020, temperatureData, temperatureTargetOrgUnit[0]),
            ...getValuesForYear(2021, temperatureData, temperatureTargetOrgUnit[1]),
            ...getValuesForYear(2022, temperatureData, temperatureTargetOrgUnit[2]),
        ]

        return {
            labels,
            datasets: [
                {
                    fill: false,
                    label: 'Temperature',
                    data: combinedValues,
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                },
            ],
        }
    }, [temperatureData, temperatureTargetOrgUnit, labels])

    return (
        <ClimateDataSection
            item={item}
            bgColor={COLORS.red_light}
            chartData={temperatureChartData}
            title="Temperature"
            xAxisText="Mois"
            yAxisText="en °C"
            height="300px"
        />
    )
}

export default TemperatureChart
