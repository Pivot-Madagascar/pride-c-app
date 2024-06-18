import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ClimateDataSection from '../../components/ClimateDataSection'
import COLORS from '../../constants/styles'
import { setAodAtmLevelMunicipality } from '../../redux/climateMunicipalityLvlSlice'
import { setAodAtmLevel } from '../../redux/climateSlice'
import { generateLabels, getOrgUnitIndex } from '../../utils/formating'
import {
    fetchAndFormat,
    getValuesForYear,
} from '../../utils/request'

const AodAtmLevelChart = ({
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
    const [aodAtmLevelTargetOrgUnit, setAodAtmLevelTargetOrgUnit] =
        useState(null)
    const [
        aodAtmLevelMunicipalityTargetOrgUnit,
        setAodAtmLevelMunicipalityTargetOrgUnit,
    ] = useState(null)

    const aodAtmLevelData = useSelector((state) => state.climate.aodAtmLevel)
    const aodAtmLevelMunicipalityData = useSelector(
        (state) => state.climateMunicipalityLvl.aodAtmLevelMunicipality
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
                label: 'AodAtmLevel',
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
        if (aodAtmLevelData && targetOrgUnit) {
            const keys = Object.keys(aodAtmLevelData)
            if (keys.length === 3 && orgUnits && orgUnits.length > 0) {
                const ids = years.map((year) =>
                    getOrgUnitIndex(aodAtmLevelData[year], targetOrgUnit[0])
                )
                setAodAtmLevelTargetOrgUnit(ids)
            }
        }
    }, [orgUnits, aodAtmLevelData, targetOrgUnit])

    useEffect(() => {
        if (aodAtmLevelMunicipalityData && targetOrgUnit && municipalities) {
            const orgUnits = municipalities.map(
                (municipality) => municipality.id
            )
            const keys = Object.keys(aodAtmLevelMunicipalityData)
            if (keys.length === 3 && orgUnits && orgUnits.length > 0) {
                const ids = years.map((year) =>
                    getOrgUnitIndex(
                        aodAtmLevelMunicipalityData[year],
                        targetOrgUnit
                    )
                )
                setAodAtmLevelMunicipalityTargetOrgUnit(ids)
            }
        }
    }, [municipalities, aodAtmLevelMunicipalityData, targetOrgUnit])

    useEffect(() => {
        const fetchAodAtmLevelMunicipalityData = async () => {
            if (!aodAtmLevelMunicipalityData && municipalities) {
                const orgUnits = municipalities.map(
                    (municipality) => municipality.id
                )
                const promises = years.map(async (year) => {
                    const aodAtmLevel = await fetchAndFormat(
                        dataElement,
                        engine,
                        periods[year],
                        orgUnits
                    )
                    dispatch(setAodAtmLevelMunicipality({ year, aodAtmLevel }))
                })
                await Promise.all(promises)
            }
        }
        fetchAodAtmLevelMunicipalityData()
    }, [dispatch, periods, engine, aodAtmLevelMunicipalityData, municipalities])

    useEffect(() => {
        const fetchAodAtmLevelData = async () => {
            if (!aodAtmLevelData && orgUnits) {
                const promises = years.map(async (year) => {
                    const aodAtmLevel = await fetchAndFormat(
                        dataElement,
                        engine,
                        periods[year],
                        orgUnits
                    )
                    dispatch(setAodAtmLevel({ year, aodAtmLevel }))
                })
                await Promise.all(promises)
            }
        }
        fetchAodAtmLevelData()
    }, [dispatch, periods, engine, aodAtmLevelData, orgUnits])

    const aodAtmLevelChartData = useMemo(() => {
        if (!aodAtmLevelData || !aodAtmLevelTargetOrgUnit) {
            return defaultChartData
        }

        const combinedValues = [
            ...getValuesForYear(
                2020,
                aodAtmLevelData,
                aodAtmLevelTargetOrgUnit[0]
            ),
            ...getValuesForYear(
                2021,
                aodAtmLevelData,
                aodAtmLevelTargetOrgUnit[1]
            ),
            ...getValuesForYear(
                2022,
                aodAtmLevelData,
                aodAtmLevelTargetOrgUnit[2]
            ),
        ]

        return {
            labels,
            datasets: [
                {
                    fill: false,
                    label: 'AodAtmLevel',
                    data: combinedValues,
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                },
            ],
        }
    }, [aodAtmLevelData, aodAtmLevelTargetOrgUnit, labels])

    const aodAtmLevelMunicipalityChartData = useMemo(() => {
        if (
            !aodAtmLevelMunicipalityData ||
            !aodAtmLevelMunicipalityTargetOrgUnit
        ) {
            return defaultChartData
        }

        const combinedValues = [
            ...getValuesForYear(
                2020,
                aodAtmLevelMunicipalityData,
                aodAtmLevelMunicipalityTargetOrgUnit[0]
            ),
            ...getValuesForYear(
                2021,
                aodAtmLevelMunicipalityData,
                aodAtmLevelMunicipalityTargetOrgUnit[1]
            ),
            ...getValuesForYear(
                2022,
                aodAtmLevelMunicipalityData,
                aodAtmLevelMunicipalityTargetOrgUnit[2]
            ),
        ]

        console.error(combinedValues, 'trajpa,p,d,oza,dza,p');

        return {
            labels,
            datasets: [
                {
                    fill: false,
                    label: 'AodAtmLevel',
                    data: combinedValues,
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                },
            ],
        }
    }, [
        aodAtmLevelMunicipalityData,
        aodAtmLevelMunicipalityTargetOrgUnit,
        labels,
    ])

    return (
        <div>
            <ClimateDataSection
            item={item}
            bgColor={colorTheme}
            chartData={
                adminDivisionType === 'fokontany'
                    ? aodAtmLevelChartData 
                    : adminDivisionType === 'municipality'
                    ? aodAtmLevelMunicipalityChartData
                    : defaultChartData 
            }
            title="AodAtmLevel"
            xAxisText="Mois"
            yAxisText="en °C"
            height="230px"
        />
        </div>
    )
}

export default AodAtmLevelChart
