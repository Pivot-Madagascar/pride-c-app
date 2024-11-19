const fillMonthlyValues = (data) => {
    const result = Array(12).fill(null)
    data.forEach((item) => {
        const monthIndex = parseInt(item.period.slice(-2)) - 1
        result[monthIndex] = item.value
    })
    return result
}

const updateLastNull = (resultArray, fullYearData) => {
    const lastNullIndex = resultArray.lastIndexOf(null)
    if (lastNullIndex !== -1 && fullYearData[lastNullIndex]) {
        resultArray[lastNullIndex] = fullYearData[lastNullIndex].value
    }
    return resultArray
}

const generateQuarterlyForecastChart = (threeMonthData, annualData) => {
    const result = Array(12).fill(null)

    threeMonthData.forEach((item) => {
        const monthIndex = parseInt(item.period.slice(-2)) - 1 
        result[monthIndex] = item.value
    })

    const lastNullIndex = result.lastIndexOf(null)

    if (lastNullIndex !== -1 && annualData[lastNullIndex]) {
        result[lastNullIndex] = annualData[lastNullIndex].value
    }

    return result
}

export { fillMonthlyValues, updateLastNull, generateQuarterlyForecastChart }
