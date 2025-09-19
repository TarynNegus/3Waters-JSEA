import React, { useState } from 'react'
import hazardToPPE from '../utils/hazardToPPE'

export default function JobStepForm({ onAdd }) {
  const [stepText, setStepText] = useState('')
  const [hazardsInput, setHazardsInput] = useState('')
  const [riskBefore, setRiskBefore] = useState('Medium')

  function parseHazards(raw) {
    return raw.split(',').map(h => h.trim()).filter(Boolean)
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
      <input value={stepText} onChange={e => setStepText(e.target.value)} />

      <label>Hazards (comma separated)</label>
      <input value={hazardsInput} onChange={e => setHazardsInput(e.target.value)} />

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
