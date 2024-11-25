import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { generateYearArray } from '../../utils/format-time'
import { getStoredData } from '../../utils/storeHelper'

const useMalariaData = () => {
    const malariaState = useSelector((state) => state.malaria)

    const forecastAdjustedAvg = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'avg',
        adminLvl: 'data',
    })

    const forecastAdjustedLowci = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'lowci',
        adminLvl: 'data',
    })

    const forecastAdjustedUppci = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'uppci',
        adminLvl: 'data',
    })

    const forecastAdjustedAvgDistrict = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'avg',
        adminLvl: 'district',
    })

    const forecastAdjustedLowciDistrict = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'lowci',
        adminLvl: 'district',
    })

    const forecastAdjustedUpperciDistrict = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'uppci',
        adminLvl: 'district',
    })

    const forecastAdjustedAnnualAvgDistrict = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'annualAvg',
        adminLvl: 'district',
    })

    const forecastAdjustedAvgMunicipal = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'avg',
        adminLvl: 'municipal',
    })

    const forecastAdjustedAnnualAvgMunicipal = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'annualAvg',
        adminLvl: 'municipal',
    })

    const forecastAdjustedLowciMunicipal = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'lowci',
        adminLvl: 'municipal',
    })

    const forecastAdjustedUpperciMunicipal = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'uppci',
        adminLvl: 'municipal',
    })

    const forecastAdjustedAvgFokontany = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'avg',
        adminLvl: 'fokontany',
    })

    const forecastAdjustedAnnualAvgFokontany = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'annualAvg',
        adminLvl: 'fokontany',
    })

    const forecastAdjustedLowciFokontany = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'lowci',
        adminLvl: 'fokontany',
    })

    const forecastAdjustedUpperciFokontany = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'uppci',
        adminLvl: 'fokontany',
    })

    const forecastDataTableMunicipal = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'dataTable',
        adminLvl: 'municipal',
    })

    const forecastDataTableFokontany = getStoredData({
        data: malariaState,
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
        data: malariaState,
        type: 'historic',
        source: 'adjusted',
        statType: 'data',
    })

    const historicAdjustedDistrict = getStoredData({
        data: malariaState,
        type: 'historic',
        source: 'adjusted',
        adminLvl: 'district'
    })

    const historicAdjustedMunicipal = getStoredData({
        data: malariaState,
        type: 'historic',
        source: 'adjusted',
        adminLvl: 'municipal'
    })

    const historicAdjustedFokontany = getStoredData({
        data: malariaState,
        type: 'historic',
        source: 'adjusted',
        adminLvl: 'fokontany'
    })

    const historicSimulationDistrict = getStoredData({
        data: malariaState,
        type: 'historic',
        source: 'simulation',
        adminLvl: 'district'
    })

    const historicSimulationMunicipal = getStoredData({
        data: malariaState,
        type: 'historic',
        source: 'simulation',
        adminLvl: 'municipal'
    })

    const historicSimulationFokontany = getStoredData({
        data: malariaState,
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

    const alertCsb = getStoredData({
        data: malariaState,
        type: 'alert',
        source: 'csb',
        dataType: 'dataElement'
    })

    const alertCsbDistrict = getStoredData({
        data: malariaState,
        type: 'alert',
        source: 'csb',
        adminLevel: 'district'
    })

    const alertAdjusted = getStoredData({
        data: malariaState,
        type: 'alert',
        source: 'adjusted',
        dataType: 'dataElement'
    })

    const alertAdjustedDistrict = getStoredData({
        data: malariaState,
        type: 'alert',
        source: 'adjusted',
        adminLevel: 'district'
    })

    const alertVigilance = getStoredData({
        data: malariaState,
        type: 'alert',
        source: 'vigilance',
        dataType: 'dataElement'
    })

    const alertVigilanceDistrict = getStoredData({
        data: malariaState,
        type: 'alert',
        source: 'vigilance',
        adminLevel: 'district'
    })

    const alertCompareCsb = getStoredData({
        data: malariaState,
        type: 'compare',
        source: 'csb',
        dataType: 'dataElement'
    })

    const alertCompareCsbDistrict = getStoredData({
        data: malariaState,
        type: 'compare',
        source: 'csb',
        adminLevel: 'district'
    })

    const alertCompareAdjusted = getStoredData({
        data: malariaState,
        type: 'compare',
        source: 'adjusted',
        dataType: 'dataElement'
    })

    const alertCompareAdjustedDistrict = getStoredData({
        data: malariaState,
        type: 'compare',
        source: 'adjusted',
        adminLevel: 'district'
    })

    const alertCompareTrend = getStoredData({
        data: malariaState,
        type: 'compare',
        source: 'trend',
        dataType: 'dataElement'
    })

    const alertCompareTrendDistrict = getStoredData({
        data: malariaState,
        type: 'compare',
        source: 'trend',
        adminLevel: 'district'
    })

    const alertCompareCsbVigilance = getStoredData({
        data: malariaState,
        type: 'compare',
        source: 'csbVigilance',
        dataType: 'dataElement'
    })

    const alertCompareCsbVigilanceDistrict = getStoredData({
        data: malariaState,
        type: 'compare',
        source: 'csbVigilance',
        adminLevel: 'district'
    })

    const malariaAlertElements = [
        {
            alertType: 'csb',
            adminLevel: 'district',
            dataElementId: alertCsb.id,
            storedValue: alertCsbDistrict
        },
        {
            alertType: 'adjusted',
            adminLevel: 'district',
            dataElementId: alertAdjusted.id,
            storedValue: alertAdjustedDistrict
        },
        {
            alertType: 'vigilance',
            adminLevel: 'district',
            dataElementId: alertVigilance.id,
            storedValue: alertVigilanceDistrict
        },
    ]

    const malariaComparisonElements = [
        {
            alertType: 'csb',
            adminLevel: 'district',
            dataElementId: alertCompareCsb.id,
            storedValue: alertCompareCsbDistrict
        },
        {
            alertType: 'adjusted',
            adminLevel: 'district',
            dataElementId: alertCompareAdjusted.id,
            storedValue: alertCompareAdjustedDistrict
        },
        {
            alertType: 'trend',
            adminLevel: 'district',
            dataElementId: alertCompareTrend.id,
            storedValue: alertCompareTrendDistrict
        },
        {
            alertType: 'csbVigilance',
            adminLevel: 'district',
            dataElementId: alertCompareCsbVigilance.id,
            storedValue: alertCompareCsbVigilanceDistrict
        }
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
        historicElementsSimulation,
        malariaAlertElements,
        malariaComparisonElements
    }
}

export default useMalariaData
