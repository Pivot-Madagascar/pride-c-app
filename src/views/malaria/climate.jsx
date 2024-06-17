import { useDataEngine } from '@dhis2/app-runtime'
import { Box, CircularProgress } from '@mui/material'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import MultiSelect from '../../components/MultiSelect'
import { CLIMATE } from '../../constants/mapping'
import { generateYearMonths } from '../../utils/format-time'
import { createClimateParams } from '../../utils/request'
// import ClimateChart from '../climate/ClimatChart'
import PrecipitationChart from '../climate/PrecipitationChart'
import TemperatureChart from '../climate/TemperatureChart'
import VegetationIndexChart from '../climate/VegetationIndexChart'
import WaterSurfaceIndexChart from '../climate/WaterSurfaceIndexChart'
import { sample } from './data'
import style from './malariaDashboard.module.scss'

const {
    precipitation,
    temperature,
    vegetationIndex,
    waterSurfaceIndex,
    vegetativeWaterIndex,
    bushfireArea,
    no2AtmLevel,
    aodAtmLevel,
    floodedRiceFields,
    atmHumidity,
    windSpeed,
} = CLIMATE

const MalariaClimate = () => {
    const engine = useDataEngine()
    const orgUnits = useSelector((state) => state.orgUnit.orgUnitsId)

    const periods = useMemo(
        () => ({
            2020: generateYearMonths(2023),
            2021: generateYearMonths(2021),
            2022: generateYearMonths(2022),
        }),
        []
    )

    const climateVariable = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
        { label: 'Option 4', value: 'option4' },
        { label: 'Option 5', value: 'option5' },
        { label: 'Option 6', value: 'option6' },
    ]

    const handleSelect = (selectedValues) => {
        // Update the parent component state or perform other actions with the selected values
        console.log(selectedValues)
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
        <div>
            <div>
                <MultiSelect
                    options={climateVariable}
                    onSelect={handleSelect}
                />
            </div>
            <div className={style.climateContent}>
                <PrecipitationChart
                    periods={periods}
                    engine={engine}
                    orgUnits={orgUnits}
                    item={sample.climate[0]}
                    dataElement={precipitation.id}
                />

                <TemperatureChart
                    periods={periods}
                    engine={engine}
                    orgUnits={orgUnits}
                    item={sample.climate[1]}
                    dataElement={temperature.id}
                />

                <VegetationIndexChart
                    periods={periods}
                    engine={engine}
                    orgUnits={orgUnits}
                    item={sample.climate[2]}
                    dataElement={vegetationIndex.id}
                />

                <WaterSurfaceIndexChart
                    periods={periods}
                    engine={engine}
                    orgUnits={orgUnits}
                    item={sample.climate[3]}
                    dataElement={waterSurfaceIndex.id}
                />
                {/* <VegetativeWaterIndexComponent periods={periods} engine={engine} orgUnits={orgUnits} /> */}
                {/* <BushfireAreaComponent periods={periods} engine={engine} orgUnits={orgUnits} />
                <No2AtmLevelComponent periods={periods} engine={engine} orgUnits={orgUnits} />
                <AodAtmLevelComponent periods={periods} engine={engine} orgUnits={orgUnits} />
                <FloodedRiceFieldsComponent periods={periods} engine={engine} orgUnits={orgUnits} />
                <AtmHumidityComponent periods={periods} engine={engine} orgUnits={orgUnits} />
                <WindSpeedComponent periods={periods} engine={engine} orgUnits={orgUnits} /> */}
            </div>
        </div>
    )
}

export default MalariaClimate
