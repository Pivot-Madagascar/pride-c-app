import { useDataEngine } from '@dhis2/app-runtime'
import { Box, CircularProgress } from '@mui/material'
import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { HistoricDataManager } from '../../components'
import ClimateDataSection from '../../components/ClimateDataSection'
import HelpButton from '../../components/HelpButton'
import Modal from '../../components/Modal'
import MultiSelect from '../../components/MultiSelect'
import SearchInput from '../../components/SearchInput'
import ToggleButton from '../../components/ToggleButton'
import { CLIMATE } from '../../constants/mapping'
import COLORS from '../../constants/styles'
import { generateYearMonths } from '../../utils/format-time'
import { generateLabels } from '../../utils/formatting'
import { getStoredData } from '../../utils/storeHelper'
import { sample } from '../malaria/data'
import style from '../malaria/malariaDashboard.module.scss'
import ClimateChart from './ClimateChart'
import { climateData } from './data'

const {
    precipitation,
    temperature,
    vegetationIndex,
    waterSurfaceIndex,
    vegetativeWaterIndex,
    bushfireArea,
    aodAtmLevel,
    floodedRiceFields,
    atmHumidity,
    windSpeed,
} = CLIMATE

const helpText = `
    Aliquam eget finibus ante, non facilisis lectus. Sed vitae dignissim est, vel aliquam tellus.
    Praesent non nunc mollis, fermentum neque at, semper arcu.
    Nullam eget est sed sem iaculis gravida eget vitae justo.
`

const district = [{ id: 'VtP4BdCeXIo', displayName: 'Ifanadiana' }]

const generateMonthYearArray = (startYear) => {
    const monthYearArray = []
    const options = { month: 'short', year: 'numeric' }

    // Get the current date
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() // 0 (Jan) to 11 (Dec)

    // Loop through the years from the start year to the current year
    for (let year = startYear; year <= currentYear; year++) {
        // Determine the last month to include
        const lastMonth = year === currentYear ? currentMonth - 1 : 11 // Stop at the current month - 1 for the current year

        for (let month = 0; month <= lastMonth; month++) {
            const date = new Date(year, month)
            const formattedDate = new Intl.DateTimeFormat(
                'fr-FR',
                options
            ).format(date)
            monthYearArray.push(formattedDate.replace('.', '')) // Remove the dot from the short month name
        }
    }

    return monthYearArray
}

const currentYear = new Date().getFullYear()
const lastThreeYears = [currentYear, currentYear - 2, currentYear - 1]

const climateVariables = [
    { label: precipitation.displayName, value: precipitation.id },
    { label: temperature.displayName, value: temperature.id },
    { label: vegetationIndex.displayName, value: vegetationIndex.id },
    { label: waterSurfaceIndex.displayName, value: waterSurfaceIndex.id },
    { label: bushfireArea.displayName, value: bushfireArea.id },
    { label: vegetativeWaterIndex.displayName, value: vegetativeWaterIndex.id },
    { label: aodAtmLevel.displayName, value: aodAtmLevel.id },
    { label: floodedRiceFields.displayName, value: floodedRiceFields.id },
    { label: windSpeed.displayName, value: windSpeed.id },
]

const ClimateDisplay = ({
    themeColor,
    diseaseHistoricData,
    onSetDiseaseHistoricData,
    activeState,
    sampleData,
}) => {
    const engine = useDataEngine()

    const municipalities = useSelector((state) => state.orgUnit.municipalities)
    const fokontanyList = useSelector((state) => state.orgUnit.fokontanyList)
    const district = useSelector((state) => state.orgUnit.district)
    const orgUnits = useSelector((state) => state.orgUnit.orgUnitsId)

    const districtOrgUnitIds = district.map((element) => element.id)
    const municipalOrgUnitIds = useSelector(
        (state) => state.orgUnit.municipalities || []
    ).map((element) => element.id)
    const fokontanyOrgUnitIds = useSelector(
        (state) => state.orgUnit.fokontanyList || []
    ).map((element) => element.id)

    const [locationList, setLocationList] = useState([])

    useEffect(() => {
        console.log(locationList, 'location list ----- ');
    }, [locationList])

    const diseaseHistoricDistrict = getStoredData({
        data: activeState,
        type: 'historic',
        source: 'simulation',
        adminLvl: 'district',
    })

    const diseaseHistoricMunicipal = getStoredData({
        data: activeState,
        type: 'historic',
        source: 'simulation',
        adminLvl: 'municipal',
    })

    const diseaseHistoricFokontany = getStoredData({
        data: activeState,
        type: 'historic',
        source: 'simulation',
        adminLvl: 'fokontany',
    })

    const labels = generateMonthYearArray(2022)

    const defaultChartData = {
        labels,
        datasets: [
            {
                fill: false,
                label: 'Cas',
                data: [],
                borderColor: COLORS.primary_text,
                backgroundColor: COLORS.primary_text,
                tension: 0.2,
                hidden: false,
                pointStyle: false,
            },
        ],
    }

    const [openModal, setOpenModal] = useState(false)
    const [modalData, setModalData] = useState({ title: 'Aide', content: '' })
    const [chartData, setChartData] = useState(defaultChartData)
    const [activeOrgUnit, setActiveOrgUnit] = useState(null)
    const [selected, setSelected] = useState([])
    const [adminLvl, setAdminLvl] = useState()
    const [activeDiseaseData, setActiveDiseaseData] = useState([])

    const handleHelpBtnClick = (value) => {
        setOpenModal(true)
        setModalData({
            title: 'Aide',
            content: (
                <div dangerouslySetInnerHTML={{ __html: value.content }} />
            ),
        })
    }

    const periods = useMemo(
        () => ({
            2022: generateYearMonths(2022),
            2023: generateYearMonths(2023),
            2024: generateYearMonths(2024),
        }),
        []
    )

    const handleSelect = (selectedValues) => {
        setSelected(selectedValues)
    }

    const handleAdministrativeDivision = useCallback(
        (value) => {
            setAdminLvl(value)
            const newLocationList =
                value === 'fokontany'
                    ? fokontanyList
                    : value === 'municipal'
                    ? municipalities
                    : district
            setLocationList(newLocationList)

            if (value === 'district') {
                setActiveOrgUnit(district) // Set Ifanadiana as default selected district
            }
        },
        [
            district,
            fokontanyList,
            municipalities,
            sampleData.currentThemeColor,
            locationList,
        ]
    )

    const setCurrentLocation = (value) => {
        if (value) {
            setActiveOrgUnit(value)
        } else {
            setActiveOrgUnit(district)
        }
    }

    useEffect(() => {
        if (!activeOrgUnit) {
            if (adminLvl === 'district') {
                setActiveOrgUnit(district)
            } else {
                setActiveOrgUnit({ id: '', displayName: '' })
            }
        }
    }, [activeOrgUnit])

    useEffect(() => {
        if (locationList.length !== 0) {
            setOpenModal(true)
            setModalData({
                title: 'Selectionner une localisation',
                content: (
                    <SearchInput
                        borderColor={sampleData.currentThemeColor}
                        options={locationList}
                        adminDivisionType={adminLvl}
                        onSelect={setCurrentLocation}
                        width={'80%'}
                        disabled={locationList.length === 0}
                    />
                ),
            })
        }
    }, [adminLvl, locationList])

    const handleVisualizationType = useCallback((value) => {
        console.log(`Visualization type: ${value}`)
    }, [])

    const getConcatenatedData = (dataObject, key) => {
        if (Object.prototype.hasOwnProperty.call(dataObject, key)) {
            const yearData = dataObject[key]
            const concatenatedArray = []
            const sortedYears = Object.keys(yearData).sort()
            sortedYears.forEach((year) => {
                concatenatedArray.push(...yearData[year])
            })

            return concatenatedArray
        } else {
            return `Key "${key}" not found.`
        }
    }

    useEffect(() => {
        const newChartData = {
            ...defaultChartData,
            datasets: [
                {
                    ...defaultChartData.datasets[0],
                    data:
                        activeDiseaseData && activeOrgUnit
                            ? getConcatenatedData(
                                  activeDiseaseData,
                                  activeOrgUnit.id
                              )
                            : [],
                },
            ],
        }
        setChartData(newChartData)
    }, [activeDiseaseData, activeOrgUnit])

    if (!orgUnits) {
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

    useEffect(() => {
        adminLvl === 'district'
            ? setActiveDiseaseData(diseaseHistoricDistrict)
            : adminLvl === 'municipal'
            ? setActiveDiseaseData(diseaseHistoricMunicipal)
            : adminLvl === 'fokontany'
            ? setActiveDiseaseData(diseaseHistoricFokontany)
            : setActiveDiseaseData([])
    }, [
        adminLvl,
        diseaseHistoricDistrict,
        diseaseHistoricMunicipal,
        diseaseHistoricFokontany,
    ])

    return (
        <div className={style.climateContainer}>
            {diseaseHistoricData.map((element, index) => (
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
                    onSetHistoricData={onSetDiseaseHistoricData}
                    storedValue={element.storedValue}
                    periods={lastThreeYears}
                />
            ))}
            <div className={style.climateHeader}>
                <div className={style.multiSelectContainer}>
                    <MultiSelect
                        options={climateVariables}
                        onSelect={handleSelect}
                        label="Variables climatique (choisir 2)"
                        maxSelectable={2}
                    />
                </div>
                <div className={style.buttonsContainer}>
                    <ToggleButton
                        options={sampleData.visualizationType}
                        bgColor={themeColor}
                        onSelect={handleVisualizationType}
                    />
                    <ToggleButton
                        options={sampleData.adminitrativeDivisions}
                        bgColor={themeColor}
                        onSelect={handleAdministrativeDivision}
                    />
                    <SearchInput
                        borderColor={themeColor}
                        options={locationList}
                        adminDivisionType={adminLvl}
                        onSelect={setCurrentLocation}
                        disabled={locationList.length === 0}
                        currentValue={activeOrgUnit}
                    />
                    <HelpButton
                        bgColor={themeColor}
                        text={helpText}
                        onClick={handleHelpBtnClick}
                    />
                </div>
            </div>
            <div className={style.climateContent}>
                <ClimateDataSection
                    item={sampleData.statisticCard}
                    bgColor={themeColor}
                    chartData={chartData}
                    title={'Cas de paludisme'}
                    xAxisText="Mois"
                    yAxisText="Cas"
                    height="230px"
                />

                {selected.includes(precipitation.id) && (
                    <ClimateChart
                        periods={periods}
                        engine={engine}
                        orgUnits={orgUnits}
                        item={sampleData.climate[0]}
                        dataElement={precipitation.id}
                        targetOrgUnit={activeOrgUnit.id}
                        adminDivisionType={adminLvl}
                        colorTheme={themeColor}
                        type="precipitation"
                        labels={labels}
                    />
                )}

                {selected.includes(temperature.id) && (
                    <ClimateChart
                        periods={periods}
                        engine={engine}
                        orgUnits={orgUnits}
                        item={sampleData.climate[1]}
                        dataElement={temperature.id}
                        targetOrgUnit={activeOrgUnit.id}
                        adminDivisionType={adminLvl}
                        colorTheme={themeColor}
                        type="temperature"
                        labels={labels}
                    />
                )}

                {selected.includes(vegetationIndex.id) && (
                    <ClimateChart
                        periods={periods}
                        engine={engine}
                        orgUnits={orgUnits}
                        item={sampleData.climate[2]}
                        dataElement={vegetationIndex.id}
                        targetOrgUnit={activeOrgUnit.id}
                        adminDivisionType={adminLvl}
                        colorTheme={themeColor}
                        type="vegetationIndex"
                        labels={labels}
                    />
                )}

                {selected.includes(waterSurfaceIndex.id) && (
                    <ClimateChart
                        periods={periods}
                        engine={engine}
                        orgUnits={orgUnits}
                        item={sampleData.climate[3]}
                        dataElement={waterSurfaceIndex.id}
                        targetOrgUnit={activeOrgUnit.id}
                        adminDivisionType={adminLvl}
                        colorTheme={themeColor}
                        type="waterSurfaceIndex"
                        labels={labels}
                    />
                )}

                {selected.includes(atmHumidity.id) && (
                    <ClimateChart
                        periods={periods}
                        engine={engine}
                        orgUnits={orgUnits}
                        item={sampleData.climate[4]}
                        dataElement={atmHumidity.id}
                        targetOrgUnit={activeOrgUnit.id}
                        adminDivisionType={adminLvl}
                        colorTheme={themeColor}
                        type="atmHumidity"
                        labels={labels}
                    />
                )}

                {selected.includes(bushfireArea.id) && (
                    <ClimateChart
                        periods={periods}
                        engine={engine}
                        orgUnits={orgUnits}
                        item={sampleData.climate[5]}
                        dataElement={bushfireArea.id}
                        targetOrgUnit={activeOrgUnit.id}
                        adminDivisionType={adminLvl}
                        colorTheme={themeColor}
                        type="bushfireArea"
                        labels={labels}
                    />
                )}

                {selected.includes(vegetativeWaterIndex.id) && (
                    <ClimateChart
                        periods={periods}
                        engine={engine}
                        orgUnits={orgUnits}
                        item={sampleData.climate[6]}
                        dataElement={vegetativeWaterIndex.id}
                        targetOrgUnit={activeOrgUnit.id}
                        adminDivisionType={adminLvl}
                        colorTheme={themeColor}
                        type="vegetativeWaterIndex"
                        labels={labels}
                    />
                )}

                {selected.includes(aodAtmLevel.id) && (
                    <ClimateChart
                        periods={periods}
                        engine={engine}
                        orgUnits={orgUnits}
                        item={sampleData.climate[7]}
                        dataElement={aodAtmLevel.id}
                        targetOrgUnit={activeOrgUnit.id}
                        adminDivisionType={adminLvl}
                        colorTheme={themeColor}
                        type="aodAtmLevel"
                        labels={labels}
                    />
                )}

                {selected.includes(floodedRiceFields.id) && (
                    <ClimateChart
                        periods={periods}
                        engine={engine}
                        orgUnits={orgUnits}
                        item={sampleData.climate[8]}
                        dataElement={floodedRiceFields.id}
                        targetOrgUnit={activeOrgUnit.id}
                        adminDivisionType={adminLvl}
                        colorTheme={themeColor}
                        type="floodedRiceFields"
                        labels={labels}
                    />
                )}

                {selected.includes(windSpeed.id) && (
                    <ClimateChart
                        periods={periods}
                        engine={engine}
                        orgUnits={orgUnits}
                        item={sampleData.climate[9]}
                        dataElement={windSpeed.id}
                        targetOrgUnit={activeOrgUnit.id}
                        adminDivisionType={adminLvl}
                        colorTheme={themeColor}
                        type="windSpeed"
                        labels={labels}
                    />
                )}
            </div>
            <Modal
                open={openModal}
                handleClose={() => setOpenModal(false)}
                title={modalData.title}
            >
                {modalData.content}
            </Modal>
        </div>
    )
}

export default ClimateDisplay
