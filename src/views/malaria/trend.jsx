import { useDataEngine } from '@dhis2/app-runtime'
import {
    CalendarMonth as CalendarIcon,
    Tune as FilterIcon,
    Download as DownloadIcon,
} from '@mui/icons-material'
import {
    Skeleton,
    Typography,
    Button,
    CircularProgress,
    Box,
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import DataTable from '../../components/DataTable'
import HelpButton from '../../components/HelpButton'
import SearchInput from '../../components/SearchInput'
import StatisticCard from '../../components/StatisticCard'
import ToggleButton from '../../components/ToggleButton'
import { currentPeriod } from '../../constants/config'
import { HEALTH } from '../../constants/mapping'
import {
    setMalariaMean,
    setMalariaLower,
    setMalariaUpper,
    setCombinedData,
} from '../../redux/malariaSlice'
import { combineData } from '../../utils/formating'
import {
    constructDimensions,
    mapRowToDetails,
    createParams,
    createQuery,
} from '../../utils/request'
import { sampleData } from './data'
import style from './malariaDashboard.module.scss'

const mean = HEALTH.malariaMean
const lower = HEALTH.malariaLower
const upper = HEALTH.malariaUpper

const helpText = `
    Aliquam eget finibus ante, non facilisis lectus. Sed vitae dignissim est, vel aliquam tellus.
    Praesent non nunc mollis, fermentum neque at, semper arcu.
    Nullam eget est sed sem iaculis gravida eget vitae justo.
`

const MalariaTrend = () => {
    const [loading, setLoading] = useState(true)
    const [locationList, setLocationList] = useState([])
    const [activeLocation, setActiveLocation] = useState(null)
    const [activeHealthMetric, setActiveHealthMetric] = useState(null)
    const [adminDivisionType, setAdminDivisionType] = useState()

    const municipalities = useSelector((state) => state.orgUnit.municipalities)
    const fokontanyList = useSelector((state) => state.orgUnit.fokontanyList)
    const orgUnitsId = useSelector((state) => state.orgUnit.orgUnitsId)
    const ageClasses = useSelector((state) => state.appSettings.ageClasses)

    const meanData = useSelector((state) => state.malaria.malariaMean)
    const lowerData = useSelector((state) => state.malaria.malariaLower)
    const upperData = useSelector((state) => state.malaria.malariaUpper)
    const combinedData = useSelector((state) => state.malaria.combinedData)

    const engine = useDataEngine()
    const dispatch = useDispatch()

    const categoryCombo = ageClasses[1]
    const periods = currentPeriod
    const orgUnits = orgUnitsId

    const meanParams = createParams(mean.id, categoryCombo, periods, orgUnits)
    const lowerParams = createParams(lower.id, categoryCombo, periods, orgUnits)
    const upperParams = createParams(upper.id, categoryCombo, periods, orgUnits)

    const meanDimensions = constructDimensions(meanParams)
    const lowerDimensions = constructDimensions(lowerParams)
    const upperDimensions = constructDimensions(upperParams)

    const meanQuery = createQuery(meanDimensions)
    const lowerQuery = createQuery(lowerDimensions)
    const upperQuery = createQuery(upperDimensions)

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

    const fetchData = async (query, action) => {
        try {
            const { data } = await engine.query(query)
            const { items } = data.metaData
            const rows = data.rows
            const payload = rows.map((row) => mapRowToDetails(row, items))
            dispatch(action(payload))
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        const loadData = async () => {
            if (!meanData) {
                await fetchData(meanQuery, setMalariaMean)
            }
            if (!lowerData) {
                await fetchData(lowerQuery, setMalariaLower)
            }
            if (!upperData) {
                await fetchData(upperQuery, setMalariaUpper)
            }
            setLoading(false)
        }
        loadData()
    }, [engine, meanQuery, lowerQuery, upperQuery, dispatch])

    useEffect(() => {
        if (!combinedData && fokontanyList) {
            if (meanData && lowerData && upperData) {
                const dataArrays = [lowerData, meanData, upperData]
                const flattenedArray = dataArrays.flat()
                const combinedData = combineData(flattenedArray, fokontanyList)
                dispatch(setCombinedData(combinedData))
            }
        }
    }, [engine, meanData, lowerData, upperData, fokontanyList, dispatch])

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
            <div className={style.chartSection}>
                <Skeleton height={400} />
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
                <DataTable data={combinedData} />
            </div>
        </div>
    )
}

export default MalariaTrend
