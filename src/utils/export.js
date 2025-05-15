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

const exportToPDF = (rows, columns) => {
    const doc = new jsPDF()
    const tableData = rows.map((row) => [
        row.original.parentName,
        row.original.orgUnitName,
        row.original.periodName,
        row.original.lowci,
        row.original.avg,
        row.original.uppci,
    ])

    const tableHeaders = columns.filter((c) => c.visible).map((c) => c.header)

    autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
    })

    doc.save(`${currentYear}_${currentMonth}_${currentDay}.pdf`)
}

const exportToExcel = (rows, columns) => {
    const tableHeaders = columns.filter((c) => c.visible).map((c) => c.header)

    const tableData = [
        [tableHeaders],
        ...rows.map((row) => [
            row.original.parentName,
            row.original.orgUnitName,
            row.original.periodName,
            row.original.lowci,
            row.original.avg,
            row.original.uppci,
        ]),
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
