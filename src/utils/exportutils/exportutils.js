import domtoimage from 'dom-to-image-more'
import downloadjs  from 'downloadjs'
import { saveAs }  from 'file-saver'
import jsPDF        from 'jspdf'
import autoTable    from 'jspdf-autotable'

import { getFormattedDate, detectDateRange } from '@/utils/exportutils/date.js'
import { buildMetadataTable }               from '@/utils/exportutils/metadata.js'
import {
    addLogoToDoc, addHeaderToDoc,
    addMetadataTableToDoc, addPageNumbers,
} from '@/utils/exportutils/pdfhelpers.js'
import { buildExcelWorkbook } from '@/utils/exportutils/excelworkbook.js'

export const exportToPDF = async ({
    rows,
    columns,
    logoBase64,
    disease      = '',
    dataSources  = '',
    orgUnitLevel = '',
    dateRange    = null,
    exportDate   = null,
}) => {
    try {
        const { day, month, year } = getFormattedDate()
        const doc            = new jsPDF()
        const visibleColumns = columns.filter(col => col.visible && col.accessorKey)
        const tableHeaders   = visibleColumns.map(col => col.header || col.accessorKey)
        const tableData      = rows.map(row => visibleColumns.map(col => row.original[col.accessorKey]))

        const columnStyles = {}
        visibleColumns.forEach((col, index) => {
            if (['lowci', 'avg', 'uppci'].includes(col.accessorKey)) {
                columnStyles[index] = { halign: 'center' }
            }
        })

        const resolvedDateRange = dateRange ?? detectDateRange(rows, visibleColumns)
        const metadata = buildMetadataTable({ disease, dataSources, orgUnitLevel, dateRange: resolvedDateRange, exportDate })

        autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
            margin: { top: 50, bottom: 20 },
            columnStyles,
            didDrawPage: () => {
                const pageWidth = doc.internal.pageSize.getWidth()
                addLogoToDoc(doc, logoBase64)
                addHeaderToDoc(doc, pageWidth)
                addMetadataTableToDoc(doc, metadata, 30)
            },
        })

        addPageNumbers(doc)
        doc.save(`PRIDE-C Export ${year}${month}${day}.pdf`)
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message ?? error }
    }
}

export const exportToExcel = async ({
    rows,
    columns,
    logoBase64,
    disease      = '',
    dataSources  = '',
    orgUnitLevel = '',
    dateRange    = null,
    exportDate   = null,
    headerColor  = '1565C0',
}) => {
    try {
        const { day, month, year } = getFormattedDate()
        const visibleColumns = columns.filter(c => c.visible)
        const tableHeaders   = visibleColumns.map(c => c.header)
        const accessorKeys   = visibleColumns.map(c => c.accessorKey)

        const resolvedDateRange = dateRange ?? detectDateRange(rows, visibleColumns)

        const dataRows = rows.map(row =>
            accessorKeys.map(key => {
                if (key === 'periodName') {
                    const period = row.original.period
                    return `${period.slice(4)}-${period.slice(0, 4)}`
                }
                return row.original[key] ?? ''
            })
        )

        const buffer = await buildExcelWorkbook({
            visibleColumns,
            tableHeaders,
            accessorKeys,
            dataRows,
            logoBase64,
            metadataArgs: { disease, dataSources, orgUnitLevel, dateRange: resolvedDateRange, exportDate },
            headerColor,
        })

        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        saveAs(blob, `PRIDE-C Export ${year}${month}${day}.xlsx`)
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message ?? error }
    }
}

export const exportToImage = async ({
    htmlElement,
    fileName = `img_${new Date().toISOString().split('T')[0]}.png`,
}) => {
    try {
        if (htmlElement) {
            const dataUrl = await domtoimage.toPng(htmlElement, {
                cacheBust: true,
                style: { background: 'white' },
            })
            downloadjs(dataUrl, fileName, 'image/png')
        }
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message ?? error }
    }
}