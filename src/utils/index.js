// Formatting (strings, dates, data grouping)
export {
    capitalizeFirstLetter,
    fDate,
    fDateTime,
    fTimestamp,
    fToNow,
    generateYearMonths,
    generateYearMonthsRange,
    generateYearArray,
    generateLabels,
    useMonthYYYYMM,
    convertToLocaleDate,
    getPeriodName,
    aggregateByOrgUnit,
    collectValuesByOrgUnit,
    formatForecast,
    regroupData,
    groupByPeriod,
    combineData,
    combineValuesByOrgUnits,
    addOrgUnitNameToFeatures,
    updateDataReducer
} from '@/utils/format'

export {
    useBusinessDate,
    getMonthName
} from '@/utils/timezone'

export {
    useNextThreeMonths,
    generateSimulationPeriods
} from '@/utils/diseaseData'

// Request/API
export {
    fetchAndFormat,
    fetchForecastData,
    fetchAnalyticsData
} from '@/utils/request'

// Data Processing
export { isEqual } from '@/utils/isEqual'
