import { useDataEngine } from '@dhis2/app-runtime'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { CLIMATE } from '../../constants/mapping'
import { generateYearMonths } from '../../utils/format-time'
import { regroupData } from '../../utils/formating'
import {
    createClimateParams,
    createQuery,
    constructDimensions,
    mapRowToDetailsClimate,
} from '../../utils/request'

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
    const [orgUnits, setOrgUnits] = useState()
    const [climateData, setClimateData] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const engine = useDataEngine()
    const municipalities = useSelector((state) => state.orgUnit.municipalities)

    const periods = useMemo(
        () => ({
            2020: generateYearMonths(2020),
            2021: generateYearMonths(2021),
            2022: generateYearMonths(2022),
        }),
        []
    )

    const params = useMemo(() => {
        if (!orgUnits) {return null}

        const years = [2020, 2021, 2022]
        const climateParams = {}

        years.forEach((year) => {
            climateParams[`${year}Precipitation`] = createClimateParams(
                precipitation.id,
                periods[year],
                orgUnits
            )
            climateParams[`${year}Temperature`] = createClimateParams(
                temperature.id,
                periods[year],
                orgUnits
            )
            climateParams[`${year}VegetationIndex`] = createClimateParams(
                vegetationIndex.id,
                periods[year],
                orgUnits
            )
            climateParams[`${year}WaterSurfaceIndex`] = createClimateParams(
                waterSurfaceIndex.id,
                periods[year],
                orgUnits
            )
            climateParams[`${year}VegetativeWaterIndex`] = createClimateParams(
                vegetativeWaterIndex.id,
                periods[year],
                orgUnits
            )
            climateParams[`${year}BushfireArea`] = createClimateParams(
                bushfireArea.id,
                periods[year],
                orgUnits
            )
            climateParams[`${year}No2AtmLevel`] = createClimateParams(
                no2AtmLevel.id,
                periods[year],
                orgUnits
            )
            climateParams[`${year}AodAtmLevel`] = createClimateParams(
                aodAtmLevel.id,
                periods[year],
                orgUnits
            )
            climateParams[`${year}FloodedRiceFields`] = createClimateParams(
                floodedRiceFields.id,
                periods[year],
                orgUnits
            )
            climateParams[`${year}AtmHumidity`] = createClimateParams(
                atmHumidity.id,
                periods[year],
                orgUnits
            )
            climateParams[`${year}WindSpeed`] = createClimateParams(
                windSpeed.id,
                periods[year],
                orgUnits
            )
        })

        return climateParams
    }, [orgUnits, periods])

    useEffect(() => {
        if (municipalities && !orgUnits) {
            setOrgUnits(municipalities.map((element) => element.id))
        }
    }, [municipalities, orgUnits])

    useEffect(() => {
        const fetchData = async () => {
            if (!params) {return}

            setLoading(true)
            setError(null)

            try {
                const fetchAndFormat = async (paramKey) => {
                    const dimensions = constructDimensions(params[paramKey])
                    const query = createQuery(dimensions)
                    const { data } = await engine.query(query)
                    const { items } = data.metaData
                    const rows = data.rows
                    return regroupData(
                        rows.map((row) => mapRowToDetailsClimate(row, items))
                    )
                }

                const years = [2020, 2021, 2022]
                const newClimateData = {
                    precipitation: {},
                    temperature: {},
                    vegetationIndex: {},
                    waterSurfaceIndex: {},
                    vegetativeWaterIndex: {},
                    bushfireArea: {},
                    no2AtmLevel: {},
                    aodAtmLevel: {},
                    floodedRiceFields: {},
                    atmHumidity: {},
                    windSpeed: {},
                }

                for (const year of years) {
                    newClimateData.precipitation[year] = await fetchAndFormat(
                        `${year}Precipitation`
                    )
                    newClimateData.temperature[year] = await fetchAndFormat(
                        `${year}Temperature`
                    )
                    newClimateData.vegetationIndex[year] = await fetchAndFormat(
                        `${year}VegetationIndex`
                    )
                    newClimateData.waterSurfaceIndex[year] =
                        await fetchAndFormat(`${year}WaterSurfaceIndex`)
                    newClimateData.vegetativeWaterIndex[year] =
                        await fetchAndFormat(`${year}VegetativeWaterIndex`)
                    newClimateData.bushfireArea[year] = await fetchAndFormat(
                        `${year}BushfireArea`
                    )
                    newClimateData.no2AtmLevel[year] = await fetchAndFormat(
                        `${year}No2AtmLevel`
                    )
                    newClimateData.aodAtmLevel[year] = await fetchAndFormat(
                        `${year}AodAtmLevel`
                    )
                    newClimateData.floodedRiceFields[year] =
                        await fetchAndFormat(`${year}FloodedRiceFields`)
                    newClimateData.atmHumidity[year] = await fetchAndFormat(
                        `${year}AtmHumidity`
                    )
                    newClimateData.windSpeed[year] = await fetchAndFormat(
                        `${year}WindSpeed`
                    )
                }

                setClimateData(newClimateData)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
                console.log(climateData);
            }
        }

        fetchData()
    }, [params, engine])

    return (
        <div className="container">
            <p>Malaria climate</p>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {[
                'precipitation',
                'temperature',
                'vegetationIndex',
                'waterSurfaceIndex',
                'vegetativeWaterIndex',
                'bushfireArea',
                'no2AtmLevel',
                'aodAtmLevel',
                'floodedRiceFields',
                'atmHumidity',
                'windSpeed',
            ].map((category) => (
                <div key={category}>
                    <h3>
                        {category.charAt(0).toUpperCase() +
                            category.slice(1).replace(/([A-Z])/g, ' $1')}
                    </h3>
                    {Object.keys(climateData[category] || {}).map((year) => (
                        <div key={year}>
                            <h4>{year}</h4>
                            <pre>
                                {JSON.stringify(
                                    climateData[category][year],
                                    null,
                                    2
                                )}
                            </pre>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default MalariaClimate
