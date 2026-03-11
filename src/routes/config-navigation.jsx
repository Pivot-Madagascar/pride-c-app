import BacteriaIcon from '../components/Icons/Bacteria'
import DashboardIcon from '../components/Icons/Dashboard'
import HelpIcon from '../components/Icons/Help'
import LungsVirusIcon from '../components/Icons/LungsVirus'
import MosquitoNetIcon from '../components/Icons/Mosquito'
import TrendUpIcon from '../components/Icons/TrendUp'
import WeatherIcon from '../components/Icons/Weather'
import COLORS from '../constants/styles'
import i18n from '../locales'

const navConfig = [
    {
        title: i18n.t('Home'),
        path: '/',
        icon: (props) => <DashboardIcon {...props} />,
        colors: {
            bgColor: COLORS.gray_lighter,
            fontColor: COLORS.primary_text,
        },
    },
    {
        title: i18n.t('Malaria'),
        icon: (props) => <MosquitoNetIcon {...props} />,
        colors: {
            bgColor: COLORS.red_light,
            fontColor: COLORS.red,
        },
        nestedMenu: [
            {
                title: i18n.t('Trends'),
                path: '/malaria-trend',
                icon: (props) => <TrendUpIcon {...props} />,
            },
            {
                title: i18n.t('Climate'),
                path: '/malaria-climate',
                icon: (props) => <WeatherIcon {...props} />,
            },
        ],
    },
    {
        title: i18n.t('Diarrheal Disease'),
        icon: (props) => <BacteriaIcon {...props} />,
        colors: {
            bgColor: COLORS.green_lighter,
            fontColor: COLORS.green,
        },
        nestedMenu: [
            {
                title: i18n.t('Trends'),
                path: '/diarrhea-trend',
                icon: (props) => <TrendUpIcon {...props} />,
            },
            {
                title: i18n.t('Climate'),
                path: '/diarrhea-climate',
                icon: (props) => <WeatherIcon {...props} />,
            },
        ],
    },
    {
        title: i18n.t('Acute Respiratory Infections'),
        icon: (props) => <LungsVirusIcon {...props} />,
        colors: {
            bgColor: COLORS.blue_lighter,
            fontColor: COLORS.blue,
        },
        nestedMenu: [
            {
                title: i18n.t('Trends'),
                path: '/ira-trend',
                icon: (props) => <TrendUpIcon {...props} />,
            },
            {
                title: i18n.t('Climate'),
                path: '/ira-climate',
                icon: (props) => <WeatherIcon {...props} />,
            },
        ],
    },
    {
        title: i18n.t('Help'),
        path: '/help',
        icon: (props) => <HelpIcon {...props} />,
        colors: {
            bgColor: COLORS.gray_lighter,
            fontColor: COLORS.primary_text,
        },
    },
]

export default navConfig
