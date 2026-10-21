// Results report for ThirdPartyTrust: detailed findings, the not-applicable register, and the method, scope,
// attestation, and CIS credit. These sections are collapsed on screen and expanded in the exported PDF.
// Loads after tpt-report-core.js and tpt-questionnaire-details.js.
(function () {
  const { el, hasText } = window.TPT.dom;
  const h = window.TPT.report.helpers;
  const source = window.CIS_V81_SOURCE;
  const CATEGORY_IDS = window.TPT.scoring.CATEGORY_IDS;
  const ATTESTATION = window.TPT.questionnaireDetails.ATTESTATION;

  function categoryName(id) {
    return source.scoringMethod.categories.find((c) => c.id === id).name;
  }

  function findings(payload) {
    const { results, assessment } = payload;
    const children = results.controls.map((control) => {
      const items = control.safeguards.map((s) => {
        const entry = assessment.safeguards[s.id] || {};
        const lines = [el("p", { className: "finding-title" }, [el("strong", { text: s.id + " " }), document.createTextNode(s.title)])];
        if (!s.applicable) {
          lines.push(el("p", { className: "finding-line", text: "Not applicable to this vendor. See the not-applicable register." }));
        } else {
          lines.push(el("p", { className: "finding-line", text: CATEGORY_IDS.map((id) => categoryName(id) + ": " + h.optionLabel(id, s.ratings[id])).join(" \u00b7 ") }));
          lines.push(el("p", { className: "finding-line", text: "Safeguard score: " + h.score(s.score) }));
        }
        if (hasText(entry.notes)) lines.push(el("p", { className: "finding-line", text: "Notes: " + entry.notes }));
        const ev = entry.evidence || {};
        if (hasText(ev.title) || hasText(ev.location) || hasText(ev.date)) {
          lines.push(el("p", { className: "finding-line", text: "Evidence: " + [ev.title, ev.location, ev.date].filter(hasText).join(" \u00b7 ") }));
        }
        return el("li", { className: "finding" }, lines);
      });
      return el("div", { className: "finding-group" }, [el("h3", { text: "Control " + control.id + ": " + control.name }), el("ul", { className: "finding-list" }, items)]);
    });
    return h.section("report-findings", "Detailed findings", children, true);
  }

  function notApplicable(payload) {
    const { results, assessment } = payload;
    const rows = [];
    results.controls.forEach((c) => c.safeguards.forEach((s) => {
      if (s.applicable) return;
      const j = (assessment.safeguards[s.id] || {}).justification || {};
      rows.push([s.id + " " + s.title, j.reason || "", j.risk || "", j.mitigations || "", j.reviewDate || ""]);
    }));
    const body = rows.length
      ? [h.table(["Safeguard", "Reason", "Risk of not applying it", "Compensating measures", "Review date"], rows)]
      : [el("p", { text: "Every Safeguard applies to this vendor." })];
    return h.section("report-na", "Not-applicable register", body, true);
  }

  function method(payload) {
    const d = payload.assessment.details;
    const own = [
      ["Letter grade", "A to F from the overall score: A 90 and above, B 80, C 70, D 60, F below 60."],
      ["Impact", "Set by the kind of data the vendor handles."],
      ["Likelihood", "Set for each Control by how widely its Safeguards are implemented; any IG1 Safeguard not implemented makes it Critical."],
      ["Risk level", "Combines Impact and Likelihood on four levels: Low, Moderate, High, and Critical."],
      ["Recommended actions", "Safeguards to prioritize (not implemented) or strengthen (partly implemented), IG1 first."],
      ["Implementation Group scores", "The CIS averaging applied to each Implementation Group's applicable Safeguards."],
      ["Gap to target", "Points to the next grade, and each Control's distance to a score of 100."],
      ["Deltas", "Changes since the previous and the first assessment of the same vendor."]
    ];
    return h.section("report-method", "Method, scope, attestation and credit", [
      el("h3", { text: "From CIS Controls v8.1" }),
      el("p", { text: "The 18 Controls, the 153 Safeguards and their Implementation Groups, and the CIS Advanced Scoring Method: four ratings per Safeguard, averaged by Safeguard, then by Control, then overall." }),
      el("h3", { text: "The tool's own method" }),
      el("ul", { className: "method-list" }, own.map(([term, text]) => el("li", {}, [el("strong", { text: term + ": " }), document.createTextNode(text)]))),
      el("h3", { text: "Attestation" }),
      el("p", { text: "Respondent: " + d.respondentName + ", " + d.respondentRole + " \u00b7 Reviewer: " + d.reviewer + " \u00b7 Date: " + d.assessmentDate }),
      el("p", { className: "report-note", text: ATTESTATION }),
      el("p", { className: "report-credit", text: "Safeguard titles and descriptions: CIS Critical Security Controls v8.1, Center for Internet Security, Inc., licensed under CC BY-NC-ND 4.0." }),
      el("p", { className: "report-credit", text: "A self-assessment, not a scan: results reflect what the respondent reported." })
    ], true);
  }

  window.TPT.report.parts.details = { findings, notApplicable, method };
})();
