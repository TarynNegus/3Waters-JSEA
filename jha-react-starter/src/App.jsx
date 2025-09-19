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
                        />

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
        <small>Starter app — extend hazardToPPE in src/utils/hazardToPPE.js to match your company's PPE matrix.</small>
      </footer>
    </div>
  )
}
