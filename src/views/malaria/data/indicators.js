
import { MALARIA } from '../../../constants/mapping'
import { getMonthYYYYMM } from '../../../utils/format-time'

const getMalariaIndicator = () => {
    const indicatorElements = [
        {
            path: ['alert', 'csb'],
            periods: [getMonthYYYYMM()],
            dataElement: MALARIA.alert.csb.id
        },
        {
            path: ['alert', 'comCases'],
            periods: [getMonthYYYYMM()],
            dataElement: MALARIA.alert.comCases.id
        },
        {
            path: ['alert', 'incidence'],
            periods: [getMonthYYYYMM()],
            dataElement: MALARIA.alert.incidence.id
        },
        {
            path: ['alert', 'csbVigilance'],
            periods: [getMonthYYYYMM()],
            dataElement: MALARIA.alert.csbVigilance.id
        },
        {
            path: ['compare', 'trend'],
            periods: [getMonthYYYYMM()],
            dataElement: MALARIA.compare.trend.id
        },
        {
            path: ['compare', 'csb'],
            periods: [getMonthYYYYMM()],
            dataElement: MALARIA.compare.csb.id
        },
        {
            path: ['compare', 'comCases'],
            periods: [getMonthYYYYMM()],
            dataElement: MALARIA.compare.comCases.id
        },
        {
            path: ['compare', 'incidence'],
            periods: [getMonthYYYYMM()],
            dataElement: MALARIA.compare.incidence.id
        }
    ]
    return {
        indicatorElements,
    }
}
export default getMalariaIndicator
