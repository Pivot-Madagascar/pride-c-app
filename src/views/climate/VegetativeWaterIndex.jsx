import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ClimateDataSection from '../../components/ClimateDataSection'
import COLORS from '../../constants/styles'
import { setVegetativeWaterIndexMunicipality } from '../../redux/climateMunicipalityLvlSlice'
import { setVegetativeWaterIndex } from '../../redux/climateSlice'
import { generateLabels, getOrgUnitIndex } from '../../utils/formating'
import {
    fetchAndFormat,
    getValuesForYear,
} from '../../utils/request'

const VegetativeWaterIndexChart = ({
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
    const [vegetativeWaterIndexTargetOrgUnit, setVegetativeWaterIndexTargetOrgUnit] =
        useState(null)
    const [
        vegetativeWaterIndexMunicipalityTargetOrgUnit,
        setVegetativeWaterIndexMunicipalityTargetOrgUnit,
    ] = useState(null)

    const vegetativeWaterIndexData = useSelector((state) => state.climate.vegetativeWaterIndex)
    const vegetativeWaterIndexMunicipalityData = useSelector(
        (state) => state.climateMunicipalityLvl.vegetativeWaterIndexMunicipality
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
                label: 'VegetativeWaterIndex',
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
        if (vegetativeWaterIndexData && targetOrgUnit) {
            const keys = Object.keys(vegetativeWaterIndexData)
            if (keys.length === 3 && orgUnits && orgUnits.length > 0) {
                const ids = years.map((year) =>
                    getOrgUnitIndex(vegetativeWaterIndexData[year], targetOrgUnit[0])
                )
                setVegetativeWaterIndexTargetOrgUnit(ids)
            }
        }
    }, [orgUnits, vegetativeWaterIndexData, targetOrgUnit])

    useEffect(() => {
        if (vegetativeWaterIndexMunicipalityData && targetOrgUnit && municipalities) {
            const orgUnits = municipalities.map(
                (municipality) => municipality.id
            )
            const keys = Object.keys(vegetativeWaterIndexMunicipalityData)
            if (keys.length === 3 && orgUnits && orgUnits.length > 0) {
                const ids = years.map((year) =>
                    getOrgUnitIndex(
                        vegetativeWaterIndexMunicipalityData[year],
                        targetOrgUnit
                    )
                )
                setVegetativeWaterIndexMunicipalityTargetOrgUnit(ids)
            }
        }
    }, [municipalities, vegetativeWaterIndexMunicipalityData, targetOrgUnit])

    useEffect(() => {
        const fetchVegetativeWaterIndexMunicipalityData = async () => {
            if (!vegetativeWaterIndexMunicipalityData && municipalities) {
                const orgUnits = municipalities.map(
                    (municipality) => municipality.id
                )
                const promises = years.map(async (year) => {
                    const vegetativeWaterIndex = await fetchAndFormat(
                        dataElement,
                        engine,
                        periods[year],
                        orgUnits
                    )
                    dispatch(setVegetativeWaterIndexMunicipality({ year, vegetativeWaterIndex }))
                })
                await Promise.all(promises)
            }
        }
        fetchVegetativeWaterIndexMunicipalityData()
    }, [dispatch, periods, engine, vegetativeWaterIndexMunicipalityData, municipalities])

    useEffect(() => {
        const fetchVegetativeWaterIndexData = async () => {
            if (!vegetativeWaterIndexData && orgUnits) {
                const promises = years.map(async (year) => {
                    const vegetativeWaterIndex = await fetchAndFormat(
                        dataElement,
                        engine,
                        periods[year],
                        orgUnits
                    )
                    dispatch(setVegetativeWaterIndex({ year, vegetativeWaterIndex }))
                })
                await Promise.all(promises)
            }
        }
        fetchVegetativeWaterIndexData()
    }, [dispatch, periods, engine, vegetativeWaterIndexData, orgUnits])

    const vegetativeWaterIndexChartData = useMemo(() => {
        if (!vegetativeWaterIndexData || !vegetativeWaterIndexTargetOrgUnit) {
            return defaultChartData
        }

        const combinedValues = [
            ...getValuesForYear(
                2020,
                vegetativeWaterIndexData,
                vegetativeWaterIndexTargetOrgUnit[0]
            ),
            ...getValuesForYear(
                2021,
                vegetativeWaterIndexData,
                vegetativeWaterIndexTargetOrgUnit[1]
            ),
            ...getValuesForYear(
                2022,
                vegetativeWaterIndexData,
                vegetativeWaterIndexTargetOrgUnit[2]
            ),
        ]

        return {
            labels,
            datasets: [
                {
                    fill: false,
                    label: 'VegetativeWaterIndex',
                    data: combinedValues,
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                },
            ],
        }
    }, [vegetativeWaterIndexData, vegetativeWaterIndexTargetOrgUnit, labels])

    const vegetativeWaterIndexMunicipalityChartData = useMemo(() => {
        if (
            !vegetativeWaterIndexMunicipalityData ||
            !vegetativeWaterIndexMunicipalityTargetOrgUnit
        ) {
            return defaultChartData
        }

        const combinedValues = [
            ...getValuesForYear(
                2020,
                vegetativeWaterIndexMunicipalityData,
                vegetativeWaterIndexMunicipalityTargetOrgUnit[0]
            ),
            ...getValuesForYear(
                2021,
                vegetativeWaterIndexMunicipalityData,
                vegetativeWaterIndexMunicipalityTargetOrgUnit[1]
            ),
            ...getValuesForYear(
                2022,
                vegetativeWaterIndexMunicipalityData,
                vegetativeWaterIndexMunicipalityTargetOrgUnit[2]
            ),
        ]

        console.error(combinedValues, 'trajpa,p,d,oza,dza,p');

        return {
            labels,
            datasets: [
                {
                    fill: false,
                    label: 'VegetativeWaterIndex',
                    data: combinedValues,
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                },
            ],
        }
    }, [
        vegetativeWaterIndexMunicipalityData,
        vegetativeWaterIndexMunicipalityTargetOrgUnit,
        labels,
    ])

    return (
        <div>
            <ClimateDataSection
            item={item}
            bgColor={colorTheme}
            chartData={
                adminDivisionType === 'fokontany'
                    ? vegetativeWaterIndexChartData 
                    : adminDivisionType === 'municipality'
                    ? vegetativeWaterIndexMunicipalityChartData
                    : defaultChartData 
            }
            title="VegetativeWaterIndex"
            xAxisText="Mois"
            yAxisText=""
            height="230px"
        />
        </div>
    )
}

export default VegetativeWaterIndexChart
