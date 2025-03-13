import { useSelector } from 'react-redux'
import { setDiarrheaAlertData, setDiarrheaCompareData } from '../../redux/diarrheaSlice'
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

    const forecastDataTableDistrict = getStoredData({
        data: diarrheaState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'dataTable',
        adminLvl: 'district',
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

    const alertComCases = getStoredData({
        data: diarrheaState,
        type: 'alert',
        source: 'comCases',
        dataType: 'dataElement'
    })

    const alertComCasesDistrict = getStoredData({
        data: diarrheaState,
        type: 'alert',
        source: 'comCases',
        adminLevel: 'district'
    })

    const alertIncidence = getStoredData({
        data: diarrheaState,
        type: 'alert',
        source: 'incidence',
        dataType: 'dataElement'
    })

    const alertIncidenceDistrict = getStoredData({
        data: diarrheaState,
        type: 'alert',
        source: 'incidence',
        adminLevel: 'district'
    })

    const alertCsbVigilance = getStoredData({
        data: diarrheaState,
        type: 'alert',
        source: 'csbVigilance',
        dataType: 'dataElement'
    })

    const alertCsbVigilanceDistrict = getStoredData({
        data: diarrheaState,
        type: 'alert',
        source: 'csbVigilance',
        adminLevel: 'district'
    })

    const compareCsb = getStoredData({
        data: diarrheaState,
        type: 'compare',
        source: 'csb',
        dataType: 'dataElement'
    })

    const compareCsbDistrict = getStoredData({
        data: diarrheaState,
        type: 'compare',
        source: 'csb',
        adminLevel: 'district'
    })

    const compareComCases = getStoredData({
        data: diarrheaState,
        type: 'compare',
        source: 'comCases',
        dataType: 'dataElement'
    })

    const compareComCasesDistrict = getStoredData({
        data: diarrheaState,
        type: 'compare',
        source: 'comCases',
        adminLevel: 'district'
    })

    const compareIncidence = getStoredData({
        data: diarrheaState,
        type: 'compare',
        source: 'incidence',
        dataType: 'dataElement',
    })

    const compareIncidenceDistrict = getStoredData({
        data: diarrheaState,
        type: 'compare',
        source: 'incidence',
        adminLevel: 'district'
    })

    const compareTrend = getStoredData({
        data: diarrheaState,
        type: 'compare',
        source: 'trend',
        dataType: 'dataElement'
    })

    const compareTrendDistrict = getStoredData({
        data: diarrheaState,
        type: 'compare',
        source: 'trend',
        adminLevel: 'district'
    })

    const diarrheaIndicators = [
        {   
            indicatorType: 'alert',
            source: 'csb',
            adminLevel: 'district',
            dataElementId: alertCsb.id,
            storedValue: alertCsbDistrict,
            action: setDiarrheaAlertData
        },
        {   
            indicatorType: 'alert',
            source: 'comCases',
            adminLevel: 'district',
            dataElementId: alertComCases.id,
            storedValue: alertComCasesDistrict,
            action: setDiarrheaAlertData
        },
        {
            indicatorType: 'alert',
            source: 'incidence',
            adminLevel: 'district',
            dataElementId: alertIncidence.id,
            storedValue: alertIncidenceDistrict,
            action: setDiarrheaAlertData
        },
        {
            indicatorType: 'alert',
            source: 'csbVigilance',
            adminLevel: 'district',
            dataElementId: alertCsbVigilance.id,
            storedValue: alertCsbVigilanceDistrict,
            action: setDiarrheaAlertData
        },
        {
            indicatorType: 'compare',
            source: 'csb',
            adminLevel: 'district',
            dataElementId: compareCsb.id,
            storedValue: compareCsbDistrict,
            action: setDiarrheaCompareData
        },
        {
            indicatorType: 'compare',
            source: 'comCases',
            adminLevel: 'district',
            dataElementId: compareComCases.id,
            storedValue: compareComCasesDistrict,
            action: setDiarrheaCompareData
        },
        {
            indicatorType: 'compare',
            source: 'incidence',
            adminLevel: 'district',
            dataElementId: compareIncidence.id,
            storedValue: compareIncidenceDistrict,
            action: setDiarrheaCompareData
        },
        {
            indicatorType: 'compare',
            source: 'trend',
            adminLevel: 'district',
            dataElementId: compareTrend.id,
            storedValue: compareTrendDistrict,
            action: setDiarrheaCompareData
        },
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
        forecastDataTableDistrict,
        forecastDataTableMunicipal,
        forecastDataTableFokontany,
        forecastElements,
        historicElements,
        historicElementsSimulation,
        diarrheaIndicators
    }
}

export default useDiarrheaData
