import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ClimateDataSection from '../../components/ClimateDataSection'
import COLORS from '../../constants/styles'
import { setWindSpeedMunicipality } from '../../redux/climateMunicipalityLvlSlice'
import { setWindSpeed } from '../../redux/climateSlice'
import { generateLabels, getOrgUnitIndex } from '../../utils/formating'
import {
    fetchAndFormat,
    getValuesForYear,
} from '../../utils/request'

const WindSpeedChart = ({
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
    const [windSpeedTargetOrgUnit, setWindSpeedTargetOrgUnit] =
        useState(null)
    const [
        windSpeedMunicipalityTargetOrgUnit,
        setWindSpeedMunicipalityTargetOrgUnit,
    ] = useState(null)

    const windSpeedData = useSelector((state) => state.climate.windSpeed)
    const windSpeedMunicipalityData = useSelector(
        (state) => state.climateMunicipalityLvl.windSpeedMunicipality
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
                label: 'WindSpeed',
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
        if (windSpeedData && targetOrgUnit) {
            const keys = Object.keys(windSpeedData)
            if (keys.length === 3 && orgUnits && orgUnits.length > 0) {
                const ids = years.map((year) =>
                    getOrgUnitIndex(windSpeedData[year], targetOrgUnit[0])
                )
                setWindSpeedTargetOrgUnit(ids)
            }
        }
    }, [orgUnits, windSpeedData, targetOrgUnit])

    useEffect(() => {
        if (windSpeedMunicipalityData && targetOrgUnit && municipalities) {
            const orgUnits = municipalities.map(
                (municipality) => municipality.id
            )
            const keys = Object.keys(windSpeedMunicipalityData)
            if (keys.length === 3 && orgUnits && orgUnits.length > 0) {
                const ids = years.map((year) =>
                    getOrgUnitIndex(
                        windSpeedMunicipalityData[year],
                        targetOrgUnit
                    )
                )
                setWindSpeedMunicipalityTargetOrgUnit(ids)
            }
        }
    }, [municipalities, windSpeedMunicipalityData, targetOrgUnit])

    useEffect(() => {
        const fetchWindSpeedMunicipalityData = async () => {
            if (!windSpeedMunicipalityData && municipalities) {
                const orgUnits = municipalities.map(
                    (municipality) => municipality.id
                )
                const promises = years.map(async (year) => {
                    const windSpeed = await fetchAndFormat(
                        dataElement,
                        engine,
                        periods[year],
                        orgUnits
                    )
                    dispatch(setWindSpeedMunicipality({ year, windSpeed }))
                })
                await Promise.all(promises)
            }
        }
        fetchWindSpeedMunicipalityData()
    }, [dispatch, periods, engine, windSpeedMunicipalityData, municipalities])

    useEffect(() => {
        const fetchWindSpeedData = async () => {
            if (!windSpeedData && orgUnits) {
                const promises = years.map(async (year) => {
                    const windSpeed = await fetchAndFormat(
                        dataElement,
                        engine,
                        periods[year],
                        orgUnits
                    )
                    dispatch(setWindSpeed({ year, windSpeed }))
                })
                await Promise.all(promises)
            }
        }
        fetchWindSpeedData()
    }, [dispatch, periods, engine, windSpeedData, orgUnits])

    const windSpeedChartData = useMemo(() => {
        if (!windSpeedData || !windSpeedTargetOrgUnit) {
            return defaultChartData
        }

        const combinedValues = [
            ...getValuesForYear(
                2020,
                windSpeedData,
                windSpeedTargetOrgUnit[0]
            ),
            ...getValuesForYear(
                2021,
                windSpeedData,
                windSpeedTargetOrgUnit[1]
            ),
            ...getValuesForYear(
                2022,
                windSpeedData,
                windSpeedTargetOrgUnit[2]
            ),
        ]

        return {
            labels,
            datasets: [
                {
                    fill: false,
                    label: 'WindSpeed',
                    data: combinedValues,
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                },
            ],
        }
    }, [windSpeedData, windSpeedTargetOrgUnit, labels])

    const windSpeedMunicipalityChartData = useMemo(() => {
        if (
            !windSpeedMunicipalityData ||
            !windSpeedMunicipalityTargetOrgUnit
        ) {
            return defaultChartData
        }

        const combinedValues = [
            ...getValuesForYear(
                2020,
                windSpeedMunicipalityData,
                windSpeedMunicipalityTargetOrgUnit[0]
            ),
            ...getValuesForYear(
                2021,
                windSpeedMunicipalityData,
                windSpeedMunicipalityTargetOrgUnit[1]
            ),
            ...getValuesForYear(
                2022,
                windSpeedMunicipalityData,
                windSpeedMunicipalityTargetOrgUnit[2]
            ),
        ]

        console.error(combinedValues, 'trajpa,p,d,oza,dza,p');

        return {
            labels,
            datasets: [
                {
                    fill: false,
                    label: 'WindSpeed',
                    data: combinedValues,
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                },
            ],
        }
    }, [
        windSpeedMunicipalityData,
        windSpeedMunicipalityTargetOrgUnit,
        labels,
    ])

    return (
        <div>
            <ClimateDataSection
            item={item}
            bgColor={colorTheme}
            chartData={
                adminDivisionType === 'fokontany'
                    ? windSpeedChartData 
                    : adminDivisionType === 'municipality'
                    ? windSpeedMunicipalityChartData
                    : defaultChartData 
            }
            title="WindSpeed"
            xAxisText="Mois"
            yAxisText="en m/s"
            height="230px"
        />
        </div>
    )
}

export default WindSpeedChart
