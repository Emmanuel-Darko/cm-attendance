import jsPDF from 'jspdf'
import QRCode from 'qrcode'

interface Kid {
  id: string
  full_name: string
}

interface PDFConfig {
  qrSize: number
  cols: number
  padding: number
  margin: number
  nameHeight: number
}

export const usePDFExport = () => {
  const defaultConfig: PDFConfig = {
    qrSize: 50,
    cols: 3,
    padding: 10,
    margin: 15,
    nameHeight: 8
  }

  const generateQRCodesPDF = async (kids: Kid[], config = defaultConfig) => {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    const { qrSize, cols, padding, margin, nameHeight } = config
    const cellWidth = (pageWidth - (margin * 2) - (padding * (cols - 1))) / cols
    const cellHeight = qrSize + nameHeight + 5
    const rows = Math.floor((pageHeight - (margin * 2)) / (cellHeight + padding))

    let currentRow = 0
    let currentCol = 0

    for (let i = 0; i < kids.length; i++) {
      const kid = kids[i]

      if (currentRow >= rows) {
        pdf.addPage()
        currentRow = 0
        currentCol = 0
      }

      const x = margin + (currentCol * (cellWidth + padding))
      const y = margin + (currentRow * (cellHeight + padding))

      try {
        const qrDataUrl = await QRCode.toDataURL(kid.id, {
          width: 300,
          margin: 1,
          color: { dark: '#4F46E5', light: '#FFFFFF' }
        })

        pdf.addImage(qrDataUrl, 'PNG', x, y, qrSize, qrSize)

        // Child name
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(0, 0, 0)
        const nameWidth = pdf.getTextWidth(kid.full_name)
        const nameX = x + (qrSize / 2) - (nameWidth / 2)
        pdf.text(kid.full_name, nameX, y + qrSize + 4)

        // Child ID
        pdf.setFontSize(7)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(128, 128, 128)
        const idText = `ID: ${kid.id.slice(0, 12)}...`
        const idWidth = pdf.getTextWidth(idText)
        const idX = x + (qrSize / 2) - (idWidth / 2)
        pdf.text(idText, idX, y + qrSize + 7)

        currentCol++
        if (currentCol >= cols) {
          currentCol = 0
          currentRow++
        }
      } catch (error) {
        console.error(`Failed to generate QR for ${kid.full_name}:`, error)
      }
    }

    // Add footers
    const totalPages = pdf.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(100, 100, 100)
      
      const footerText = `Generated on ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })} • Page ${i} of ${totalPages}`
      
      pdf.text(footerText, pageWidth / 2, pageHeight - 5, { align: 'center' })
    }

    const fileName = `QR_Codes_${new Date().toISOString().split('T')[0]}_${kids.length}_children.pdf`
    pdf.save(fileName)

    return { success: true, fileName, count: kids.length }
  }

  return { generateQRCodesPDF }
}