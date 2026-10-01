import React from 'react'
import BacteriaIcon from '@/components/Icons/Bacteria'
import COLORS from '@/constants/styles'
import baseSample from '@/constants/diseaseSample'

export const sample = {
    ...baseSample,
    title: 'Maladie Diarrhéique',
    statisticCard: {
        ...baseSample.statisticCard,
        title: 'Nombre de cas ajustés de maladie diarrhéique, selon les prévisions',
        comparison: 0,
        icon: (props) => <BacteriaIcon {...props} />,
    },
    themeColor: COLORS.green_lighter,
    mapColors: [
        '#f3ff90',
        '#defb82',
        '#c9f774',
        '#b4f366',
        '#a0ef58',
        '#8bea4a',
        '#76e63c',
        '#61e22e',
        '#4cde20',
        '#37da12',
        '#2bcd12',
        '#1fb010',
        '#059212',
    ],
}