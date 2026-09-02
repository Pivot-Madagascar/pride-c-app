// Time Formatting
export {
    fDate,
    fDateTime,
    fTimestamp,
    fToNow,
    generateYearMonths,
    generateYearMonthsRange,
    generateYearArray,
    getMonthYYYYMM,
    convertToLocaleDate
} from '@/utils/format-time'

// Data Formatting & Processing
export {
    formatForecast,
    regroupData
} from '@/utils/format'

// Request/API
export {
    fetchAndFormat,
    fetchForecastData,
    fetchAnalyticsData
} from '@/utils/request'

// Data Processing
export { isEqual } from '@/utils/isEqual'

// Formatting
export {
    aggregateByOrgUnit,
    addOrgUnitNameToFeatures,
    combineData,
    combineValuesByOrgUnits,
    generateLabels,
    groupByPeriod,
    newRegroupData,
    updateDataReducer,
    collectValuesByOrgUnit
} from '@/utils/formatting'
