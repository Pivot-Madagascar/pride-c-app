import { regroupData, newRegroupData, aggregateByOrgUnit, collectValuesByOrgUnit } from '@/utils/formatting'

const constructDimensions = ({ id, categoryCombo, periods, orgUnits }) => {
    const dimensions = []

    if (id) {
        dimensions.push(`dx:${id}`)
    }

    if (categoryCombo) {
        dimensions.push(`co:${JSON.stringify(categoryCombo.id)}`)
    }

    if (periods && periods.length > 0) {
        dimensions.push(`pe:${periods.join(';')}`)
    }

    if (orgUnits && orgUnits.length > 0) {
        dimensions.push(`ou:${orgUnits.join(';')}`)
    }

    return dimensions
}

const mapRowToDetails = (row, items) => {
    try {
        const dataElement = row[0]
        const period = row[1]
        const orgUnit = row[2]
        const value = row[3]

        return {
            dataElement,
            period,
            orgUnit,
            value,
        }
    } catch (error) {
        console.error('Error in mapRowToDetails:', error)
        console.log('Row:', row)
        console.log('Items:', items)
        throw error
    }
}

const createParams = (id, periods, orgUnits) => ({
    id,
    periods,
    orgUnits,
})

const createQuery = (dimensions) => ({
    data: {
        resource: 'analytics',
        params: {
            dimension: dimensions,
            skipMeta: false,
            displayProperty: 'NAME',
        },
    },
})

const fetchAnalyticsData = async ({ 
    dataElements, 
    periods, 
    orgUnits, 
    engine 
}) => {
    const dimensions = [
        `dx:${dataElements.join(';')}`, 
        `pe:${periods.join(';')}`, 
        `ou:${orgUnits.join(';')}`, 
    ]

    const query = createQuery(dimensions)

    try {
        const { data } = await engine.query(query)
        const { items } = data.metaData
        const { rows } = data
        return rows.map((row) => mapRowToDetails(row, items))
    } catch(err) {
        console.error(err)
    } 
}

const fetchAndFormat = async (dataElement, engine, periods, orgUnits) => {
    const dimensions = constructDimensions(
        createParams(dataElement, periods, orgUnits)
    )

    if (periods.length === 1) {
        console.log(dimensions, 'dimensions')
    }
    const query = createQuery(dimensions)
    const { data } = await engine.query(query)
    const { items } = data.metaData
    const { rows } = data
    const payload = rows.map((row) => mapRowToDetails(row, items))
    return collectValuesByOrgUnit(payload)
    
    // return regroupData(rows.map((row) => mapRowToDetails(row, items)))
}

const fetchForecastData = async (dataElement, engine, periods, orgUnits) => {
    const dimensions = constructDimensions(
        createParams(dataElement, periods, orgUnits)
    )

    if (periods.length === 1) {
        console.log(dimensions, 'dimensions')
    }
    const query = createQuery(dimensions)
    const { data } = await engine.query(query)
    const { items } = data.metaData
    const rows = data.rows
    return newRegroupData(rows.map((row) => mapRowToDetails(row, items)))
}

export {
    fetchAndFormat,
    fetchForecastData,
    fetchAnalyticsData
}
