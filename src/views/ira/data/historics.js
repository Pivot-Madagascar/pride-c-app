import { IRA } from "../../../constants/mapping"
import { generateYearMonths } from "../../../utils/format-time"

const getIraHistoric = () => {
    const historicElements = [
        {
            dataElement: IRA.historic.adjusted.id,
            path: ['historic', 'adjusted'],
            periods: [
                ...generateYearMonths(2016),
                ...generateYearMonths(2017),
                ...generateYearMonths(2018)
            ]
        },
        {
            dataElement: IRA.historic.csbCases.id,
            path: ['historic', 'csbCases'],
            periods: [
                ...generateYearMonths(2021),
                ...generateYearMonths(2022),
                ...generateYearMonths(2023),
            ]
        },
        {
            dataElement: IRA.historic.comCases.id,
            path: ['historic', 'comCases'],
            periods: [
                ...generateYearMonths(2020), 
                ...generateYearMonths(2021), 
                ...generateYearMonths(2022)
            ]
        },
        // simulation (from 2022 to 2024)
        {
            dataElement: IRA.forecast.adjusted.avg.id,
            path: ['historic', 'adjusted'],
            periods: [
                ...generateYearMonths(2022),
                ...generateYearMonths(2023),
                ...generateYearMonths(2024)
            ]
        },
    ]

    return { historicElements }
}

export default getIraHistoric
