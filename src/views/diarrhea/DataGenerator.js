import React from 'react'
import { useSelector } from 'react-redux'
import { generateYearArray } from '../../utils/format-time'
import { getStoredData } from '../../utils/storeHelper'

const useDiarrheaData = () => {
    const diarrheaState = useSelector((state) => state.diarrhea)

    const forecastAdjustedAvg = getStoredData({
        data: diarrheaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'avg',
        adminLvl: 'data',
    })

    const forecastAdjustedLowci = getStoredData({
        data: diarrheaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'lowci',
        adminLvl: 'data',
    })

    const forecastAdjustedUppci = getStoredData({
        data: diarrheaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'uppci',
        adminLvl: 'data',
    })

    const forecastAdjustedAvgDistrict = getStoredData({
        data: diarrheaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'avg',
        adminLvl: 'district',
    })

    const forecastAdjustedLowciDistrict = getStoredData({
        data: diarrheaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'lowci',
        adminLvl: 'district',
    })

    const forecastAdjustedUpperciDistrict = getStoredData({
        data: diarrheaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'uppci',
        adminLvl: 'district',
    })

    const forecastAdjustedAnnualAvgDistrict = getStoredData({
        data: diarrheaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'annualAvg',
        adminLvl: 'district',
    })

    const forecastAdjustedAvgMunicipal = getStoredData({
        data: diarrheaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'avg',
        adminLvl: 'municipal',
    })

    const forecastAdjustedAnnualAvgMunicipal = getStoredData({
        data: diarrheaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'annualAvg',
        adminLvl: 'municipal',
    })

    const forecastAdjustedLowciMunicipal = getStoredData({
        data: diarrheaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'lowci',
        adminLvl: 'municipal',
    })

    const forecastAdjustedUpperciMunicipal = getStoredData({
        data: diarrheaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'uppci',
        adminLvl: 'municipal',
    })

    const forecastAdjustedAvgFokontany = getStoredData({
        data: diarrheaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'avg',
        adminLvl: 'fokontany',
    })

    const forecastAdjustedAnnualAvgFokontany = getStoredData({
        data: diarrheaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'annualAvg',
        adminLvl: 'fokontany',
    })

    const forecastAdjustedLowciFokontany = getStoredData({
        data: diarrheaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'lowci',
        adminLvl: 'fokontany',
    })

    const forecastAdjustedUpperciFokontany = getStoredData({
        data: diarrheaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'uppci',
        adminLvl: 'fokontany',
    })

    const forecastDataTableMunicipal = getStoredData({
        data: diarrheaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'dataTable',
        adminLvl: 'municipal',
    })

    const forecastDataTableFokontany = getStoredData({
        data: diarrheaState,
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
        data: diarrheaState,
        type: 'historic',
        source: 'adjusted',
        statType: 'data',
    })

    const historicAdjustedDistrict = getStoredData({
        data: diarrheaState,
        type: 'historic',
        source: 'adjusted',
        adminLvl: 'district'
    })

    const historicAdjustedMunicipal = getStoredData({
        data: diarrheaState,
        type: 'historic',
        source: 'adjusted',
        adminLvl: 'municipal'
    })

    const historicAdjustedFokontany = getStoredData({
        data: diarrheaState,
        type: 'historic',
        source: 'adjusted',
        adminLvl: 'fokontany'
    })

    const historicSimulationDistrict = getStoredData({
        data: diarrheaState,
        type: 'historic',
        source: 'simulation',
        adminLvl: 'district'
    })

    const historicSimulationMunicipal = getStoredData({
        data: diarrheaState,
        type: 'historic',
        source: 'simulation',
        adminLvl: 'municipal'
    })

    const historicSimulationFokontany = getStoredData({
        data: diarrheaState,
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
        data: diarrheaState,
        type: 'alert',
        source: 'csb',
        dataType: 'dataElement'
    })

    const alertCsbDistrict = getStoredData({
        data: diarrheaState,
        type: 'alert',
        source: 'csb',
        adminLevel: 'district'
    })

    const alertAdjusted = getStoredData({
        data: diarrheaState,
        type: 'alert',
        source: 'adjusted',
        dataType: 'dataElement'
    })

    const alertAdjustedDistrict = getStoredData({
        data: diarrheaState,
        type: 'alert',
        source: 'adjusted',
        adminLevel: 'district'
    })

    const alertVigilance = getStoredData({
        data: diarrheaState,
        type: 'alert',
        source: 'vigilance',
        dataType: 'dataElement'
    })

    const alertVigilanceDistrict = getStoredData({
        data: diarrheaState,
        type: 'alert',
        source: 'vigilance',
        adminLevel: 'district'
    })

    const alertCompareCsb = getStoredData({
        data: diarrheaState,
        type: 'compare',
        source: 'csb',
        dataType: 'dataElement'
    })

    const alertCompareCsbDistrict = getStoredData({
        data: diarrheaState,
        type: 'compare',
        source: 'csb',
        adminLevel: 'district'
    })

    const alertCompareAdjusted = getStoredData({
        data: diarrheaState,
        type: 'compare',
        source: 'adjusted',
        dataType: 'dataElement'
    })

    const alertCompareAdjustedDistrict = getStoredData({
        data: diarrheaState,
        type: 'compare',
        source: 'adjusted',
        adminLevel: 'district'
    })

    const alertCompareTrend = getStoredData({
        data: diarrheaState,
        type: 'compare',
        source: 'trend',
        dataType: 'dataElement'
    })

    const alertCompareTrendDistrict = getStoredData({
        data: diarrheaState,
        type: 'compare',
        source: 'trend',
        adminLevel: 'district'
    })

    const alertCompareCsbVigilance = getStoredData({
        data: diarrheaState,
        type: 'compare',
        source: 'csbVigilance',
        dataType: 'dataElement'
    })

    const alertCompareCsbVigilanceDistrict = getStoredData({
        data: diarrheaState,
        type: 'compare',
        source: 'csbVigilance',
        adminLevel: 'district'
    })

    const diarrheaAlertElements = [
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

    const diarrheaComparisonElements = [
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
        diarrheaAlertElements,
        diarrheaComparisonElements
    }
}

export default useDiarrheaData
