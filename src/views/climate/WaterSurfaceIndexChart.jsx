import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ClimateDataSection from '../../components/ClimateDataSection'
import COLORS from '../../constants/styles'
import { setWaterSurfaceIndexMunicipality } from '../../redux/climateMunicipalityLvlSlice'
import { setWaterSurfaceIndex } from '../../redux/climateSlice'
import { generateLabels, getOrgUnitIndex } from '../../utils/formating'
import {
    fetchAndFormat,
    getValuesForYear,
} from '../../utils/request'

const WaterSurfaceIndexChart = ({
    periods,
    engine,
    orgUnits,
    item,
    dataElement,
    targetOrgUnit,
    adminDivisionType,
    colorTheme
}) => {
    const dispatch = useDispatch()
    const [waterSurfaceIndexTargetOrgUnit, setWaterSurfaceIndexTargetOrgUnit] =
        useState(null)
    const [
        waterSurfaceIndexMunicipalityTargetOrgUnit,
        setWaterSurfaceIndexMunicipalityTargetOrgUnit,
    ] = useState(null)

    const waterSurfaceIndexData = useSelector((state) => state.climate.waterSurfaceIndex)
    const waterSurfaceIndexMunicipalityData = useSelector(
        (state) => state.climateMunicipalityLvl.waterSurfaceIndexMunicipality
    )
    const municipalities = useSelector((state) => state.orgUnit.municipalities)

    const years = [2020, 2021, 2022]
    // const districtOrgUnitId = ['VtP4BdCeXIo']

    const labels = useMemo(() => generateLabels(2020, 2022), [])

    const defaultChartData = {
        labels,
        datasets: [
            {
                fill: false,
                label: 'WaterSurfaceIndex',
                data: [],
                borderColor: COLORS.primary_text,
                backgroundColor: COLORS.primary_text,
                tension: 0.25,
                hidden: false,
            },
        ],
    }

    useEffect(() => {
        console.log('adminDivisionType updated:', adminDivisionType);
      }, [adminDivisionType]);

    useEffect(() => {
        if (waterSurfaceIndexData && targetOrgUnit) {
            const keys = Object.keys(waterSurfaceIndexData)
            if (keys.length === 3 && orgUnits && orgUnits.length > 0) {
                const ids = years.map((year) =>
                    getOrgUnitIndex(waterSurfaceIndexData[year], targetOrgUnit[0])
                )
                setWaterSurfaceIndexTargetOrgUnit(ids)
            }
        }
    }, [orgUnits, waterSurfaceIndexData, targetOrgUnit])

    useEffect(() => {
        if (waterSurfaceIndexMunicipalityData && targetOrgUnit && municipalities) {
            const orgUnits = municipalities.map(
                (municipality) => municipality.id
            )
            const keys = Object.keys(waterSurfaceIndexMunicipalityData)
            if (keys.length === 3 && orgUnits && orgUnits.length > 0) {
                const ids = years.map((year) =>
                    getOrgUnitIndex(
                        waterSurfaceIndexMunicipalityData[year],
                        targetOrgUnit
                    )
                )
                setWaterSurfaceIndexMunicipalityTargetOrgUnit(ids)
            }
        }
    }, [municipalities, waterSurfaceIndexMunicipalityData, targetOrgUnit])

    useEffect(() => {
        const fetchWaterSurfaceIndexMunicipalityData = async () => {
            if (!waterSurfaceIndexMunicipalityData && municipalities) {
                const orgUnits = municipalities.map(
                    (municipality) => municipality.id
                )
                const promises = years.map(async (year) => {
                    const waterSurfaceIndex = await fetchAndFormat(
                        dataElement,
                        engine,
                        periods[year],
                        orgUnits
                    )
                    dispatch(setWaterSurfaceIndexMunicipality({ year, waterSurfaceIndex }))
                })
                await Promise.all(promises)
            }
        }
        fetchWaterSurfaceIndexMunicipalityData()
    }, [dispatch, periods, engine, waterSurfaceIndexMunicipalityData, municipalities])

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

    const waterSurfaceIndexChartData = useMemo(() => {
        if (!waterSurfaceIndexData || !waterSurfaceIndexTargetOrgUnit) {
            return defaultChartData
        }

        const combinedValues = [
            ...getValuesForYear(
                2020,
                waterSurfaceIndexData,
                waterSurfaceIndexTargetOrgUnit[0]
            ),
            ...getValuesForYear(
                2021,
                waterSurfaceIndexData,
                waterSurfaceIndexTargetOrgUnit[1]
            ),
            ...getValuesForYear(
                2022,
                waterSurfaceIndexData,
                waterSurfaceIndexTargetOrgUnit[2]
            ),
        ]

        return {
            labels,
            datasets: [
                {
                    fill: false,
                    label: 'WaterSurfaceIndex',
                    data: combinedValues,
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                },
            ],
        }
    }, [waterSurfaceIndexData, waterSurfaceIndexTargetOrgUnit, labels])

    const waterSurfaceIndexMunicipalityChartData = useMemo(() => {
        if (
            !waterSurfaceIndexMunicipalityData ||
            !waterSurfaceIndexMunicipalityTargetOrgUnit
        ) {
            return defaultChartData
        }

        const combinedValues = [
            ...getValuesForYear(
                2020,
                waterSurfaceIndexMunicipalityData,
                waterSurfaceIndexMunicipalityTargetOrgUnit[0]
            ),
            ...getValuesForYear(
                2021,
                waterSurfaceIndexMunicipalityData,
                waterSurfaceIndexMunicipalityTargetOrgUnit[1]
            ),
            ...getValuesForYear(
                2022,
                waterSurfaceIndexMunicipalityData,
                waterSurfaceIndexMunicipalityTargetOrgUnit[2]
            ),
        ]

        console.error(combinedValues, 'trajpa,p,d,oza,dza,p');

        return {
            labels,
            datasets: [
                {
                    fill: false,
                    label: 'WaterSurfaceIndex',
                    data: combinedValues,
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                },
            ],
        }
    }, [
        waterSurfaceIndexMunicipalityData,
        waterSurfaceIndexMunicipalityTargetOrgUnit,
        labels,
    ])

    return (
        <div>
            <ClimateDataSection
            item={item}
            bgColor={colorTheme}
            chartData={
                adminDivisionType === 'fokontany'
                    ? waterSurfaceIndexChartData 
                    : adminDivisionType === 'municipality'
                    ? waterSurfaceIndexMunicipalityChartData
                    : defaultChartData 
            }
            title="WaterSurfaceIndex"
            xAxisText="Mois"
            yAxisText=""
            height="230px"
        />
        </div>
    )
}

export default WaterSurfaceIndexChart
