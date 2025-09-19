import React from 'react'
import html2pdf from 'html2pdf.js'
import * as XLSX from 'xlsx'

export default function ExportButtons({ steps }) {
  function exportToExcel() {
    if (!steps.length) return alert('No steps to export')
    const rows = steps.map(s => ({
      Step: s.step,
      Hazards: s.hazards.join(', '),
      'Risk (Before Controls)': s.riskBefore,
      Controls: s.controls || '',
      'Risk (After Controls)': s.riskAfter || '',
      PPE: (s.suggestedPPE||[]).concat(s.customPPE||[]).join(', ')
    }))

    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'JHA')
    XLSX.writeFile(wb, 'JHA.xlsx')
  }

  function exportToPDF() {
    if (!steps.length) return alert('No steps to export')
    const element = document.getElementById('jha-preview')
    if (!element) return alert('Preview not found')

    const opt = {
      margin: 0.5,
      filename: 'JHA.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }

    html2pdf().from(element).set(opt).save()
  }

  return (
    <div className="exports">
      <button className="btn" onClick={exportToExcel}>Export to Excel</button>
      <button className="btn" onClick={exportToPDF}>Export to PDF</button>
    </div>
  )
}
