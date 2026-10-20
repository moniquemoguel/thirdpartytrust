// Results report for ThirdPartyTrust: the seal, the executive summary (shown in the exported PDF), and the
// Implementation Group scores with the gap to target. Loads after tpt-report-core.js.
(function () {
  const { el } = window.TPT.dom;
  const h = window.TPT.report.helpers;
  const controls = window.CIS_V81_CONTROLS;

  function riskTotals(results) {
    return { critical: results.criticalControls.length, high: results.highControls.length };
  }

  function seal(payload) {
    const { results, assessment } = payload;
    const critical = results.criticalControls.length;
    return el("section", { className: "report-seal", "aria-label": "Overall result" }, [
      el("p", { className: "seal-grade", text: results.overall.grade }),
      el("div", { className: "seal-text" }, [
        el("p", { className: "seal-score", text: "Score " + results.overall.display + " out of 100" }),
        el("p", { className: "seal-critical", text: critical === 0 ? "No Controls rated Critical" : critical + (critical === 1 ? " Control rated Critical" : " Controls rated Critical") }),
        el("p", { className: "seal-vendor", text: assessment.details.vendorName + " \u00b7 " + assessment.details.assessmentDate })
      ])
    ]);
  }

  function notImplementedCounts(results) {
    let ig1 = 0;
    let top = null;
    results.controls.forEach((c) => {
      const count = c.safeguards.filter((s) => s.applicable && s.ratings.implemented === 0).length;
      ig1 += c.safeguards.filter((s) => s.applicable && s.ratings.implemented === 0 && s.entryGroup === "IG1").length;
      if (count > 0 && (!top || count > top.count)) top = { id: c.id, name: c.name, count };
    });
    return { ig1, top };
  }

  function narrative(payload) {
    const { results, assessment } = payload;
    const d = assessment.details;
    const { critical, high } = riskTotals(results);
    const ni = notImplementedCounts(results);
    const grade = results.overall.grade;
    const lines = [
      d.vendorName + " scored " + results.overall.display + " out of 100, a grade of " + grade + ".",
      critical + high === 0 ? "No Controls are rated Critical or High." : critical + " of " + controls.length + " Controls are rated Critical and " + high + " High.",
      "Impact is " + results.impact + " because the vendor handles " + h.sensitivityLabel(assessment.dataSensitivity).toLowerCase() + ".",
      ni.top ? "Not Implemented answers are concentrated in Control " + ni.top.id + " (" + ni.top.name + "), with " + ni.top.count + "." : "No Safeguards are rated Not Implemented."
    ];
    if (ni.ig1 > 0) lines.push(ni.ig1 + (ni.ig1 === 1 ? " essential (IG1) Safeguard is" : " essential (IG1) Safeguards are") + " not implemented.");
    if ((grade === "A" || grade === "B") && critical + high > 0) lines.push("The grade is high, but " + (critical + high) + (critical + high === 1 ? " Control still carries" : " Controls still carry") + " Critical or High risk.");
    if ((grade === "D" || grade === "F") && critical + high === 0) lines.push("The grade is low, but no Control is rated Critical or High.");
    return lines.join(" ");
  }

  function tile(value, label) {
    return el("div", { className: "exec-tile" }, [el("p", { className: "exec-tile-value", text: String(value) }), el("p", { className: "exec-tile-label", text: label })]);
  }

  function executive(payload) {
    const { results, assessment, assessmentId } = payload;
    const d = assessment.details;
    const exposed = results.register.filter((r) => r.riskLevel === "Critical" || r.riskLevel === "High");
    return el("section", { className: "report-section report-exec" }, [
      el("h2", { text: "Executive summary" }),
      el("p", { className: "exec-meta", text: "Assessment ID " + assessmentId + " \u00b7 " + d.assessmentDate }),
      el("p", { className: "exec-vendor", text: d.vendorName + " \u00b7 " + d.serviceProvided + " \u00b7 Handles " + h.sensitivityLabel(assessment.dataSensitivity).toLowerCase() + " (Impact: " + results.impact + ")" }),
      el("div", { className: "exec-tiles" }, [
        tile(results.counts.applicable, "Safeguards assessed"),
        tile(results.counts.notApplicable, "Not applicable"),
        tile(results.implementedCounts["100"], "Implemented on All Systems"),
        tile(results.implementedCounts["0"], "Not Implemented")
      ]),
      el("p", { className: "exec-narrative", text: narrative(payload) }),
      el("div", { className: "exec-exposure" }, [el("p", { className: "exec-exposure-label", text: "Primary exposure" })].concat(
        exposed.length
          ? exposed.map((r) => el("span", { className: "risk-badge risk-" + r.riskLevel.toLowerCase(), text: "Control " + r.controlId + ": " + r.controlName }))
          : [el("span", { className: "risk-badge risk-low", text: "No Controls rated Critical or High" })]
      )),
      el("p", { className: "exec-scope", text: "All " + controls.reduce((n, c) => n + c.safeguards.length, 0) + " Safeguards in all " + controls.length + " CIS Controls (IG1 to IG3). Answers are self-reported and not independently verified." })
    ]);
  }

  function groups(payload) {
    const { results, gaps } = payload;
    const gs = results.groupScores;
    const next = gaps && gaps.nextGrade;
    return h.section("report-groups", "Implementation Group scores and gap to target", [
      el("div", { className: "group-tiles" }, ["IG1", "IG2", "IG3"].map((g) =>
        el("div", { className: "exec-tile" }, [el("p", { className: "exec-tile-value", text: gs[g] ? gs[g].display : "Not applicable" }), el("p", { className: "exec-tile-label", text: g })])
      )),
      el("p", { className: "report-note", text: "IG2 includes all IG1 Safeguards, and IG3 includes all 153, so the IG3 score equals the overall score. Calculated over applicable Safeguards; this is the tool's own calculation." }),
      el("p", { className: "gap-line" }, [
        el("strong", { text: next ? h.score(next.pointsNeeded) + " points to " + (next.grade === "A" ? "an " : "a ") + next.grade : "Top grade reached." }),
        el("span", { className: "report-label", text: " Tool's own measure" })
      ])
    ]);
  }

  window.TPT.report.parts.summary = { seal, executive, groups };
})();
