import React, { useState } from "react";

function JobStepForm({ isFirstStep, onAddStep, onComplete }) {
  const initialForm = {
    step: "",
    hazards: [],
    otherHazard: "",
    likelihood: "",
    consequences: "",
    controls: "",
  };

  const [formData, setFormData] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleHazardChange = (e) => {
    const value = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setFormData({ ...formData, hazards: value });
  };

  const addStep = () => {
    onAddStep(formData);
    setFormData(initialForm); // ✅ reset the form for the next step
  };

  return (
    <div style={{ border: "1px dashed gray", padding: "10px", marginTop: "10px" }}>
      <h3>{isFirstStep ? "Add First Step" : "Add Next Step"}</h3>

      {/* Step description */}
      <input
        type="text"
        name="step"
        placeholder="Enter step description"
        value={formData.step}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: "8px" }}
      />

      {/* Hazards checkboxes */}
<label><strong>Hazards:</strong></label>
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", marginBottom: "8px" }}>
  {[
    "Adverse Weather (hot, cold, windy)",
    "Biological hazards",
    "Cranes/Forklift/Lifting/Hoisting",
    "Cultural heritage",
    "Cutting and Grinding",
    "Difficult Terrain",
    "Dust/Pollen",
    "Electrical Equipment (Shock)",
    "Exhaust Smoke/Gases/Vapours ",
    "Explosive Atmosphere",
    "Falling/Dropped Objects",
    "Fire",
    "Flora (Plants)/ Fauna (Animals)",
    "Ground Instability/terrain",
    "Heat",
    "Inadequate Entry and Exit",
    "Lighting",
    "Manual Handling",
    "Mechanical (crush)",
    "Mechanical/Ergonomic",
    "Moving, Rotating Parts",
    "Oil/Fuel Spill",
    "Overhead Services (Power lines)",
    "Overhead Work",
    "Pinch/Crush",
    "Plant Operation /Vehicles",
    "Plant/Equipment movement",
    "Poor/Difficult Communication/Noise",
        "Pressure (Stored Energy)",
    "Public Interaction/Perception",
    "Simultaneous Operations",
    "Slips Trips or Fall Hazards",
    "Tools and Equipment/Tagged/Certified",
    "Toxic Dusts/Mists/Fumes/Odours",
    "Traffic/Public Control",
    "Unauthorised Access",
    "Underground Services",
    "Uneven Ground",
    "Working alone",
    "Working around water",
    "Working at Heights (>1.5m)",
    "Other"
  ].map((hazard) => (
    <label key={hazard} style={{ display: "flex", alignItems: "center" }}>
      <input
        type="checkbox"
        value={hazard}
        checked={formData.hazards.includes(hazard)}
        onChange={(e) => {
          if (e.target.checked) {
            setFormData({ ...formData, hazards: [...formData.hazards, hazard] });
          } else {
            setFormData({
              ...formData,
              hazards: formData.hazards.filter((h) => h !== hazard),
            });
          }
        }}
      />
      <span style={{ marginLeft: "4px" }}>{hazard}</span>
    </label>
  ))}
</div>

      {/* Likelihood dropdown */}
      <label><strong>Likelihood Rating:</strong></label>
      <select
        name="likelihood"
        value={formData.likelihood}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: "8px" }}
      >
        <option value="">Select...</option>
        <option>1 - Unlikely</option>
        <option>2 - Possible</option>
        <option>3 - Moderate</option>
        <option>4 - Likely</option>
        <option>5 - Almost Certain</option>
      </select>

      {/* Consequences dropdown */}
      <label><strong>Consequences Rating:</strong></label>
      <select
        name="consequences"
        value={formData.consequences}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: "8px" }}
      >
        <option value="">Select...</option>
        <option>1 - Low</option>
        <option>2 - Minor</option>
        <option>3 - Moderate</option>
        <option>4 - Major</option>
        <option>5 - Catastrophic</option>
      </select>

      {/* Controls */}
      <textarea
        name="controls"
        placeholder="Enter control measures"
        value={formData.controls}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: "8px" }}
      />

      {/* Buttons */}
      <div>
        <button onClick={addStep}>Add Step</button>
        <button onClick={onComplete} style={{ marginLeft: "8px" }}>
          Complete Form
        </button>
        {!isFirstStep && (
          <button style={{ marginLeft: "8px", background: "red", color: "white" }}>
            Delete Step
          </button>
        )}
      </div>
    </div>
  );
}

export default JobStepForm;
