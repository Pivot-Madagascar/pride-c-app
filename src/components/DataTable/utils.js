export const replaceNulls = (data) => {
    return data.map(item => ({
        ...item,
        lowci: item.lowci === null || Number.isNaN(item.lowci) || item.lowci === undefined ? 0 : item.lowci,
        avg: item.avg === null || Number.isNaN(item.avg) || item.avg === undefined ? 0 : item.avg,
        uppci: item.uppci === null || Number.isNaN(item.uppci) || item.uppci === undefined ? 0 : item.uppci
    }))
}