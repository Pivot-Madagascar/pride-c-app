import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ClimateDataSection from '../../components/ClimateDataSection'
import ClimateLineChart from '../../components/ClimateLineChart'
import ClimateStatisticCard from '../../components/ClimateStatisticCard'
import COLORS from '../../constants/styles'
import {
    setDistrictPrecipitation,
    setDistrictTemperature,
    setDistrictVegetationIndex,
    setDistrictWaterSurfaceIndex,
    setDistrictVegetativeWaterIndex,
    setDistrictBushfireArea,
    setDistrictNo2AtmLevel,
    setDistrictAodAtmLevel,
    setDistrictFloodedRiceFields,
    setDistrictAtmHumidity,
    setDistrictWindSpeed,
} from '../../redux/climateDistrictLvlSlice'
import {
    setFokontanyPrecipitation,
    setFokontanyTemperature,
    setFokontanyVegetationIndex,
    setFokontanyWaterSurfaceIndex,
    setFokontanyVegetativeWaterIndex,
    setFokontanyBushfireArea,
    setFokontanyNo2AtmLevel,
    setFokontanyAodAtmLevel,
    setFokontanyFloodedRiceFields,
    setFokontanyAtmHumidity,
    setFokontanyWindSpeed,
} from '../../redux/climateFokontanyLvlSlice'
import {
    setMunicipalityPrecipitation,
    setMunicipalityTemperature,
    setMunicipalityVegetationIndex,
    setMunicipalityWaterSurfaceIndex,
    setMunicipalityVegetativeWaterIndex,
    setMunicipalityBushfireArea,
    setMunicipalityNo2AtmLevel,
    setMunicipalityAodAtmLevel,
    setMunicipalityFloodedRiceFields,
    setMunicipalityAtmHumidity,
    setMunicipalityWindSpeed,
} from '../../redux/climateMunicipalityLvlSlice'
import { generateLabels } from '../../utils/formatting'
import { fetchAndFormat } from '../../utils/request'
import style from './ClimateChart.module.scss'
import { climateData } from './data'

// const currentYear = new Date().getFullYear()
// const years = [currentYear, currentYear - 2, currentYear - 1]

const years = [2022, 2023, 2024] // TODO: set periods dynamically by getting the current year and subtracting 2 years

const ClimateChart = ({
    periods,
    engine,
    orgUnits,
    dataElement,
    targetOrgUnit,
    adminDivisionType,
    colorTheme,
    type,
    labels
}) => {
    const dispatch = useDispatch()
    const [currentVariable, setCurrentVariable] = useState({
        title: '',
        value: '',
        id: '',
        percentage: 0,
        description: '',
        unit: '',
        icon: () => null,
    })
    const fokontanyLvlData = useSelector(
        (state) => state.climateFokontanyLvl[type]
    )
    const municipalLvlData = useSelector(
        (state) => state.climateMunicipalityLvl[type]
    )
    const districtLvlData = useSelector(
        (state) => state.climateDistrictLvl[type]
    )
    const municipalities = useSelector((state) => state.orgUnit.municipalities)
    const district = useSelector((state) => state.orgUnit.district)
    const emptyChartData = {
        labels,
        datasets: [
            {
                fill: false,
                label: '',
                data: [],
                borderColor: COLORS.primary_text,
                backgroundColor: COLORS.primary_text,
                tension: 0.25,
                hidden: false,
            },
        ],
    }

    const concatenateData = (data) => {
        return Object.values(data).flat()
    }

    const getActionByType = (type, data, level) => {
        const actions = {
            district: {
                precipitation: setDistrictPrecipitation,
                temperature: setDistrictTemperature,
                vegetationIndex: setDistrictVegetationIndex,
                waterSurfaceIndex: setDistrictWaterSurfaceIndex,
                vegetativeWaterIndex: setDistrictVegetativeWaterIndex,
                bushfireArea: setDistrictBushfireArea,
                no2AtmLevel: setDistrictNo2AtmLevel,
                aodAtmLevel: setDistrictAodAtmLevel,
                floodedRiceFields: setDistrictFloodedRiceFields,
                atmHumidity: setDistrictAtmHumidity,
                windSpeed: setDistrictWindSpeed,
            },
            municipality: {
                precipitation: setMunicipalityPrecipitation,
                temperature: setMunicipalityTemperature,
                vegetationIndex: setMunicipalityVegetationIndex,
                waterSurfaceIndex: setMunicipalityWaterSurfaceIndex,
                vegetativeWaterIndex: setMunicipalityVegetativeWaterIndex,
                bushfireArea: setMunicipalityBushfireArea,
                no2AtmLevel: setMunicipalityNo2AtmLevel,
                aodAtmLevel: setMunicipalityAodAtmLevel,
                floodedRiceFields: setMunicipalityFloodedRiceFields,
                atmHumidity: setMunicipalityAtmHumidity,
                windSpeed: setMunicipalityWindSpeed,
            },
            fokontany: {
                precipitation: setFokontanyPrecipitation,
                temperature: setFokontanyTemperature,
                vegetationIndex: setFokontanyVegetationIndex,
                waterSurfaceIndex: setFokontanyWaterSurfaceIndex,
                vegetativeWaterIndex: setFokontanyVegetativeWaterIndex,
                bushfireArea: setFokontanyBushfireArea,
                no2AtmLevel: setFokontanyNo2AtmLevel,
                aodAtmLevel: setFokontanyAodAtmLevel,
                floodedRiceFields: setFokontanyFloodedRiceFields,
                atmHumidity: setFokontanyAtmHumidity,
                windSpeed: setFokontanyWindSpeed,
            },
        }
        return actions[level][type]({ data })
    }

    const fetchData = async (orgUnitLevel, setDataAction, orgUnits) => {
        if (!orgUnitLevel) {
            const promises = years.map(async (year) => {
                const result = await fetchAndFormat(
                    dataElement,
                    engine,
                    periods[year],
                    orgUnits
                )
                result.forEach((element) => {
                    const data = {
                        [element.orgUnit]: { [year]: element.values },
                    }
                    const action = setDataAction(type, data)
                    dispatch(action)
                })
            })
            await Promise.all(promises)
        }
    }

    useEffect(() => {
        if (dataElement) {
            const climateVariable = climateData.find(
                (element) => element.id === dataElement
            )
            setCurrentVariable(climateVariable)
        } else {
            setCurrentVariable({
                title: '',
                value: '',
                id: '',
                percentage: 0,
                description: '',
                unit: '',
                icon: () => null,
            })
        }
    }, [dataElement])

    useEffect(() => {
        fetchData(
            districtLvlData,
            (type, data) => getActionByType(type, data, 'district'),
            [district[0].id]
        )
    }, [dispatch, periods, engine, districtLvlData, district])

    useEffect(() => {
        fetchData(
            municipalLvlData,
            (type, data) => getActionByType(type, data, 'municipality'),
            municipalities.map((municipality) => municipality.id)
        )
    }, [dispatch, periods, engine, municipalLvlData, municipalities])

    useEffect(() => {
        fetchData(
            fokontanyLvlData,
            (type, data) => getActionByType(type, data, 'fokontany'),
            orgUnits
        )
    }, [dispatch, periods, engine, fokontanyLvlData, orgUnits])

    const getChartData = (dataLevel, targetOrgUnit) => {
        if (!dataLevel || !targetOrgUnit) {
            return emptyChartData
        } else {
            const data = dataLevel[targetOrgUnit]
            if (data) {
                return {
                    labels,
                    datasets: [
                        {
                            fill: false,
                            label: '',
                            data: concatenateData(data),
                            borderColor: COLORS.primary_text,
                            backgroundColor: COLORS.primary_text,
                            tension: 0.2,
                            hidden: false,
                            pointStyle: false,
                        },
                    ],
                }
            } else {
                return emptyChartData
            }
        }
    }

    const fokontanyChartData = useMemo(
        () => getChartData(fokontanyLvlData, targetOrgUnit),
        [fokontanyLvlData, targetOrgUnit, labels]
    )
    const municipalChartData = useMemo(
        () => getChartData(municipalLvlData, targetOrgUnit),
        [municipalLvlData, targetOrgUnit, labels]
    )
    const districtChartData = useMemo(
        () => getChartData(districtLvlData, targetOrgUnit),
        [districtLvlData, targetOrgUnit, labels]
    )

    return (
        <div className={style.climateTableRow}>
            <div className={style.statiticCardSection}>
                <ClimateStatisticCard
                    item={currentVariable}
                    bgColor={colorTheme}
                />
            </div>
            <div className={style.climateChartSection}>
                <ClimateLineChart
                    data={
                        adminDivisionType === 'fokontany'
                            ? fokontanyChartData
                            : adminDivisionType === 'municipal'
                            ? municipalChartData
                            : adminDivisionType === 'district'
                            ? districtChartData
                            : emptyChartData
                    }
                    title=""
                    xAxisText="Mois"
                    yAxisText={currentVariable.unit ? currentVariable.unit : ''}
                    height="230px"
                    unit={currentVariable.unit}
                />
            </div>
        </div>
    )
}

export default ClimateChart
