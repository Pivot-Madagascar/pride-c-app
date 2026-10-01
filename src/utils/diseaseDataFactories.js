import {
    generateYearArray,
    generateYearMonthsRange
} from '@/utils/format'

import {
    generateSimulationPeriods
} from '@/utils/diseaseData'

export const createForecastData = (Disease, nextThreeMonths, currentPeriod) => {
    const forecastElements = [
        {
            path: ['forecast', 'adjusted', 'avg'],
            periods: nextThreeMonths,
            dataElement: Disease.forecast.adjusted.avg.id,
        },
        {
            path: ['forecast', 'adjusted', 'annualAvg'],
            periods: generateYearArray(),
            dataElement: Disease.forecast.adjusted.avg.id,
        },
        {
            path: ['forecast', 'adjusted', 'lowci'],
            periods: nextThreeMonths,
            dataElement: Disease.forecast.adjusted.lowci.id,
        },
        {
            path: ['forecast', 'adjusted', 'uppci'],
            periods: nextThreeMonths,
            dataElement: Disease.forecast.adjusted.uppci.id,
        },
        {
            path: ['forecast', 'csbCases', 'avg'],
            periods: nextThreeMonths,
            dataElement: Disease.forecast.csbCases.avg.id,
        },
        {
            path: ['forecast', 'csbCases', 'annualAvg'],
            periods: generateYearArray(),
            dataElement: Disease.forecast.csbCases.avg.id,
        },
        {
            path: ['forecast', 'csbCases', 'lowci'],
            periods: nextThreeMonths,
            dataElement: Disease.forecast.csbCases.lowci.id,
        },
        {
            path: ['forecast', 'csbCases', 'uppci'],
            periods: nextThreeMonths,
            dataElement: Disease.forecast.csbCases.uppci.id,
        },
        {
            path: ['forecast', 'comCases', 'avg'],
            periods: nextThreeMonths,
            dataElement: Disease.forecast.comCases.avg.id,
        },
        {
            path: ['forecast', 'comCases', 'annualAvg'],
            periods: generateYearArray(),
            dataElement: Disease.forecast.comCases.avg.id,
        },
        {
            path: ['forecast', 'comCases', 'lowci'],
            periods: nextThreeMonths,
            dataElement: Disease.forecast.comCases.lowci.id,
        },
        {
            path: ['forecast', 'comCases', 'uppci'],
            periods: nextThreeMonths,
            dataElement: Disease.forecast.comCases.uppci.id,
        },
    ]
    return { forecastElements }
}

export const createHistoricData = (Disease, nextThreeMonths, currentPeriod) => {
    const historicElements = [
        {
            dataElement: Disease.historic.adjusted.id,
            path: ['historic', 'adjusted'],
            periods: generateYearMonthsRange(2022, 2024),
        },
        {
            dataElement: Disease.historic.csbCases.id,
            path: ['historic', 'csbCases'],
            periods: generateYearMonthsRange(2022, 2024),
        },
        {
            dataElement: Disease.historic.comCases.id,
            path: ['historic', 'comCases'],
            periods: generateYearMonthsRange(2022, 2024),
        },
    ]
    return { historicElements }
}

export const createIndicatorData = (Disease, nextThreeMonths, currentPeriod) => {
    const indicatorElements = [
        {
            path: ['alert', 'csb'],
            periods: [currentPeriod],
            dataElement: Disease.alert.csb.id,
        },
        {
            path: ['alert', 'comCases'],
            periods: [currentPeriod],
            dataElement: Disease.alert.comCases.id,
        },
        {
            path: ['alert', 'incidence'],
            periods: [currentPeriod],
            dataElement: Disease.alert.incidence.id,
        },
        {
            path: ['alert', 'csbVigilance'],
            periods: [currentPeriod],
            dataElement: Disease.alert.csbVigilance.id,
        },
        {
            path: ['compare', 'trend'],
            periods: [currentPeriod],
            dataElement: Disease.compare.trend.id,
        },
        {
            path: ['compare', 'csb'],
            periods: [currentPeriod],
            dataElement: Disease.compare.csb.id,
        },
        {
            path: ['compare', 'comCases'],
            periods: [currentPeriod],
            dataElement: Disease.compare.comCases.id,
        },
        {
            path: ['compare', 'incidence'],
            periods: [currentPeriod],
            dataElement: Disease.compare.incidence.id,
        },
    ]
    return { indicatorElements }
}

export const createSimulationData = (Disease, nextThreeMonths, currentPeriod) => {
    const simulationElements = [
        {
            dataElement: Disease.forecast.adjusted.avg.id,
            path: ['simulation', 'historic'],
            periods: generateYearMonthsRange(2022, 2024),
        },
        {
            dataElement: Disease.forecast.adjusted.avg.id,
            path: ['simulation', 'adjusted'],
            periods: [...generateSimulationPeriods()],
        },
        {
            dataElement: Disease.forecast.comCases.avg.id,
            path: ['simulation', 'comCases'],
            periods: [...generateSimulationPeriods()],
        },
        {
            dataElement: Disease.forecast.csbCases.avg.id,
            path: ['simulation', 'csbCases'],
            periods: [...generateSimulationPeriods()],
        },
    ]
    return { simulationElements }
}