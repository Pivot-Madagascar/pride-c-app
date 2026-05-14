import autoTable from 'jspdf-autotable'
import { getFormattedDate } from '@/utils/exportutils/date.js'

const PRIDE_C_LOGO_RATIO = 602 / 558
const LOGO_HEIGHT        = 13.33 

export const precompressLogo = async (logoBase64) => {
    if (!logoBase64) { return null }

    const src = logoBase64.startsWith('data:')
        ? logoBase64
        : `data:image/png;base64,${logoBase64}`

    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
            const canvas = document.createElement('canvas')
            const scale  = Math.min(1, 80 / img.naturalHeight)
            canvas.width  = Math.round(img.naturalWidth  * scale)
            canvas.height = Math.round(img.naturalHeight * scale)
            const ctx = canvas.getContext('2d')
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            resolve(canvas.toDataURL('image/jpeg', 0.7))
        }
        img.onerror = (e) => reject(e)
        img.src = src
    })
}

export const addLogoToDoc = (doc, compressedLogo) => {
    if (!compressedLogo) {return}
    const logoWidth = LOGO_HEIGHT * PRIDE_C_LOGO_RATIO
    doc.addImage(compressedLogo, 'JPEG', 15, 8, logoWidth, LOGO_HEIGHT)
}

export const addHeaderToDoc = (doc, pageWidth) => {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    const text = "Rapport de prévision généré par l'application PRIDE-C"
    const x = (pageWidth - doc.getTextWidth(text)) / 2
    doc.text(text, x, 18)
}

export const addMetadataTableToDoc = (doc, { headers, values }, startY = 30) => {
    if (headers.length === 0) { return }
    autoTable(doc, {
        head: [headers],
        body: [values],
        startY,
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

export const addPageNumbers = (doc) => {
    const { label: formattedDate } = getFormattedDate()
    const pageCount  = doc.internal.getNumberOfPages()
    const pageWidth  = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100)
        doc.text(`Page ${i} / ${pageCount}`,          15,           pageHeight - 10)
        doc.text(`Généré le : ${formattedDate}`,       pageWidth - 60, pageHeight - 10)
    }
}