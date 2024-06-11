import { useDataEngine } from '@dhis2/app-runtime'
import {
    CalendarMonth as CalendarIcon,
    Tune as FilterIcon,
    Download as DownloadIcon,
} from '@mui/icons-material'
import { CircularProgress, Button, Typography, Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import DataTable from '../../components/DataTable'
import HelpButton from '../../components/HelpButton'
import LineChart from '../../components/LineChart'
import SearchInput from '../../components/SearchInput'
import StatisticCard from '../../components/StatisticCard'
import ToggleButton from '../../components/ToggleButton'
import { currentPeriod } from '../../constants/config'
import { HEALTH } from '../../constants/mapping'
import COLORS from '../../constants/styles'
import {
    setMalariaDataTable,
    fetchMalariaMean,
    fetchMalariaLower,
    fetchMalariaUpper,
    fetchMalaria2016,
    fetchMalaria2017,
    fetchMalaria2018,
} from '../../redux/malariaSlice'
import { generateYearMonths } from '../../utils/format-time'
import { combineData, addValues } from '../../utils/formating'
import { createParams } from '../../utils/request'
import { sampleData } from './data'
import style from './malariaDashboard.module.scss'

const helpText = `
    Aliquam eget finibus ante, non facilisis lectus. Sed vitae dignissim est, vel aliquam tellus.
    Praesent non nunc mollis, fermentum neque at, semper arcu.
    Nullam eget est sed sem iaculis gravida eget vitae justo.
`

const mean = HEALTH.malariaMean
const lower = HEALTH.malariaLower
const upper = HEALTH.malariaUpper

const MalariaTrend = () => {
    const [loading, setLoading] = useState(true)
    const [locationList, setLocationList] = useState([])
    const [activeLocation, setActiveLocation] = useState(null)
    const [activeHealthMetric, setActiveHealthMetric] = useState(null)
    const [adminDivisionType, setAdminDivisionType] = useState()

    const engine = useDataEngine()
    const dispatch = useDispatch()

    const municipalities = useSelector((state) => state.orgUnit.municipalities)
    const fokontanyList = useSelector((state) => state.orgUnit.fokontanyList)
    const orgUnits = useSelector((state) => state.orgUnit.orgUnitsId)
    // const ageClasses = useSelector((state) => state.appSettings.ageClasses)

    const meanData = useSelector((state) => state.malaria.malariaMean)
    const lowerData = useSelector((state) => state.malaria.malariaLower)
    const upperData = useSelector((state) => state.malaria.malariaUpper)

    const malaria_2016 = useSelector((state) => state.malaria.malaria_2016)
    const malaria_2017 = useSelector((state) => state.malaria.malaria_2017)
    const malaria_2018 = useSelector((state) => state.malaria.malaria_2018)

    const categoryCombo = 'FJJdoeFmC9H' // moins de 5 ans

    const _2016Periods = generateYearMonths(2016)
    const _2017Periods = generateYearMonths(2017)
    const _2018Periods = generateYearMonths(2018)

    const meanParams = createParams(
        mean.id,
        categoryCombo,
        currentPeriod,
        orgUnits
    )
    const lowerParams = createParams(
        lower.id,
        categoryCombo,
        currentPeriod,
        orgUnits
    )
    const upperParams = createParams(
        upper.id,
        categoryCombo,
        currentPeriod,
        orgUnits
    )

    const _2016Params = createParams(
        mean.id,
        categoryCombo,
        _2016Periods,
        orgUnits
    )
    const _2017Params = createParams(
        mean.id,
        categoryCombo,
        _2017Periods,
        orgUnits
    )
    const _2018Params = createParams(
        mean.id,
        categoryCombo,
        _2018Periods,
        orgUnits
    )

    const dataTableData = useSelector((state) => state.malaria.dataTableData)

    useEffect(() => {
        if (!meanData) {
            dispatch(fetchMalariaMean({ params: meanParams, engine }))
        }
        if (!lowerData) {
            dispatch(fetchMalariaLower({ params: lowerParams, engine }))
        }
        if (!upperData) {
            dispatch(fetchMalariaUpper({ params: upperParams, engine }))
        }
        if (!malaria_2016) {
            dispatch(fetchMalaria2016({ params: _2016Params, engine }))
        }
        if (!malaria_2017) {
            dispatch(fetchMalaria2017({ params: _2017Params, engine }))
        }
        if (!malaria_2018) {
            dispatch(fetchMalaria2018({ params: _2018Params, engine }))
        }
    }, [dispatch, engine])

    useEffect(() => {
        if (
            !meanData ||
            !lowerData ||
            !upperData ||
            !malaria_2016 ||
            !malaria_2017 ||
            !malaria_2018
        ) {
            setLoading(true)
        } else {
            setLoading(false)
        }
    }, [
        meanData,
        lowerData,
        upperData,
        malaria_2016,
        malaria_2017,
        malaria_2018,
    ])

    useEffect(() => {
        if (!dataTableData && fokontanyList) {
            if (meanData && lowerData && upperData) {
                const flattenedArray = [lowerData, meanData, upperData].flat()
                const combinedData = combineData(flattenedArray, fokontanyList)
                dispatch(setMalariaDataTable(combinedData))
            }
        }
    }, [meanData, lowerData, upperData, fokontanyList, dispatch])

    const labels = [
        'Jan',
        'Fev',
        'Mars',
        'Avr',
        'Mai',
        'Juin',
        'Juil',
        'Aout',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
    ]

    const data = {
        labels,
        datasets: [
            {
                fill: false,
                label: '2021',
                data: malaria_2016 ? addValues(orgUnits, malaria_2016) : [],
                borderColor: COLORS.blue,
                backgroundColor: COLORS.blue,
            },
            {
                fill: false,
                label: '2022',
                data: malaria_2017 ? addValues(orgUnits, malaria_2017) : [],
                borderColor: COLORS.green,
                backgroundColor: COLORS.green,
            },
            {
                fill: false,
                label: '2023',
                data: malaria_2018 ? addValues(orgUnits, malaria_2018) : [],
                borderColor: COLORS.red_chart_line,
                backgroundColor: COLORS.red_chart_line,
            },
        ],
    }

    const setHealthMetric = (value) => {
        console.error(`Health Metric: ${value}`)
        setActiveHealthMetric(value)
    }

    const setAgeClass = (value) => {
        console.error(`Age Class: ${value}`)
    }

    const setAdministrativeDivision = (value) => {
        setAdminDivisionType(value)
        if (value === 'fokontany') {
            setLocationList(fokontanyList)
        } else if (value === 'municipality') {
            setLocationList(municipalities)
        }
    }

    const setCurrentLocation = (value) => {
        setActiveLocation(value)
    }

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <CircularProgress />
            </Box>
        )
    }

    return (
        <div className="container">
            <div className={style.statisticsSection}>
                {sampleData.trends.map((item, index) => (
                    <StatisticCard
                        key={index}
                        item={item}
                        className={style.singleCard}
                        bgColor={sampleData.currentThemeColor}
                    />
                ))}
            </div>
            <div className={style.filterSection}>
                <ToggleButton
                    options={sampleData.healthMetrics}
                    bgColor={sampleData.currentThemeColor}
                    onSelect={setHealthMetric}
                />
                <ToggleButton
                    options={sampleData.ageClasses}
                    bgColor={sampleData.currentThemeColor}
                    onSelect={setAgeClass}
                />
                <ToggleButton
                    options={sampleData.adminitrativeDivisions}
                    bgColor={sampleData.currentThemeColor}
                    onSelect={setAdministrativeDivision}
                />
                <SearchInput
                    borderColor={sampleData.currentThemeColor}
                    options={locationList}
                    onSelect={setCurrentLocation}
                    currentValue={locationList[0]}
                />
                <HelpButton
                    bgColor={sampleData.currentThemeColor}
                    text={helpText}
                />
            </div>
            <div className={style.visualization}>
                <div className={style.chartSection}>
                    <div className={style.mapContainer}></div>
                    <div className={style.lineChartContainer}>
                        <LineChart data={data} />
                    </div>
                </div>
                <HelpButton
                    bgColor={sampleData.currentThemeColor}
                    text={helpText}
                />
            </div>
            <div className={style.dataTableSection}>
                <div className={style.dataTableHeaderSection}>
                    <div className={style.dataTableHeader}>
                        <Typography variant="h4">
                            Predictions et tendances
                        </Typography>
                        <div className={style.dataTableFilters}>
                            <Button
                                variant="outlined"
                                startIcon={<CalendarIcon />}
                            >
                                Definir une periode
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<FilterIcon />}
                            >
                                Filtres
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                            >
                                Telecharger
                            </Button>
                        </div>
                    </div>
                    <HelpButton
                        bgColor={sampleData.currentThemeColor}
                        text={helpText}
                    />
                </div>
                <DataTable data={dataTableData} />
            </div>
        </div>
    )
}

export default MalariaTrend
