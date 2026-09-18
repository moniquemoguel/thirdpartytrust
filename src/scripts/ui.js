// Wires the questionnaire to the scoring engine and updates the results seal.

const form = document.getElementById("assessment-form");
const button = document.getElementById("run-assessment");
const seal = document.querySelector(".result-seal");
const panel = document.querySelector(".result-panel");
const exportButton = document.getElementById("export-task-sheet");

function getAllSafeguardAnswers() {
  const radios = form.querySelectorAll('input[type="radio"]');
  const names = new Set();
  radios.forEach((radio) => names.add(radio.name));

  const answers = {};
  names.forEach((name) => {
    const checked = form.querySelector(`input[name="${name}"]:checked`);
    answers[name] = checked ? checked.value : null;
  });
  return answers;
}

function clearBreakdown() {
  const existing = panel.querySelector(".result-breakdown");
  if (existing) existing.remove();
}

function showIncomplete() {
  clearBreakdown();
  exportButton.style.display = "none";
  seal.textContent = "";
  seal.classList.add("is-empty");

  const status = document.createElement("p");
  status.className = "seal-status";
  status.textContent = "INCOMPLETE";

  const copy = document.createElement("p");
  copy.className = "seal-empty-copy";
  copy.textContent = "Answer every question to generate a grade.";

  seal.append(status, copy);
}

const TIER_LABELS = {
  full: "Fully implemented",
  partial: "Partially implemented",
  none: "Not implemented",
};

function renderBreakdown(result) {
  clearBreakdown();

  const breakdown = document.createElement("div");
  breakdown.className = "result-breakdown";

  const heading = document.createElement("p");
  heading.className = "breakdown-heading";
  heading.textContent = result.framework + " -- v" + result.matrixVersion;
  breakdown.append(heading);

  result.families.forEach((family) => {
    const familyHeading = document.createElement("p");
    familyHeading.className = "breakdown-heading";
    familyHeading.textContent = family.name + ": " + family.points.toFixed(2) + " / " + family.maxPoints.toFixed(2);
    breakdown.append(familyHeading);

    const familyCitation = document.createElement("p");
    familyCitation.className = "breakdown-citation";
    familyCitation.textContent = family.citation;
    breakdown.append(familyCitation);

    family.safeguards.forEach((safeguard) => {
      const row = document.createElement("div");
      row.className = "breakdown-row";

      const line = document.createElement("p");
      line.className = "breakdown-line";
      line.textContent = safeguard.id + " -- " + safeguard.title;

      const detail = document.createElement("p");
      detail.className = "breakdown-citation";
      const tierLabel = safeguard.tier ? TIER_LABELS[safeguard.tier] : "Not answered";
      detail.textContent = tierLabel + " -- " + safeguard.points.toFixed(2) + " / " + safeguard.maxPoints.toFixed(2) + " pts";

      row.append(line, detail);
      breakdown.append(row);
    });
  });

  panel.insertBefore(breakdown, exportButton);
}

function showResult(vendorName, result) {
  seal.classList.remove("is-empty");
  seal.textContent = "";

  const grade = document.createElement("p");
  grade.className = "seal-grade";
  grade.textContent = result.grade;

  const label = document.createElement("p");
  label.className = "seal-status";
  label.textContent = vendorName || "Assessment complete";

  const score = document.createElement("p");
  score.className = "seal-score";
  score.textContent = result.score + " / 100";

  seal.append(grade, label, score);
  renderBreakdown(result);
  exportButton.style.display = "block";
}

button.addEventListener("click", () => {
  const vendorName = document.getElementById("vendor-name").value.trim();
  const answers = getAllSafeguardAnswers();

  const result = window.ThirdPartyTrust.computeAssessment(answers);

  if (!result.complete) {
    showIncomplete();
    return;
  }

  showResult(vendorName, result);
});

exportButton.addEventListener("click", () => {
  window.print();
});
