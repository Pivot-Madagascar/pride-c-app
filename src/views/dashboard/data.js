import COLORS from '../../constants/styles'

export const sampleData = {
    healthMetrics: [
        {
            title: 'Paludisme',
            incidences: 70000,
            totalCase: 86000,
            trend: 34,
            bgColor: COLORS.red,
            fontSize: 2,
            href: 'malaria-trend',
        },
        {
            title: 'Maladies diarrheiques',
            incidences: 50000,
            totalCase: 72500,
            trend: 7,
            bgColor: COLORS.green,
            fontSize: 1.5,
            href: 'diarrhea-trend',
        },
        {
            title: 'IRA',
            incidences: 15020,
            totalCase: 3150,
            trend: 58,
            bgColor: COLORS.blue,
            fontSize: 2,
            href: 'ira-trend',
        },
    ],
}
