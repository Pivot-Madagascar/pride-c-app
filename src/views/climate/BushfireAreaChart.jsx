import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ClimateDataSection from '../../components/ClimateDataSection'
import COLORS from '../../constants/styles'
import { setBushfireAreaMunicipality } from '../../redux/climateMunicipalityLvlSlice'
import { setBushfireArea } from '../../redux/climateSlice'
import { generateLabels, getOrgUnitIndex } from '../../utils/formating'
import {
    fetchAndFormat,
    getValuesForYear,
} from '../../utils/request'

const BushfireAreaChart = ({
    periods,
    engine,
    orgUnits,
    item,
    dataElement,
    targetOrgUnit,
    adminDivisionType,
}) => {
    const dispatch = useDispatch()
    const [bushfireAreaTargetOrgUnit, setBushfireAreaTargetOrgUnit] =
        useState(null)
    const [
        bushfireAreaMunicipalityTargetOrgUnit,
        setBushfireAreaMunicipalityTargetOrgUnit,
    ] = useState(null)

    const bushfireAreaData = useSelector((state) => state.climate.bushfireArea)
    const bushfireAreaMunicipalityData = useSelector(
        (state) => state.climateMunicipalityLvl.bushfireAreaMunicipality
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
                label: 'BushfireArea',
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
        if (bushfireAreaData && targetOrgUnit) {
            const keys = Object.keys(bushfireAreaData)
            if (keys.length === 3 && orgUnits && orgUnits.length > 0) {
                const ids = years.map((year) =>
                    getOrgUnitIndex(bushfireAreaData[year], targetOrgUnit[0])
                )
                setBushfireAreaTargetOrgUnit(ids)
            }
        }
    }, [orgUnits, bushfireAreaData, targetOrgUnit])

    useEffect(() => {
        if (bushfireAreaMunicipalityData && targetOrgUnit && municipalities) {
            const orgUnits = municipalities.map(
                (municipality) => municipality.id
            )
            const keys = Object.keys(bushfireAreaMunicipalityData)
            if (keys.length === 3 && orgUnits && orgUnits.length > 0) {
                const ids = years.map((year) =>
                    getOrgUnitIndex(
                        bushfireAreaMunicipalityData[year],
                        targetOrgUnit
                    )
                )
                setBushfireAreaMunicipalityTargetOrgUnit(ids)
            }
        }
    }, [municipalities, bushfireAreaMunicipalityData, targetOrgUnit])

    useEffect(() => {
        const fetchBushfireAreaMunicipalityData = async () => {
            if (!bushfireAreaMunicipalityData && municipalities) {
                const orgUnits = municipalities.map(
                    (municipality) => municipality.id
                )
                const promises = years.map(async (year) => {
                    const bushfireArea = await fetchAndFormat(
                        dataElement,
                        engine,
                        periods[year],
                        orgUnits
                    )
                    dispatch(setBushfireAreaMunicipality({ year, bushfireArea }))
                })
                await Promise.all(promises)
            }
        }
        fetchBushfireAreaMunicipalityData()
    }, [dispatch, periods, engine, bushfireAreaMunicipalityData, municipalities])

    useEffect(() => {
        const fetchBushfireAreaData = async () => {
            if (!bushfireAreaData && orgUnits) {
                const promises = years.map(async (year) => {
                    const bushfireArea = await fetchAndFormat(
                        dataElement,
                        engine,
                        periods[year],
                        orgUnits
                    )
                    dispatch(setBushfireArea({ year, bushfireArea }))
                })
                await Promise.all(promises)
            }
        }
        fetchBushfireAreaData()
    }, [dispatch, periods, engine, bushfireAreaData, orgUnits])

    const bushfireAreaChartData = useMemo(() => {
        if (!bushfireAreaData || !bushfireAreaTargetOrgUnit) {
            return defaultChartData
        }

        const combinedValues = [
            ...getValuesForYear(
                2020,
                bushfireAreaData,
                bushfireAreaTargetOrgUnit[0]
            ),
            ...getValuesForYear(
                2021,
                bushfireAreaData,
                bushfireAreaTargetOrgUnit[1]
            ),
            ...getValuesForYear(
                2022,
                bushfireAreaData,
                bushfireAreaTargetOrgUnit[2]
            ),
        ]

        return {
            labels,
            datasets: [
                {
                    fill: false,
                    label: 'BushfireArea',
                    data: combinedValues,
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                },
            ],
        }
    }, [bushfireAreaData, bushfireAreaTargetOrgUnit, labels])

    const bushfireAreaMunicipalityChartData = useMemo(() => {
        if (
            !bushfireAreaMunicipalityData ||
            !bushfireAreaMunicipalityTargetOrgUnit
        ) {
            return defaultChartData
        }

        const combinedValues = [
            ...getValuesForYear(
                2020,
                bushfireAreaMunicipalityData,
                bushfireAreaMunicipalityTargetOrgUnit[0]
            ),
            ...getValuesForYear(
                2021,
                bushfireAreaMunicipalityData,
                bushfireAreaMunicipalityTargetOrgUnit[1]
            ),
            ...getValuesForYear(
                2022,
                bushfireAreaMunicipalityData,
                bushfireAreaMunicipalityTargetOrgUnit[2]
            ),
        ]

        console.error(combinedValues, 'trajpa,p,d,oza,dza,p');

        return {
            labels,
            datasets: [
                {
                    fill: false,
                    label: 'BushfireArea',
                    data: combinedValues,
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                },
            ],
        }
    }, [
        bushfireAreaMunicipalityData,
        bushfireAreaMunicipalityTargetOrgUnit,
        labels,
    ])

    return (
        <div>
            <ClimateDataSection
            item={item}
            bgColor={COLORS.red_light}
            chartData={
                adminDivisionType === 'fokontany'
                    ? bushfireAreaChartData 
                    : adminDivisionType === 'municipality'
                    ? bushfireAreaMunicipalityChartData
                    : defaultChartData 
            }
            title="BushfireArea"
            xAxisText="Mois"
            yAxisText="en °C"
            height="230px"
        />
        </div>
    )
}

export default BushfireAreaChart
