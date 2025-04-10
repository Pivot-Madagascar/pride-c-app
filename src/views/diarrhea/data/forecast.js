import { DIARRHEA } from '../../../constants/mapping'
import { generateYearArray } from '../../../utils/format-time'

const getLastThreeMonths = () => {
    const currentDate = new Date()
    const lastThreeMonths = []
    for (let i = 1; i < 4; i++) {
        const month = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + i,
            1
        )
        const yearMonth = month.toISOString().slice(0, 7).replace('-', '')
        lastThreeMonths.unshift(yearMonth)
    }
    return lastThreeMonths
}

const getDiarrheaForecast = () => {
    const forecastElements = [
        {
            path: ['forecast', 'adjusted', 'avg'],
            periods: getLastThreeMonths(),
            dataElement: DIARRHEA.forecast.adjusted.avg.id
        },
        {
            path: ['forecast', 'adjusted', 'annualAvg'],
            periods: generateYearArray(),
            dataElement: DIARRHEA.forecast.adjusted.avg.id
        },
        {
            path: ['forecast', 'adjusted', 'lowci'],
            periods: getLastThreeMonths(),
            dataElement: DIARRHEA.forecast.adjusted.lowci.id
        },
        {
            path: ['forecast', 'adjusted', 'uppci'],
            periods: getLastThreeMonths(),
            dataElement: DIARRHEA.forecast.adjusted.uppci.id
        },
        {
            path: ['forecast', 'csbCases', 'avg'],
            periods: getLastThreeMonths(),
            dataElement: DIARRHEA.forecast.csbCases.avg.id
        },
        {
            path: ['forecast', 'csbCases', 'annualAvg'],
            periods: generateYearArray(),
            dataElement: DIARRHEA.forecast.csbCases.avg.id
        },
        {
            path: ['forecast', 'csbCases', 'lowci'],
            periods: getLastThreeMonths(),
            dataElement: DIARRHEA.forecast.csbCases.lowci.id
        },
        {
            path: ['forecast', 'csbCases', 'uppci'],
            periods: getLastThreeMonths(),
            dataElement: DIARRHEA.forecast.csbCases.uppci.id
        },
        {
            path: ['forecast', 'comCases', 'avg'],
            periods: getLastThreeMonths(),
            dataElement: DIARRHEA.forecast.comCases.avg.id
        },
        {
            path: ['forecast', 'comCases', 'annualAvg'],
            periods: generateYearArray(),
            dataElement: DIARRHEA.forecast.comCases.avg.id
        },
        {
            path: ['forecast', 'comCases', 'lowci'],
            periods: getLastThreeMonths(),
            dataElement: DIARRHEA.forecast.comCases.lowci.id
        },
        {
            path: ['forecast', 'comCases', 'uppci'],
            periods: getLastThreeMonths(),
            dataElement: DIARRHEA.forecast.comCases.uppci.id
        },
    ]

    return { forecastElements }
}

export default getDiarrheaForecast
