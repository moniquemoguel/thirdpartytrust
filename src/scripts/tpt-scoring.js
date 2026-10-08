// Scoring for ThirdPartyTrust, part 1 of 2: the CIS Advanced Scoring roll-up, exact rounding, the letter
// grade, and completeness. No DOM access. Loads after the src/data files.
(function () {
  const CATEGORY_IDS = ["policy", "implemented", "automated", "reported"];
  const EXPECTED_CONTROLS = 18;
  const EXPECTED_SAFEGUARDS = 153;
  const JUSTIFICATION_FIELDS = ["reason", "risk", "mitigations", "reviewDate"];

  const source = window.CIS_V81_SOURCE;
  const controls = window.CIS_V81_CONTROLS;
  const method = window.TPT_METHODOLOGY;

  function dataProblem() {
    if (!source || !Array.isArray(controls) || !method) return "A data file did not load.";
    if (controls.length !== EXPECTED_CONTROLS) return "Expected 18 CIS Controls, found " + controls.length + ".";
    const ids = new Set();
    controls.forEach((c) => c.safeguards.forEach((s) => ids.add(s.id)));
    if (ids.size !== EXPECTED_SAFEGUARDS) return "Expected 153 CIS Safeguards, found " + ids.size + ".";
    const categories = source.scoringMethod.categories.map((c) => c.id);
    if (categories.join() !== CATEGORY_IDS.join()) return "Scoring categories do not match the CIS Advanced Scoring Method.";
    return null;
  }

  // Exact fractions keep averages free of floating-point error until the single rounding step.
  function gcd(a, b) {
    while (b) [a, b] = [b, a % b];
    return Math.abs(a);
  }

  function fraction(num, den) {
    const g = gcd(num, den) || 1;
    return { num: num / g, den: den / g };
  }

  function addFractions(a, b) {
    return fraction(a.num * b.den + b.num * a.den, a.den * b.den);
  }

  function averageOf(fractions) {
    const total = fractions.reduce(addFractions, { num: 0, den: 1 });
    return fraction(total.num, total.den * fractions.length);
  }

  // Half-up rounding to whole hundredths of a point, for non-negative scores.
  function toHundredths(f) {
    return Math.floor((f.num * 200 + f.den) / (2 * f.den));
  }

  function formatScore(hundredths) {
    return (hundredths / 100).toFixed(method.scoreDecimals);
  }

  function gradeFor(hundredths) {
    const band = method.gradeBands.find((b) => hundredths >= b.minScore * 100);
    return band.grade;
  }

  function isRatingValue(value) {
    return value === null || value === 0 || value === 25 || value === 50 || value === 75 || value === 100;
  }

  function hasJustification(entry) {
    const j = entry && entry.justification;
    return Boolean(j) && JUSTIFICATION_FIELDS.every((field) => typeof j[field] === "string" && j[field].trim() !== "");
  }

  function scoreSafeguard(safeguard, entry) {
    const applicable = !entry || entry.applicable !== false;
    const ratings = (entry && entry.ratings) || {};
    const result = {
      id: safeguard.id,
      title: safeguard.title,
      entryGroup: safeguard.implementationGroups[0],
      applicable,
      ratings: {},
      unanswered: 0,
      score: null,
      justified: applicable ? null : hasJustification(entry)
    };
    if (!applicable) return result;

    const scored = [];
    CATEGORY_IDS.forEach((id) => {
      const value = ratings[id];
      if (!isRatingValue(value)) {
        result.ratings[id] = undefined;
        result.unanswered += 1;
        return;
      }
      result.ratings[id] = value;
      if (value !== null) scored.push(value);
    });

    if (result.unanswered === 0 && scored.length > 0) {
      result.fraction = fraction(scored.reduce((a, b) => a + b, 0), scored.length);
      result.score = toHundredths(result.fraction);
    }
    return result;
  }

  function categoryAverages(safeguards) {
    const averages = {};
    CATEGORY_IDS.forEach((id) => {
      const values = safeguards
        .filter((s) => s.applicable && typeof s.ratings[id] === "number")
        .map((s) => fraction(s.ratings[id], 1));
      averages[id] = values.length ? toHundredths(averageOf(values)) : null;
    });
    return averages;
  }

  function computeScores(assessment) {
    const problem = dataProblem();
    if (problem) return { available: false, problem };

    const entries = (assessment && assessment.safeguards) || {};
    const counts = { applicable: 0, notApplicable: 0, ratingsRequired: 0, ratingsAnswered: 0, missingJustifications: 0 };

    const controlResults = controls.map((control) => {
      const safeguards = control.safeguards.map((s) => scoreSafeguard(s, entries[s.id]));
      safeguards.forEach((s) => {
        if (s.applicable) {
          counts.applicable += 1;
          counts.ratingsRequired += CATEGORY_IDS.length;
          counts.ratingsAnswered += CATEGORY_IDS.length - s.unanswered;
        } else {
          counts.notApplicable += 1;
          if (!s.justified) counts.missingJustifications += 1;
        }
      });

      const scoredFractions = safeguards.filter((s) => s.score !== null).map((s) => s.fraction);
      const controlFraction = scoredFractions.length ? averageOf(scoredFractions) : null;
      return {
        id: control.id,
        name: control.name,
        safeguards,
        scoredCount: scoredFractions.length,
        fraction: controlFraction,
        score: controlFraction ? toHundredths(controlFraction) : null,
        categoryAverages: categoryAverages(safeguards)
      };
    });

    const complete = counts.ratingsAnswered === counts.ratingsRequired && counts.missingJustifications === 0;
    const scoredControls = controlResults.filter((c) => c.fraction);
    let overall = null;
    if (complete && scoredControls.length > 0) {
      const hundredths = toHundredths(averageOf(scoredControls.map((c) => c.fraction)));
      overall = { hundredths, display: formatScore(hundredths), grade: gradeFor(hundredths) };
    }

    return {
      available: true,
      framework: source.framework,
      scoringMethod: source.scoringMethod.name,
      complete,
      counts,
      overall,
      controls: controlResults
    };
  }

  window.TPT = window.TPT || {};
  window.TPT.scoring = {
    CATEGORY_IDS,
    computeScores,
    formatScore,
    gradeFor,
    toHundredths,
    fraction
  };
})();
