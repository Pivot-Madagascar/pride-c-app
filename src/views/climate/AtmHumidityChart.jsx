import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ClimateDataSection from '../../components/ClimateDataSection'
import COLORS from '../../constants/styles'
import { setAtmHumidityMunicipality } from '../../redux/climateMunicipalityLvlSlice'
import { setAtmHumidity } from '../../redux/climateSlice'
import { generateLabels, getOrgUnitIndex } from '../../utils/formating'
import {
    fetchAndFormat,
    getValuesForYear,
} from '../../utils/request'

const AtmHumidityChart = ({
    periods,
    engine,
    orgUnits,
    item,
    dataElement,
    targetOrgUnit,
    adminDivisionType,
}) => {
    const dispatch = useDispatch()
    const [atmHumidityTargetOrgUnit, setAtmHumidityTargetOrgUnit] =
        useState(null)
    const [
        atmHumidityMunicipalityTargetOrgUnit,
        setAtmHumidityMunicipalityTargetOrgUnit,
    ] = useState(null)

    const atmHumidityData = useSelector((state) => state.climate.atmHumidity)
    const atmHumidityMunicipalityData = useSelector(
        (state) => state.climateMunicipalityLvl.atmHumidityMunicipality
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
                label: 'AtmHumidity',
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
        if (atmHumidityData && targetOrgUnit) {
            const keys = Object.keys(atmHumidityData)
            if (keys.length === 3 && orgUnits && orgUnits.length > 0) {
                const ids = years.map((year) =>
                    getOrgUnitIndex(atmHumidityData[year], targetOrgUnit[0])
                )
                setAtmHumidityTargetOrgUnit(ids)
            }
        }
    }, [orgUnits, atmHumidityData, targetOrgUnit])

    useEffect(() => {
        if (atmHumidityMunicipalityData && targetOrgUnit && municipalities) {
            const orgUnits = municipalities.map(
                (municipality) => municipality.id
            )
            const keys = Object.keys(atmHumidityMunicipalityData)
            if (keys.length === 3 && orgUnits && orgUnits.length > 0) {
                const ids = years.map((year) =>
                    getOrgUnitIndex(
                        atmHumidityMunicipalityData[year],
                        targetOrgUnit
                    )
                )
                setAtmHumidityMunicipalityTargetOrgUnit(ids)
            }
        }
    }, [municipalities, atmHumidityMunicipalityData, targetOrgUnit])

    useEffect(() => {
        const fetchAtmHumidityMunicipalityData = async () => {
            if (!atmHumidityMunicipalityData && municipalities) {
                const orgUnits = municipalities.map(
                    (municipality) => municipality.id
                )
                const promises = years.map(async (year) => {
                    const atmHumidity = await fetchAndFormat(
                        dataElement,
                        engine,
                        periods[year],
                        orgUnits
                    )
                    dispatch(setAtmHumidityMunicipality({ year, atmHumidity }))
                })
                await Promise.all(promises)
            }
        }
        fetchAtmHumidityMunicipalityData()
    }, [dispatch, periods, engine, atmHumidityMunicipalityData, municipalities])

    useEffect(() => {
        const fetchAtmHumidityData = async () => {
            if (!atmHumidityData && orgUnits) {
                const promises = years.map(async (year) => {
                    const atmHumidity = await fetchAndFormat(
                        dataElement,
                        engine,
                        periods[year],
                        orgUnits
                    )
                    dispatch(setAtmHumidity({ year, atmHumidity }))
                })
                await Promise.all(promises)
            }
        }
        fetchAtmHumidityData()
    }, [dispatch, periods, engine, atmHumidityData, orgUnits])

    const atmHumidityChartData = useMemo(() => {
        if (!atmHumidityData || !atmHumidityTargetOrgUnit) {
            return defaultChartData
        }

        const combinedValues = [
            ...getValuesForYear(
                2020,
                atmHumidityData,
                atmHumidityTargetOrgUnit[0]
            ),
            ...getValuesForYear(
                2021,
                atmHumidityData,
                atmHumidityTargetOrgUnit[1]
            ),
            ...getValuesForYear(
                2022,
                atmHumidityData,
                atmHumidityTargetOrgUnit[2]
            ),
        ]

        return {
            labels,
            datasets: [
                {
                    fill: false,
                    label: 'AtmHumidity',
                    data: combinedValues,
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                },
            ],
        }
    }, [atmHumidityData, atmHumidityTargetOrgUnit, labels])

    const atmHumidityMunicipalityChartData = useMemo(() => {
        if (
            !atmHumidityMunicipalityData ||
            !atmHumidityMunicipalityTargetOrgUnit
        ) {
            return defaultChartData
        }

        const combinedValues = [
            ...getValuesForYear(
                2020,
                atmHumidityMunicipalityData,
                atmHumidityMunicipalityTargetOrgUnit[0]
            ),
            ...getValuesForYear(
                2021,
                atmHumidityMunicipalityData,
                atmHumidityMunicipalityTargetOrgUnit[1]
            ),
            ...getValuesForYear(
                2022,
                atmHumidityMunicipalityData,
                atmHumidityMunicipalityTargetOrgUnit[2]
            ),
        ]

        console.error(combinedValues, 'trajpa,p,d,oza,dza,p');

        return {
            labels,
            datasets: [
                {
                    fill: false,
                    label: 'AtmHumidity',
                    data: combinedValues,
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                },
            ],
        }
    }, [
        atmHumidityMunicipalityData,
        atmHumidityMunicipalityTargetOrgUnit,
        labels,
    ])

    return (
        <div>
            <ClimateDataSection
            item={item}
            bgColor={COLORS.red_light}
            chartData={
                adminDivisionType === 'fokontany'
                    ? atmHumidityChartData 
                    : adminDivisionType === 'municipality'
                    ? atmHumidityMunicipalityChartData
                    : defaultChartData 
            }
            title="AtmHumidity"
            xAxisText="Mois"
            yAxisText="en °C"
            height="230px"
        />
        </div>
    )
}

export default AtmHumidityChart
