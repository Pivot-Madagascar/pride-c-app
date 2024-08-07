import { useDataEngine } from '@dhis2/app-runtime'
import { Box, CircularProgress } from '@mui/material'
import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
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

const ClimateDisplay = ({ themeColor }) => {
    const engine = useDataEngine()

    const municipalities = useSelector((state) => state.orgUnit.municipalities)
    const fokontanyList = useSelector((state) => state.orgUnit.fokontanyList)
    const district = useSelector((state) => state.orgUnit.district)
    const orgUnits = useSelector((state) => state.orgUnit.orgUnitsId)

    const [locationList, setLocationList] = useState([])

    const [openModal, setOpenModal] = useState(false)
    const [modalData, setModalData] = useState({ title: 'Aide', content: '' })

    const [activeOrgUnit, setActiveOrgUnit] = useState(null)
    const [selected, setSelected] = useState([])
    const [adminDivisionType, setAdminDivisionType] = useState()

    const labels = useMemo(() => generateLabels(2020, 2022), [])

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
            2020: generateYearMonths(2023),
            2021: generateYearMonths(2021),
            2022: generateYearMonths(2022),
        }),
        []
    )

    const handleSelect = (selectedValues) => {
        setSelected(selectedValues)
    }

    const handleAdministrativeDivision = useCallback(
        (value) => {
            setAdminDivisionType(value)
            const newLocationList =
                value === 'fokontany' 
                ? fokontanyList 
                : value === 'municipality' 
                ? municipalities
                : []
            setLocationList(newLocationList)

            if (value === 'district') {
                setActiveOrgUnit(district) // Set Ifanadiana as default selected district
            }
        },
        [district, fokontanyList, municipalities, sample.currentThemeColor, locationList] 
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
            if (adminDivisionType === 'district') {
                setActiveOrgUnit(district)
            } else {
                setActiveOrgUnit({ id: '', displayName: ''})
            }
        }
    }, [activeOrgUnit])

    useEffect(() => {
        if (locationList.length !== 0) {
            setOpenModal(true)
                setModalData({
                    title:
                        adminDivisionType === 'fokontany'
                            ? 'Selectioner un fokontany'
                            : 'Selectionner une commune',
                    content: (
                        <SearchInput
                            borderColor={sample.currentThemeColor}
                            options={locationList}
                            adminDivisionType={adminDivisionType}
                            onSelect={setCurrentLocation}
                            width={'80%'}
                            disabled={locationList.length === 0}
                        />
                    ),
                })
        }
    }, [adminDivisionType, locationList])

    const handleVisualizationType = useCallback((value) => {
        console.log(`Visualization type: ${value}`)
    }, [])

 

    const defaultChartData = {
        labels,
        datasets: [
            {
                fill: false,
                label: 'Cas',
                data: sample.trendsData,
                borderColor: COLORS.primary_text,
                backgroundColor: COLORS.primary_text,
                tension: 0.2,
                hidden: false,
                pointStyle: false
            },
        ],
    }

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

    return (
        <div className={style.climateContainer}>
            <div className={style.climateHeader}>
                <div className={style.multiSelectContainer}>
                    <MultiSelect
                        options={climateVariables}
                        onSelect={handleSelect}
                    />
                </div>
                <div className={style.buttonsContainer}>
                    <ToggleButton
                        options={sample.visualizationType}
                        bgColor={themeColor}
                        onSelect={handleVisualizationType}
                    />
                    <ToggleButton
                        options={sample.adminitrativeDivisions}
                        bgColor={themeColor}
                        onSelect={handleAdministrativeDivision}
                    />
                    <SearchInput
                        borderColor={themeColor}
                        options={locationList}
                        adminDivisionType={adminDivisionType}
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
                    item={sample.malaria}
                    bgColor={themeColor}
                    chartData={defaultChartData}
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
                        item={sample.climate[0]}
                        dataElement={precipitation.id}
                        targetOrgUnit={activeOrgUnit.id}
                        adminDivisionType={adminDivisionType}
                        colorTheme={themeColor}
                        type="precipitation"
                    />
                )}

                {selected.includes(temperature.id) && (
                    <ClimateChart
                        periods={periods}
                        engine={engine}
                        orgUnits={orgUnits}
                        item={sample.climate[1]}
                        dataElement={temperature.id}
                        targetOrgUnit={activeOrgUnit.id}
                        adminDivisionType={adminDivisionType}
                        colorTheme={themeColor}
                        type="temperature"
                    />
                )}

                {selected.includes(vegetationIndex.id) && (
                    <ClimateChart
                        periods={periods}
                        engine={engine}
                        orgUnits={orgUnits}
                        item={sample.climate[2]}
                        dataElement={vegetationIndex.id}
                        targetOrgUnit={activeOrgUnit.id}
                        adminDivisionType={adminDivisionType}
                        colorTheme={themeColor}
                        type="vegetationIndex"
                    />
                )}

                {selected.includes(waterSurfaceIndex.id) && (
                    <ClimateChart
                        periods={periods}
                        engine={engine}
                        orgUnits={orgUnits}
                        item={sample.climate[3]}
                        dataElement={waterSurfaceIndex.id}
                        targetOrgUnit={activeOrgUnit.id}
                        adminDivisionType={adminDivisionType}
                        colorTheme={themeColor}
                        type="waterSurfaceIndex"
                    />
                )}

                {selected.includes(atmHumidity.id) && (
                    <ClimateChart
                        periods={periods}
                        engine={engine}
                        orgUnits={orgUnits}
                        item={sample.climate[4]}
                        dataElement={atmHumidity.id}
                        targetOrgUnit={activeOrgUnit.id}
                        adminDivisionType={adminDivisionType}
                        colorTheme={themeColor}
                        type="atmHumidity"
                    />
                )}

                {selected.includes(bushfireArea.id) && (
                    <ClimateChart
                        periods={periods}
                        engine={engine}
                        orgUnits={orgUnits}
                        item={sample.climate[5]}
                        dataElement={bushfireArea.id}
                        targetOrgUnit={activeOrgUnit.id}
                        adminDivisionType={adminDivisionType}
                        colorTheme={themeColor}
                        type="bushfireArea"
                    />
                )}

                {selected.includes(vegetativeWaterIndex.id) && (
                    <ClimateChart
                        periods={periods}
                        engine={engine}
                        orgUnits={orgUnits}
                        item={sample.climate[6]}
                        dataElement={vegetativeWaterIndex.id}
                        targetOrgUnit={activeOrgUnit.id}
                        adminDivisionType={adminDivisionType}
                        colorTheme={themeColor}
                        type="vegetativeWaterIndex"
                    />
                )}

                {selected.includes(aodAtmLevel.id) && (
                    <ClimateChart
                        periods={periods}
                        engine={engine}
                        orgUnits={orgUnits}
                        item={sample.climate[7]}
                        dataElement={aodAtmLevel.id}
                        targetOrgUnit={activeOrgUnit.id}
                        adminDivisionType={adminDivisionType}
                        colorTheme={themeColor}
                        type="aodAtmLevel"
                    />
                )}

                {selected.includes(floodedRiceFields.id) && (
                    <ClimateChart
                        periods={periods}
                        engine={engine}
                        orgUnits={orgUnits}
                        item={sample.climate[8]}
                        dataElement={floodedRiceFields.id}
                        targetOrgUnit={activeOrgUnit.id}
                        adminDivisionType={adminDivisionType}
                        colorTheme={themeColor}
                        type="floodedRiceFields"
                    />
                )}

                {selected.includes(windSpeed.id) && (
                    <ClimateChart
                        periods={periods}
                        engine={engine}
                        orgUnits={orgUnits}
                        item={sample.climate[9]}
                        dataElement={windSpeed.id}
                        targetOrgUnit={activeOrgUnit.id}
                        adminDivisionType={adminDivisionType}
                        colorTheme={themeColor}
                        type="windSpeed"
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
