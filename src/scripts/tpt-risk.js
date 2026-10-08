// Scoring for ThirdPartyTrust, part 2 of 2: Implementation Group sub-scores, the risk register, recommended
// actions, and executive summary data. Likelihood, Impact, and Risk Level are this tool's own method, not CIS's.
// No DOM access. Loads after tpt-scoring.js.
(function () {
  const scoring = window.TPT && window.TPT.scoring;
  const method = window.TPT_METHODOLOGY;
  const source = window.CIS_V81_SOURCE;
  const GROUPS = ["IG1", "IG2", "IG3"];
  const REQUIRED_DETAILS = ["vendorName", "serviceProvided", "respondentName", "respondentRole", "reviewer", "assessmentDate"];
  const IMPLEMENTED_LABELS = {};
  if (source) {
    source.scoringMethod.categories
      .find((c) => c.id === "implemented")
      .options.forEach((o) => {
        IMPLEMENTED_LABELS[o.value === null ? "na" : o.value] = o.label;
      });
  }

  function groupRank(group) {
    return GROUPS.indexOf(group);
  }

  function safeguardOrder(a, b) {
    const byGroup = groupRank(a.entryGroup) - groupRank(b.entryGroup);
    if (byGroup !== 0) return byGroup;
    const [ac, as] = a.id.split(".").map(Number);
    const [bc, bs] = b.id.split(".").map(Number);
    return ac - bc || as - bs;
  }

  function addFractions(a, b) {
    return scoring.fraction(a.num * b.den + b.num * a.den, a.den * b.den);
  }

  // CIS Implementation Groups are cumulative: IG2 contains every IG1 Safeguard, and IG3 contains all 153.
  // Each sub-score applies the CIS roll-up to the applicable Safeguards in that group only.
  function groupScores(controls) {
    const result = {};
    GROUPS.forEach((group) => {
      const controlFractions = controls
        .map((control) => {
          const members = control.safeguards.filter((s) => s.score !== null && groupRank(s.entryGroup) <= groupRank(group));
          if (!members.length) return null;
          const total = members.map((s) => s.fraction).reduce(addFractions, { num: 0, den: 1 });
          return scoring.fraction(total.num, total.den * members.length);
        })
        .filter(Boolean);
      if (!controlFractions.length) {
        result[group] = null;
        return;
      }
      const total = controlFractions.reduce(addFractions, { num: 0, den: 1 });
      const hundredths = scoring.toHundredths(scoring.fraction(total.num, total.den * controlFractions.length));
      result[group] = { hundredths, display: scoring.formatScore(hundredths) };
    });
    return result;
  }

  function likelihoodFor(evaluated) {
    if (!evaluated.length) return null;
    if (evaluated.some((s) => s.ratings.implemented === 0 && s.entryGroup === "IG1")) return "Critical";
    if (evaluated.some((s) => s.ratings.implemented === 0 || s.ratings.implemented === 25)) return "High";
    if (evaluated.some((s) => s.ratings.implemented === 50 || s.ratings.implemented === 75)) return "Moderate";
    return "Low";
  }

  function recommendedAction(evaluated) {
    const notImplemented = evaluated.filter((s) => s.ratings.implemented === 0).sort(safeguardOrder);
    if (notImplemented.length) return { type: "Prioritize", safeguards: notImplemented.map((s) => s.id) };
    const partial = evaluated.filter((s) => s.ratings.implemented < 100).sort(safeguardOrder);
    if (partial.length) return { type: "Strengthen", safeguards: partial.map((s) => s.id) };
    return { type: "None", safeguards: [] };
  }

  function impactFor(dataSensitivity) {
    const option = method.dataSensitivity.options.find((o) => o.id === dataSensitivity);
    return option ? option.impact : null;
  }

  function missingDetails(details) {
    const d = details || {};
    const missing = REQUIRED_DETAILS.filter((field) => typeof d[field] !== "string" || d[field].trim() === "");
    if (d.attested !== true) missing.push("attested");
    return missing;
  }

  function computeAssessment(assessment) {
    if (!scoring || !method) return { available: false, problem: "A scoring file did not load." };
    const scores = scoring.computeScores(assessment);
    if (!scores.available) return scores;

    const impact = impactFor(assessment && assessment.dataSensitivity);
    const detailsMissing = missingDetails(assessment && assessment.details);
    const complete = scores.complete && impact !== null && detailsMissing.length === 0;

    const register = scores.controls.map((control) => {
      const evaluated = control.safeguards.filter((s) => s.applicable && typeof s.ratings.implemented === "number");
      const likelihood = likelihoodFor(evaluated);
      return {
        controlId: control.id,
        controlName: control.name,
        likelihood,
        impact,
        riskLevel: likelihood && impact ? method.riskMatrix[impact][likelihood] : null,
        action: likelihood ? recommendedAction(evaluated) : null
      };
    });

    let riskCounts = null;
    if (impact) {
      riskCounts = { Critical: 0, High: 0, Moderate: 0, Low: 0, NotApplicable: 0 };
      register.forEach((r) => {
        if (r.riskLevel) riskCounts[r.riskLevel] += 1;
        else riskCounts.NotApplicable += 1;
      });
    }

    const implementedCounts = {};
    Object.keys(IMPLEMENTED_LABELS).forEach((key) => {
      implementedCounts[key] = 0;
    });
    scores.controls.forEach((control) =>
      control.safeguards.forEach((s) => {
        if (!s.applicable) return;
        const value = s.ratings.implemented;
        if (value === null) implementedCounts.na += 1;
        else if (typeof value === "number") implementedCounts[value] += 1;
      })
    );

    return {
      available: true,
      complete,
      missing: {
        ratings: scores.counts.ratingsRequired - scores.counts.ratingsAnswered,
        justifications: scores.counts.missingJustifications,
        dataSensitivity: impact === null,
        details: detailsMissing
      },
      framework: scores.framework,
      scoringMethod: scores.scoringMethod,
      methodologyVersion: method.version,
      counts: scores.counts,
      overall: complete ? scores.overall : null,
      groupScores: complete ? groupScores(scores.controls) : null,
      impact,
      controls: scores.controls,
      register,
      riskCounts,
      implementedCounts,
      implementedLabels: IMPLEMENTED_LABELS,
      criticalControls: register.filter((r) => r.riskLevel === "Critical").map((r) => r.controlId),
      highControls: register.filter((r) => r.riskLevel === "High").map((r) => r.controlId)
    };
  }

  window.TPT = window.TPT || {};
  window.TPT.risk = { computeAssessment, likelihoodFor, REQUIRED_DETAILS };
})();
