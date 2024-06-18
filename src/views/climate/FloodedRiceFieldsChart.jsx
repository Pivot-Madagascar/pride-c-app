import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ClimateDataSection from '../../components/ClimateDataSection'
import COLORS from '../../constants/styles'
import { setFloodedRiceFieldsMunicipality } from '../../redux/climateMunicipalityLvlSlice'
import { setFloodedRiceFields } from '../../redux/climateSlice'
import { generateLabels, getOrgUnitIndex } from '../../utils/formating'
import {
    fetchAndFormat,
    getValuesForYear,
} from '../../utils/request'

const FloodedRiceFieldsChart = ({
    periods,
    engine,
    orgUnits,
    item,
    dataElement,
    targetOrgUnit,
    adminDivisionType,
}) => {
    const dispatch = useDispatch()
    const [floodedRiceFieldsTargetOrgUnit, setFloodedRiceFieldsTargetOrgUnit] =
        useState(null)
    const [
        floodedRiceFieldsMunicipalityTargetOrgUnit,
        setFloodedRiceFieldsMunicipalityTargetOrgUnit,
    ] = useState(null)

    const floodedRiceFieldsData = useSelector((state) => state.climate.floodedRiceFields)
    const floodedRiceFieldsMunicipalityData = useSelector(
        (state) => state.climateMunicipalityLvl.floodedRiceFieldsMunicipality
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
                label: 'FloodedRiceFields',
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
        if (floodedRiceFieldsData && targetOrgUnit) {
            const keys = Object.keys(floodedRiceFieldsData)
            if (keys.length === 3 && orgUnits && orgUnits.length > 0) {
                const ids = years.map((year) =>
                    getOrgUnitIndex(floodedRiceFieldsData[year], targetOrgUnit[0])
                )
                setFloodedRiceFieldsTargetOrgUnit(ids)
            }
        }
    }, [orgUnits, floodedRiceFieldsData, targetOrgUnit])

    useEffect(() => {
        if (floodedRiceFieldsMunicipalityData && targetOrgUnit && municipalities) {
            const orgUnits = municipalities.map(
                (municipality) => municipality.id
            )
            const keys = Object.keys(floodedRiceFieldsMunicipalityData)
            if (keys.length === 3 && orgUnits && orgUnits.length > 0) {
                const ids = years.map((year) =>
                    getOrgUnitIndex(
                        floodedRiceFieldsMunicipalityData[year],
                        targetOrgUnit
                    )
                )
                setFloodedRiceFieldsMunicipalityTargetOrgUnit(ids)
            }
        }
    }, [municipalities, floodedRiceFieldsMunicipalityData, targetOrgUnit])

    useEffect(() => {
        const fetchFloodedRiceFieldsMunicipalityData = async () => {
            if (!floodedRiceFieldsMunicipalityData && municipalities) {
                const orgUnits = municipalities.map(
                    (municipality) => municipality.id
                )
                const promises = years.map(async (year) => {
                    const floodedRiceFields = await fetchAndFormat(
                        dataElement,
                        engine,
                        periods[year],
                        orgUnits
                    )
                    dispatch(setFloodedRiceFieldsMunicipality({ year, floodedRiceFields }))
                })
                await Promise.all(promises)
            }
        }
        fetchFloodedRiceFieldsMunicipalityData()
    }, [dispatch, periods, engine, floodedRiceFieldsMunicipalityData, municipalities])

    useEffect(() => {
        const fetchFloodedRiceFieldsData = async () => {
            if (!floodedRiceFieldsData && orgUnits) {
                const promises = years.map(async (year) => {
                    const floodedRiceFields = await fetchAndFormat(
                        dataElement,
                        engine,
                        periods[year],
                        orgUnits
                    )
                    dispatch(setFloodedRiceFields({ year, floodedRiceFields }))
                })
                await Promise.all(promises)
            }
        }
        fetchFloodedRiceFieldsData()
    }, [dispatch, periods, engine, floodedRiceFieldsData, orgUnits])

    const floodedRiceFieldsChartData = useMemo(() => {
        if (!floodedRiceFieldsData || !floodedRiceFieldsTargetOrgUnit) {
            return defaultChartData
        }

        const combinedValues = [
            ...getValuesForYear(
                2020,
                floodedRiceFieldsData,
                floodedRiceFieldsTargetOrgUnit[0]
            ),
            ...getValuesForYear(
                2021,
                floodedRiceFieldsData,
                floodedRiceFieldsTargetOrgUnit[1]
            ),
            ...getValuesForYear(
                2022,
                floodedRiceFieldsData,
                floodedRiceFieldsTargetOrgUnit[2]
            ),
        ]

        return {
            labels,
            datasets: [
                {
                    fill: false,
                    label: 'FloodedRiceFields',
                    data: combinedValues,
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                },
            ],
        }
    }, [floodedRiceFieldsData, floodedRiceFieldsTargetOrgUnit, labels])

    const floodedRiceFieldsMunicipalityChartData = useMemo(() => {
        if (
            !floodedRiceFieldsMunicipalityData ||
            !floodedRiceFieldsMunicipalityTargetOrgUnit
        ) {
            return defaultChartData
        }

        const combinedValues = [
            ...getValuesForYear(
                2020,
                floodedRiceFieldsMunicipalityData,
                floodedRiceFieldsMunicipalityTargetOrgUnit[0]
            ),
            ...getValuesForYear(
                2021,
                floodedRiceFieldsMunicipalityData,
                floodedRiceFieldsMunicipalityTargetOrgUnit[1]
            ),
            ...getValuesForYear(
                2022,
                floodedRiceFieldsMunicipalityData,
                floodedRiceFieldsMunicipalityTargetOrgUnit[2]
            ),
        ]

        console.error(combinedValues, 'trajpa,p,d,oza,dza,p');

        return {
            labels,
            datasets: [
                {
                    fill: false,
                    label: 'FloodedRiceFields',
                    data: combinedValues,
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                },
            ],
        }
    }, [
        floodedRiceFieldsMunicipalityData,
        floodedRiceFieldsMunicipalityTargetOrgUnit,
        labels,
    ])

    return (
        <div>
            <ClimateDataSection
            item={item}
            bgColor={COLORS.red_light}
            chartData={
                adminDivisionType === 'fokontany'
                    ? floodedRiceFieldsChartData 
                    : adminDivisionType === 'municipality'
                    ? floodedRiceFieldsMunicipalityChartData
                    : defaultChartData 
            }
            title="FloodedRiceFields"
            xAxisText="Mois"
            yAxisText="en °C"
            height="230px"
        />
        </div>
    )
}

export default FloodedRiceFieldsChart
