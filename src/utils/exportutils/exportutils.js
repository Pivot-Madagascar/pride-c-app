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
    fileName,
    logoBase64,
    disease      = '',
    dataSources  = '',
    orgUnitLevel = '',
    dateRange    = null,
    exportDate   = null,
}) => {
    try {
        const { day, month, year } = getFormattedDate()
        if (!fileName) {
            fileName = `PRIDE-C Export ${year}${month}${day}.png`
        }
        if (htmlElement) {
            const resolvedDateRange = dateRange ?? detectDateRange([], [])
            const metadata = buildMetadataTable({ disease, dataSources, orgUnitLevel, dateRange: resolvedDateRange, exportDate })

            // Capture the chart element first
            const chartDataUrl = await domtoimage.toPng(htmlElement, {
                cacheBust: true,
                style: { background: 'white' },
            })

            // Create metadata elements
            const metadataContainer = document.createElement('div')
            metadataContainer.style.background = 'white'
            metadataContainer.style.padding = '20px'
            metadataContainer.style.fontFamily = 'Arial, sans-serif'

            // Add logo if provided
            if (logoBase64) {
                const logoImg = document.createElement('img')
                logoImg.src = logoBase64
                logoImg.style.height = '40px'
                logoImg.style.marginBottom = '10px'
                metadataContainer.appendChild(logoImg)
            }

            // Add metadata table
            if (metadata.headers.length > 0) {
                const table = document.createElement('table')
                table.style.borderCollapse = 'collapse'
                table.style.fontSize = '12px'
                table.style.margin = '0 20px'

                // Header row
                const thead = document.createElement('thead')
                const headerRow = document.createElement('tr')
                metadata.headers.forEach(header => {
                    const th = document.createElement('th')
                    th.textContent = header
                    th.style.border = '1px solid black'
                    th.style.padding = '5px'
                    th.style.backgroundColor = '#f0f0f0'
                    th.style.textAlign = 'center'
                    headerRow.appendChild(th)
                })
                thead.appendChild(headerRow)
                table.appendChild(thead)

                // Data row
                const tbody = document.createElement('tbody')
                const dataRow = document.createElement('tr')
                metadata.values.forEach(value => {
                    const td = document.createElement('td')
                    td.textContent = value
                    td.style.border = '1px solid black'
                    td.style.padding = '5px'
                    td.style.textAlign = 'center'
                    dataRow.appendChild(td)
                })
                tbody.appendChild(dataRow)
                table.appendChild(tbody)

                metadataContainer.appendChild(table)
            }

            // Compose the images: chart first, then metadata below
            const chartImg = new Image()
            const metadataImg = new Image()

            await new Promise((resolve) => {
                chartImg.onload = () => {
                    // Now set the table width to match the chart width minus margins
                    const table = metadataContainer.querySelector('table')
                    if (table) {
                        table.style.width = `${chartImg.width - 40}px`
                        table.style.margin = '0 auto'
                    }

                    // Temporarily append metadata to body offscreen to capture
                    metadataContainer.style.position = 'absolute'
                    metadataContainer.style.top = '-9999px'
                    metadataContainer.style.left = '-9999px'
                    document.body.appendChild(metadataContainer)

                    domtoimage.toPng(metadataContainer, {
                        cacheBust: true,
                        style: { background: 'white' },
                    }).then((metadataDataUrl) => {
                        document.body.removeChild(metadataContainer)

                        metadataImg.onload = () => {
                            const canvas = document.createElement('canvas')
                            const ctx = canvas.getContext('2d')
                            canvas.width = chartImg.width // Use chart width as base
                            canvas.height = chartImg.height + metadataImg.height
                            ctx.fillStyle = 'white'
                            ctx.fillRect(0, 0, canvas.width, canvas.height)
                            ctx.drawImage(chartImg, 0, 0)
                            // Center the metadata horizontally
                            const metadataX = (canvas.width - metadataImg.width) / 2
                            ctx.drawImage(metadataImg, metadataX, chartImg.height)
                            const dataUrl = canvas.toDataURL('image/png')
                            downloadjs(dataUrl, fileName, 'image/png')
                            resolve()
                        }
                        metadataImg.src = metadataDataUrl
                    })
                }
                chartImg.src = chartDataUrl
            })
        }
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message ?? error }
    }
}