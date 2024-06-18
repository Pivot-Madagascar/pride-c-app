import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ClimateDataSection from '../../components/ClimateDataSection'
import COLORS from '../../constants/styles'
import { setPrecipitationMunicipality } from '../../redux/climateMunicipalityLvlSlice'
import { setPrecipitation } from '../../redux/climateSlice'
import { generateLabels, getOrgUnitIndex } from '../../utils/formating'
import {
    fetchAndFormat,
    getValuesForYear,
} from '../../utils/request'

const PrecipitationChart = ({
    periods,
    engine,
    orgUnits,
    item,
    dataElement,
    targetOrgUnit,
    adminDivisionType,
    colorTheme,
}) => {
    const dispatch = useDispatch()
    const [precipitationTargetOrgUnit, setPrecipitationTargetOrgUnit] =
        useState(null)
    const [
        precipitationMunicipalityTargetOrgUnit,
        setPrecipitationMunicipalityTargetOrgUnit,
    ] = useState(null)

    const precipitationData = useSelector((state) => state.climate.precipitation)
    const precipitationMunicipalityData = useSelector(
        (state) => state.climateMunicipalityLvl.precipitationMunicipality
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
                label: 'Precipitation',
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
        if (precipitationData && targetOrgUnit) {
            const keys = Object.keys(precipitationData)
            if (keys.length === 3 && orgUnits && orgUnits.length > 0) {
                const ids = years.map((year) =>
                    getOrgUnitIndex(precipitationData[year], targetOrgUnit[0])
                )
                setPrecipitationTargetOrgUnit(ids)
            }
        }
    }, [orgUnits, precipitationData, targetOrgUnit])

    useEffect(() => {
        if (precipitationMunicipalityData && targetOrgUnit && municipalities) {
            const orgUnits = municipalities.map(
                (municipality) => municipality.id
            )
            const keys = Object.keys(precipitationMunicipalityData)
            if (keys.length === 3 && orgUnits && orgUnits.length > 0) {
                const ids = years.map((year) =>
                    getOrgUnitIndex(
                        precipitationMunicipalityData[year],
                        targetOrgUnit
                    )
                )
                setPrecipitationMunicipalityTargetOrgUnit(ids)
            }
        }
    }, [municipalities, precipitationMunicipalityData, targetOrgUnit])

    useEffect(() => {
        const fetchPrecipitationMunicipalityData = async () => {
            if (!precipitationMunicipalityData && municipalities) {
                const orgUnits = municipalities.map(
                    (municipality) => municipality.id
                )
                const promises = years.map(async (year) => {
                    const precipitation = await fetchAndFormat(
                        dataElement,
                        engine,
                        periods[year],
                        orgUnits
                    )
                    dispatch(setPrecipitationMunicipality({ year, precipitation }))
                })
                await Promise.all(promises)
            }
        }
        fetchPrecipitationMunicipalityData()
    }, [dispatch, periods, engine, precipitationMunicipalityData, municipalities])

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

    const precipitationChartData = useMemo(() => {
        if (!precipitationData || !precipitationTargetOrgUnit) {
            return defaultChartData
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
                    label: 'Precipitation',
                    data: combinedValues,
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                },
            ],
        }
    }, [precipitationData, precipitationTargetOrgUnit, labels])

    const precipitationMunicipalityChartData = useMemo(() => {
        if (
            !precipitationMunicipalityData ||
            !precipitationMunicipalityTargetOrgUnit
        ) {
            return defaultChartData
        }

        const combinedValues = [
            ...getValuesForYear(
                2020,
                precipitationMunicipalityData,
                precipitationMunicipalityTargetOrgUnit[0]
            ),
            ...getValuesForYear(
                2021,
                precipitationMunicipalityData,
                precipitationMunicipalityTargetOrgUnit[1]
            ),
            ...getValuesForYear(
                2022,
                precipitationMunicipalityData,
                precipitationMunicipalityTargetOrgUnit[2]
            ),
        ]

        return {
            labels,
            datasets: [
                {
                    fill: false,
                    label: 'Precipitation',
                    data: combinedValues,
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                },
            ],
        }
    }, [
        precipitationMunicipalityData,
        precipitationMunicipalityTargetOrgUnit,
        labels,
    ])

    return (
        <div>
            <ClimateDataSection
                item={item}
                bgColor={colorTheme}
                chartData={
                    adminDivisionType === 'fokontany'
                        ? precipitationChartData 
                        : adminDivisionType === 'municipality'
                        ? precipitationMunicipalityChartData
                        : defaultChartData 
                }
                title="Precipitation"
                xAxisText="Mois"
                yAxisText="en mm"
                height="230px"
            />
        </div>
    )
}

export default PrecipitationChart
