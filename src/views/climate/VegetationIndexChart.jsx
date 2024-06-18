import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ClimateDataSection from '../../components/ClimateDataSection'
import COLORS from '../../constants/styles'
import { setVegetationIndexMunicipality } from '../../redux/climateMunicipalityLvlSlice'
import { setVegetationIndex } from '../../redux/climateSlice'
import { generateLabels, getOrgUnitIndex } from '../../utils/formating'
import {
    fetchAndFormat,
    getValuesForYear,
} from '../../utils/request'

const VegetationIndexChart = ({
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
    const [vegetationIndexTargetOrgUnit, setVegetationIndexTargetOrgUnit] =
        useState(null)
    const [
        vegetationIndexMunicipalityTargetOrgUnit,
        setVegetationIndexMunicipalityTargetOrgUnit,
    ] = useState(null)

    const vegetationIndexData = useSelector((state) => state.climate.vegetationIndex)
    const vegetationIndexMunicipalityData = useSelector(
        (state) => state.climateMunicipalityLvl.vegetationIndexMunicipality
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
                label: 'VegetationIndex',
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
        if (vegetationIndexData && targetOrgUnit) {
            const keys = Object.keys(vegetationIndexData)
            if (keys.length === 3 && orgUnits && orgUnits.length > 0) {
                const ids = years.map((year) =>
                    getOrgUnitIndex(vegetationIndexData[year], targetOrgUnit[0])
                )
                setVegetationIndexTargetOrgUnit(ids)
            }
        }
    }, [orgUnits, vegetationIndexData, targetOrgUnit])

    useEffect(() => {
        if (vegetationIndexMunicipalityData && targetOrgUnit && municipalities) {
            const orgUnits = municipalities.map(
                (municipality) => municipality.id
            )
            const keys = Object.keys(vegetationIndexMunicipalityData)
            if (keys.length === 3 && orgUnits && orgUnits.length > 0) {
                const ids = years.map((year) =>
                    getOrgUnitIndex(
                        vegetationIndexMunicipalityData[year],
                        targetOrgUnit
                    )
                )
                setVegetationIndexMunicipalityTargetOrgUnit(ids)
            }
        }
    }, [municipalities, vegetationIndexMunicipalityData, targetOrgUnit])

    useEffect(() => {
        const fetchVegetationIndexMunicipalityData = async () => {
            if (!vegetationIndexMunicipalityData && municipalities) {
                const orgUnits = municipalities.map(
                    (municipality) => municipality.id
                )
                const promises = years.map(async (year) => {
                    const vegetationIndex = await fetchAndFormat(
                        dataElement,
                        engine,
                        periods[year],
                        orgUnits
                    )
                    dispatch(setVegetationIndexMunicipality({ year, vegetationIndex }))
                })
                await Promise.all(promises)
            }
        }
        fetchVegetationIndexMunicipalityData()
    }, [dispatch, periods, engine, vegetationIndexMunicipalityData, municipalities])

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

    const vegetationIndexChartData = useMemo(() => {
        if (!vegetationIndexData || !vegetationIndexTargetOrgUnit) {
            return defaultChartData
        }

        const combinedValues = [
            ...getValuesForYear(
                2020,
                vegetationIndexData,
                vegetationIndexTargetOrgUnit[0]
            ),
            ...getValuesForYear(
                2021,
                vegetationIndexData,
                vegetationIndexTargetOrgUnit[1]
            ),
            ...getValuesForYear(
                2022,
                vegetationIndexData,
                vegetationIndexTargetOrgUnit[2]
            ),
        ]

        return {
            labels,
            datasets: [
                {
                    fill: false,
                    label: 'VegetationIndex',
                    data: combinedValues,
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                },
            ],
        }
    }, [vegetationIndexData, vegetationIndexTargetOrgUnit, labels])

    const vegetationIndexMunicipalityChartData = useMemo(() => {
        if (
            !vegetationIndexMunicipalityData ||
            !vegetationIndexMunicipalityTargetOrgUnit
        ) {
            return defaultChartData
        }

        const combinedValues = [
            ...getValuesForYear(
                2020,
                vegetationIndexMunicipalityData,
                vegetationIndexMunicipalityTargetOrgUnit[0]
            ),
            ...getValuesForYear(
                2021,
                vegetationIndexMunicipalityData,
                vegetationIndexMunicipalityTargetOrgUnit[1]
            ),
            ...getValuesForYear(
                2022,
                vegetationIndexMunicipalityData,
                vegetationIndexMunicipalityTargetOrgUnit[2]
            ),
        ]

        console.error(combinedValues, 'trajpa,p,d,oza,dza,p');

        return {
            labels,
            datasets: [
                {
                    fill: false,
                    label: 'VegetationIndex',
                    data: combinedValues,
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                },
            ],
        }
    }, [
        vegetationIndexMunicipalityData,
        vegetationIndexMunicipalityTargetOrgUnit,
        labels,
    ])

    return (
        <div>
            <ClimateDataSection
            item={item}
            bgColor={colorTheme}
            chartData={
                adminDivisionType === 'fokontany'
                    ? vegetationIndexChartData 
                    : adminDivisionType === 'municipality'
                    ? vegetationIndexMunicipalityChartData
                    : defaultChartData 
            }
            title="VegetationIndex"
            xAxisText="Mois"
            yAxisText=""
            height="230px"
        />
        </div>
    )
}

export default VegetationIndexChart
