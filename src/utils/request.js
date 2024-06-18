import { regroupData } from "./formating"

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

const mapRowToDetails = (row, items) => ({
    dataElement: row[0],
    categoryOptionCombo: row[1],
    period: row[2],
    periodName: items[row[2]].name,
    orgUnit: row[3],
    orgUnitName: items[row[3]].name,
    value: row[4],
})

const mapRowToDetailsClimate = (row, items) => {
    try {
        const period = row[1];
        const orgUnit = row[2];
        const value = row[3];

        return {
            period,
            orgUnit,
            value
        };
    } catch (error) {
        console.error('Error in mapRowToDetailsClimate:', error);
        console.log('Row:', row);
        console.log('Items:', items);
        throw error;
    }
};


const createParams = (id, categoryCombo, periods, orgUnits) => ({
    id,
    categoryCombo,
    periods,
    orgUnits,
})

const createClimateParams = (id, periods, orgUnits) => ({
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

const fetchAndFormat = async (dataElement, engine, periods, orgUnits) => {
    const dimensions = constructDimensions(createClimateParams(dataElement, periods, orgUnits))
    const query = createQuery(dimensions)
    const { data } = await engine.query(query)
    const { items } = data.metaData
    const rows = data.rows
    return regroupData(rows.map(row => mapRowToDetailsClimate(row, items)))
}

const getValuesForYear = (year, data, targetOrgUnit) => {
    if (data && data[year] && targetOrgUnit && data[year][targetOrgUnit]) {
        return data[year][targetOrgUnit]['values'] || []
    }
    return []
}

const getValuesForYearDistrict = (year, data) => {
    if (data && data[year]) {
        return data[year]['values'] || []
    }
    return []
}


export {
    constructDimensions,
    mapRowToDetails,
    mapRowToDetailsClimate,
    createParams,
    createClimateParams,
    createQuery,
    fetchAndFormat,
    getValuesForYear,
    getValuesForYearDistrict
}
