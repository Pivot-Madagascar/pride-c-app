import React, { useMemo, useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import COLORS from '../../constants/styles'
import ForecastDataManager from '../../components/DataManager/ForecastDataManager'
import HistoricDataManager from '../../components/DataManager/HistoricDataManager'
import DataTable from '../../components/DataTable'
import HelpButton from '../../components/HelpButton'
import LineChart from '../../components/LineChart'
import { CircularProgress, Button, Typography, Box } from '@mui/material'
import SearchInput from '../../components/SearchInput'
import StatisticCard from '../../components/StatisticCard'
import ToggleButton from '../../components/ToggleButton'
import Modal from '../../components/Modal'
import { combineData } from '../../utils/formatting'
import CustomSlider from '../../components/Slider'
import Map from '../../components/Map'
import { sample } from './data'
import { sliderMarks } from '../../constants/config'
import style from './malariaDashboard.module.scss'

const helpText = `
    Aliquam eget finibus ante, non facilisis lectus. Sed vitae dignissim est, vel aliquam tellus.
    Praesent non nunc mollis, fermentum neque at, semper arcu.
    Nullam eget est sed sem iaculis gravida eget vitae justo.
`

const helpText_1 = `
    Utilisez ces boutons et le menu déroulant pour sélectionner les indicateurs, 
    les classes d'âge et les zones administratives qui vous intéressent. Le taux d'incidence est affiché 
    comme le nombre de cas pour 10 000 personnes. Seul le paludisme aura des données pour la classe d'âge 
    des plus de 5 ans.
`

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

const district = [{ id: 'VtP4BdCeXIo', displayName: 'Ifanadiana' }]

const MalariaTrend = () => {
    const [loading, setLoading] = useState(true)
    const [locationList, setLocationList] = useState([])
    const [adminDivisionLvl, setAdminDivisionLvl] = useState()
    const [combinedData, setCombinedData] = useState(undefined)
    const [activeOrgUnit, setActiveOrgUnit] = useState(undefined)
    const [openModal, setOpenModal] = useState(false)
    const [modalContent, setModalContent] = useState('')

    const districtOrgUnitIds = district.map((element) => element.id)
    const municipalOrgUnitIds = useSelector(
        (state) => state.orgUnit.municipalities || []
    ).map((element) => element.id)
    const fokontanyOrgUnitIds = useSelector(
        (state) => state.orgUnit.fokontanyList || []
    ).map((element) => element.id)

    const malariaState = useSelector((state) => state.newMalaria)
    const fokontanyList = useSelector((state) => state.orgUnit.fokontanyList)
    const municipalities = useSelector((state) => state.orgUnit.municipalities)

    const getValueFromStore = (state, keys) => {
        return keys.reduce((acc, key) => {
            if (acc && acc[key] !== undefined) {
                return acc[key]
            }
            return undefined
        }, state)
    }

    const getAdjustedData = (type, statType, level) => {
        const path = [type, 'adjusted']
        if (statType) {
            path.push(statType)
        }
        return level
            ? getValueFromStore(malariaState, [...path, level])
            : getValueFromStore(malariaState, [...path, 'data'])
    }

    const historicAdjusted = getAdjustedData('historic')
    const forecastAdjustedAvg = getAdjustedData('forecast', 'avg')
    const forecastAdjustedLowci = getAdjustedData('forecast', 'lowci')
    const forecastAdjustedUppci = getAdjustedData('forecast', 'uppci')

    const forecastAdjustedAvgDistrict = getAdjustedData(
        'forecast',
        'avg',
        'district'
    )
    const forecastAdjustedAvgFokontany = getAdjustedData(
        'forecast',
        'avg',
        'fokontany'
    )
    const forecastAdjustedLowciFokontany = getAdjustedData(
        'forecast',
        'lowci',
        'fokontany'
    )
    const forecastAdjustedUpperciFokontany = getAdjustedData(
        'forecast',
        'uppci',
        'fokontany'
    )

    const setHealthMetric = useCallback((value) => {
        console.log(`Health Metric: ${value}`)
    }, [])

    const setAgeClass = useCallback((value) => {
        console.log(`Age Class: ${value}`)
    }, [])

    const setAdministrativeDivision = useCallback(
        (value) => {
            setAdminDivisionLvl(value)
            setLocationList(
                value === 'fokontany'
                    ? fokontanyList
                    : value === 'municipal'
                    ? municipalities
                    : district
            )
        },
        [fokontanyList, municipalities]
    )

    const handleMapData = (event) => {
        console.log(event);
        // setMapPeriodId(event)
    }

    const convertToFrenchDate = (dateString) => {
        if (!/^\d{6}$/.test(dateString)) {
            throw new Error("Invalid date format. Please use 'YYYYMM'.")
        }

        const year = parseInt(dateString.slice(0, 4), 10)
        const month = parseInt(dateString.slice(4, 6), 10) - 1

        const date = new Date(year, month)

        const options = { year: 'numeric', month: 'long' }
        const formatter = new Intl.DateTimeFormat('fr-FR', options)

        return formatter.format(date)
    }

    const generateNewData = (orgUnits, mean, min, max) => {
        const newData = []
        let idCounter = 1

        orgUnits.forEach((orgUnit) => {
            const { id, displayName, municipality, municipalityId } = orgUnit

            if (mean[id] && min[id] && max[id]) {
                const meanValues = mean[id]
                const minValues = min[id]
                const maxValues = max[id]

                meanValues.forEach((meanEntry, index) => {
                    const period = meanEntry.period
                    const minValue = minValues[index]
                        ? minValues[index].value
                        : null
                    const maxValue = maxValues[index]
                        ? maxValues[index].value
                        : null

                    newData.push({
                        id: idCounter++,
                        period: period,
                        periodName: convertToFrenchDate(period),
                        orgUnit: id,
                        orgUnitName: displayName,
                        municipality: municipality,
                        municipalityId: municipalityId,
                        min: minValue,
                        mean: meanEntry.value,
                        max: maxValue,
                    })
                })
            }
        })

        return newData
    }

    const handleHelpBtnClick = (value) => {
        setOpenModal(value.open)
        setModalContent(value.content)
    }

    const setCurrentLocation = useCallback(
        (value) => {
            if (adminDivisionLvl === 'municipality' && value) {
                setActiveOrgUnit(fokontanyOrgUnitIds)
                // sethighlightedOrgUnits(fokontanyIds)
            } else if (adminDivisionLvl === 'fokontany' && value) {
                setActiveOrgUnit([value.id])
                // sethighlightedOrgUnits([value.id])
                // setLineChartTitle(
                //     `Cas détécté dans le fokontany de ${value.displayName}`
                // )
            } else {
                if (!value) {
                    setActiveOrgUnit(districtOrgUnitIds)
                    // sethighlightedOrgUnits([])
                    // setLineChartTitle(
                    //     `Cas détécté dans le district d'Ifanadiana`
                    // )
                } else {
                    console.error(
                        `adminDivisionType as ${adminDivisionLvl} is not available`
                    )
                }
            }
        },
        [adminDivisionLvl, fokontanyOrgUnitIds]
    )

    useEffect(() => {
        const isDataAvailable = fokontanyList && 
                                forecastAdjustedAvgFokontany && 
                                forecastAdjustedLowciFokontany && 
                                forecastAdjustedUpperciFokontany
        if (isDataAvailable && !combinedData) {
            const formattedData = generateNewData(
                fokontanyList,
                forecastAdjustedAvgFokontany,
                forecastAdjustedLowciFokontany,
                forecastAdjustedUpperciFokontany
            )
            setCombinedData(formattedData)
        }
    }, [
        fokontanyList,
        forecastAdjustedAvgFokontany,
        forecastAdjustedLowciFokontany,
        forecastAdjustedUpperciFokontany,
        combinedData,
        setCombinedData
    ])

    const lineChartData = useMemo(() => {
        const labels = [
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
        ]

        return {
            labels,
            datasets: [
                {
                    fill: false,
                    label: '2016',
                    data: historicAdjusted?.['VtP4BdCeXIo']?.['2016'] || [],
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                },
                {
                    fill: false,
                    label: '2017',
                    data: historicAdjusted?.['VtP4BdCeXIo']?.['2017'] || [],
                    borderColor: COLORS.green,
                    backgroundColor: COLORS.green,
                    tension: 0.25,
                },
                {
                    fill: false,
                    label: '2018',
                    data: historicAdjusted?.['VtP4BdCeXIo']?.['2018'] || [],
                    borderColor: COLORS.red_chart_line,
                    backgroundColor: COLORS.red_chart_line,
                    tension: 0.25,
                },
            ],
        }
    }, [historicAdjusted])

    const forecastElements = [
        {
            forecastType: 'adjusted',
            caseType: 'avg',
            adminLevel: 'district',
            dataElementId: forecastAdjustedAvg.id,
        },
        {
            forecastType: 'adjusted',
            caseType: 'avg',
            adminLevel: 'municipal',
            dataElementId: forecastAdjustedAvg.id,
        },
        {
            forecastType: 'adjusted',
            caseType: 'avg',
            adminLevel: 'fokontany',
            dataElementId: forecastAdjustedAvg.id,
        },
        {
            forecastType: 'adjusted',
            caseType: 'lowci',
            adminLevel: 'district',
            dataElementId: forecastAdjustedLowci.id,
        },
        {
            forecastType: 'adjusted',
            caseType: 'lowci',
            adminLevel: 'municipal',
            dataElementId: forecastAdjustedLowci.id,
        },
        {
            forecastType: 'adjusted',
            caseType: 'lowci',
            adminLevel: 'fokontany',
            dataElementId: forecastAdjustedLowci.id,
        },
        {
            forecastType: 'adjusted',
            caseType: 'uppci',
            adminLevel: 'district',
            dataElementId: forecastAdjustedUppci.id,
        },
        {
            forecastType: 'adjusted',
            caseType: 'uppci',
            adminLevel: 'municipal',
            dataElementId: forecastAdjustedUppci.id,
        },
        {
            forecastType: 'adjusted',
            caseType: 'uppci',
            adminLevel: 'fokontany',
            dataElementId: forecastAdjustedUppci.id,
        },
    ]

    const historicElements = [
        {
            caseType: 'adjusted',
            adminLevel: 'district',
            dataElementId: historicAdjusted.id,
        },
        {
            caseType: 'adjusted',
            adminLevel: 'municipal',
            dataElementId: historicAdjusted.id,
        },
        {
            caseType: 'adjusted',
            adminLevel: 'fokontany',
            dataElementId: historicAdjusted.id,
        },
    ]

    return (
        <div className="container" style={{ marginTop: -80 }}>
            {forecastElements.map((element, index) => (
                <ForecastDataManager
                    key={index}
                    forecastType={element.forecastType}
                    caseType={element.caseType}
                    adminLevel={element.adminLevel}
                    orgUnitIds={
                        element.adminLevel === 'district'
                            ? districtOrgUnitIds
                            : element.adminLevel === 'municipal'
                            ? municipalOrgUnitIds
                            : fokontanyOrgUnitIds
                    }
                    dataElementId={element.dataElementId}
                />
            ))}
            {historicElements.map((element, index) => (
                <HistoricDataManager
                    key={index}
                    caseType={element.caseType}
                    adminLevel={element.adminLevel}
                    orgUnitIds={
                        element.adminLevel === 'district'
                            ? districtOrgUnitIds
                            : element.adminLevel === 'municipal'
                            ? municipalOrgUnitIds
                            : fokontanyOrgUnitIds
                    }
                    dataElementId={element.dataElementId}
                />
            ))}
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
                    adminDivisionType={adminDivisionLvl}
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
                            data={combinedData}
                            colors={sample.mapColors}
                            highlightedOrgUnitIds={[]}
                            periodId={0}
                            adminDivisionType={adminDivisionLvl}
                        />
                        <CustomSlider
                            color={COLORS.red_light}
                            marks={sliderMarks}
                            onChange={handleMapData}
                        />
                    </div>
                    <div className={style.lineChartContainer}>
                        <LineChart
                            data={lineChartData}
                            title={'lineChartTitle'}
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
                    </div>
                    <HelpButton
                        bgColor={sample.currentThemeColor}
                        text={helpText}
                        onClick={handleHelpBtnClick}
                    />
                </div>
                {combinedData && <DataTable data={combinedData} />}
                <Modal
                    open={openModal}
                    handleClose={() => setOpenModal(false)}
                    title="Aide"
                >
                    <div dangerouslySetInnerHTML={{ __html: modalContent }} />
                </Modal>
            </div>
        </div>
    )
}

export default MalariaTrend
