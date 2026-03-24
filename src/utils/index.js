// Barrel exports for utils
// This allows cleaner imports: import { fDate, regroupData } from '@/utils'

// Time Formatting
export {
    fDate,
    fDateTime,
    fTimestamp,
    fToNow,
    generateYearMonths,
    generateYearArray,
    getMonthYYYYMM,
    convertToLocaleDate
} from './format-time.js'

// Data Formatting & Processing
export {
    formatForecast,
    regroupData
} from './format.js'

// Request/API
export {
    fetchAndFormat,
    fetchForecastData,
    fetchAnalyticsData
} from './request.js'

// Data Processing
export { isEqual } from './isEqual.js'

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
} from './formatting.js'
