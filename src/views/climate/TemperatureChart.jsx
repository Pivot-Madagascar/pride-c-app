import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ClimateDataSection from '../../components/ClimateDataSection'
import COLORS from '../../constants/styles'
import { setTemperatureMunicipality } from '../../redux/climateMunicipalityLvlSlice'
import { setTemperature } from '../../redux/climateSlice'
import { generateLabels, getOrgUnitIndex } from '../../utils/formating'
import {
    fetchAndFormat,
    getValuesForYear,
} from '../../utils/request'

const TemperatureChart = ({
    periods,
    engine,
    orgUnits,
    item,
    dataElement,
    targetOrgUnit,
    adminDivisionType,
}) => {
    const dispatch = useDispatch()
    const [temperatureTargetOrgUnit, setTemperatureTargetOrgUnit] =
        useState(null)
    const [
        temperatureMunicipalityTargetOrgUnit,
        setTemperatureMunicipalityTargetOrgUnit,
    ] = useState(null)

    const temperatureData = useSelector((state) => state.climate.temperature)
    const temperatureMunicipalityData = useSelector(
        (state) => state.climateMunicipalityLvl.temperatureMunicipality
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
                label: 'Temperature',
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
        if (temperatureData && targetOrgUnit) {
            const keys = Object.keys(temperatureData)
            if (keys.length === 3 && orgUnits && orgUnits.length > 0) {
                const ids = years.map((year) =>
                    getOrgUnitIndex(temperatureData[year], targetOrgUnit[0])
                )
                setTemperatureTargetOrgUnit(ids)
            }
        }
    }, [orgUnits, temperatureData, targetOrgUnit])

    useEffect(() => {
        if (temperatureMunicipalityData && targetOrgUnit && municipalities) {
            const orgUnits = municipalities.map(
                (municipality) => municipality.id
            )
            const keys = Object.keys(temperatureMunicipalityData)
            if (keys.length === 3 && orgUnits && orgUnits.length > 0) {
                const ids = years.map((year) =>
                    getOrgUnitIndex(
                        temperatureMunicipalityData[year],
                        targetOrgUnit
                    )
                )
                setTemperatureMunicipalityTargetOrgUnit(ids)
            }
        }
    }, [municipalities, temperatureMunicipalityData, targetOrgUnit])

    useEffect(() => {
        const fetchTemperatureMunicipalityData = async () => {
            if (!temperatureMunicipalityData && municipalities) {
                const orgUnits = municipalities.map(
                    (municipality) => municipality.id
                )
                const promises = years.map(async (year) => {
                    const temperature = await fetchAndFormat(
                        dataElement,
                        engine,
                        periods[year],
                        orgUnits
                    )
                    dispatch(setTemperatureMunicipality({ year, temperature }))
                })
                await Promise.all(promises)
            }
        }
        fetchTemperatureMunicipalityData()
    }, [dispatch, periods, engine, temperatureMunicipalityData, municipalities])

    useEffect(() => {
        const fetchTemperatureData = async () => {
            if (!temperatureData && orgUnits) {
                const promises = years.map(async (year) => {
                    const temperature = await fetchAndFormat(
                        dataElement,
                        engine,
                        periods[year],
                        orgUnits
                    )
                    dispatch(setTemperature({ year, temperature }))
                })
                await Promise.all(promises)
            }
        }
        fetchTemperatureData()
    }, [dispatch, periods, engine, temperatureData, orgUnits])

    const temperatureChartData = useMemo(() => {
        if (!temperatureData || !temperatureTargetOrgUnit) {
            return defaultChartData
        }

        const combinedValues = [
            ...getValuesForYear(
                2020,
                temperatureData,
                temperatureTargetOrgUnit[0]
            ),
            ...getValuesForYear(
                2021,
                temperatureData,
                temperatureTargetOrgUnit[1]
            ),
            ...getValuesForYear(
                2022,
                temperatureData,
                temperatureTargetOrgUnit[2]
            ),
        ]

        return {
            labels,
            datasets: [
                {
                    fill: false,
                    label: 'Temperature',
                    data: combinedValues,
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                },
            ],
        }
    }, [temperatureData, temperatureTargetOrgUnit, labels])

    const temperatureMunicipalityChartData = useMemo(() => {
        if (
            !temperatureMunicipalityData ||
            !temperatureMunicipalityTargetOrgUnit
        ) {
            return defaultChartData
        }

        const combinedValues = [
            ...getValuesForYear(
                2020,
                temperatureMunicipalityData,
                temperatureMunicipalityTargetOrgUnit[0]
            ),
            ...getValuesForYear(
                2021,
                temperatureMunicipalityData,
                temperatureMunicipalityTargetOrgUnit[1]
            ),
            ...getValuesForYear(
                2022,
                temperatureMunicipalityData,
                temperatureMunicipalityTargetOrgUnit[2]
            ),
        ]

        console.error(combinedValues, 'trajpa,p,d,oza,dza,p');

        return {
            labels,
            datasets: [
                {
                    fill: false,
                    label: 'Temperature',
                    data: combinedValues,
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                },
            ],
        }
    }, [
        temperatureMunicipalityData,
        temperatureMunicipalityTargetOrgUnit,
        labels,
    ])

    return (
        <div>
            <ClimateDataSection
            item={item}
            bgColor={COLORS.red_light}
            chartData={
                adminDivisionType === 'fokontany'
                    ? temperatureChartData 
                    : adminDivisionType === 'municipality'
                    ? temperatureMunicipalityChartData
                    : defaultChartData 
            }
            title="Temperature"
            xAxisText="Mois"
            yAxisText="en °C"
            height="230px"
        />
        </div>
    )
}

export default TemperatureChart
