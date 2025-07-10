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

const exportToPDF = ({ rows, columns, logoBase64 }) => {
    const doc = new jsPDF()

    const visibleColumns = columns.filter((col) => col.visible && col.accessorKey)
    const tableHeaders = visibleColumns.map((col) => col.header || col.accessorKey)
    const tableData = rows.map((row) => visibleColumns.map((col) => row.original[col.accessorKey]))

    autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
        margin: { top: 30, bottom: 20 },
        didDrawPage: (data) => {
            const pageWidth = doc.internal.pageSize.getWidth()
            if (logoBase64) { doc.addImage(logoBase64, 'PNG', 15, 8, 20, 20) }
            doc.setFontSize(12)
            doc.setFont('helvetica', 'bold')
            const headerText = 'Rapport de prévision PRIDE-C'
            const textWidth = doc.getTextWidth(headerText)
            const x = (pageWidth - textWidth) / 2
            doc.text(headerText, x, 20)
        },
    })

    const pageCount = doc.internal.getNumberOfPages()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100)

        doc.text(`Page ${i} / ${pageCount}`, 15, pageHeight - 10)
        doc.text(`Généré le : ${currentDay}-${currentMonth}-${currentYear}`, pageWidth - 60, pageHeight - 10)
    }

    doc.save(`rapport_${currentYear}_${currentMonth}_${currentDay}.pdf`)
}


const exportToExcel = ({ rows, columns }) => {
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
                return row.original[key] ?? ''
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
                    // Optional: set background color explicitly
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
