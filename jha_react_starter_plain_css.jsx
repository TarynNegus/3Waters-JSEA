# JHA React Starter (Plain CSS)

This single-file project scaffold contains a compact React + Vite starter for a Job Hazard Analysis (JHA) app with the features you requested:

- Add multiple job steps
- Each step: description, hazards (multi), initial risk (before controls)
- Add controls later and set "risk after controls"
- Suggested PPE auto-populated from hazard(s) (editable per step)
- Export to Excel (SheetJS) and PDF (html2pdf.js)
- Optional example backend (Node/Express + Nodemailer) to email the PDF as an attachment

> NOTE: This document contains multiple source files concatenated for convenience. Copy each section into the matching file in a Vite React project (or use the steps below to create a new project).

---

/* -------------------------------------------------------------------------- */
/* FILE: README.md                                                            */
/* -------------------------------------------------------------------------- */

# JHA React Starter (plain CSS)

## Quick start

1. Create a Vite React project (or use your own):

```bash
npm create vite@latest jha-app -- --template react
cd jha-app
```

2. Install dependencies

```bash
npm install html2pdf.js xlsx
# Optional backend email server requires:
# npm install express nodemailer cors body-parser
```

3. Replace / add the files from this scaffold into `src/` and `server/` as shown.

4. Run the dev server

```bash
npm install
npm run dev
```

5. Open http://localhost:5173

## Files included in the scaffold (paste into your project):
- src/main.jsx
- src/App.jsx
- src/components/JobStepForm.jsx
- src/components/ExportButtons.jsx
- src/utils/hazardToPPE.js
- src/index.css
- server/email-server.js (optional)

---

/* -------------------------------------------------------------------------- */
/* FILE: package.json (example snippet - paste into your project's package.json) */
/* -------------------------------------------------------------------------- */

{
  "name": "jha-app",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "start-server": "node server/email-server.js"
  }
}

/* -------------------------------------------------------------------------- */
/* FILE: src/main.jsx                                                         */
/* -------------------------------------------------------------------------- */

import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

/* -------------------------------------------------------------------------- */
/* FILE: src/utils/hazardToPPE.js                                              */
/* -------------------------------------------------------------------------- */

// Basic hazard -> PPE mapping. Edit/extend this object to match company policy.
const hazardToPPE = {
  "Chemical Exposure": ["Gloves", "Goggles", "Apron"],
  "Falling Objects": ["Hard Hat", "Steel Toe Boots"],
  "Loud Noise": ["Ear Protection"],
  "Dust/Inhalation Risk": ["Respirator", "Dust Mask"],
  "Sharp Objects": ["Cut-Resistant Gloves"],
  "Heat/Burn": ["Heat-Resistant Gloves", "Face Shield"],
  "Electric Shock": ["Insulated Gloves", "Voltage-rated Boots"],
  "Slips/Trips": ["High-Visibility Vest", "Nonslip Boots"],
}

export default hazardToPPE

/* -------------------------------------------------------------------------- */
/* FILE: src/components/JobStepForm.jsx                                        */
/* -------------------------------------------------------------------------- */

import React, { useState } from 'react'
import hazardToPPE from '../utils/hazardToPPE'

export default function JobStepForm({ onAdd }) {
  const [stepText, setStepText] = useState('')
  const [hazardsInput, setHazardsInput] = useState('')
  const [riskBefore, setRiskBefore] = useState('Medium')

  function parseHazards(raw) {
    return raw
      .split(',')
      .map(h => h.trim())
      .filter(Boolean)
  }

  function computePPE(hazards) {
    const all = hazards.flatMap(h => hazardToPPE[h] || [])
    return Array.from(new Set(all))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const hazards = parseHazards(hazardsInput)
    const suggestedPPE = computePPE(hazards)

    if (!stepText.trim()) return alert('Please add a Job Step description')

    const newStep = {
      id: Date.now(),
      step: stepText,
      hazards,
      riskBefore,
      controls: '',
      riskAfter: '',
      suggestedPPE,
      customPPE: []
    }

    onAdd(newStep)
    setStepText('')
    setHazardsInput('')
    setRiskBefore('Medium')
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h3>Add Job Step</h3>

      <label>Job Step</label>
      <input
        value={stepText}
        onChange={e => setStepText(e.target.value)}
        placeholder="Describe the task or step"
      />

      <label>Hazards (comma separated)</label>
      <input
        value={hazardsInput}
        onChange={e => setHazardsInput(e.target.value)}
        placeholder="e.g. Loud Noise, Falling Objects"
      />

      <label>Initial Risk Level (before controls)</label>
      <select value={riskBefore} onChange={e => setRiskBefore(e.target.value)}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <div style={{textAlign:'right'}}>
        <button type="submit" className="btn">Add Step</button>
      </div>
    </form>
  )
}

/* -------------------------------------------------------------------------- */
/* FILE: src/components/ExportButtons.jsx                                      */
/* -------------------------------------------------------------------------- */

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
      PPE: (s.suggestedPPE || []).concat(s.customPPE || []).join(', ')
    }))

    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'JHA')
    XLSX.writeFile(wb, 'JHA.xlsx')
  }

  async function exportToPDF() {
    if (!steps.length) return alert('No steps to export')
    const element = document.getElementById('jha-preview')
    if (!element) return alert('Preview not found')

    const opt = {
      margin:       0.5,
      filename:     'JHA.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    }

    html2pdf().from(element).set(opt).save()
  }

  // Example: generate PDF blob and return base64 (used if you want to POST to a server)
  function generatePdfBase64() {
    return new Promise((resolve, reject) => {
      const element = document.getElementById('jha-preview')
      if (!element) return reject(new Error('Preview element not found'))

      // create PDF then read blob as base64
      html2pdf().from(element).toPdf().get('pdf').then((pdf) => {
        const blob = pdf.output('blob')
        const reader = new FileReader()
        reader.onloadend = () => {
          // reader.result is a data:application/pdf;base64,.... string
          resolve(reader.result)
        }
        reader.onerror = err => reject(err)
        reader.readAsDataURL(blob)
      }).catch(reject)
    })
  }

  async function emailViaServer() {
    if (!steps.length) return alert('No steps to email')
    try {
      const dataUrl = await generatePdfBase64()
      // POST to your backend endpoint - see server/email-server.js that expects a base64 string
      const resp = await fetch('/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: '', // fill recipient on client or server
          subject: 'Job Hazard Analysis',
          text: 'Attached is the JHA PDF',
          attachmentName: 'JHA.pdf',
          attachmentBase64: dataUrl.split(',')[1] // strip data:<mime>;base64,
        })
      })

      const json = await resp.json()
      if (json.ok) alert('Email sent (server responded OK)')
      else alert('Server error sending email: ' + (json.error || 'unknown'))
    } catch (err) {
      console.error(err)
      alert('Error generating or sending PDF: ' + err.message)
    }
  }

  return (
    <div className="exports">
      <button className="btn" onClick={exportToExcel}>Export to Excel</button>
      <button className="btn" onClick={exportToPDF}>Export to PDF</button>
      <button className="btn" onClick={emailViaServer}>Email PDF (via server)</button>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* FILE: src/App.jsx                                                           */
/* -------------------------------------------------------------------------- */

import React, { useState } from 'react'
import JobStepForm from './components/JobStepForm'
import ExportButtons from './components/ExportButtons'

export default function App() {
  const [steps, setSteps] = useState([])

  function addStep(step) {
    setSteps(prev => [step, ...prev])
  }

  function removeStep(id) {
    if (!confirm('Remove this step?')) return
    setSteps(prev => prev.filter(p => p.id !== id))
  }

  function updateStep(id, patch) {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))
  }

  return (
    <div className="container">
      <header>
        <h1>Job Hazard Analysis (JHA) — Starter</h1>
        <p>Enter steps, select hazards. Suggested PPE will populate from the hazards mapping.</p>
      </header>

      <main>
        <div className="sidebar">
          <JobStepForm onAdd={addStep} />
          <ExportButtons steps={steps} />
        </div>

        <div className="content">
          <section id="jha-preview" className="card preview">
            <h2>JHA Preview</h2>
            <small>Use Export buttons to download or email this preview.</small>

            {steps.length === 0 ? (
              <p>No steps added yet.</p>
            ) : (
              <div className="steps">
                {steps.map(s => (
                  <article key={s.id} className="step-card">
                    <div className="step-head">
                      <strong>{s.step}</strong>
                      <div className="actions">
                        <button className="link" onClick={() => removeStep(s.id)}>Delete</button>
                      </div>
                    </div>

                    <div className="meta">
                      <div><b>Hazards:</b> {s.hazards.join(', ') || '—'}</div>
                      <div><b>Risk (Before):</b> {s.riskBefore}</div>
                      <div><b>Controls:</b> {s.controls || '—'}</div>
                      <div><b>Risk (After):</b> {s.riskAfter || '—'}</div>
                      <div><b>PPE:</b> {(s.suggestedPPE||[]).concat(s.customPPE||[]).join(', ') || '—'}</div>
                    </div>

                    <details className="edit">
                      <summary>Edit Controls / PPE / Risk After</summary>
                      <div className="edit-area">
                        <label>Controls</label>
                        <textarea
                          value={s.controls}
                          onChange={e => updateStep(s.id, { controls: e.target.value })}
                          placeholder="Describe control measures (e.g. guard in place, signage)">
                        </textarea>

                        <label>Risk After Controls</label>
                        <select value={s.riskAfter} onChange={e => updateStep(s.id, { riskAfter: e.target.value })}>
                          <option value="">(Select)</option>
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                        </select>

                        <label>Custom PPE (comma separated)</label>
                        <input
                          value={(s.customPPE || []).join(', ')}
                          onChange={e => updateStep(s.id, { customPPE: e.target.value.split(',').map(x => x.trim()).filter(Boolean) })}
                          placeholder="Add extra PPE items"
                        />

                      </div>
                    </details>

                  </article>
                ))}
              </div>
            )}

          </section>
        </div>
      </main>

      <footer>
        <small>Starter app — extend hazardToPPE in <code>src/utils/hazardToPPE.js</code> to match your company's PPE matrix.</small>
      </footer>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* FILE: src/index.css                                                         */
/* -------------------------------------------------------------------------- */

:root{
  --bg: #f7f8fb;
  --card: #fff;
  --accent: #0b5cff;
  --muted: #666;
}

*{box-sizing:border-box}
body{font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; background:var(--bg); margin:0; color:#111}
.container{max-width:1100px; margin:28px auto; padding:16px}
header h1{margin:0 0 6px}
header p{margin:0 0 18px; color:var(--muted)}
main{display:flex; gap:18px}
.sidebar{width:320px}
.content{flex:1}
.card{background:var(--card); padding:14px; border-radius:8px; box-shadow:0 6px 18px rgba(20,20,40,0.06);}
.form input, .form textarea, .form select{width:100%; padding:8px; margin-bottom:10px; border:1px solid #e4e6ef; border-radius:6px}
.form label{font-size:13px; color:var(--muted); display:block; margin-bottom:4px}
.btn{background:var(--accent); color:white; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; margin-right:8px}
.btn:hover{opacity:0.95}
.exports{margin-top:12px}
.preview .step-card{border-top:1px dashed #eee; padding:10px 0}
.step-head{display:flex; justify-content:space-between; align-items:center}
.step-head .actions .link{background:none;border:none;color:var(--accent);cursor:pointer}
.meta{font-size:13px; color:#222; margin-top:8px}
.edit{margin-top:8px}
.edit-area textarea{height:80px}
footer{margin-top:18px; color:var(--muted)}

/* -------------------------------------------------------------------------- */
/* FILE: server/email-server.js (optional - node server to accept base64 PDF and send via nodemailer) */
/* -------------------------------------------------------------------------- */

/*
  Usage:
    - Install: npm install express nodemailer cors body-parser
    - Set environment variables for your SMTP credentials (e.g. GMAIL user & pass)
      - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
    - Run: node server/email-server.js

  This server exposes POST /send and expects JSON:
  {
    to: 'recipient@example.com',
    subject: 'JHA PDF',
    text: 'See attached',
    attachmentName: 'JHA.pdf',
    attachmentBase64: 'JVBERi0xLjcK...'  // base64 only (no data: prefix)
  }
*/

// Simple server - production hardened code NOT included. Use only as an example.

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const nodemailer = require('nodemailer')

const app = express()
app.use(cors())
app.use(bodyParser.json({ limit: '25mb' }))

app.post('/send', async (req, res) => {
  try {
    const { to, subject, text, attachmentName, attachmentBase64 } = req.body
    if (!to) return res.status(400).json({ ok: false, error: 'recipient required in "to"' })

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER,
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASS
      }
    })

    const attachments = []
    if (attachmentBase64) {
      attachments.push({
        filename: attachmentName || 'attachment.pdf',
        content: Buffer.from(attachmentBase64, 'base64'),
      })
    }

    const mail = {
      from: process.env.SMTP_USER || process.env.EMAIL_FROM || 'no-reply@example.com',
      to,
      subject: subject || 'Job Hazard Analysis',
      text: text || 'Please find attached the JHA document',
      attachments
    }

    const info = await transporter.sendMail(mail)
    console.log('sent', info.messageId)
    res.json({ ok: true, info })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: (err && err.message) || 'unknown error' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log('Email server listening on', PORT))

/* -------------------------------------------------------------------------- */
/* END OF SCAFFOLD                                                            */
/* -------------------------------------------------------------------------- */
