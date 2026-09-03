// Converts questionnaire answers into a 0-100 score and a letter grade.
// No DOM access here — this stays testable on its own, independent of the UI.

const MAX_POINTS = {
  dataSensitivity: 30,
  permissionScope: 25,
  encryption: 25,
  breachHistory: 20,
};

function scoreDataSensitivity(value) {
  const points = { public: 30, internal: 22, customer: 12, regulated: 4 };
  return points[value] ?? 0;
}

function scorePermissionScope(selected) {
  const deductions = { read: 3, write: 6, admin: 12, "third-party": 10 };
  const total = selected.reduce((sum, item) => sum + (deductions[item] ?? 0), 0);
  return Math.max(MAX_POINTS.permissionScope - total, 0);
}

function scoreEncryption(value) {
  const points = { full: 25, partial: 12, unknown: 0 };
  return points[value] ?? 0;
}

function scoreBreachHistory(value) {
  const points = { none: 20, disclosed: 10, undisclosed: 0 };
  return points[value] ?? 0;
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
  const breakdown = [
    {
      label: "Data sensitivity",
      points: scoreDataSensitivity(answers.dataSensitivity),
      maxPoints: MAX_POINTS.dataSensitivity,
    },
    {
      label: "Permission scope",
      points: scorePermissionScope(answers.permissionScope || []),
      maxPoints: MAX_POINTS.permissionScope,
    },
    {
      label: "Encryption",
      points: scoreEncryption(answers.encryption),
      maxPoints: MAX_POINTS.encryption,
    },
    {
      label: "Breach history",
      points: scoreBreachHistory(answers.breachHistory),
      maxPoints: MAX_POINTS.breachHistory,
    },
  ];

  const score = breakdown.reduce((sum, item) => sum + item.points, 0);

  return { score, grade: letterGrade(score), breakdown };
}

window.ThirdPartyTrust = { computeAssessment };
