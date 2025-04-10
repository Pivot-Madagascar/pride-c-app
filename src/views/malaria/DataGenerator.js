import { useSelector } from 'react-redux'
import { MALARIA } from '../../constants/mapping'
import { generateYearArray } from '../../utils/format-time'
import { getStoredData , getElementFromStore } from '../../utils/storeHelper'

const useMalariaData = () => {
    const malariaState = useSelector((state) => state.malaria)

    // Adjusted
    // const forecastAdjustedAvg.id = getStoredData({
    //     data: malariaState,
    //     type: 'forecast',
    //     source: 'adjusted',
    //     statType: 'avg',
    //     adminLvl: 'dataElement',
    // })

    const forecastAdjustedAvg = MALARIA.forecast.adjusted.avg
    const forecastAdjustedLowci = MALARIA.forecast.adjusted.lowci
    const forecastAdjustedUppci = MALARIA.forecast.adjusted.uppci
    // const forecastAdjustedLowci = getStoredData({
    //     data: malariaState,
    //     type: 'forecast',
    //     source: 'adjusted',
    //     statType: 'lowci',
    //     adminLvl: 'dataElement',
    // })

    // const forecastAdjustedUppci = getStoredData({
    //     data: malariaState,
    //     type: 'forecast',
    //     source: 'adjusted',
    //     statType: 'uppci',
    //     adminLvl: 'dataElement',
    // })

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

    const forecastCsbCasesAvg = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'csbCases',
        statType: 'avg',
        adminLvl: 'dataElement',
    })

    // csbCases

    const forecastCsbCasesLowci = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'csbCase',
        statType: 'lowci',
        adminLvl: 'dataElement',
    })

    const forecastCsbCasesUppci = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'csbCase',
        statType: 'uppci',
        adminLvl: 'dataElement',
    })

    const forecastCsbCasesAvgDistrict = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'csbCase',
        statType: 'avg',
        adminLvl: 'district',
    })

    const forecastCsbCasesLowciDistrict = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'csbCase',
        statType: 'lowci',
        adminLvl: 'district',
    })

    const forecastCsbCasesUpperciDistrict = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'csbCase',
        statType: 'uppci',
        adminLvl: 'district',
    })

    const forecastCsbCasesAnnualAvgDistrict = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'csbCase',
        statType: 'annualAvg',
        adminLvl: 'district',
    })

    const forecastCsbCasesAvgMunicipal = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'csbCase',
        statType: 'avg',
        adminLvl: 'municipal',
    })

    const forecastCsbCasesAnnualAvgMunicipal = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'csbCase',
        statType: 'annualAvg',
        adminLvl: 'municipal',
    })

    const forecastCsbCasesLowciMunicipal = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'csbCase',
        statType: 'lowci',
        adminLvl: 'municipal',
    })

    const forecastCsbCasesUpperciMunicipal = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'csbCase',
        statType: 'uppci',
        adminLvl: 'municipal',
    })

    const forecastCsbCasesAvgFokontany = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'csbCase',
        statType: 'avg',
        adminLvl: 'fokontany',
    })

    const forecastCsbCasesAnnualAvgFokontany = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'csbCase',
        statType: 'annualAvg',
        adminLvl: 'fokontany',
    })

    const forecastCsbCasesLowciFokontany = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'csbCase',
        statType: 'lowci',
        adminLvl: 'fokontany',
    })

    const forecastCsbCasesUpperciFokontany = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'csbCase',
        statType: 'uppci',
        adminLvl: 'fokontany',
    })

    const forecastAdjustedDataTableDistrict = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'dataTable',
        adminLvl: 'district',
    })

    const forecastAdjustedDataTableMunicipal = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'dataTable',
        adminLvl: 'municipal',
    })

    const forecastAdjustedDataTableFokontany = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'dataTable',
        adminLvl: 'fokontany',
    })

    const forecastCsbCasesDataTableDistrict = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'csbCases',
        statType: 'dataTable',
        adminLvl: 'district',
    })

    const forecastCsbCasesDataTableMunicipal = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'csbCases',
        statType: 'dataTable',
        adminLvl: 'municipal',
    })

    const forecastCsbCasesDataTableFokontany = getStoredData({
        data: malariaState,
        type: 'forecast',
        source: 'csbCases',
        statType: 'dataTable',
        adminLvl: 'fokontany',
    })

    const forecastElements = [
        // {
        //     forecastType: 'adjusted',
        //     caseType: 'avg',
        //     adminLevel: 'district',
        //     dataElementId: forecastAdjustedAvg.id,
        //     storedValue: forecastAdjustedAvgDistrict,
        //     periods: undefined,
        // },
        // {
        //     forecastType: 'adjusted',
        //     caseType: 'avg',
        //     adminLevel: 'municipal',
        //     dataElementId: forecastAdjustedAvg.id,
        //     storedValue: forecastAdjustedAvgMunicipal,
        //     periods: undefined,
        // },
        // {
        //     forecastType: 'adjusted',
        //     caseType: 'avg',
        //     adminLevel: 'fokontany',
        //     dataElementId: forecastAdjustedAvg.id,
        //     storedValue: forecastAdjustedAvgFokontany,
        //     periods: undefined,
        // },
        // {
        //     forecastType: 'adjusted',
        //     caseType: 'annualAvg',
        //     adminLevel: 'district',
        //     dataElementId: forecastAdjustedAvg.id,
        //     storedValue: forecastAdjustedAnnualAvgDistrict,
        //     periods: generateYearArray(),
        // },
        // {
        //     forecastType: 'adjusted',
        //     caseType: 'annualAvg',
        //     adminLevel: 'municipal',
        //     dataElementId: forecastAdjustedAvg.id,
        //     storedValue: forecastAdjustedAnnualAvgMunicipal,
        //     periods: generateYearArray(),
        // },
        // {
        //     forecastType: 'adjusted',
        //     caseType: 'annualAvg',
        //     adminLevel: 'fokontany',
        //     dataElementId: forecastAdjustedAvg.id,
        //     storedValue: forecastAdjustedAnnualAvgFokontany,
        //     periods: generateYearArray(),
        // },
        // {
        //     forecastType: 'adjusted',
        //     caseType: 'lowci',
        //     adminLevel: 'district',
        //     dataElementId: forecastAdjustedLowci.id,
        //     storedValue: forecastAdjustedLowciDistrict,
        //     periods: undefined,
        // },
        // {
        //     forecastType: 'adjusted',
        //     caseType: 'lowci',
        //     adminLevel: 'municipal',
        //     dataElementId: forecastAdjustedLowci.id,
        //     storedValue: forecastAdjustedLowciMunicipal,
        //     periods: undefined,
        // },
        // {
        //     forecastType: 'adjusted',
        //     caseType: 'lowci',
        //     adminLevel: 'fokontany',
        //     dataElementId: forecastAdjustedLowci.id,
        //     storedValue: forecastAdjustedLowciFokontany,
        //     periods: undefined,
        // },
        // {
        //     forecastType: 'adjusted',
        //     caseType: 'uppci',
        //     adminLevel: 'district',
        //     dataElementId: forecastAdjustedUppci.id,
        //     storedValue: forecastAdjustedUpperciDistrict,
        //     periods: undefined,
        // },
        // {
        //     forecastType: 'adjusted',
        //     caseType: 'uppci',
        //     adminLevel: 'municipal',
        //     dataElementId: forecastAdjustedUppci.id,
        //     storedValue: forecastAdjustedUpperciMunicipal,
        //     periods: undefined,
        // },
        // {
        //     forecastType: 'adjusted',
        //     caseType: 'uppci',
        //     adminLevel: 'fokontany',
        //     dataElementId: forecastAdjustedUppci.id,
        //     storedValue: forecastAdjustedUpperciFokontany,
        //     periods: undefined,
        // },
    ]

    const historicAdjusted = MALARIA.historic.adjusted

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
        // {
        //     caseType: 'simulation',
        //     adminLevel: 'district',
        //     dataElementId: forecastAdjustedAvg.id,
        //     storedValue: historicSimulationDistrict,
        // },
        // {
        //     caseType: 'simulation',
        //     adminLevel: 'municipal',
        //     dataElementId: forecastAdjustedAvg.id,
        //     storedValue: historicSimulationMunicipal,
        // },
        // {
        //     caseType: 'simulation',
        //     adminLevel: 'fokontany',
        //     dataElementId: forecastAdjustedAvg.id,
        //     storedValue: historicSimulationFokontany,
        // },
    ]

    return {
        forecastAdjustedAvgDistrict,
        forecastAdjustedLowciDistrict,
        forecastAdjustedUpperciDistrict,
        forecastAdjustedAvgMunicipal,
        forecastAdjustedLowciMunicipal,
        forecastAdjustedUpperciMunicipal,
        forecastAdjustedAvgFokontany,
        forecastAdjustedLowciFokontany,
        forecastAdjustedUpperciFokontany,
        forecastAdjustedDataTableDistrict,
        forecastAdjustedDataTableMunicipal,
        forecastAdjustedDataTableFokontany,
        forecastElements,
        historicElements,
        historicElementsSimulation,
    }
}

export default useMalariaData
