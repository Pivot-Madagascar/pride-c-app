import { useDataEngine } from '@dhis2/app-runtime'
import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setForecastData, setHistoricData } from '../../redux/newMalariaSlice'
import { generateYearMonths } from '../../utils/format-time'
import { fetchAndFormat } from '../../utils/request'

const currentYear = new Date().getFullYear()
const lastThreeYears = [currentYear - 6, currentYear - 7, currentYear - 8]
const district = [{ id: 'VtP4BdCeXIo', displayName: 'Ifanadiana' }]

const lastThreeMonths = () => {
    const months = []
    const date = new Date()

    for (let i = 0; i < 3; i++) {
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        months.unshift(`${year}${month}`)
        date.setMonth(date.getMonth() - 1)
    }

    return months
}

const MalariaTrend = () => {
    const engine = useDataEngine()
    const dispatch = useDispatch()

    const districtOrgUnitIds = district.map((element) => element.id)
    const municipalOrgUnitIds = useSelector(
        (state) => state.orgUnit.municipalities || []
    ).map((element) => element.id)
    const fokontanyOrgUnitIds = useSelector(
        (state) => state.orgUnit.fokontanyList || []
    ).map((element) => element.id)

    const malariaState = useSelector((state) => state.newMalaria)

    const historicPeriods = useMemo(
        () =>
            lastThreeYears.reduce((acc, year) => {
                acc[year] = generateYearMonths(year)
                return acc
            }, {}),
        [lastThreeYears]
    )

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

    const fetchData = async ({ dataElement, period, orgUnits }) => {
        const result = await fetchAndFormat(
            dataElement,
            engine,
            period,
            orgUnits
        )
        return result
    }

    const historicAdjusted = getAdjustedData('historic')
    const districtHistoricAdjusted = getAdjustedData(
        'historic',
        undefined,
        'district'
    )
    const municipalHistoricAdjusted = getAdjustedData(
        'historic',
        undefined,
        'municipal'
    )
    const fokontanyHistoricAdjusted = getAdjustedData(
        'historic',
        undefined,
        'fokontany'
    )

    const forecastAdjustedAvg = getAdjustedData('forecast', 'avg')
    const districtForecastAdjustedAvg = getAdjustedData(
        'forecast',
        'avg',
        'district'
    )
    const municipalForecastAdjustedAvg = getAdjustedData(
        'forecast',
        'avg',
        'municipal'
    )
    const fokontanyForecastAdjustedAvg = getAdjustedData(
        'forecast',
        'avg',
        'fokontany'
    )

    const forecastAdjustedLowci = getAdjustedData('forecast', 'lowci')
    const districtForecastAdjustedLowci = getAdjustedData(
        'forecast',
        'lowci',
        'district'
    )
    const municipalForecastAdjustedLowci = getAdjustedData(
        'forecast',
        'lowci',
        'municipal'
    )
    const fokontanyForecastAdjustedLowci = getAdjustedData(
        'forecast',
        'lowci',
        'fokontany'
    )

    const forecastAdjustedUppci = getAdjustedData('forecast', 'uppci')
    const districtForecastAdjustedUppci = getAdjustedData(
        'forecast',
        'uppci',
        'district'
    )
    const municipalForecastAdjustedUppci = getAdjustedData(
        'forecast',
        'uppci',
        'municipal'
    )
    const fokontanyForecastAdjustedUppci = getAdjustedData(
        'forecast',
        'uppci',
        'fokontany'
    )

    const fetchForecastData = async (
        forecastType,
        caseType,
        adminLevel,
        orgUnitIds,
        dataElementId,
        storedValue
    ) => {
        if (!storedValue) {
            try {
                const result = await fetchData({
                    dataElement: dataElementId,
                    period: lastThreeMonths(),
                    orgUnits: orgUnitIds,
                })

                const combineData = {}
                result.forEach((item) => {
                    const orgUnit = item.orgUnit
                    const values = item.values
                    combineData[orgUnit] = values
                })

                dispatch(
                    setForecastData({
                        forecastType,
                        caseType,
                        adminLevel,
                        data: combineData,
                    })
                )
            } catch (error) {
                console.error(`Error fetching ${adminLevel} data:`, error)
            }
        }
    }

    const fetchHistoricalData = async (
        caseType,
        adminLevel,
        orgUnitIds,
        dataElementId,
        storedValue
    ) => {
        if (!storedValue) {
            try {
                const keys = Object.keys(historicPeriods)
                const combinedData = await keys.reduce(
                    async (accPromise, key) => {
                        const acc = await accPromise
                        const result = await fetchData({
                            dataElement: dataElementId,
                            period: historicPeriods[key],
                            orgUnits: orgUnitIds,
                        })

                        const newArray = []

                        result.forEach((item) => {
                            const orgUnit = item.orgUnit
                            const values = item.values
                            if (!acc[orgUnit]) {
                                acc[orgUnit] = {}
                            }
                            acc[orgUnit][key] = values
                            const data = {
                                [item.orgUnit]: {
                                    [key]: item.values,
                                },
                            }
                            newArray.push(data)
                        })
                        
                        newArray.forEach((item) => {
                            const orgUnitKey = Object.keys(item)[0]
                            const yearData = item[orgUnitKey]
                            if (!acc[orgUnitKey]) {
                                acc[orgUnitKey] = {}
                            }
                            Object.keys(yearData).forEach((year) => {
                                if (!acc[orgUnitKey][year]) {
                                    acc[orgUnitKey][year] = yearData[year]
                                }
                            })
                        })

                        return acc
                    },
                    Promise.resolve({})
                )
                dispatch(
                    setHistoricData({
                        caseType,
                        adminLevel,
                        data: combinedData,
                    })
                )
            } catch (error) {
                console.error(error)
            }
        }
    }

    // forecast-adjusted-avg
    useEffect(() => {
        fetchForecastData(
            'adjusted',
            'avg',
            'fokontany',
            fokontanyOrgUnitIds,
            forecastAdjustedAvg.id,
            fokontanyForecastAdjustedAvg
        )
    }, [
        forecastAdjustedAvg,
        fokontanyOrgUnitIds,
        lastThreeMonths,
        dispatch,
        fokontanyForecastAdjustedAvg,
    ])

    useEffect(() => {
        fetchForecastData(
            'adjusted',
            'avg',
            'municipal',
            municipalOrgUnitIds,
            forecastAdjustedAvg.id,
            municipalForecastAdjustedAvg
        )
    }, [
        forecastAdjustedAvg,
        municipalOrgUnitIds,
        lastThreeMonths,
        dispatch,
        municipalForecastAdjustedAvg,
    ])

    useEffect(() => {
        fetchForecastData(
            'adjusted',
            'avg',
            'district',
            districtOrgUnitIds,
            forecastAdjustedAvg.id,
            districtForecastAdjustedAvg
        )
    }, [
        forecastAdjustedAvg,
        districtOrgUnitIds,
        lastThreeMonths,
        dispatch,
        districtForecastAdjustedAvg,
    ])

    // forecast-adjusted-lowci
    useEffect(() => {
        fetchForecastData(
            'adjusted',
            'lowci',
            'fokontany',
            fokontanyOrgUnitIds,
            forecastAdjustedLowci.id,
            fokontanyForecastAdjustedLowci
        )
    }, [
        forecastAdjustedLowci,
        fokontanyOrgUnitIds,
        lastThreeMonths,
        dispatch,
        fokontanyForecastAdjustedLowci,
    ])

    useEffect(() => {
        fetchForecastData(
            'adjusted',
            'lowci',
            'municipal',
            municipalOrgUnitIds,
            forecastAdjustedLowci.id,
            municipalForecastAdjustedLowci
        )
    }, [
        forecastAdjustedLowci,
        municipalOrgUnitIds,
        lastThreeMonths,
        dispatch,
        municipalForecastAdjustedLowci,
    ])

    useEffect(() => {
        fetchForecastData(
            'adjusted',
            'lowci',
            'district',
            districtOrgUnitIds,
            forecastAdjustedLowci.id,
            districtForecastAdjustedLowci
        )
    }, [
        forecastAdjustedLowci,
        districtOrgUnitIds,
        lastThreeMonths,
        dispatch,
        districtForecastAdjustedLowci,
    ])

    // forecast-adjusted-uppci
    useEffect(() => {
        fetchForecastData(
            'adjusted',
            'uppci',
            'fokontany',
            fokontanyOrgUnitIds,
            forecastAdjustedUppci.id,
            fokontanyForecastAdjustedUppci
        )
    }, [
        forecastAdjustedUppci,
        fokontanyOrgUnitIds,
        lastThreeMonths,
        dispatch,
        fokontanyForecastAdjustedUppci,
    ])

    useEffect(() => {
        fetchForecastData(
            'adjusted',
            'uppci',
            'municipal',
            municipalOrgUnitIds,
            forecastAdjustedUppci.id,
            municipalForecastAdjustedUppci
        )
    }, [
        forecastAdjustedUppci,
        municipalOrgUnitIds,
        lastThreeMonths,
        dispatch,
        municipalForecastAdjustedUppci,
    ])

    useEffect(() => {
        fetchForecastData(
            'adjusted',
            'uppci',
            'district',
            districtOrgUnitIds,
            forecastAdjustedUppci.id,
            districtForecastAdjustedUppci
        )
    }, [
        forecastAdjustedUppci,
        districtOrgUnitIds,
        lastThreeMonths,
        dispatch,
        districtForecastAdjustedUppci,
    ])

    // historic-adjusted
    useEffect(() => {
        fetchHistoricalData(
            'adjusted',
            'district',
            districtOrgUnitIds,
            historicAdjusted.id,
            districtHistoricAdjusted
        )
    }, [
        historicAdjusted,
        districtOrgUnitIds,
        historicPeriods,
        dispatch,
        districtHistoricAdjusted,
    ])

    useEffect(() => {
        fetchHistoricalData(
            'adjusted',
            'municipal',
            municipalOrgUnitIds,
            historicAdjusted.id,
            municipalHistoricAdjusted
        )
    }, [
        historicAdjusted,
        municipalOrgUnitIds,
        historicPeriods,
        dispatch,
        municipalHistoricAdjusted,
    ])

    useEffect(() => {
        fetchHistoricalData(
            'adjusted',
            'fokontany',
            fokontanyOrgUnitIds,
            historicAdjusted.id,
            fokontanyHistoricAdjusted
        )
    }, [
        historicAdjusted,
        fokontanyOrgUnitIds,
        historicPeriods,
        dispatch,
        fokontanyHistoricAdjusted,
    ])

    return (
        <div>
            <h1>MALARIA DATA</h1>
            <div>
                Historic Adjusted Data: {JSON.stringify(historicAdjusted)}
            </div>
            <div>
                Forecast Com Cases Avg Data:{' '}
                {JSON.stringify(districtForecastAdjustedUppci)}
            </div>
        </div>
    )
}

export default MalariaTrend
