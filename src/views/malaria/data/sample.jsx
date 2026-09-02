import React from 'react'
import MosquitoIcon from '@/components/Icons/Mosquito'
import COLORS from '@/constants/styles'
import baseSample from '@/constants/diseaseSample'

export const sample = {
    ...baseSample,
    title: 'Paludisme',
    statisticCard: {
        ...baseSample.statisticCard,
        title: 'Nombre de cas ajustés de paludisme, selon les prévisions',
        comparison: 0,
        icon: (props) => <MosquitoIcon {...props} />,
    },
    themeColor: COLORS.red_light,
    mapColors: [
        '#f5e0e4',
        '#ecc1c9',
        '#e7b1bb',
        '#e2a1ad',
        '#dd92a0',
        '#d98292',
        '#d47384',
        '#cf6377',
        '#ca5369',
        '#c5445c',
        '#bb3a51',
        '#ac354b',
        '#9c3044',
    ],
}