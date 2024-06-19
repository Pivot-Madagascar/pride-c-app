import { useDataEngine } from '@dhis2/app-runtime'
import {
    CalendarMonth as CalendarIcon,
    Tune as FilterIcon,
    Download as DownloadIcon,
} from '@mui/icons-material'
import { CircularProgress, Button, Typography, Box } from '@mui/material'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import DataTable from '../../components/DataTable'
import HelpButton from '../../components/HelpButton'
import LineChart from '../../components/LineChart'
import SearchInput from '../../components/SearchInput'
import StatisticCard from '../../components/StatisticCard'
import ToggleButton from '../../components/ToggleButton'
import CustomSlider from '../../components/Slider'
import Modal from '../../components/Modal'
import Map from '../../components/Map'
import { currentPeriod, sliderMarks } from '../../constants/config'
import { HEALTH } from '../../constants/mapping'
import COLORS from '../../constants/styles'
import {
    setDiarrheaDataTable,
    fetchDiarrheaMean,
    fetchDiarrheaLower,
    fetchDiarrheaUpper,
    fetchDiarrhea2016,
    fetchDiarrhea2017,
    fetchDiarrhea2018,
    fetchMean2016,
    fetchLower2016,
    fetchUpper2016,
} from '../../redux/diarrheaSlice'
import { generateYearMonths } from '../../utils/format-time'
import {
    combineData,
    addValues,
    combineValuesByOrgUnits,
} from '../../utils/formating'
import { createParams } from '../../utils/request'
import { sample } from './data'
import style from './diarrheaDashboard.module.scss'

const helpText = `
    Aliquam eget finibus ante, non facilisis lectus. Sed vitae dignissim est, vel aliquam tellus.
    Praesent non nunc mollis, fermentum neque at, semper arcu.
    Nullam eget est sed sem iaculis gravida eget vitae justo.
`

const helpText_1 = `
Utilisez ces boutons et le menu déroulant pour sélectionner les indicateurs, 
les classes d'âge et les zones administratives qui vous intéressent. Le taux d'incidence est affiché 
comme le nombre de cas pour 10 000 personnes. Seul le paludisme aura des données pour la classe d'âge 
des plus de 5 ans.`

const helpText_2 = `
L'indicateur que vous avez sélectionné est affiché dans ces visualisations.
<br />
<br />
La carte de gauche affiche l'indicateur prédit par le fokontany pour les trois mois à venir. 
Vous pouvez passer d'un mois à l'autre à l'aide de la barre de défilement située en bas.
<br />
<br />
Le graphique montre une série temporel de l'indicateur pour la zone administrative choisie. 
Les données historiques sont représentées par la ligne continue et la période de prévision 
correspond aux trois mois à venir, avec un intervalle de confiance entourant les prévisions.

`



const mean = HEALTH.diarrheaMean
const lower = HEALTH.diarrheaLower
const upper = HEALTH.diarrheaUpper

const DiarrheaTrend = () => {
    const [loading, setLoading] = useState(true)
    const [locationList, setLocationList] = useState([])
    const [adminDivisionType, setAdminDivisionType] = useState()
    const [activeOrgUnit, setActiveOrgUnit] = useState(null)
    const [lineChartTitle, setLineChartTitle] = useState(
        `Cas détécté dans le district d'Ifanadiana`
    )
    const [highlightedOrgUnits, sethighlightedOrgUnits] = useState([])
    const [mapPeriodId, setMapPeriodId] = useState(0)
    const [openModal, setOpenModal] = useState(false)
    const [modalContent, setModalContent] = useState('')
    const [yearData, setYearData] = useState({
        2021: null,
        2022: null,
        2023: null,
    })
    const [minMaxData, setMinMaxData] = useState({ min: null, max: null })

    const engine = useDataEngine()
    const dispatch = useDispatch()

    const municipalities = useSelector((state) => state.orgUnit.municipalities)
    const fokontanyList = useSelector((state) => state.orgUnit.fokontanyList)
    const orgUnits = useSelector((state) => state.orgUnit.orgUnitsId)

    const meanData = useSelector((state) => state.diarrhea.diarrheaMean)
    const lowerData = useSelector((state) => state.diarrhea.diarrheaLower)
    const upperData = useSelector((state) => state.diarrhea.diarrheaUpper)

    const diarrhea_2016 = useSelector((state) => state.diarrhea.diarrhea_2016)
    const diarrhea_2017 = useSelector((state) => state.diarrhea.diarrhea_2017)
    const diarrhea_2018 = useSelector((state) => state.diarrhea.diarrhea_2018)

    const mean_2016 = useSelector((state) => state.diarrhea.mean_2016)
    const lower_2016 = useSelector((state) => state.diarrhea.lower_2016)
    const upper_2016 = useSelector((state) => state.diarrhea.upper_2016)

    const fktToMunicipalities = useSelector(
        (state) => state.orgUnit.fktToMunicipalities
    )

    const categoryCombo = 'FJJdoeFmC9H' // classe d'age moins de 5 ans

    const periods = useMemo(
        () => ({
            2016: generateYearMonths(2016),
            2017: generateYearMonths(2017),
            2018: generateYearMonths(2018),
        }),
        []
    )

    const params = useMemo(
        () => ({
            mean: createParams(mean.id, categoryCombo, currentPeriod, orgUnits),
            lower: createParams(
                lower.id,
                categoryCombo,
                currentPeriod,
                orgUnits
            ),
            upper: createParams(
                upper.id,
                categoryCombo,
                currentPeriod,
                orgUnits
            ),
            2016: createParams(mean.id, categoryCombo, periods[2016], orgUnits),
            2017: createParams(mean.id, categoryCombo, periods[2017], orgUnits),
            2018: createParams(mean.id, categoryCombo, periods[2018], orgUnits),
            '2016Mean': createParams(
                mean.id,
                categoryCombo,
                periods[2016],
                orgUnits
            ),
            '2016Lower': createParams(
                lower.id,
                categoryCombo,
                periods[2016],
                orgUnits
            ),
            '2016Upper': createParams(
                upper.id,
                categoryCombo,
                periods[2016],
                orgUnits
            ),
        }),
        [categoryCombo, orgUnits, periods]
    )

    const dataTableData = useSelector((state) => state.diarrhea.dataTableData)

    useEffect(() => {
        if (!meanData)
            dispatch(fetchDiarrheaMean({ params: params.mean, engine }))
        if (!lowerData)
            dispatch(fetchDiarrheaLower({ params: params.lower, engine }))
        if (!upperData)
            dispatch(fetchDiarrheaUpper({ params: params.upper, engine }))
        if (!diarrhea_2016)
            dispatch(fetchDiarrhea2016({ params: params['2016'], engine }))
        if (!diarrhea_2017)
            dispatch(fetchDiarrhea2017({ params: params['2017'], engine }))
        if (!diarrhea_2018)
            dispatch(fetchDiarrhea2018({ params: params['2018'], engine }))
        if (!mean_2016)
            dispatch(fetchMean2016({ params: params['2016Mean'], engine }))
        if (!lower_2016)
            dispatch(fetchLower2016({ params: params['2016Lower'], engine }))
        if (!upper_2016)
            dispatch(fetchUpper2016({ params: params['2016Upper'], engine }))
    }, [
        dispatch,
        engine,
        meanData,
        lowerData,
        upperData,
        diarrhea_2016,
        diarrhea_2017,
        diarrhea_2018,
        mean_2016,
        lower_2016,
        upper_2016,
        params,
    ])

    useEffect(() => {
        setLoading(
            !meanData ||
                !lowerData ||
                !upperData ||
                !diarrhea_2016 ||
                !diarrhea_2017 ||
                !diarrhea_2018 ||
                !mean_2016 ||
                !lower_2016 ||
                !upper_2016
        )
    }, [
        meanData,
        lowerData,
        upperData,
        diarrhea_2016,
        diarrhea_2017,
        diarrhea_2018,
        mean_2016,
        lower_2016,
        upper_2016,
    ])

    useEffect(() => {
        if (
            !dataTableData &&
            fokontanyList &&
            meanData &&
            lowerData &&
            upperData
        ) {
            const combinedData = combineData(
                [lowerData, meanData, upperData].flat(),
                fokontanyList
            )
            dispatch(setDiarrheaDataTable(combinedData))
        }
    }, [meanData, lowerData, upperData, fokontanyList, dispatch, dataTableData])

    useEffect(() => {
        if (activeOrgUnit) {
            setYearData({
                2021: combineValuesByOrgUnits(activeOrgUnit, diarrhea_2016),
                2022: combineValuesByOrgUnits(activeOrgUnit, diarrhea_2017),
                2023: combineValuesByOrgUnits(activeOrgUnit, diarrhea_2018),
            })
            setMinMaxData({
                min: combineValuesByOrgUnits(activeOrgUnit, lower_2016),
                max: combineValuesByOrgUnits(activeOrgUnit, upper_2016),
            })
        }
    }, [
        activeOrgUnit,
        diarrhea_2016,
        diarrhea_2017,
        diarrhea_2018,
        lower_2016,
        upper_2016,
    ])

    const labels = useMemo(
        () => [
            'Janv',
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
        ],
        []
    )

    const data = useMemo(
        () => ({
            labels,
            datasets: [
                {
                    fill: false,
                    label: '2024',
                    data:
                        yearData[2021] ||
                        (diarrhea_2016
                            ? addValues(orgUnits, diarrhea_2016)
                            : []),
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                },
                {
                    fill: false,
                    label: '2022',
                    data:
                        yearData[2022] ||
                        (diarrhea_2017
                            ? addValues(orgUnits, diarrhea_2017)
                            : []),
                    borderColor: COLORS.green,
                    backgroundColor: COLORS.green,
                    tension: 0.25,
                    hidden: false,
                },
                {
                    fill: false,
                    label: '2023',
                    data:
                        yearData[2023] ||
                        (diarrhea_2018
                            ? addValues(orgUnits, diarrhea_2018)
                            : []),
                    borderColor: COLORS.red_chart_line,
                    backgroundColor: COLORS.red_chart_line,
                    tension: 0.25,
                    hidden: false,
                },
                {
                    fill: 0,
                    label: 'Maximum',
                    data:
                        minMaxData.max ||
                        (upper_2016 ? addValues(orgUnits, upper_2016) : []),
                    borderColor: 'transparent',
                    backgroundColor: 'rgb(0, 0, 0, 0.2)',
                    tension: 0.25,
                    pointRadius: 0,
                    type: 'line',
                    hidden: false,
                },
                {
                    fill: 0,
                    label: 'Minimum',
                    data:
                        minMaxData.min ||
                        (lower_2016 ? addValues(orgUnits, lower_2016) : []),
                    borderColor: 'transparent',
                    backgroundColor: 'rgb(0, 0, 0, 0.2)',
                    tension: 0.25,
                    pointRadius: 0,
                    type: 'line',
                    hidden: false,
                },
            ],
        }),
        [
            labels,
            yearData,
            minMaxData,
            diarrhea_2016,
            diarrhea_2017,
            diarrhea_2018,
            upper_2016,
            lower_2016,
            orgUnits,
        ]
    )

    const getFokontanyIds = useCallback((data, { displayName, id }) => {
        const key = `${displayName}-${id}`
        return data[key]?.combinedChildren.map((child) => child.id) || []
    }, [])

    const setHealthMetric = useCallback((value) => {
        console.log(`Health Metric: ${value}`)
    }, [])

    const setAgeClass = useCallback((value) => {
        console.log(`Age Class: ${value}`)
    }, [])

    const setAdministrativeDivision = useCallback(
        (value) => {
            setAdminDivisionType(value)
            setLocationList(
                value === 'fokontany' ? fokontanyList : municipalities
            )
        },
        [fokontanyList, municipalities]
    )

    const setCurrentLocation = useCallback(
        (value) => {
            if (adminDivisionType === 'municipality' && value) {
                const fokontanyIds = getFokontanyIds(fktToMunicipalities, value)
                setActiveOrgUnit(fokontanyIds)
                sethighlightedOrgUnits(fokontanyIds)
                setLineChartTitle(
                    `Cas détécté dans la commune de ${value.displayName}`
                )
            } else if (adminDivisionType === 'fokontany' && value) {
                setActiveOrgUnit([value.id])
                sethighlightedOrgUnits([value.id])
                setLineChartTitle(
                    `Cas détécté dans le fokontany de ${value.displayName}`
                )
            } else {
                if (!value) {
                    setActiveOrgUnit(orgUnits)
                    sethighlightedOrgUnits([])
                    setLineChartTitle(
                        `Cas détécté dans le district d'Ifanadiana`
                    )
                } else {
                    console.error(
                        `adminDivisionType as ${adminDivisionType} is not available`
                    )
                }
            }
        },
        [adminDivisionType, orgUnits, fktToMunicipalities, getFokontanyIds]
    )

    const handleMapData = (event) => {
        setMapPeriodId(event)
    }

    const handleHelpBtnClick = (value) => {
        setOpenModal(value.open)
        setModalContent(value.content)
    }

    const resetModal = () => {
        setOpenModal(false)
        setModalContent('')
    }

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
            >
                <CircularProgress />
            </Box>
        )
    }

    return (
        <div className="container" style={{ marginTop: -80 }}>
            <div className={style.statisticsSection}>
                {sample.trends.map((item, index) => (
                    <StatisticCard
                        key={index}
                        item={item}
                        className={style.singleCard}
                        bgColor={sample.currentThemeColor}
                    />
                ))}
            </div>
            <div className={style.filterSection}>
                <ToggleButton
                    options={sample.healthMetrics}
                    bgColor={sample.currentThemeColor}
                    onSelect={setHealthMetric}
                />
                <ToggleButton
                    options={sample.ageClasses}
                    bgColor={sample.currentThemeColor}
                    onSelect={setAgeClass}
                />
                <ToggleButton
                    options={sample.adminitrativeDivisions}
                    bgColor={sample.currentThemeColor}
                    onSelect={setAdministrativeDivision}
                />
                <SearchInput
                    borderColor={sample.currentThemeColor}
                    options={locationList}
                    adminDivisionType={adminDivisionType}
                    onSelect={setCurrentLocation}
                />
                <HelpButton
                    bgColor={sample.currentThemeColor}
                    text={helpText_1}
                    onClick={handleHelpBtnClick}
                />
            </div>
            <div className={style.visualization}>
                <div className={style.chartSection}>
                    <div className={style.mapContainer}>
                        <Map
                            data={dataTableData}
                            colors={sample.mapColors}
                            highlightedOrgUnitIds={highlightedOrgUnits}
                            periodId={mapPeriodId}
                            adminDivisionType={adminDivisionType}
                        />
                        <CustomSlider
                            color={COLORS.red_light}
                            marks={sliderMarks}
                            onChange={handleMapData}
                        />
                    </div>
                    <div className={style.lineChartContainer}>
                        <LineChart
                            data={data}
                            title={lineChartTitle}
                            xAxisText="Mois"
                            yAxisText="Nombre de cas"
                        />
                    </div>
                </div>
                <HelpButton
                    bgColor={sample.currentThemeColor}
                    text={helpText_2}
                    onClick={handleHelpBtnClick}
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
                        bgColor={sample.currentThemeColor}
                        text={helpText}
                        onClick={handleHelpBtnClick}
                    />
                </div>
                <DataTable data={dataTableData} />
                <Modal
                    open={openModal}
                    handleClose={resetModal}
                    content={modalContent}
                />
            </div>
        </div>
    )
}

export default DiarrheaTrend
