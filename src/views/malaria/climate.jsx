import { useDataEngine } from '@dhis2/app-runtime'
import { Box, CircularProgress } from '@mui/material'
import React, { useMemo, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import MultiSelect from '../../components/MultiSelect'
import { CLIMATE } from '../../constants/mapping'
import { generateYearMonths } from '../../utils/format-time'
import { createClimateParams } from '../../utils/request'
// import ClimateChart from '../climate/ClimatChart'
import PrecipitationChart from '../climate/PrecipitationChart'
import VegetativeWaterIndexChart from '../climate/VegetativeWaterIndex'
import TemperatureChart from '../climate/TemperatureChart'
import VegetationIndexChart from '../climate/VegetationIndexChart'
import WaterSurfaceIndexChart from '../climate/WaterSurfaceIndexChart'
import BushfireAreaChart from '../climate/BushfireAreaChart'
import AodAtmLevelChart from '../climate/AodAtmLevelChart'
import FloodedRiceFieldsChart from '../climate/FloodedRiceFieldsChart'
import WindSpeedChart from '../climate/WindSpeedChart'
import AtmHumidityChart from '../climate/AtmHumidityChart'
import ToggleButton from '../../components/ToggleButton'
import HelpButton from '../../components/HelpButton'
import Modal from '../../components/Modal'
import SearchInput from '../../components/SearchInput'
import { sample } from './data'
import style from './malariaDashboard.module.scss'
import { generateLabels } from '../../utils/formating'
import ClimateDataSection from '../../components/ClimateDataSection'
import COLORS from '../../constants/styles'

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

const MalariaClimate = () => {
    const engine = useDataEngine()
    const [locationList, setLocationList] = useState([])
    const municipalities = useSelector((state) => state.orgUnit.municipalities)
    const fokontanyList = useSelector((state) => state.orgUnit.fokontanyList)
    const orgUnits = useSelector((state) => state.orgUnit.orgUnitsId)

    const [openModal, setOpenModal] = useState(false)
    const [modalContent, setModalContent] = useState('')
    
    const [lineChartTitle, setLineChartTitle] = useState(
        `Cas détécté dans le district d'Ifanadiana`
    )
    const [activeOrgUnit, setActiveOrgUnit] = useState(null)
    const [selected, setSelected] = useState([])
    const [adminDivisionType, setAdminDivisionType] = useState()
    const fktToMunicipalities = useSelector(
        (state) => state.orgUnit.fktToMunicipalities
    )
    const malaria_2018Data = useSelector((state) => state.malaria.malaria_2018)
    const malaria_2017Data = useSelector((state) => state.malaria.malaria_2017)

    const years = [2020, 2021, 2022]
    // const districtOrgUnitId = ['VtP4BdCeXIo']

    const labels = useMemo(() => generateLabels(2020, 2022), [])

    const malariaChartData = useMemo(() => {
        return {
            labels,
            datasets: [
                {
                    fill: false,
                    label: 'Cas de paludisme',
                    data: [malaria_2017Data, malaria_2018Data, malaria_2017Data],
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                }
            ]
        }
    })

    

    const periods = useMemo(
        () => ({
            2020: generateYearMonths(2023),
            2021: generateYearMonths(2021),
            2022: generateYearMonths(2022),
        }),
        []
    )

    const climateVariable = [
        { label: 'Précipitation totale', value: precipitation.id },
        { label: 'Temperature moyenne', value: temperature.id },
        { label: 'Indicateur de végétation', value: vegetationIndex.id },
        { label: "Indicateur de l'eau de surface", value: waterSurfaceIndex.id },
        { label: 'Proportion de superficie avec un feu de brousse', value: bushfireArea.id },
        { label: "Indicateur de l'eau vegetative", value: vegetativeWaterIndex.id },
        { label: "Niveau moyen de la profondeur optique des aérosols", value: aodAtmLevel.id },
        { label: "Proportion moyenne de rizières inondé", value: floodedRiceFields.id },
        { label: "Vitesse moyenne du vent", value: windSpeed.id },
    ]

    const handleSelect = (selectedValues) => {
        setSelected(selectedValues)
    }

    const handleAdministrativeDivision = useCallback(
        (value) => {
            setAdminDivisionType(value)
            setLocationList(
                value === 'fokontany' ? fokontanyList : municipalities
            )
        },
        [fokontanyList, municipalities]
    )

    const getFokontanyIds = useCallback((data, { displayName, id }) => {
        const key = `${displayName}-${id}`
        return data[key]?.combinedChildren.map((child) => child.id) || []
    }, [])

    const handleVisualizationType = useCallback((value) => {
        console.log(`Visualization type: ${value}`)
    }, [])

    const setCurrentLocation = useCallback(
        (value) => {
            if (adminDivisionType === 'municipality' && value) {
                setActiveOrgUnit(value.id)
                setLineChartTitle(
                    `Cas détécté dans la commune de ${value.displayName}`
                )
            } else if (adminDivisionType === 'fokontany' && value) {
                setActiveOrgUnit([value.id])
                setLineChartTitle(
                    `Cas détécté dans le fokontany de ${value.displayName}`
                )
            } else {
                if (!value) {
                    setActiveOrgUnit(null)
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

    const defaultChartData = {
        labels,
        datasets: [
            {
                fill: false,
                label: 'Temperature',
                data: sample.trendsData,
                borderColor: COLORS.primary_text,
                backgroundColor: COLORS.primary_text,
                tension: 0.25,
                hidden: false,
            },
        ],
    }

    const handleHelpBtnClick = (value) => {
        setOpenModal(value.open)
        setModalContent(value.content)
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
                        options={climateVariable}
                        onSelect={handleSelect}
                    />
                </div>
                <div className={style.buttonsContainer}>
                    <ToggleButton
                        options={sample.visualizationType}
                        bgColor={sample.currentThemeColor}
                        onSelect={handleVisualizationType}
                    />
                    <ToggleButton
                        options={sample.adminitrativeDivisions}
                        bgColor={sample.currentThemeColor}
                        onSelect={handleAdministrativeDivision}
                    />
                    <SearchInput
                        borderColor={sample.currentThemeColor}
                        options={locationList}
                        adminDivisionType={adminDivisionType}
                        onSelect={setCurrentLocation}
                    />
                    <HelpButton
                        bgColor={sample.currentThemeColor}
                        text={helpText}
                        onClick={handleHelpBtnClick}
                    />
                </div>
            </div>
            <div className={style.climateContent}>
                <ClimateDataSection 
                    item={sample.malaria}
                    bgColor={COLORS.red_light}
                    chartData={defaultChartData}
                    title={"Cas de paludisme"}
                    xAxisText="Mois"
                    yAxisText="Cas"
                    height="230px"
                />
                { selected.includes(precipitation.id) &&
                    <PrecipitationChart
                        periods={periods}
                        engine={engine}
                        orgUnits={orgUnits}
                        item={sample.climate[0]}
                        dataElement={precipitation.id}
                        targetOrgUnit={activeOrgUnit}
                        adminDivisionType={adminDivisionType}
                        colorTheme={COLORS.red_light}
                    />
                }

                { selected.includes(temperature.id) &&
                    <TemperatureChart
                        periods={periods}
                        engine={engine}
                        orgUnits={orgUnits}
                        item={sample.climate[1]}
                        dataElement={temperature.id}
                        targetOrgUnit={activeOrgUnit}
                        adminDivisionType={adminDivisionType}
                        colorTheme={COLORS.red_light}
                    />
                }
                { selected.includes(vegetationIndex.id) &&
                    <VegetationIndexChart
                        periods={periods}
                        engine={engine}
                        orgUnits={orgUnits}
                        item={sample.climate[2]}
                        dataElement={vegetationIndex.id}
                        targetOrgUnit={activeOrgUnit}
                        adminDivisionType={adminDivisionType}
                        colorTheme={COLORS.red_light}
                    />
                }
                
                { selected.includes(waterSurfaceIndex.id) &&
                    <WaterSurfaceIndexChart
                        periods={periods}
                        engine={engine}
                        orgUnits={orgUnits}
                        item={sample.climate[3]}
                        dataElement={waterSurfaceIndex.id}
                        targetOrgUnit={activeOrgUnit}
                        adminDivisionType={adminDivisionType}
                        colorTheme={COLORS.red_light}
                    />
                }
                
                { selected.includes(vegetativeWaterIndex.id) &&
                    <VegetativeWaterIndexChart
                        periods={periods} 
                        engine={engine} 
                        orgUnits={orgUnits} 
                        item={sample.climate[6]}
                        dataElement={vegetativeWaterIndex.id}
                        targetOrgUnit={activeOrgUnit}
                        adminDivisionType={adminDivisionType}
                        colorTheme={COLORS.red_light}
                    />
                }
                
                { selected.includes(bushfireArea.id) &&
                    <BushfireAreaChart 
                        periods={periods} 
                        engine={engine} 
                        orgUnits={orgUnits} 
                        item={sample.climate[5]}
                        dataElement={bushfireArea.id}
                        targetOrgUnit={activeOrgUnit}
                        adminDivisionType={adminDivisionType}
                        colorTheme={COLORS.red_light}
                    />
                }
                
                { selected.includes(aodAtmLevel.id) &&
                    <AodAtmLevelChart 
                        periods={periods} 
                        engine={engine} 
                        orgUnits={orgUnits} 
                        item={sample.climate[7]}
                        dataElement={aodAtmLevel.id}
                        targetOrgUnit={activeOrgUnit}
                        adminDivisionType={adminDivisionType}
                        colorTheme={COLORS.red_light}
                    />
                }
                
                { selected.includes(floodedRiceFields.id) &&
                    <FloodedRiceFieldsChart 
                        periods={periods} 
                        engine={engine} 
                        orgUnits={orgUnits} 
                        item={sample.climate[8]}
                        dataElement={floodedRiceFields.id}
                        targetOrgUnit={activeOrgUnit}
                        adminDivisionType={adminDivisionType}
                        colorTheme={COLORS.red_light}
                    />
                }
                
                { selected.includes(atmHumidity.id) &&
                    <AtmHumidityChart 
                        periods={periods} 
                        engine={engine} 
                        orgUnits={orgUnits} 
                        item={sample.climate[4]}
                        dataElement={atmHumidity.id}
                        targetOrgUnit={activeOrgUnit}
                        adminDivisionType={adminDivisionType}
                        colorTheme={COLORS.red_light}
                    />
                }

                { selected.includes(windSpeed.id) &&
                    <WindSpeedChart 
                        periods={periods} 
                        engine={engine} 
                        orgUnits={orgUnits} 
                        item={sample.climate[9]}
                        dataElement={windSpeed.id}
                        targetOrgUnit={activeOrgUnit}
                        adminDivisionType={adminDivisionType}
                        colorTheme={COLORS.red_light}
                    />
                }
            </div>
            <Modal
                open={openModal}
                handleClose={() => setOpenModal(false)}
                title='Aides'
            >
                <div dangerouslySetInnerHTML={{ __html: modalContent }} />
            </Modal>
        </div>
    )
}

export default MalariaClimate
