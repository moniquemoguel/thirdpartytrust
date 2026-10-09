// Saved assessment files for ThirdPartyTrust: build a file, validate a loaded file, and compare a prior
// assessment with the current one. Files hold answers only; scores are always recomputed by the engine.
// Every loaded file is untrusted input. No DOM or network access. Loads after tpt-risk.js.
(function () {
  const FORMAT = "thirdpartytrust-assessment";
  const FORMAT_VERSION = 1;
  const MAX_FILE_CHARACTERS = 4000000;
  const LIMITS = { detail: 200, notes: 4000, justification: 2000, evidenceTitle: 300, evidenceLocation: 500 };
  const DETAIL_LABELS = {
    vendorName: "Vendor name",
    serviceProvided: "Service provided",
    respondentName: "Respondent name",
    respondentRole: "Respondent role",
    reviewer: "Reviewer"
  };
  const DETAIL_FIELDS = Object.keys(DETAIL_LABELS);
  const JUSTIFICATION_FIELDS = ["reason", "risk", "mitigations", "reviewDate"];
  const RATING_VALUES = [0, 25, 50, 75, 100, null];
  const FORBIDDEN_KEYS = ["__proto__", "constructor", "prototype"];

  const source = window.CIS_V81_SOURCE;
  const controls = window.CIS_V81_CONTROLS;
  const method = window.TPT_METHODOLOGY;
  const scoring = window.TPT && window.TPT.scoring;
  const risk = window.TPT && window.TPT.risk;

  function safeguardIds() {
    const ids = new Set();
    controls.forEach((c) => c.safeguards.forEach((s) => ids.add(s.id)));
    return ids;
  }

  function newAssessmentId() {
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return hex.slice(0, 8) + "-" + hex.slice(8, 12) + "-" + hex.slice(12, 16) + "-" + hex.slice(16, 20) + "-" + hex.slice(20);
  }

  function isPlainObject(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  function isCalendarDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [y, m, d] = value.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
  }

  function checkKeys(object, allowed, where, errors) {
    Object.keys(object).forEach((key) => {
      if (!allowed.includes(key)) errors.push(where + " has an unexpected field: " + key.slice(0, 40) + ".");
    });
  }

  function cleanText(value, limit, where, errors) {
    if (value === undefined) return "";
    if (typeof value !== "string") {
      errors.push(where + " must be text.");
      return "";
    }
    if (value.length > limit) errors.push(where + " is longer than " + limit + " characters.");
    return value.slice(0, limit);
  }

  function cleanDate(value, where, errors) {
    const text = cleanText(value, 10, where, errors);
    if (text !== "" && !isCalendarDate(text)) errors.push(where + " must be a real date in YYYY-MM-DD format.");
    return text;
  }

  // Rebuilds an assessment from known fields only, so nothing outside the schema reaches the app.
  function cleanAssessment(input, errors) {
    const result = { details: {}, dataSensitivity: null, safeguards: {} };
    if (!isPlainObject(input)) {
      errors.push("The assessment section is missing.");
      return result;
    }
    checkKeys(input, ["details", "dataSensitivity", "safeguards"], "The assessment", errors);

    if (input.details !== undefined && !isPlainObject(input.details)) errors.push("Assessment details are not in the expected format.");
    const details = isPlainObject(input.details) ? input.details : {};
    checkKeys(details, DETAIL_FIELDS.concat(["assessmentDate", "attested"]), "Assessment details", errors);
    DETAIL_FIELDS.forEach((field) => {
      result.details[field] = cleanText(details[field], LIMITS.detail, DETAIL_LABELS[field], errors);
    });
    result.details.assessmentDate = cleanDate(details.assessmentDate, "Assessment date", errors);
    if (details.attested !== undefined && typeof details.attested !== "boolean") errors.push("The attestation must be true or false.");
    result.details.attested = details.attested === true;

    const sensitivityIds = method.dataSensitivity.options.map((o) => o.id);
    if (input.dataSensitivity !== null && input.dataSensitivity !== undefined) {
      if (sensitivityIds.includes(input.dataSensitivity)) result.dataSensitivity = input.dataSensitivity;
      else errors.push("The data sensitivity answer is not a recognized option.");
    }

    const valid = safeguardIds();
    if (input.safeguards !== undefined && !isPlainObject(input.safeguards)) errors.push("The Safeguard answers are not in the expected format.");
    const entries = isPlainObject(input.safeguards) ? input.safeguards : {};
    Object.keys(entries).forEach((id) => {
      if (!valid.has(id)) {
        errors.push("Unknown CIS Safeguard: " + id.slice(0, 20) + ".");
        return;
      }
      const entry = entries[id];
      const where = "Safeguard " + id;
      if (!isPlainObject(entry)) {
        errors.push(where + " is not in the expected format.");
        return;
      }
      checkKeys(entry, ["applicable", "ratings", "justification", "notes", "evidence"], where, errors);
      if (entry.applicable !== undefined && typeof entry.applicable !== "boolean") errors.push(where + " applicability must be true or false.");
      const clean = { applicable: entry.applicable !== false, ratings: {}, notes: "", evidence: {}, justification: {} };

      const ratings = isPlainObject(entry.ratings) ? entry.ratings : {};
      checkKeys(ratings, scoring.CATEGORY_IDS, where + " ratings", errors);
      scoring.CATEGORY_IDS.forEach((category) => {
        if (!(category in ratings)) return;
        if (RATING_VALUES.includes(ratings[category])) clean.ratings[category] = ratings[category];
        else errors.push(where + " has a rating that is not a CIS Advanced Scoring value.");
      });

      const justification = isPlainObject(entry.justification) ? entry.justification : {};
      checkKeys(justification, JUSTIFICATION_FIELDS, where + " justification", errors);
      ["reason", "risk", "mitigations"].forEach((field) => {
        clean.justification[field] = cleanText(justification[field], LIMITS.justification, where + " justification " + field, errors);
      });
      clean.justification.reviewDate = cleanDate(justification.reviewDate, where + " review date", errors);

      clean.notes = cleanText(entry.notes, LIMITS.notes, where + " notes", errors);
      const evidence = isPlainObject(entry.evidence) ? entry.evidence : {};
      checkKeys(evidence, ["title", "location", "date"], where + " evidence", errors);
      clean.evidence.title = cleanText(evidence.title, LIMITS.evidenceTitle, where + " evidence title", errors);
      clean.evidence.location = cleanText(evidence.location, LIMITS.evidenceLocation, where + " evidence location", errors);
      clean.evidence.date = cleanDate(evidence.date, where + " evidence date", errors);

      result.safeguards[id] = clean;
    });
    return result;
  }

  function fileName(assessment, savedAt) {
    const vendor = ((assessment.details && assessment.details.vendorName) || "vendor")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "vendor";
    return "thirdpartytrust-" + vendor + "-" + savedAt.slice(0, 10) + ".json";
  }

  function buildFile(assessment, assessmentId) {
    const errors = [];
    const clean = cleanAssessment(assessment, errors);
    const savedAt = new Date().toISOString();
    const status = risk.computeAssessment(clean).complete ? "complete" : "draft";
    const record = {
      format: FORMAT,
      formatVersion: FORMAT_VERSION,
      assessmentId: assessmentId || newAssessmentId(),
      savedAt,
      status,
      framework: source.framework,
      dataVersion: source.version,
      methodologyVersion: method.version,
      assessment: clean
    };
    return { text: JSON.stringify(record, null, 2), fileName: fileName(clean, savedAt), record, errors };
  }

  function parseFile(text) {
    if (typeof text !== "string" || text.length === 0) return { ok: false, errors: ["The file is empty."] };
    if (text.length > MAX_FILE_CHARACTERS) return { ok: false, errors: ["The file is too large to be a ThirdPartyTrust assessment."] };

    let forbidden = false;
    let parsed;
    try {
      parsed = JSON.parse(text, (key, value) => {
        if (FORBIDDEN_KEYS.includes(key)) forbidden = true;
        return value;
      });
    } catch (error) {
      return { ok: false, errors: ["The file is not valid JSON."] };
    }
    if (forbidden) return { ok: false, errors: ["The file contains a field name that is not allowed."] };
    if (!isPlainObject(parsed) || parsed.format !== FORMAT) {
      return { ok: false, errors: ["This is not a ThirdPartyTrust assessment file."] };
    }

    const errors = [];
    checkKeys(parsed, ["format", "formatVersion", "assessmentId", "savedAt", "status", "framework", "dataVersion", "methodologyVersion", "assessment"], "The file", errors);
    if (parsed.formatVersion !== FORMAT_VERSION) errors.push("This file uses an unsupported format version.");
    if (parsed.framework !== source.framework) errors.push("This file was not made for " + source.framework + ".");
    if (parsed.dataVersion !== source.version) errors.push("This file was made with a different version of the CIS data.");
    const idPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
    if (typeof parsed.assessmentId !== "string" || !idPattern.test(parsed.assessmentId)) errors.push("The assessment ID is not valid.");
    if (typeof parsed.savedAt !== "string" || Number.isNaN(Date.parse(parsed.savedAt))) errors.push("The saved date is not valid.");

    const assessment = cleanAssessment(parsed.assessment, errors);
    if (errors.length) return { ok: false, errors: errors.slice(0, 10), errorCount: errors.length };

    return {
      ok: true,
      assessmentId: parsed.assessmentId,
      savedAt: parsed.savedAt,
      methodologyChanged: parsed.methodologyVersion !== method.version,
      assessment
    };
  }

  function compare(priorAssessment, currentAssessment) {
    const before = risk.computeAssessment(priorAssessment);
    const after = risk.computeAssessment(currentAssessment);
    if (!before.complete || !after.complete) {
      return { ok: false, reason: "Both assessments must be complete before progress can be compared." };
    }

    if (!before.overall || !after.overall) {
      return { ok: false, reason: "Both assessments need at least one applicable, scored Safeguard to compare." };
    }
    const sameVendor =
      priorAssessment.details.vendorName.trim().toLowerCase() === currentAssessment.details.vendorName.trim().toLowerCase();

    const controlChanges = after.controls.map((control, i) => {
      const prior = before.controls[i];
      return {
        controlId: control.id,
        controlName: control.name,
        before: prior.score,
        after: control.score,
        change: prior.score !== null && control.score !== null ? control.score - prior.score : null,
        riskBefore: before.register[i].riskLevel,
        riskAfter: after.register[i].riskLevel
      };
    });

    const safeguards = { improved: [], regressed: [], unchanged: [], applicabilityChanged: [] };
    after.controls.forEach((control, i) =>
      control.safeguards.forEach((s, j) => {
        const prior = before.controls[i].safeguards[j];
        if (prior.applicable !== s.applicable) safeguards.applicabilityChanged.push(s.id);
        else if (prior.score === null || s.score === null) return;
        else if (s.score > prior.score) safeguards.improved.push(s.id);
        else if (s.score < prior.score) safeguards.regressed.push(s.id);
        else safeguards.unchanged.push(s.id);
      })
    );

    const groupChanges = {};
    Object.keys(after.groupScores).forEach((group) => {
      const b = before.groupScores[group];
      const a = after.groupScores[group];
      groupChanges[group] = b && a ? a.hundredths - b.hundredths : null;
    });

    return {
      ok: true,
      sameVendor,
      priorDate: priorAssessment.details.assessmentDate,
      overall: {
        before: before.overall.hundredths,
        after: after.overall.hundredths,
        change: after.overall.hundredths - before.overall.hundredths,
        gradeBefore: before.overall.grade,
        gradeAfter: after.overall.grade
      },
      groupChanges,
      riskCountsBefore: before.riskCounts,
      riskCountsAfter: after.riskCounts,
      controlChanges,
      safeguards
    };
  }

  window.TPT = window.TPT || {};
  window.TPT.assessmentFile = { buildFile, parseFile, compare, newAssessmentId, MAX_FILE_CHARACTERS };
})();
