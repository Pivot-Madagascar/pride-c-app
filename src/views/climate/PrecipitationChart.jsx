import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ClimateDataSection from '../../components/ClimateDataSection'
import COLORS from '../../constants/styles'
import { setPrecipitation } from '../../redux/climateSlice'
import { getOrgUnitIndex , generateLabels } from '../../utils/formating'
import { fetchAndFormat, getValuesForYear } from '../../utils/request'

const PrecipitationChart = ({ periods, engine, orgUnits, item, dataElement }) => {
    const dispatch = useDispatch()
    const [precipitationTargetOrgUnit, setPrecipitationTargetOrgUnit] =
        useState(null)

    const precipitationData = useSelector(
        (state) => state.climate.precipitation
    )
    const years = [2020, 2021, 2022]

    useEffect(() => {
        if (precipitationData) {
            const keys = Object.keys(precipitationData)
            if (keys.length === 3 && orgUnits && orgUnits.length > 0) {
                const targetOrgUnit = 'nqQz5XyejUS' // Replace with your actual target orgUnit
                const ids = years.map((year) =>
                    getOrgUnitIndex(precipitationData[year], targetOrgUnit)
                )
                setPrecipitationTargetOrgUnit(ids)
            }
        }
    }, [orgUnits, precipitationData])

    useEffect(() => {
        const fetchPrecipitationData = async () => {
            if (!precipitationData && orgUnits) {
                const promises = years.map(async (year) => {
                    const precipitation = await fetchAndFormat(
                        dataElement,
                        engine,
                        periods[year],
                        orgUnits
                    )
                    dispatch(setPrecipitation({ year, precipitation }))
                })
                await Promise.all(promises)
            }
        }
        fetchPrecipitationData()
    }, [dispatch, periods, engine, precipitationData, orgUnits])

    const labels = useMemo(() => generateLabels(2020, 2022), [])
    const precipitationChartData = useMemo(() => {
        if (!precipitationData || !precipitationTargetOrgUnit) {
            return {
                labels,
                datasets: [
                    {
                        fill: false,
                        label: 'Précipitation',
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
            ...getValuesForYear(
                2020,
                precipitationData,
                precipitationTargetOrgUnit[0]
            ),
            ...getValuesForYear(
                2021,
                precipitationData,
                precipitationTargetOrgUnit[1]
            ),
            ...getValuesForYear(
                2022,
                precipitationData,
                precipitationTargetOrgUnit[2]
            ),
        ]

        return {
            labels,
            datasets: [
                {
                    fill: false,
                    label: 'Précipitation',
                    data: combinedValues,
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                },
            ],
        }
    }, [precipitationData, precipitationTargetOrgUnit, labels])

    return (
        <ClimateDataSection
            item={item}
            bgColor={COLORS.red_light}
            chartData={precipitationChartData}
            title="Précipitation"
            xAxisText="Mois"
            yAxisText="en mm"
            height="300px"
        />
    )
}

export default PrecipitationChart
