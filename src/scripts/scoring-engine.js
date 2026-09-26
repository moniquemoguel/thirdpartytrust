// Converts questionnaire answers into a 0-100 score and a letter grade.
// Weights are sourced from the CIS v8.1.2 IG1-mapped governance matrix.
// No DOM access here -- this stays testable on its own, independent of the UI.

const GOVERNANCE_MATRIX = {
  version: "2.0.0",
  framework: "CIS Critical Security Controls v8.1.2 \u2014 Implementation Group 1",
  families: [
    {
      id: "data-protection",
      name: "Data Protection & Privacy",
      citation: "CIS Control 3 \u2014 Data Protection",
      safeguards: [
        { id: "3.1", title: "Establish and Maintain a Data Management Process", points: { full: 3.33, partial: 1.67, none: 0 } },
        { id: "3.2", title: "Establish and Maintain a Data Inventory", points: { full: 3.33, partial: 1.67, none: 0 } },
        { id: "3.3", title: "Configure Data Access Control Lists", points: { full: 3.33, partial: 1.67, none: 0 } },
        { id: "3.4", title: "Enforce Data Retention", points: { full: 3.33, partial: 1.67, none: 0 } },
        { id: "3.5", title: "Securely Dispose of Data", points: { full: 3.35, partial: 1.68, none: 0 } },
      ],
    },
    {
      id: "access-identity",
      name: "Access & Identity Management",
      citation: "CIS Controls 5 & 6 \u2014 Account Management, Access Control Management",
      safeguards: [
        { id: "5.1", title: "Establish and Maintain an Inventory of Accounts", points: { full: 1.85, partial: 0.93, none: 0 } },
        { id: "5.2", title: "Use Unique Passwords", points: { full: 1.85, partial: 0.93, none: 0 } },
        { id: "5.3", title: "Disable Dormant Accounts", points: { full: 1.85, partial: 0.93, none: 0 } },
        { id: "5.4", title: "Restrict Administrator Privileges to Dedicated Administrator Accounts", points: { full: 1.85, partial: 0.93, none: 0 } },
        { id: "6.1", title: "Establish an Access Granting Process", points: { full: 1.85, partial: 0.93, none: 0 } },
        { id: "6.2", title: "Establish an Access Revoking Process", points: { full: 1.85, partial: 0.93, none: 0 } },
        { id: "6.3", title: "Require MFA for Externally-Exposed Applications", points: { full: 1.85, partial: 0.93, none: 0 } },
        { id: "6.4", title: "Require MFA for Remote Network Access", points: { full: 1.85, partial: 0.93, none: 0 } },
        { id: "6.5", title: "Require MFA for Administrative Access", points: { full: 1.86, partial: 0.93, none: 0 } },
      ],
    },
    {
      id: "vulnerability-threat",
      name: "Vulnerability & Threat Management",
      citation: "CIS Controls 7 & 10 \u2014 Continuous Vulnerability Management, Malware Defenses",
      safeguards: [
        { id: "7.1", title: "Establish and Maintain a Vulnerability Management Process", points: { full: 2.78, partial: 1.39, none: 0 } },
        { id: "7.2", title: "Establish and Maintain a Remediation Process", points: { full: 2.78, partial: 1.39, none: 0 } },
        { id: "7.3", title: "Perform Automated Operating System Patch Management", points: { full: 2.78, partial: 1.39, none: 0 } },
        { id: "10.1", title: "Deploy and Maintain Anti-Malware Software", points: { full: 2.78, partial: 1.39, none: 0 } },
        { id: "10.2", title: "Configure Automatic Anti-Malware Signature Updates", points: { full: 2.78, partial: 1.39, none: 0 } },
        { id: "10.3", title: "Disable Autorun and Autoplay for Removable Media", points: { full: 2.77, partial: 1.39, none: 0 } },
      ],
    },
    {
      id: "network-hygiene",
      name: "Network & System Hygiene",
      citation: "CIS Controls 1 & 11 \u2014 Enterprise Asset Inventory, Data Recovery",
      safeguards: [
        { id: "1.1", title: "Establish and Maintain Detailed Enterprise Asset Inventory", points: { full: 3.33, partial: 1.67, none: 0 } },
        { id: "1.2", title: "Address Unauthorized Assets", points: { full: 3.33, partial: 1.67, none: 0 } },
        { id: "11.1", title: "Establish and Maintain a Data Recovery Process", points: { full: 3.33, partial: 1.67, none: 0 } },
        { id: "11.2", title: "Perform Automated Backups", points: { full: 3.33, partial: 1.67, none: 0 } },
        { id: "11.3", title: "Protect Recovery Data", points: { full: 3.34, partial: 1.67, none: 0 } },
      ],
    },
    {
      id: "vendor-oversight",
      name: "Vendor & Service Provider Oversight",
      citation: "CIS Control 15 \u2014 Service Provider Management",
      safeguards: [
        { id: "15.1", title: "Establish and Maintain an Inventory of Service Providers", points: { full: 16.67, partial: 8.34, none: 0 } },
      ],
    },
    {
      id: "awareness-response",
      name: "Security Awareness & Incident Response",
      citation: "CIS Controls 14 & 17 \u2014 Security Awareness and Skills Training, Incident Response Management",
      safeguards: [
        { id: "14.1", title: "Establish and Maintain a Security Awareness Program", points: { full: 1.85, partial: 0.93, none: 0 } },
        { id: "14.2", title: "Train Workforce Members to Recognize Social Engineering Attacks", points: { full: 1.85, partial: 0.93, none: 0 } },
        { id: "14.3", title: "Train Workforce Members on Authentication Best Practices", points: { full: 1.85, partial: 0.93, none: 0 } },
        { id: "14.4", title: "Train Workforce on Data Handling Best Practices", points: { full: 1.85, partial: 0.93, none: 0 } },
        { id: "14.6", title: "Train Workforce Members on Recognizing and Reporting Security Incidents", points: { full: 1.85, partial: 0.93, none: 0 } },
        { id: "14.7", title: "Train Workforce on How to Identify and Report if Their Enterprise Assets are Missing Security Updates", points: { full: 1.85, partial: 0.93, none: 0 } },
        { id: "14.8", title: "Train Workforce on the Dangers of Connecting to and Transmitting Enterprise Data Over Insecure Networks", points: { full: 1.85, partial: 0.93, none: 0 } },
        { id: "17.1", title: "Designate Personnel to Manage Incident Handling", points: { full: 1.85, partial: 0.93, none: 0 } },
        { id: "17.3", title: "Establish and Maintain an Enterprise Process for Reporting Incidents", points: { full: 1.87, partial: 0.94, none: 0 } },
      ],
    },
  ],
};

function letterGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

// answers shape: { "3.1": "full", "3.2": "partial", "5.1": "none", ... }
// every safeguard id must have an entry, or the family is treated as incomplete
function computeAssessment(answers) {
  const familyResults = [];
  let score = 0;
  let missingAnswers = false;

  GOVERNANCE_MATRIX.families.forEach((family) => {
    let familyPoints = 0;
    let familyMax = 0;
    const safeguardResults = [];

    family.safeguards.forEach((safeguard) => {
      const tier = answers[safeguard.id];
      const maxForSafeguard = safeguard.points.full;
      familyMax += maxForSafeguard;

      if (!tier || !(tier in safeguard.points)) {
        missingAnswers = true;
        safeguardResults.push({ id: safeguard.id, title: safeguard.title, tier: null, points: 0, maxPoints: maxForSafeguard });
        return;
      }

      const earned = safeguard.points[tier];
      familyPoints += earned;
      safeguardResults.push({ id: safeguard.id, title: safeguard.title, tier, points: earned, maxPoints: maxForSafeguard });
    });

    score += familyPoints;
    familyResults.push({
      id: family.id,
      name: family.name,
      citation: family.citation,
      points: familyPoints,
      maxPoints: familyMax,
      safeguards: safeguardResults,
    });
  });

  return {
    score: Math.round(score * 100) / 100,
    grade: letterGrade(score),
    families: familyResults,
    complete: !missingAnswers,
    framework: GOVERNANCE_MATRIX.framework,
    matrixVersion: GOVERNANCE_MATRIX.version,
  };
}

window.ThirdPartyTrust = { computeAssessment };
