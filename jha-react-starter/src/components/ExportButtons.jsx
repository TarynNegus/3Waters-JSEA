import React from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

function ExportButton({ jobTask, projectLocation, teamMembers, approvedBy, date, steps }) {
  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("JSEA");

    // Header rows
    worksheet.addRow(["Job / Task:", jobTask || "", "Project/Location:", projectLocation || ""]);
    worksheet.addRow(["JSA Team Members:", teamMembers || "", "Date:", date || ""]);
    worksheet.addRow(["JSA Approved by:", approvedBy || ""]);
    worksheet.addRow([]); // Empty row for spacing

    // Steps table header
    worksheet.addRow(["Step", "Hazard", "Risk", "Control Measures"]);

    // Steps data (if provided)
    if (steps && steps.length > 0) {
      steps.forEach((step, index) => {
        worksheet.addRow([
          step.step || `Step ${index + 1}`,
          step.hazard || "",
          step.risk || "",
          step.control || "",
        ]);
      });
    }

    // Style headers
    worksheet.getRow(5).font = { bold: true };

    // Generate Excel buffer and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "JSEA.xlsx");
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Export JSEA to Excel
    </button>
  );
}

export default ExportButton;