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
    fetchMean2016,
    fetchLower2016,
    fetchUpper2016
} from '../../redux/malariaSlice'
import { generateYearMonths } from '../../utils/format-time'
import { combineData, addValues, combineValuesByOrgUnits } from '../../utils/formating'
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
    const [adminDivisionType, setAdminDivisionType] = useState()
    const [activeOrgUnit, setActiveOrgUnit] = useState(null)
    const [activeOrgUnitName, setActiveOrgUnitName] = useState('Ifanadiana')

    const [_2021Data, set_2021Data] = useState(null)
    const [_2022Data, set_2022Data] = useState(null)
    const [_2023Data, set_2023Data] = useState(null)
    // const [_meanData, set_meanData] = useState(null)
    const [_maxData, set_maxData] = useState(null)
    const [_minData, set_minData] = useState(null)

    const engine = useDataEngine()
    const dispatch = useDispatch()

    const municipalities = useSelector((state) => state.orgUnit.municipalities)
    const fokontanyList = useSelector((state) => state.orgUnit.fokontanyList)
    const orgUnits = useSelector((state) => state.orgUnit.orgUnitsId)

    const meanData = useSelector((state) => state.malaria.malariaMean)
    const lowerData = useSelector((state) => state.malaria.malariaLower)
    const upperData = useSelector((state) => state.malaria.malariaUpper)

    const malaria_2016 = useSelector((state) => state.malaria.malaria_2016)
    const malaria_2017 = useSelector((state) => state.malaria.malaria_2017)
    const malaria_2018 = useSelector((state) => state.malaria.malaria_2018)

    const mean_2016 = useSelector((state) => state.malaria.mean_2016)
    const lower_2016 = useSelector((state) => state.malaria.lower_2016)
    const upper_2016 = useSelector((state) => state.malaria.upper_2016)

    const fktToMunicipalities = useSelector((state) => state.orgUnit.fktToMunicipalities)

    const categoryCombo = 'FJJdoeFmC9H' // classe d'age moins de 5 ans

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

    const _2016MeanParams = createParams(
        mean.id,
        categoryCombo,
        _2016Periods, 
        orgUnits
    )

    const _2016LowerParams = createParams(
        lower.id,
        categoryCombo,
        _2016Periods, 
        orgUnits
    )

    const _2016UpperParams = createParams(
        upper.id,
        categoryCombo,
        _2016Periods, 
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
        if (!mean_2016) {
            dispatch(fetchMean2016({ params: _2016MeanParams, engine }))
        }
        if (!lower_2016) {
            dispatch(fetchLower2016({ params: _2016LowerParams, engine }))
        }
        if (!upper_2016) {
            dispatch(fetchUpper2016({ params: _2016UpperParams, engine }))
        }
    }, [dispatch, engine])

    useEffect(() => {
        if (
            !meanData ||
            !lowerData ||
            !upperData ||
            !malaria_2016 ||
            !malaria_2017 ||
            !malaria_2018 ||
            !mean_2016 ||
            !lower_2016 ||
            !upper_2016 
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
        mean_2016,
        lower_2016,
        upper_2016
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

    useEffect(() => {
        if (activeOrgUnit) {
            set_2021Data(combineValuesByOrgUnits(activeOrgUnit, malaria_2016))
            set_2022Data(combineValuesByOrgUnits(activeOrgUnit, malaria_2017))
            set_2023Data(combineValuesByOrgUnits(activeOrgUnit, malaria_2018))
            set_minData(combineValuesByOrgUnits(activeOrgUnit, lower_2016))
            set_maxData(combineValuesByOrgUnits(activeOrgUnit, upper_2016))
        }
    }, [activeOrgUnit])

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
                data: _2021Data ? _2021Data : malaria_2016 ? addValues(orgUnits, malaria_2016) : [],
                borderColor: COLORS.primary_text,
                backgroundColor: COLORS.primary_text,
                tension: 0.25,
            },
            {
                fill: false,
                label: '2022',
                data: _2022Data ? _2022Data : malaria_2017 ? addValues(orgUnits, malaria_2017) : [],
                borderColor: COLORS.green,
                backgroundColor: COLORS.green,
                tension: 0.25,
            },
            {
                fill: false,
                label: '2023',
                data: _2023Data ? _2023Data : malaria_2018 ? addValues(orgUnits, malaria_2018) : [],
                borderColor: COLORS.red_chart_line,
                backgroundColor: COLORS.red_chart_line,
                tension: 0.25
            },
            {
                fill: 0,
                label: 'Maximum',
                data: _maxData ? _maxData : upper_2016 ? addValues(orgUnits, upper_2016) : [],
                borderColor: 'transparent',
                backgroundColor: 'rgb(0, 0, 0, 0.2)',
                tension: 0.25,
                pointRadius: 0,
                type: 'line'
            },
            {
                fill: 0,
                label: 'Minimum',
                data: _minData ? _minData : lower_2016 ? addValues(orgUnits, lower_2016) : [],
                borderColor: 'transparent',
                backgroundColor: 'rgb(0, 0, 0, 0.2)',
                tension: 0.25,
                pointRadius: 0,
                type: 'line'
            }
        ],
    }

    const getFokontanyIds = (data, { displayName, id }) => {
        const key = `${displayName}-${id}`
        if (data[key]) {
          return data[key].combinedChildren.map(child => child.id)
        } else {
          return []
        }
      }

    const setHealthMetric = (value) => {
        console.error(`Health Metric: ${value}`)
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
        console.error(value);
        if (adminDivisionType === 'municipality' && value) {
            const fokontanyIds = getFokontanyIds(fktToMunicipalities, value)
            setActiveOrgUnit(fokontanyIds)
            setActiveOrgUnitName(value.displayName)
        } else if (adminDivisionType === 'fokontany' && value) {
            setActiveOrgUnit([value.id])
            setActiveOrgUnitName(value.displayName)
        } else {
            if (!value) {
                setActiveOrgUnit(orgUnits),
                setActiveOrgUnitName('Ifanadiana')
            } else {
                console.error(`adminDivisionType as ${adminDivisionType} is not available` );
            }
        }
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
                        <div className={style.lineChartTitle}>
                            { activeOrgUnitName === 'Ifanadiana' && <span>Cas détécté dans le district de IFANADIANA</span> }
                            { activeOrgUnitName !== 'Ifanadiana' && adminDivisionType === 'municipality' && <span>Cas détécté dans la commune de { activeOrgUnitName }</span> }
                            { activeOrgUnitName !== 'Ifanadiana' && adminDivisionType === 'fokontany' && <span>Cas détécté dans le fokontany de { activeOrgUnitName }</span> } 
                        </div>
                        <div className={style.lineChart}>
                            <LineChart data={data} />
                            <div className={style.lineChartLegends}>

                            </div>
                        </div>
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
