import React, { useState } from "react";
import JobStepForm from "./JobStepForm";

function JobStepList() {
  const [steps, setSteps] = useState([]);
  const [addingNew, setAddingNew] = useState(true);

  const handleAddStep = (newStep) => {
    setSteps([...steps, { ...newStep, id: steps.length + 1, expanded: false }]);
    setAddingNew(true);
  };

  const toggleExpand = (id) => {
    setSteps(
      steps.map((s) =>
        s.id === id ? { ...s, expanded: !s.expanded } : s
      )
    );
  };

  return (
    <div>
      <h2>Steps</h2>

      {/* Collapsible saved steps */}
      {steps.map((s, i) => (
        <div
          key={s.id}
          style={{ border: "1px solid #ccc", margin: "8px 0", padding: "8px" }}
        >
          <div
            style={{ display: "flex", justifyContent: "space-between", cursor: "pointer" }}
            onClick={() => toggleExpand(s.id)}
          >
            <strong>Step {i + 1}:</strong> {s.step || "(no step entered)"}
            <span>{s.expanded ? "▲" : "▼"}</span>
          </div>

          {s.expanded && (
            <div style={{ marginTop: "8px" }}>
              <p><strong>Hazards:</strong> {s.hazards?.join(", ") || "None"}</p>
              <p><strong>Likelihood Rating:</strong> {s.likelihood || "N/A"}</p>
              <p><strong>Consequences Rating:</strong> {s.consequences || "N/A"}</p>
              <p><strong>Controls:</strong> {s.controls || "None"}</p>
              <p><strong>PPE:</strong> {s.suggestedPPE?.join(", ") || "None"}</p>
            </div>
          )}
        </div>
      ))}

      {/* Active form */}
      {addingNew && (
        <JobStepForm
          isFirstStep={steps.length === 0}
          onAddStep={handleAddStep}
          onComplete={() => setAddingNew(false)}
        />
      )}
    </div>
  );
}

export default JobStepList;
