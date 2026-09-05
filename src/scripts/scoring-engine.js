// Converts questionnaire answers into a 0-100 score and a letter grade.
// Weights are sourced from the CIS-mapped governance matrix (see governance-matrix.json).
// No DOM access here — this stays testable on its own, independent of the UI.

const GOVERNANCE_MATRIX = {
  version: "1.0.0",
  framework: "CIS Critical Security Controls v8",
  categories: {
    dataSensitivity: {
      citation: "CIS Control 3 — Data Protection",
      maxPoints: 30,
      values: { public: 30, internal: 22, customer: 12, regulated: 4 },
    },
    permissionScope: {
      citation: "CIS Control 6 — Access Control Management",
      maxPoints: 25,
      deductions: { read: 3, write: 6, admin: 12, "third-party": 10 },
    },
    encryption: {
      citation: "CIS Control 3 — Data Protection",
      maxPoints: 25,
      values: { full: 25, partial: 12, unknown: 0 },
    },
    breachHistory: {
      citation: "CIS Control 15 — Service Provider Management",
      maxPoints: 20,
      values: { none: 20, disclosed: 10, undisclosed: 0 },
    },
  },
};

function scoreDataSensitivity(value) {
  const category = GOVERNANCE_MATRIX.categories.dataSensitivity;
  return category.values[value] ?? 0;
}

function scorePermissionScope(selected) {
  const category = GOVERNANCE_MATRIX.categories.permissionScope;
  const total = selected.reduce((sum, item) => sum + (category.deductions[item] ?? 0), 0);
  return Math.max(category.maxPoints - total, 0);
}

function scoreEncryption(value) {
  const category = GOVERNANCE_MATRIX.categories.encryption;
  return category.values[value] ?? 0;
}

function scoreBreachHistory(value) {
  const category = GOVERNANCE_MATRIX.categories.breachHistory;
  return category.values[value] ?? 0;
}

function letterGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

// answers shape:
// { dataSensitivity, permissionScope: [], encryption, breachHistory }
function computeAssessment(answers) {
  const categories = GOVERNANCE_MATRIX.categories;

  const breakdown = [
    {
      label: "Data sensitivity",
      points: scoreDataSensitivity(answers.dataSensitivity),
      maxPoints: categories.dataSensitivity.maxPoints,
      citation: categories.dataSensitivity.citation,
    },
    {
      label: "Permission scope",
      points: scorePermissionScope(answers.permissionScope || []),
      maxPoints: categories.permissionScope.maxPoints,
      citation: categories.permissionScope.citation,
    },
    {
      label: "Encryption",
      points: scoreEncryption(answers.encryption),
      maxPoints: categories.encryption.maxPoints,
      citation: categories.encryption.citation,
    },
    {
      label: "Breach history",
      points: scoreBreachHistory(answers.breachHistory),
      maxPoints: categories.breachHistory.maxPoints,
      citation: categories.breachHistory.citation,
    },
  ];

  const score = breakdown.reduce((sum, item) => sum + item.points, 0);

  return {
    score,
    grade: letterGrade(score),
    breakdown,
    framework: GOVERNANCE_MATRIX.framework,
    matrixVersion: GOVERNANCE_MATRIX.version,
  };
}

window.ThirdPartyTrust = { computeAssessment };
