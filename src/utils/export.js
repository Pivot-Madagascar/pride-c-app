import domtoimage from 'dom-to-image-more'
import downloadjs from 'downloadjs'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const currentDate = new Date()
const currentYear = currentDate.getFullYear()
const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0')
const currentDay = String(currentDate.getDate()).padStart(2, '0')
const formattedDate = `${currentDay}-${currentMonth}-${currentYear}`

const PRIDE_C_LOGO_RATIO = 602 / 558
const LOGO_HEIGHT = 13.33

const buildMetadataTable = (metadata) => {
    const headers = []
    const values = []

    if (metadata.disease) {
        headers.push('Maladie')
        values.push(metadata.disease)
    }

    if (metadata.dataSources) {
        headers.push('Sources de données')
        values.push(metadata.dataSources)
    }

    if (metadata.orgUnitLevel) {
        headers.push('Niveau de l\'unité organisationnelle')
        values.push(metadata.orgUnitLevel)
    }

    if (metadata.dateRange && (metadata.dateRange.start || metadata.dateRange.end)) {
        const dateText = metadata.dateRange.start && metadata.dateRange.end
            ? `${metadata.dateRange.start} - ${metadata.dateRange.end}`
            : metadata.dateRange.start || metadata.dateRange.end
        headers.push('Periode')
        values.push(dateText)
    }

    headers.push('Date d\'exportation')
    values.push(metadata.exportDate || formattedDate)

    return { headers, values }
}

const addLogoToDoc = (doc, logoBase64) => {
    if (!logoBase64) {
        return
    }

    const logoWidth = LOGO_HEIGHT * PRIDE_C_LOGO_RATIO
    doc.addImage(logoBase64, 'PNG', 15, 8, logoWidth, LOGO_HEIGHT)
}

const addHeaderToDoc = (doc, pageWidth) => {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    const headerText = 'Rapport de prévision généré par l\'application PRIDE-C'
    const textWidth = doc.getTextWidth(headerText)
    const x = (pageWidth - textWidth) / 2
    doc.text(headerText, x, 18)
}

const addPageNumbers = (doc) => {
    const pageCount = doc.internal.getNumberOfPages()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100)
        doc.text(`Page ${i} / ${pageCount}`, 15, pageHeight - 10)
        doc.text(`Généré le : ${formattedDate}`, pageWidth - 60, pageHeight - 10)
    }
}

const exportToPDF = async ({ rows, columns, logoBase64, disease = '', dataSources = '', orgUnitLevel = '', dateRange = null, exportDate = null }) => {
    try {
        const doc = new jsPDF()
        const visibleColumns = columns.filter((col) => col.visible && col.accessorKey)
        const tableHeaders = visibleColumns.map((col) => col.header || col.accessorKey)
        const tableData = rows.map((row) => visibleColumns.map((col) => row.original[col.accessorKey]))

        // Calculate column indices for centering numeric columns
        const columnStyles = {}
        visibleColumns.forEach((col, index) => {
            if (['lowci', 'avg', 'uppci'].includes(col.accessorKey)) {
                columnStyles[index] = { halign: 'center' }
            }
        })

        // Detect date range from periodName column
        let detectedDateRange = dateRange
        if (!detectedDateRange) {
            const periodNameColumn = visibleColumns.find(col => col.accessorKey === 'periodName')
            if (periodNameColumn && rows.length > 0) {
                const periods = rows.map(row => row.original.periodName).filter(Boolean)
                if (periods.length > 0) {
                    // Sort periods to find first and last
                    const sortedPeriods = [...periods].sort((a, b) => {
                        // Parse period names 
                        const parsePeriod = (period) => {
                            const parts = period.split(' ')
                            if (parts.length === 2) {
                                const monthNames = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 
                                    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
                                const monthIndex = monthNames.findIndex(m => 
                                    parts[0].toLowerCase().startsWith(m.toLowerCase())
                                )
                                if (monthIndex !== -1) {
                                    return new Date(parseInt(parts[1]), monthIndex, 1)
                                }
                            }
                            return new Date(period)
                        }
                        return parsePeriod(a) - parsePeriod(b)
                    })
                    detectedDateRange = {
                        start: sortedPeriods[0],
                        end: sortedPeriods[sortedPeriods.length - 1]
                    }
                }
            }
        }

        autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
            margin: { top: 50, bottom: 20 },
            columnStyles,
            didDrawPage: () => {
                const pageWidth = doc.internal.pageSize.getWidth()
                addLogoToDoc(doc, logoBase64)
                addHeaderToDoc(doc, pageWidth)

                const { headers, values } = buildMetadataTable({ disease, dataSources, orgUnitLevel, dateRange: detectedDateRange, exportDate })

                if (headers.length > 0) {
                    autoTable(doc, {
                        head: [headers],
                        body: [values],
                        startY: 30,
                        margin: { left: 15, right: 15 },
                        styles: {
                            fontSize: 7,
                            cellPadding: 2,
                            lineColor: [0, 0, 0],
                            lineWidth: 0.1,
                            halign: 'center',
                        },
                        headStyles: {
                            fontStyle: 'bold',
                            fillColor: [240, 240, 240],
                            textColor: [0, 0, 0],
                        },
                        theme: 'grid',
                    })
                }
            },
        })

        addPageNumbers(doc)
        doc.save(`PRIDE-C Export ${currentYear}${currentMonth}${currentDay}.pdf`)
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message || error }
    }
}

const exportToExcel = async ({ rows, columns }) => {
    try {
        const visibleColumns = columns.filter((c) => c.visible)
        const tableHeaders = visibleColumns.map((c) => c.header)
        const accessorKeys = visibleColumns.map((c) => c.accessorKey)

        const tableData = [
            tableHeaders,
            ...rows.map((row) =>
                accessorKeys.map((key) => {
                    if (key === 'periodName') {
                        const period = row.original.period
                        return `${period.slice(4)}-${period.slice(0, 4)}`
                    }
                    return row.original[key] || ''
                })
            ),
        ]

        const worksheet = XLSX.utils.aoa_to_sheet(tableData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Pride-C table')

        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        })

        const blob = new Blob([excelBuffer], {
            type: 'application/octet-stream',
        })

        saveAs(blob, `${currentYear}_${currentMonth}_${currentDay}.xlsx`)
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message || error }
    }
}

const exportToImage = async ({
    htmlElement,
    fileName = `img_${new Date().toISOString().split('T')[0]}.png`,
}) => {
    try {
        if (htmlElement) {
            const dataUrl = await domtoimage.toPng(htmlElement, {
                cacheBust: true,
                style: {
                    background: 'white',
                },
            })
            downloadjs(dataUrl, fileName, 'image/png')
        }
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message || error }
    }
}

export { exportToExcel, exportToPDF, exportToImage }
