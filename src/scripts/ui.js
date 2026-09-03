// Wires the questionnaire to the scoring engine and updates the results seal.

const form = document.getElementById("assessment-form");
const button = document.getElementById("run-assessment");
const seal = document.querySelector(".result-seal");

function getSelectedValue(name) {
  const checked = form.querySelector(`input[name="${name}"]:checked`);
  return checked ? checked.value : null;
}

function getCheckedValues(name) {
  return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map((el) => el.value);
}

function showIncomplete() {
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
}

button.addEventListener("click", () => {
  const vendorName = document.getElementById("vendor-name").value.trim();
  const dataSensitivity = getSelectedValue("data-sensitivity");
  const permissionScope = getCheckedValues("permission-scope");
  const encryption = getSelectedValue("encryption");
  const breachHistory = getSelectedValue("breach-history");

  if (!dataSensitivity || !encryption || !breachHistory) {
    showIncomplete();
    return;
  }

  const result = window.ThirdPartyTrust.computeAssessment({
    dataSensitivity,
    permissionScope,
    encryption,
    breachHistory,
  });

  showResult(vendorName, result);
});
