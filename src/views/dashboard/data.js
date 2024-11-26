import COLORS from '../../constants/styles'

export const sampleData = {
    healthMetrics: [
        {
            title: 'Paludisme',
            incidences: 6292,
            totalCase: 7453,
            trend: 90.1,
            bgColor: COLORS.red,
            fontSize: 2,
            href: 'malaria-trend',
        },
        {
            title: 'Maladies diarrheiques',
            incidences: 2249,
            totalCase: 536,
            trend: 21.5,
            bgColor: COLORS.green,
            fontSize: 1.5,
            href: 'diarrhea-trend',
        },
        {
            title: 'IRA',
            incidences: 6183,
            totalCase: 1295,
            trend: 8.5,
            bgColor: COLORS.blue,
            fontSize: 2,
            href: 'ira-trend',
        },
    ],
}
