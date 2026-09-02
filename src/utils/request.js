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

export const fetchPridecOrgUnitsFromDataStore = async ({ engine }) => {
    const query = {
        pridecOrgUnits: {
            resource: 'dataStore/pridec/pridecOrgUnits',
        },
    }

    try {
        const result = await engine.query(query)
        
        let ouData = result?.pridecOrgUnits?.OU
        if (!ouData) {
            ouData = result?.pridecOrgUnits
        }
        if (!ouData) {
            ouData = result?.pridecOrgUnits?.data
        }

        if (!ouData) {
            console.warn('[DataStore] No OU data found in response, full structure:', result)
            return []
        }

        if (Array.isArray(ouData)) {
            return ouData
        }

        if (typeof ouData === 'string') {
            try {
                return JSON.parse(ouData)
            } catch (parseError) {
                const converted = convertJsArrayToValidJson(ouData)
                if (converted) {
                    console.log('[DataStore] Successfully converted JS array format to JSON')
                    return converted
                }
                console.error('[DataStore] Failed to parse OU as JSON, raw value:', ouData?.substring(0, 100))
                console.error('[DataStore] Parse error:', parseError.message)
                return []
            }
        }

        return []
    } catch (error) {
        console.error('[DataStore] Failed to fetch pridecOrgUnits:', error)
        throw error
    }
}

const fetchPridecOU = async ({ engine }) => {
    const query = {
        pridecOrgUnits: {
            resource: 'organisationUnits',
            params: {
                filter: ['level:eq:5', 'dataSets.code:eq:pridec_dataset'],
                fields: ['id', 'name', 'level'],
                paging: false,
            },
        },
    }

    try {
        const result = await engine.query(query)
        const ouData = result?.pridecOrgUnits?.organisationUnits

        if (!ouData || !Array.isArray(ouData)) {
            console.warn('[OrgUnits] No OU data found in response, full structure:', result)
            return []
        }

        return ouData
    } catch (error) {
        console.error('[OrgUnits] Failed to fetch pridecOrgUnits:', error)
        throw error
    }
}

const convertJsArrayToValidJson = (jsArrayString) => {
    try {
        let converted = jsArrayString
            .replace(/,\s*([}\]])/g, '$1')
            .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
            .replace(/'/g, '"')
        return JSON.parse(converted)
    } catch (e) {
        console.error('[DataStore] Conversion failed:', e.message)
        return null
    }
}

export {
    fetchAndFormat,
    fetchForecastData,
    fetchAnalyticsData,
    fetchPridecOU
}
