import { useSelector } from 'react-redux'
import { setIraAlertData, setIraCompareData } from '../../redux/iraSlice'
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

    const forecastDataTableDistrict = getStoredData({
        data: iraState,
        type: 'forecast',
        source: 'adjusted',
        statType: 'dataTable',
        adminLvl: 'district',
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

    const alertCsb = getStoredData({
        data: iraState,
        type: 'alert',
        source: 'csb',
        dataType: 'dataElement'
    })

    const alertCsbDistrict = getStoredData({
        data: iraState,
        type: 'alert',
        source: 'csb',
        adminLevel: 'district'
    })

    const alertComCases = getStoredData({
        data: iraState,
        type: 'alert',
        source: 'comCases',
        dataType: 'dataElement'
    })

    const alertComCasesDistrict = getStoredData({
        data: iraState,
        type: 'alert',
        source: 'comCases',
        adminLevel: 'district'
    })

    const alertIncidence = getStoredData({
        data: iraState,
        type: 'alert',
        source: 'incidence',
        dataType: 'dataElement'
    })

    const alertIncidenceDistrict = getStoredData({
        data: iraState,
        type: 'alert',
        source: 'incidence',
        adminLevel: 'district'
    })

    const alertCsbVigilance = getStoredData({
        data: iraState,
        type: 'alert',
        source: 'csbVigilance',
        dataType: 'dataElement'
    })

    const alertCsbVigilanceDistrict = getStoredData({
        data: iraState,
        type: 'alert',
        source: 'csbVigilance',
        adminLevel: 'district'
    })

    const compareCsb = getStoredData({
        data: iraState,
        type: 'compare',
        source: 'csb',
        dataType: 'dataElement'
    })

    const compareCsbDistrict = getStoredData({
        data: iraState,
        type: 'compare',
        source: 'csb',
        adminLevel: 'district'
    })

    const compareComCases = getStoredData({
        data: iraState,
        type: 'compare',
        source: 'comCases',
        dataType: 'dataElement'
    })

    const compareComCasesDistrict = getStoredData({
        data: iraState,
        type: 'compare',
        source: 'comCases',
        adminLevel: 'district'
    })

    const compareIncidence = getStoredData({
        data: iraState,
        type: 'compare',
        source: 'incidence',
        dataType: 'dataElement',
    })

    const compareIncidenceDistrict = getStoredData({
        data: iraState,
        type: 'compare',
        source: 'incidence',
        adminLevel: 'district'
    })

    const compareTrend = getStoredData({
        data: iraState,
        type: 'compare',
        source: 'trend',
        dataType: 'dataElement'
    })

    const compareTrendDistrict = getStoredData({
        data: iraState,
        type: 'compare',
        source: 'trend',
        adminLevel: 'district'
    })

    const iraIndicators = [
        {   
            indicatorType: 'alert',
            source: 'csb',
            adminLevel: 'district',
            dataElementId: alertCsb.id,
            storedValue: alertCsbDistrict,
            action: setIraAlertData
        },
        {
            indicatorType: 'alert',
            source: 'comCases',
            adminLevel: 'district',
            dataElementId: alertComCases.id,
            storedValue: alertComCasesDistrict,
            action: setIraAlertData
        },
        {
            indicatorType: 'alert',
            source: 'incidence',
            adminLevel: 'district',
            dataElementId: alertIncidence.id,
            storedValue: alertIncidenceDistrict,
            action: setIraAlertData
        },
        {
            indicatorType: 'alert',
            source: 'csbVigilance',
            adminLevel: 'district',
            dataElementId: alertCsbVigilance.id,
            storedValue: alertCsbVigilanceDistrict,
            action: setIraAlertData
        },
        {
            indicatorType: 'compare',
            source: 'csb',
            adminLevel: 'district',
            dataElementId: compareCsb.id,
            storedValue: compareCsbDistrict,
            action: setIraCompareData
        },
        {
            indicatorType: 'compare',
            source: 'comCases',
            adminLevel: 'district',
            dataElementId: compareComCases.id,
            storedValue: compareComCasesDistrict,
            action: setIraCompareData
        },
        {
            indicatorType: 'compare',
            source: 'incidence',
            adminLevel: 'district',
            dataElementId: compareIncidence.id,
            storedValue: compareIncidenceDistrict,
            action: setIraCompareData
        },
        {
            indicatorType: 'compare',
            source: 'trend',
            adminLevel: 'district',
            dataElementId: compareTrend.id,
            storedValue: compareTrendDistrict,
            action: setIraCompareData
        }
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
        iraIndicators
    }
}

export default useIraData
