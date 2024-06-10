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

const createParams = (id, categoryCombo, periods, orgUnits) => ({
    id,
    categoryCombo,
    periods,
    orgUnits
});

const createQuery = (dimensions) => ({
    data: {
        resource: 'analytics',
        params: {
            dimension: dimensions,
            skipMeta: false,
            displayProperty: 'NAME',
        },
    },
});

export { constructDimensions, mapRowToDetails, createParams, createQuery }
