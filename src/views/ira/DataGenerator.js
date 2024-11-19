import React from 'react'
import { useSelector } from 'react-redux'
import { generateYearArray } from '../../utils/format-time'
import { getStoredData } from '../../utils/storeHelper'

const useIraData = () => {
    const iraState = useSelector((state) => state.ira)

    const forecastAdjustedAvg = getStoredData({
        data: iraState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'avg',
        adminLvl: 'data',
    })

    const forecastAdjustedLowci = getStoredData({
        data: iraState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'lowci',
        adminLvl: 'data',
    })

    const forecastAdjustedUppci = getStoredData({
        data: iraState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'uppci',
        adminLvl: 'data',
    })

    const forecastAdjustedAvgDistrict = getStoredData({
        data: iraState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'avg',
        adminLvl: 'district',
    })

    const forecastAdjustedLowciDistrict = getStoredData({
        data: iraState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'lowci',
        adminLvl: 'district',
    })

    const forecastAdjustedUpperciDistrict = getStoredData({
        data: iraState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'uppci',
        adminLvl: 'district',
    })

    const forecastAdjustedAnnualAvgDistrict = getStoredData({
        data: iraState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'annualAvg',
        adminLvl: 'district',
    })

    const forecastAdjustedAvgMunicipal = getStoredData({
        data: iraState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'avg',
        adminLvl: 'municipal',
    })

    const forecastAdjustedAnnualAvgMunicipal = getStoredData({
        data: iraState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'annualAvg',
        adminLvl: 'municipal',
    })

    const forecastAdjustedLowciMunicipal = getStoredData({
        data: iraState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'lowci',
        adminLvl: 'municipal',
    })

    const forecastAdjustedUpperciMunicipal = getStoredData({
        data: iraState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'uppci',
        adminLvl: 'municipal',
    })

    const forecastAdjustedAvgFokontany = getStoredData({
        data: iraState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'avg',
        adminLvl: 'fokontany',
    })

    const forecastAdjustedAnnualAvgFokontany = getStoredData({
        data: iraState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'annualAvg',
        adminLvl: 'fokontany',
    })

    const forecastAdjustedLowciFokontany = getStoredData({
        data: iraState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'lowci',
        adminLvl: 'fokontany',
    })

    const forecastAdjustedUpperciFokontany = getStoredData({
        data: iraState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'uppci',
        adminLvl: 'fokontany',
    })

    const forecastDataTableMunicipal = getStoredData({
        data: iraState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'dataTable',
        adminLvl: 'municipal',
    })

    const forecastDataTableFokontany = getStoredData({
        data: iraState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'dataTable',
        adminLvl: 'fokontany',
    })

    const forecastElements = [
        {
            forecastType: 'adjusted',
            caseType: 'avg',
            adminLevel: 'district',
            dataElementId: forecastAdjustedAvg.id,
            storedValue: forecastAdjustedAvgDistrict,
            periods: undefined,
        },
        {
            forecastType: 'adjusted',
            caseType: 'avg',
            adminLevel: 'municipal',
            dataElementId: forecastAdjustedAvg.id,
            storedValue: forecastAdjustedAvgMunicipal,
            periods: undefined,
        },
        {
            forecastType: 'adjusted',
            caseType: 'avg',
            adminLevel: 'fokontany',
            dataElementId: forecastAdjustedAvg.id,
            storedValue: forecastAdjustedAvgFokontany,
            periods: undefined,
        },
        {
            forecastType: 'adjusted',
            caseType: 'annualAvg',
            adminLevel: 'district',
            dataElementId: forecastAdjustedAvg.id,
            storedValue: forecastAdjustedAnnualAvgDistrict,
            periods: generateYearArray(),
        },
        {
            forecastType: 'adjusted',
            caseType: 'annualAvg',
            adminLevel: 'municipal',
            dataElementId: forecastAdjustedAvg.id,
            storedValue: forecastAdjustedAnnualAvgMunicipal,
            periods: generateYearArray(),
        },
        {
            forecastType: 'adjusted',
            caseType: 'annualAvg',
            adminLevel: 'fokontany',
            dataElementId: forecastAdjustedAvg.id,
            storedValue: forecastAdjustedAnnualAvgFokontany,
            periods: generateYearArray(),
        },
        {
            forecastType: 'adjusted',
            caseType: 'lowci',
            adminLevel: 'district',
            dataElementId: forecastAdjustedLowci.id,
            storedValue: forecastAdjustedLowciDistrict,
            periods: undefined,
        },
        {
            forecastType: 'adjusted',
            caseType: 'lowci',
            adminLevel: 'municipal',
            dataElementId: forecastAdjustedLowci.id,
            storedValue: forecastAdjustedLowciMunicipal,
            periods: undefined,
        },
        {
            forecastType: 'adjusted',
            caseType: 'lowci',
            adminLevel: 'fokontany',
            dataElementId: forecastAdjustedLowci.id,
            storedValue: forecastAdjustedLowciFokontany,
            periods: undefined,
        },
        {
            forecastType: 'adjusted',
            caseType: 'uppci',
            adminLevel: 'district',
            dataElementId: forecastAdjustedUppci.id,
            storedValue: forecastAdjustedUpperciDistrict,
            periods: undefined,
        },
        {
            forecastType: 'adjusted',
            caseType: 'uppci',
            adminLevel: 'municipal',
            dataElementId: forecastAdjustedUppci.id,
            storedValue: forecastAdjustedUpperciMunicipal,
            periods: undefined,
        },
        {
            forecastType: 'adjusted',
            caseType: 'uppci',
            adminLevel: 'fokontany',
            dataElementId: forecastAdjustedUppci.id,
            storedValue: forecastAdjustedUpperciFokontany,
            periods: undefined,
        },
    ]

    const historicAdjusted = getStoredData({
        data: iraState,
        type: 'historic',
        source: 'adjusted',
        statType: 'data',
    })

    const historicAdjustedDistrict = getStoredData({
        data: iraState,
        type: 'historic',
        source: 'adjusted',
        adminLvl: 'district'
    })

    const historicAdjustedMunicipal = getStoredData({
        data: iraState,
        type: 'historic',
        source: 'adjusted',
        adminLvl: 'municipal'
    })

    const historicAdjustedFokontany = getStoredData({
        data: iraState,
        type: 'historic',
        source: 'adjusted',
        adminLvl: 'fokontany'
    })

    const historicSimulationDistrict = getStoredData({
        data: iraState,
        type: 'historic',
        source: 'simulation',
        adminLvl: 'district'
    })

    const historicSimulationMunicipal = getStoredData({
        data: iraState,
        type: 'historic',
        source: 'simulation',
        adminLvl: 'municipal'
    })

    const historicSimulationFokontany = getStoredData({
        data: iraState,
        type: 'historic',
        source: 'simulation',
        adminLvl: 'fokontany'
    })

    const historicElements = [
        {
            caseType: 'adjusted',
            adminLevel: 'district',
            dataElementId: historicAdjusted.id,
            storedValue: historicAdjustedDistrict,
        },
        {
            caseType: 'adjusted',
            adminLevel: 'municipal',
            dataElementId: historicAdjusted.id,
            storedValue: historicAdjustedMunicipal,
        },
        {
            caseType: 'adjusted',
            adminLevel: 'fokontany',
            dataElementId: historicAdjusted.id,
            storedValue: historicAdjustedFokontany
        },
    ]

    const historicElementsSimulation = [
        {
            caseType: 'simulation',
            adminLevel: 'district',
            dataElementId: forecastAdjustedAvg.id,
            storedValue: historicSimulationDistrict,
        },
        {
            caseType: 'simulation',
            adminLevel: 'municipal',
            dataElementId: forecastAdjustedAvg.id,
            storedValue: historicSimulationMunicipal,
        },
        {
            caseType: 'simulation',
            adminLevel: 'fokontany',
            dataElementId: forecastAdjustedAvg.id,
            storedValue: historicSimulationFokontany,
        },
    ]

    return {
        forecastAdjustedAvgMunicipal,
        forecastAdjustedLowciMunicipal,
        forecastAdjustedUpperciMunicipal,
        forecastAdjustedAvgFokontany,
        forecastAdjustedLowciFokontany,
        forecastAdjustedUpperciFokontany,
        forecastDataTableMunicipal,
        forecastDataTableFokontany,
        forecastElements,
        historicElements,
        historicElementsSimulation
    }
}

export default useIraData
