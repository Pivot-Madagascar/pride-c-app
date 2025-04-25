const groupByOrgUnit = (data) => {
    return data.reduce((acc, item) => {
        const { orgUnit, period, value } = item
        if (!acc[orgUnit]) {
            acc[orgUnit] = { orgUnit, values: [] }
        }
        acc[orgUnit].values.push({ period, value: parseFloat(value) })
        return acc
    }, {})
}

const sortValuesByPeriod = (groupedData) => {
    for (const key in groupedData) {
        groupedData[key].values.sort((a, b) => a.period.localeCompare(b.period))
    }
}

const transformToArray = (groupedData) => {
    return Object.values(groupedData)
}

const aggregateByOrgUnit = (data) => {
    const groupedData = groupByOrgUnit(data)
    sortValuesByPeriod(groupedData)
    return transformToArray(groupedData)
}

const collectValuesByOrgUnit = (data) => {
    const groupedData = groupByOrgUnit(data);
    sortValuesByPeriod(groupedData);
    
    // Transform the values to only keep the value part
    for (const key in groupedData) {
        groupedData[key].values = groupedData[key].values.map(item => item.value);
    }
    
    return transformToArray(groupedData);
}

const formatForecast = (data) => {
    const aggregatedData = aggregateByOrgUnit(data)
    return aggregatedData.reduce((acc, item) => {
        const orgUnit = item.orgUnit
        const values = item.values
        acc[orgUnit] = values
        return acc
    }, {})
}

const regroupData = (data) => {
    const resultMap = new Map();

    // First pass: group by path
    data.forEach(item => {
        const pathKey = JSON.stringify(item.path);
        
        if (!resultMap.has(pathKey)) {
            resultMap.set(pathKey, {
                path: item.path,
                value: {}
            });
        }
        
        const valueKey = Object.keys(item.value)[0];
        const valueObj = item.value[valueKey];
        
        if (!resultMap.get(pathKey).value[valueKey]) {
            resultMap.get(pathKey).value[valueKey] = [];
        }
        
        resultMap.get(pathKey).value[valueKey].push({
            period: valueObj.period,
            value: valueObj.value
        });
    });

    // Convert map to array and sort the nested periods for each value key
    const result = Array.from(resultMap.values()).map(group => {
        Object.keys(group.value).forEach(key => {
            group.value[key].sort((a, b) => a.period.localeCompare(b.period));
        });
        return group;
    });

    return result;
}


export {
    formatForecast,
    regroupData
}