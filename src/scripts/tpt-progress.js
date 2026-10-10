// Progress over time for ThirdPartyTrust: combines up to 8 complete assessments of one vendor into a trend.
// Every assessment must share the series ID, exact vendor name, framework, and CIS data version (the last
// two are enforced when each file is loaded). Scores are recomputed from answers. No DOM or network access.
// Loads after tpt-assessment-file.js.
(function () {
  const MAX_ASSESSMENTS = 8;
  const risk = window.TPT.risk;
  const files = window.TPT.assessmentFile;

  function quarterOf(date) {
    const [year, month] = date.split("-").map(Number);
    return { year, quarter: Math.ceil(month / 3), label: "Q" + Math.ceil(month / 3) + " " + year };
  }

  function dateOf(record) {
    return (record.assessment && record.assessment.details && record.assessment.details.assessmentDate) || "";
  }

  function chronological(a, b) {
    return dateOf(a).localeCompare(dateOf(b)) || String(a.savedAt).localeCompare(String(b.savedAt));
  }

  function snapshot(record, results) {
    return {
      assessmentId: record.assessmentId,
      assessmentDate: record.assessment.details.assessmentDate,
      quarter: quarterOf(record.assessment.details.assessmentDate),
      overall: results.overall,
      groupScores: results.groupScores,
      riskCounts: results.riskCounts,
      controls: results.controls.map((c, i) => ({ id: c.id, name: c.name, score: c.score, riskLevel: results.register[i].riskLevel }))
    };
  }

  function difference(a, b) {
    return a !== null && b !== null ? b - a : null;
  }

  // records: [{ assessmentId, seriesId, savedAt, assessment, label }], each from parseFile or the current
  // assessment. anchor: the record that defines the series (normally the current assessment).
  function buildTrend(records, anchor) {
    const excluded = [];
    const reference = anchor || records.slice().sort(chronological).pop();
    if (!reference) return { ok: false, reason: "Load at least one earlier assessment to see progress.", excluded };

    const byId = new Map();
    records.forEach((record) => {
      const label = record.label || record.assessmentId;
      const mismatch = files.seriesMismatch(reference, record);
      if (mismatch) {
        excluded.push({ label, reason: mismatch });
        return;
      }
      const results = risk.computeAssessment(record.assessment);
      if (!results.complete) {
        excluded.push({ label, reason: "This assessment is not complete, so it can't be scored." });
        return;
      }
      if (!results.overall) {
        excluded.push({ label, reason: "This assessment has no applicable Safeguards to score." });
        return;
      }
      const existing = byId.get(record.assessmentId);
      if (existing) {
        const keepNew = String(record.savedAt) > String(existing.record.savedAt);
        excluded.push({ label: keepNew ? existing.record.label || existing.record.assessmentId : label, reason: "The same assessment was loaded more than once; the most recently saved copy is used." });
        if (!keepNew) return;
      }
      byId.set(record.assessmentId, { record, results });
    });

    let included = Array.from(byId.values()).sort((a, b) => chronological(a.record, b.record));
    if (included.length > MAX_ASSESSMENTS) {
      included.slice(0, included.length - MAX_ASSESSMENTS).forEach(({ record }) => {
        excluded.push({ label: record.label || record.assessmentId, reason: "Only the 8 most recent assessments are shown." });
      });
      included = included.slice(-MAX_ASSESSMENTS);
    }
    if (included.length < 2) {
      return { ok: false, reason: "Progress needs at least two complete assessments of the same vendor.", excluded };
    }

    const points = included.map(({ record, results }) => snapshot(record, results));
    const first = points[0];
    const previous = points[points.length - 2];
    const latest = points[points.length - 1];

    const controlChanges = latest.controls.map((c, i) => ({
      controlId: c.id,
      controlName: c.name,
      sinceFirst: difference(first.controls[i].score, c.score),
      sincePrevious: difference(previous.controls[i].score, c.score),
      riskFirst: first.controls[i].riskLevel,
      riskPrevious: previous.controls[i].riskLevel,
      riskLatest: c.riskLevel
    }));

    const latestPair = files.compare(included[included.length - 2].record, included[included.length - 1].record);

    return {
      ok: true,
      vendorName: files.vendorOf(reference.assessment),
      seriesId: reference.seriesId,
      points,
      overall: {
        sinceFirst: latest.overall.hundredths - first.overall.hundredths,
        sincePrevious: latest.overall.hundredths - previous.overall.hundredths
      },
      controlChanges,
      safeguardsSincePrevious: latestPair.ok ? latestPair.safeguards : null,
      excluded
    };
  }

  window.TPT.progress = { buildTrend, quarterOf, MAX_ASSESSMENTS };
})();
