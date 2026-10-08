// ThirdPartyTrust's own grading and risk method. CIS Controls v8.1 defines no letter grade, Impact,
// Likelihood, or risk level, so these values belong to this tool, not to CIS.
window.TPT_METHODOLOGY = {
  "version": "1.0.0",
  "levels": ["Low", "Moderate", "High", "Critical"],
  "scoreDecimals": 2,
  "gradeBands": [
    { "grade": "A", "minScore": 90 },
    { "grade": "B", "minScore": 80 },
    { "grade": "C", "minScore": 70 },
    { "grade": "D", "minScore": 60 },
    { "grade": "F", "minScore": 0 }
  ],
  "dataSensitivity": {
    "question": "What kind of data does this vendor handle?",
    "caption": "Sets the Impact level used in every Control's risk rating.",
    "options": [
      { "id": "public", "label": "Public information only", "impact": "Low" },
      { "id": "internal", "label": "Internal business data", "impact": "Moderate" },
      { "id": "customer", "label": "Customer or employee records", "impact": "High" },
      { "id": "regulated", "label": "Regulated data (health, financial, etc.)", "impact": "Critical" }
    ]
  },
  "riskMatrix": {
    "Critical": { "Low": "Moderate", "Moderate": "High", "High": "Critical", "Critical": "Critical" },
    "High": { "Low": "Low", "Moderate": "Moderate", "High": "High", "Critical": "Critical" },
    "Moderate": { "Low": "Low", "Moderate": "Moderate", "High": "High", "Critical": "High" },
    "Low": { "Low": "Low", "Moderate": "Low", "High": "Moderate", "Critical": "High" }
  }
};
