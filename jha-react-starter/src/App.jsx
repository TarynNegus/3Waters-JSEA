import React, { useState } from 'react';
import JobStepList from "./components/JobStepList";
import ExportButtons from './components/ExportButtons';
import logo from './assets/h789.png';

export default function App() {
  const [headerData, setHeaderData] = useState({
    jobTask: '',
    projectLocation: '',
    teamMembers: '',
    approvedBy: '',
    date: ''
  });
  const [steps, setSteps] = useState([])

  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setHeaderData((prev) => ({ ...prev, [name]: value }));
  };
  
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
    <div>
      <header style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', background: 'white', borderBottom: '1px solid #ddd' }}>
        <img src={logo} alt="3 Waters Consulting" style={{ height: '50px', marginRight: '15px' }} />
        <h1>Job Hazard Analysis</h1>
      </header>

      <main style={{ padding: '20px' }}>
        {/* Header Section */}
        <section className="card">
          <h2>General Information</h2>
          <div className="form-row">
            <label>Job / Task:</label>
            <input type="text" name="jobTask" value={headerData.jobTask} onChange={handleHeaderChange} />
            <label>Project / Location:</label>
            <input type="text" name="projectLocation" value={headerData.projectLocation} onChange={handleHeaderChange} />
          </div>

          <div className="form-row">
            <label>JSA Team Members:</label>
            <input type="text" name="teamMembers" value={headerData.teamMembers} onChange={handleHeaderChange} />
          </div>

          <div className="form-row">
            <label>JSA Approved by:</label>
            <input type="text" name="approvedBy" value={headerData.approvedBy} onChange={handleHeaderChange} />
            <label>Date:</label>
            <input type="date" name="date" value={headerData.date} onChange={handleHeaderChange} />
          </div>
        </section>

        <JobStepList />

        {/* Export */}
        <ExportButtons
  jobTask="Excavation"
  projectLocation="Site A"
  teamMembers="John, Sarah, Ahmed"
  approvedBy="Jane Smith"
  date="2025-09-22"
  steps={[
    { step: "Dig trench", hazard: "Collapse", risk: "High", control: "Shoring" },
    { step: "Place pipes", hazard: "Manual handling", risk: "Medium", control: "Use lifting aids" },
  ]}
/>
      </main>
    </div>
  );
}