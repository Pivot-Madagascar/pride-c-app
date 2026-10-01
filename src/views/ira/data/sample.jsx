import React from 'react'
import LungVirusIcon from '@/components/Icons/LungsVirus'
import COLORS from '@/constants/styles'
import baseSample from '@/constants/diseaseSample'

export const sample = {
    ...baseSample,
    title: 'Infections Respiratoires Aiguës',
    statisticCard: {
        ...baseSample.statisticCard,
        title: 'Nombre de cas ajustés de IRA, selon les prévisions',
        comparison: 0,
        icon: (props) => <LungVirusIcon {...props} />,
    },
    themeColor: COLORS.blue_lighter,
    mapColors: [
        '#a7e6ff',
        '#94d1f9',
        '#81bcf2',
        '#6ea8ec',
        '#5b93e5',
        '#487edd',
        '#3569d7',
        '#2254d0',
        '#0f40c9',
        '#052fae',
        '#042699',
        '#031e84',
        '#050c9c',
    ],
}