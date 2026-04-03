export const toArgb = (hex) => {
    const clean = hex.replace('#', '')
    return clean.length === 6 ? `FF${clean.toUpperCase()}` : clean.toUpperCase()
}

export const isLightColor = (hex) => {
    const clean = hex.replace('#', '').slice(-6)
    const r = parseInt(clean.slice(0, 2), 16)
    const g = parseInt(clean.slice(2, 4), 16)
    const b = parseInt(clean.slice(4, 6), 16)
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5
}

export const COLORS = {
    white:    'FFFFFFFF',
    black:    'FF000000',
    greyText: 'FF555555',
    border:   'FFBBBBBB',
}

export const FILLS = {
    title:  { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } },
    white:  { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
    alt:    { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFEFEF' } },
    grey:   { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } },
    header: (headerArgb) => ({ type: 'pattern', pattern: 'solid', fgColor: { argb: headerArgb } }),
}

export const THIN_BORDER = {
    top:    { style: 'thin', color: { argb: COLORS.border } },
    bottom: { style: 'thin', color: { argb: COLORS.border } },
    left:   { style: 'thin', color: { argb: COLORS.border } },
    right:  { style: 'thin', color: { argb: COLORS.border } },
}

export const applyStyle = (cell, {
    fill,
    fontColor,
    bold       = false,
    sz         = 10,
    horizontal = 'left',
    border     = false,
    numFmt     = null,
    indent     = 0,
}) => {
    cell.font      = { name: 'Arial', size: sz, bold, color: { argb: fontColor } }
    cell.fill      = fill
    cell.alignment = { horizontal, vertical: 'middle', wrapText: false, indent }
    if (border)  cell.border = THIN_BORDER
    if (numFmt)  cell.numFmt = numFmt
}

export const fillEmptyCell = (cell) =>
    applyStyle(cell, { fill: FILLS.white, fontColor: COLORS.black })

export const buildColumnWidths = ({ visibleColumns, metadataHeaders, tableHeaders, dataRows }) => {
    const PADDING   = 2
    const MIN_WIDTH = 8
    const LOGO_COL  = 4

    const widths = visibleColumns.map((_, i) => {
        const metaLen   = metadataHeaders[i]?.length ?? 0
        const headerLen = tableHeaders[i]?.length    ?? 0
        const dataLen   = dataRows.reduce((max, row) => {
            const val = row[i]
            return Math.max(max, val != null ? String(val).length : 0)
        }, 0)
        return Math.max(Math.max(metaLen, headerLen, dataLen) + PADDING, MIN_WIDTH)
    })

    return [{ width: LOGO_COL }, ...widths.map(w => ({ width: w }))]
}