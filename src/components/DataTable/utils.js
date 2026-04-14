export const getLastThreeMonths = () => {
    const currentDate = new Date()
    const lastThreeMonths = []

    for (let i = 1; i < 4; i++) {
        const month = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + i,
            1
        )
        const yearMonth = month.toISOString().slice(0, 7).replace('-', '')
        lastThreeMonths.unshift(yearMonth)
    }

    return lastThreeMonths
}

export const replaceNulls = (data) => {
    return data.map(item => ({
        ...item,
        lowci: item.lowci === null || Number.isNaN(item.lowci) || item.lowci === undefined ? 0 : item.lowci,
        avg: item.avg === null || Number.isNaN(item.avg) || item.avg === undefined ? 0 : item.avg,
        uppci: item.uppci === null || Number.isNaN(item.uppci) || item.uppci === undefined ? 0 : item.uppci
    }))
}
