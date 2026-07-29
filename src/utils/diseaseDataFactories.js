import { generateYearArray, generateYearMonths, getMonthYYYYMM } from '@/utils/format-time'
import { getLastThreeMonths, generateSimulationPeriods } from '@/utils/diseaseData'

export const createForecastData = (Disease) => {
    const forecastElements = [
        {
            path: ['forecast', 'adjusted', 'avg'],
            periods: getLastThreeMonths(),
            dataElement: Disease.forecast.adjusted.avg.id,
        },
        {
            path: ['forecast', 'adjusted', 'annualAvg'],
            periods: generateYearArray(),
            dataElement: Disease.forecast.adjusted.avg.id,
        },
        {
            path: ['forecast', 'adjusted', 'lowci'],
            periods: getLastThreeMonths(),
            dataElement: Disease.forecast.adjusted.lowci.id,
        },
        {
            path: ['forecast', 'adjusted', 'uppci'],
            periods: getLastThreeMonths(),
            dataElement: Disease.forecast.adjusted.uppci.id,
        },
        {
            path: ['forecast', 'csbCases', 'avg'],
            periods: getLastThreeMonths(),
            dataElement: Disease.forecast.csbCases.avg.id,
        },
        {
            path: ['forecast', 'csbCases', 'annualAvg'],
            periods: generateYearArray(),
            dataElement: Disease.forecast.csbCases.avg.id,
        },
        {
            path: ['forecast', 'csbCases', 'lowci'],
            periods: getLastThreeMonths(),
            dataElement: Disease.forecast.csbCases.lowci.id,
        },
        {
            path: ['forecast', 'csbCases', 'uppci'],
            periods: getLastThreeMonths(),
            dataElement: Disease.forecast.csbCases.uppci.id,
        },
        {
            path: ['forecast', 'comCases', 'avg'],
            periods: getLastThreeMonths(),
            dataElement: Disease.forecast.comCases.avg.id,
        },
        {
            path: ['forecast', 'comCases', 'annualAvg'],
            periods: generateYearArray(),
            dataElement: Disease.forecast.comCases.avg.id,
        },
        {
            path: ['forecast', 'comCases', 'lowci'],
            periods: getLastThreeMonths(),
            dataElement: Disease.forecast.comCases.lowci.id,
        },
        {
            path: ['forecast', 'comCases', 'uppci'],
            periods: getLastThreeMonths(),
            dataElement: Disease.forecast.comCases.uppci.id,
        },
    ]
    return { forecastElements }
}

export const createHistoricData = (Disease) => {
    const historicElements = [
        {
            dataElement: Disease.historic.adjusted.id,
            path: ['historic', 'adjusted'],
            periods: [
                ...generateYearMonths(2016),
                ...generateYearMonths(2017),
                ...generateYearMonths(2018),
            ],
        },
        {
            dataElement: Disease.historic.csbCases.id,
            path: ['historic', 'csbCases'],
            periods: [
                ...generateYearMonths(2021),
                ...generateYearMonths(2022),
                ...generateYearMonths(2023),
            ],
        },
        {
            dataElement: Disease.historic.comCases.id,
            path: ['historic', 'comCases'],
            periods: [
                ...generateYearMonths(2020),
                ...generateYearMonths(2021),
                ...generateYearMonths(2022),
            ],
        },
    ]
    return { historicElements }
}

export const createIndicatorData = (Disease) => {
    const indicatorElements = [
        {
            path: ['alert', 'csb'],
            periods: [getMonthYYYYMM()],
            dataElement: Disease.alert.csb.id,
        },
        {
            path: ['alert', 'comCases'],
            periods: [getMonthYYYYMM()],
            dataElement: Disease.alert.comCases.id,
        },
        {
            path: ['alert', 'incidence'],
            periods: [getMonthYYYYMM()],
            dataElement: Disease.alert.incidence.id,
        },
        {
            path: ['alert', 'csbVigilance'],
            periods: [getMonthYYYYMM()],
            dataElement: Disease.alert.csbVigilance.id,
        },
        {
            path: ['compare', 'trend'],
            periods: [getMonthYYYYMM()],
            dataElement: Disease.compare.trend.id,
        },
        {
            path: ['compare', 'csb'],
            periods: [getMonthYYYYMM()],
            dataElement: Disease.compare.csb.id,
        },
        {
            path: ['compare', 'comCases'],
            periods: [getMonthYYYYMM()],
            dataElement: Disease.compare.comCases.id,
        },
        {
            path: ['compare', 'incidence'],
            periods: [getMonthYYYYMM()],
            dataElement: Disease.compare.incidence.id,
        },
    ]
    return { indicatorElements }
}

export const createSimulationData = (Disease) => {
    const simulationElements = [
        {
            dataElement: Disease.forecast.adjusted.avg.id,
            path: ['simulation', 'historic'],
            periods: [
                ...generateYearMonths(2022),
                ...generateYearMonths(2023),
                ...generateYearMonths(2024),
                ...generateYearMonths(2025),
            ],
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