import ExcelJS   from 'exceljs'
import { getFormattedDate }   from '@/utils/exportutils/date.js'
import { buildMetadataTable } from '@/utils/exportutils/metadata.js'
import {
    toArgb, isLightColor,
    COLORS, FILLS,
    applyStyle, fillEmptyCell, buildColumnWidths,
} from '@/utils/exportutils/excelstyles.js'

const NUMERIC_KEYS = new Set(['lowci', 'avg', 'uppci'])

export const buildExcelWorkbook = async ({
    visibleColumns,
    tableHeaders,
    accessorKeys,
    dataRows,
    logoBase64,
    metadataArgs,
    headerColor = '1565C0',
}) => {
    const { day, month, year, label: formattedDate } = getFormattedDate()
    const { headers: metadataHeaders, values: metadataValues } = buildMetadataTable(metadataArgs)

    const headerArgb     = toArgb(headerColor)
    const headerTextArgb = isLightColor(headerColor) ? 'FF000000' : 'FFFFFFFF'
    const headerFill     = FILLS.header(headerArgb)

    const totalCols = Math.max(metadataHeaders.length, tableHeaders.length)

    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'PRIDE-C'
    workbook.created = new Date()

    const worksheet = workbook.addWorksheet('Pride-C table', {
        pageSetup: {
            paperSize: 9, orientation: 'portrait',
            fitToPage: false, horizontalDpi: 96, verticalDpi: 96,
        },
        pageMargins: { left: 0.5, right: 0.5, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 },
        headerFooter: {
            oddFooter:  `&L&"Arial"&9Généré le : ${formattedDate}&C&"Arial"&9Application PRIDE-C&R&"Arial"&9Page &P / &N`,
            evenFooter: `&L&"Arial"&9Généré le : ${formattedDate}&C&"Arial"&9Application PRIDE-C&R&"Arial"&9Page &P / &N`,
        },
    })

    worksheet.columns = buildColumnWidths({ visibleColumns, metadataHeaders, tableHeaders, dataRows })

    const addEmptyRow = (height = 6) => {
        const r = worksheet.addRow(Array(totalCols + 1).fill(''))
        r.height = height
        return r
    }

    const addHeaderRow = (headerValues, height = 18) => {
        const row = worksheet.addRow(['', ...headerValues, ...Array(Math.max(0, totalCols - headerValues.length)).fill('')])
        row.height = height
        row.eachCell((cell, col) => {
            if (col === 1) { fillEmptyCell(cell); return }
            applyStyle(cell, { fill: headerFill, fontColor: headerTextArgb, horizontal: 'center', border: true })
        })
        return row
    }

    const titleRow = worksheet.addRow([
        '',
        "Rapport de prévision généré par l'application PRIDE-C",
        ...Array(totalCols - 1).fill(''),
    ])
    titleRow.height = 40

    applyStyle(titleRow.getCell(1), { fill: FILLS.title, fontColor: COLORS.black, border: true })
    for (let c = 2; c <= totalCols + 1; c++) {
        applyStyle(titleRow.getCell(c), {
            fill: FILLS.title, fontColor: COLORS.black,
            bold: true, sz: 13, horizontal: 'center', border: true,
        })
    }
    worksheet.mergeCells(1, 2, 1, totalCols + 1)

    if (logoBase64) {
        const base64Data = logoBase64.includes(',') ? logoBase64.split(',')[1] : logoBase64

        const logoDimensions = await new Promise((resolve) => {
            const img = new Image()
            img.onload  = () => resolve({ w: img.naturalWidth, h: img.naturalHeight })
            img.onerror = () => resolve({ w: 602, h: 558 })
            img.src = logoBase64.startsWith('data:') ? logoBase64 : `data:image/png;base64,${base64Data}`
        })

        const logoImageId  = workbook.addImage({ base64: base64Data, extension: 'png' })
        const rowHeightEmu = 40 * 9525
        const logoWidthEmu = Math.round(rowHeightEmu * (logoDimensions.w / logoDimensions.h))

        worksheet.addImage(logoImageId, {
            tl: { col: 0, row: 0 },
            ext: { width: logoWidthEmu / 9525, height: 40 },
            editAs: 'oneCell',
        })
    }

    addEmptyRow(8)
    addEmptyRow(8)

    addHeaderRow(metadataHeaders)

    const metaValueRow = worksheet.addRow([
        '', ...metadataValues,
        ...Array(Math.max(0, totalCols - metadataValues.length)).fill(''),
    ])
    metaValueRow.height = 18
    metaValueRow.eachCell((cell, col) => {
        if (col === 1) { fillEmptyCell(cell); return }
        applyStyle(cell, { fill: FILLS.white, fontColor: COLORS.black, horizontal: 'center', border: true })
    })

    addEmptyRow(8)

    addHeaderRow(tableHeaders)

    dataRows.forEach((row, rowIndex) => {
        const fill    = rowIndex % 2 === 0 ? FILLS.white : FILLS.alt
        const excelRow = worksheet.addRow(['', ...row])
        excelRow.height = 18
        excelRow.eachCell((cell, col) => {
            if (col === 1) { fillEmptyCell(cell); return }
            const key       = accessorKeys[col - 2]
            const isNumeric = key !== undefined && (NUMERIC_KEYS.has(key) || typeof cell.value === 'number')
            applyStyle(cell, {
                fill,
                fontColor:  COLORS.black,
                horizontal: isNumeric ? 'right' : 'left',
                border:     true,
                numFmt:     isNumeric ? '# ##0' : null,
                indent:     1,
            })
        })
    })

    addEmptyRow(6)

    const sigRow = worksheet.addRow([
        '',
        `Généré le : ${formattedDate}`,
        ...Array(Math.max(0, totalCols - 2)).fill(''),
        'Application PRIDE-C',
    ])
    sigRow.height = 16

    if (totalCols > 2) {
        worksheet.mergeCells(sigRow.number, 2, sigRow.number, totalCols)
    }

    sigRow.eachCell((cell, col) => {
        if (col === 1) { return }
        applyStyle(cell, {
            fill: FILLS.grey, fontColor: COLORS.greyText,
            sz: 9, horizontal: col === 2 ? 'left' : 'right',
            border: true, indent: 1,
        })
    })

    return workbook.xlsx.writeBuffer()
}