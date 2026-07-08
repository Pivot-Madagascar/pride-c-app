import React from 'react'
import {
    Bacteria as BacteriaIcon,
    Dashboard as DashboardIcon,
    Help as HelpIcon,
    LungsVirus as LungsVirusIcon,
    Mosquito as MosquitoNetIcon,
    TrendUp as TrendUpIcon,
    Weather as WeatherIcon,
} from '@/components/Icons'
import COLORS from '@/constants/styles'

const navConfig = [
    {
        title: 'Acceuil',
        path: '/',
        icon: (props) => <DashboardIcon {...props} />,
        colors: {
            bgColor: COLORS.gray_lighter,
            fontColor: COLORS.primary_text,
        },
    },
    {
        title: 'Paludisme',
        icon: (props) => <MosquitoNetIcon {...props} />,
        colors: {
            bgColor: COLORS.red_light,
            fontColor: COLORS.red,
        },
        nestedMenu: [
            {
                title: 'Tendances',
                path: '/malaria-trend',
                icon: (props) => <TrendUpIcon {...props} />,
            },
            {
                title: 'Climat',
                path: '/malaria-climate',
                icon: (props) => <WeatherIcon {...props} />,
            },
        ],
    },
    {
        title: 'Maladie diarrheique',
        icon: (props) => <BacteriaIcon {...props} />,
        colors: {
            bgColor: COLORS.green_lighter,
            fontColor: COLORS.green,
        },
        nestedMenu: [
            {
                title: 'Tendances',
                path: '/diarrhea-trend',
                icon: (props) => <TrendUpIcon {...props} />,
            },
            {
                title: 'Climat',
                path: '/diarrhea-climate',
                icon: (props) => <WeatherIcon {...props} />,
            },
        ],
    },
    {
        title: 'IRA',
        icon: (props) => <LungsVirusIcon {...props} />,
        colors: {
            bgColor: COLORS.blue_lighter,
            fontColor: COLORS.blue,
        },
        nestedMenu: [
            {
                title: 'Tendances',
                path: '/ira-trend',
                icon: (props) => <TrendUpIcon {...props} />,
            },
            {
                title: 'Climat',
                path: '/ira-climate',
                icon: (props) => <WeatherIcon {...props} />,
            },
        ],
    },
    {
        title: 'Ressources/ aides',
        path: '/help',
        icon: (props) => <HelpIcon {...props} />,
        colors: {
            bgColor: COLORS.gray_lighter,
            fontColor: COLORS.primary_text,
        },
    },
]

export default navConfig
