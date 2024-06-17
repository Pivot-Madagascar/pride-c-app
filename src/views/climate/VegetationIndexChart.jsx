import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ClimateDataSection from '../../components/ClimateDataSection'
import COLORS from '../../constants/styles'
import { setVegetationIndex } from '../../redux/climateSlice'
import { getOrgUnitIndex, generateLabels } from '../../utils/formating'
import { fetchAndFormat, getValuesForYear } from '../../utils/request'

const VegetationIndexChart = ({
    periods,
    engine,
    orgUnits,
    item,
    dataElement,
}) => {
    const dispatch = useDispatch()
    const [currentOrgUnit, setCurrentOrgUnit] = useState(null)

    const vegetationIndexData = useSelector(
        (state) => state.climate.vegetationIndex
    )
    const years = [2020, 2021, 2022]

    useEffect(() => {
        if (vegetationIndexData) {
            const keys = Object.keys(vegetationIndexData)
            if (keys.length === 3 && orgUnits && orgUnits.length > 0) {
                const targetOrgUnit = 'nqQz5XyejUS' // Replace with your actual target orgUnit
                const ids = years.map((year) =>
                    getOrgUnitIndex(vegetationIndexData[year], targetOrgUnit)
                )
                setCurrentOrgUnit(ids)
            }
        }
    }, [orgUnits, vegetationIndexData])

    useEffect(() => {
        const fetchVegetationIndexData = async () => {
            if (!vegetationIndexData && orgUnits) {
                const promises = years.map(async (year) => {
                    const vegetationIndex = await fetchAndFormat(
                        dataElement,
                        engine,
                        periods[year],
                        orgUnits
                    )
                    dispatch(setVegetationIndex({ year, vegetationIndex }))
                })
                await Promise.all(promises)
            }
        }
        fetchVegetationIndexData()
    }, [dispatch, periods, engine, vegetationIndexData, orgUnits])

    const labels = useMemo(() => generateLabels(2020, 2022), [])
    const vegetationIndexChartData = useMemo(() => {
        if (!vegetationIndexData || !currentOrgUnit) {
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
                vegetationIndexData,
                currentOrgUnit[0]
            ),
            ...getValuesForYear(
                2021,
                vegetationIndexData,
                currentOrgUnit[1]
            ),
            ...getValuesForYear(
                2022,
                vegetationIndexData,
                currentOrgUnit[2]
            ),
        ]

        return {
            labels,
            datasets: [
                {
                    fill: false,
                    label: 'Indicateur de vegetation',
                    data: combinedValues,
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                },
            ],
        }
    }, [vegetationIndexData, currentOrgUnit, labels])

    return (
        <ClimateDataSection
            item={item}
            bgColor={COLORS.red_light}
            chartData={vegetationIndexChartData}
            title="Indicateur de vegetation"
            xAxisText="Mois"
            yAxisText="en mm"
            height="300px"
        />
    )
}

export default VegetationIndexChart
