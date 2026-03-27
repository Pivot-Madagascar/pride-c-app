
import { DIARRHEA } from '@/constants/mapping'
import { getMonthYYYYMM } from '@/utils/format-time'

const getDiarrheaIndicator = () => {
    const indicatorElements = [
        {
            path: ['alert', 'csb'],
            periods: [getMonthYYYYMM()],
            dataElement: DIARRHEA.alert.csb.id
        },
        {
            path: ['alert', 'comCases'],
            periods: [getMonthYYYYMM()],
            dataElement: DIARRHEA.alert.comCases.id
        },
        {
            path: ['alert', 'incidence'],
            periods: [getMonthYYYYMM()],
            dataElement: DIARRHEA.alert.incidence.id
        },
        {
            path: ['alert', 'csbVigilance'],
            periods: [getMonthYYYYMM()],
            dataElement: DIARRHEA.alert.csbVigilance.id
        },
        {
            path: ['compare', 'trend'],
            periods: [getMonthYYYYMM()],
            dataElement: DIARRHEA.compare.trend.id
        },
        {
            path: ['compare', 'csb'],
            periods: [getMonthYYYYMM()],
            dataElement: DIARRHEA.compare.csb.id
        },
        {
            path: ['compare', 'comCases'],
            periods: [getMonthYYYYMM()],
            dataElement: DIARRHEA.compare.comCases.id
        },
        {
            path: ['compare', 'incidence'],
            periods: [getMonthYYYYMM()],
            dataElement: DIARRHEA.compare.incidence.id
        }
    ]
    return {
        indicatorElements,
    }
}
export default getDiarrheaIndicator
