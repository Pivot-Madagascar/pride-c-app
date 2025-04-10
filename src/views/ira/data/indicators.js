
import { IRA } from '../../../constants/mapping'
import { getMonthYYYYMM } from '../../../utils/format-time'

const getIraIndicator = () => {
    const indicatorElements = [
        {
            path: ['alert', 'csb'],
            periods: [getMonthYYYYMM()],
            dataElement: IRA.alert.csb.id
        },
        {
            path: ['alert', 'comCases'],
            periods: [getMonthYYYYMM()],
            dataElement: IRA.alert.comCases.id
        },
        {
            path: ['alert', 'incidence'],
            periods: [getMonthYYYYMM()],
            dataElement: IRA.alert.incidence.id
        },
        {
            path: ['alert', 'csbVigilance'],
            periods: [getMonthYYYYMM()],
            dataElement: IRA.alert.csbVigilance.id
        },
        {
            path: ['compare', 'trend'],
            periods: [getMonthYYYYMM()],
            dataElement: IRA.compare.trend.id
        },
        {
            path: ['compare', 'csb'],
            periods: [getMonthYYYYMM()],
            dataElement: IRA.compare.csb.id
        },
        {
            path: ['compare', 'comCases'],
            periods: [getMonthYYYYMM()],
            dataElement: IRA.compare.comCases.id
        },
        {
            path: ['compare', 'incidence'],
            periods: [getMonthYYYYMM()],
            dataElement: IRA.compare.incidence.id
        }
    ]
    return {
        indicatorElements,
    }
}
export default getIraIndicator
