import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ClimateDataSection from '../../components/ClimateDataSection'
import COLORS from '../../constants/styles'
// import { setVegetationIndex } from '../../redux/climateSlice'
import { setWaterSurfaceIndex } from '../../redux/climateSlice'
import { getOrgUnitIndex , generateLabels } from '../../utils/formating'
import { fetchAndFormat, getValuesForYear } from '../../utils/request'

const WaterSurfaceIndexChart = ({ periods, engine, orgUnits, item, dataElement }) => {
    const dispatch = useDispatch()
    const [currentOrgUnit, setCurrentOrgUnit] = useState(null)

    const waterSurfaceIndexData = useSelector(
        (state) => state.climate.waterSurfaceIndex
    )
    const years = [2020, 2021, 2022]

    useEffect(() => {
        if (waterSurfaceIndexData) {
            const keys = Object.keys(waterSurfaceIndexData)
            if (keys.length === 3 && orgUnits && orgUnits.length > 0) {
                const targetOrgUnit = 'nqQz5XyejUS' // Replace with your actual target orgUnit
                const ids = years.map((year) =>
                    getOrgUnitIndex(waterSurfaceIndexData[year], targetOrgUnit)
                )
                setCurrentOrgUnit(ids)
            }
        }
    }, [orgUnits, waterSurfaceIndexData])

    useEffect(() => {
        const fetchWaterSurfaceIndexData = async () => {
            if (!waterSurfaceIndexData && orgUnits) {
                const promises = years.map(async (year) => {
                    const waterSurfaceIndex = await fetchAndFormat(
                        dataElement,
                        engine,
                        periods[year],
                        orgUnits
                    )
                    dispatch(setWaterSurfaceIndex({ year, waterSurfaceIndex }))
                })
                await Promise.all(promises)
            }
        }
        fetchWaterSurfaceIndexData()
    }, [dispatch, periods, engine, waterSurfaceIndexData, orgUnits])

    const labels = useMemo(() => generateLabels(2020, 2022), [])
    const waterSurfaceIndexChartData = useMemo(() => {
        if (!waterSurfaceIndexData || !currentOrgUnit) {
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
                waterSurfaceIndexData,
                currentOrgUnit[0]
            ),
            ...getValuesForYear(
                2021,
                waterSurfaceIndexData,
                currentOrgUnit[1]
            ),
            ...getValuesForYear(
                2022,
                waterSurfaceIndexData,
                currentOrgUnit[2]
            ),
        ]

        return {
            labels,
            datasets: [
                {
                    fill: false,
                    label: "Indicateur de l'eau de surface",
                    data: combinedValues,
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                },
            ],
        }
    }, [waterSurfaceIndexData, currentOrgUnit, labels])

    return (
        <ClimateDataSection
            item={item}
            bgColor={COLORS.red_light}
            chartData={waterSurfaceIndexChartData}
            title="Indicateur de l'eau de surface"
            xAxisText="Mois"
            yAxisText="en mm"
            height="300px"
        />
    )
}

export default WaterSurfaceIndexChart
