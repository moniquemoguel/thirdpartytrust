// Results report for ThirdPartyTrust: the Control scorecard, the risk register, and the Impact and
// Likelihood heat map. Loads after tpt-report-core.js.
(function () {
  const { el } = window.TPT.dom;
  const h = window.TPT.report.helpers;
  const method = window.TPT_METHODOLOGY;
  const CATEGORY_IDS = window.TPT.scoring.CATEGORY_IDS;

  function scorecard(payload) {
    const { results, gaps } = payload;
    const rows = results.controls.map((c, i) => {
      const register = results.register[i];
      const gap = gaps && gaps.controls[i] ? gaps.controls[i].toFull : null;
      return [
        c.id + " " + c.name,
        h.score(c.score)
      ].concat(CATEGORY_IDS.map((id) => h.score(c.categoryAverages[id]))).concat([
        gap === null ? "Not applicable" : h.score(gap),
        h.riskBadge(register.riskLevel)
      ]);
    });
    return h.section("report-scorecard", "Control scorecard", [
      h.table(["Control", "Score", "Policy", "Implemented", "Automated", "Reported", "Distance to full", "Risk level"], rows),
      el("p", { className: "report-note", text: "Distance to full is the tool's own measure: how far each Control's score is from 100." })
    ]);
  }

  function actionText(action) {
    if (!action) return "Not applicable";
    if (action.type === "None") return "No immediate action needed.";
    return action.type + " " + action.safeguards.join(", ");
  }

  function register(payload) {
    const rows = payload.results.register.map((r) => [
      r.controlId + " " + r.controlName,
      r.likelihood || "Not applicable",
      r.impact,
      h.riskBadge(r.riskLevel),
      actionText(r.action)
    ]);
    return h.section("report-register", "Risk register", [
      h.table(["Control", "Likelihood", "Impact", "Risk level", "Recommended action"], rows),
      el("p", { className: "report-note", text: "Likelihood, Impact, risk level and recommended actions are the tool's own method, not part of CIS Controls." })
    ]);
  }

  function heatmap(payload) {
    const levels = method.levels;
    const register = payload.results.register;
    const grid = el("div", { className: "heatmap", role: "group", "aria-label": "Impact and Likelihood heat map" });
    grid.append(el("p", { className: "heatmap-axis heatmap-axis-impact", text: "Impact" }));
    levels.slice().reverse().forEach((impact) => {
      grid.append(el("p", { className: "heatmap-level", text: impact }));
      levels.forEach((likelihood) => {
        const level = method.riskMatrix[impact][likelihood];
        const ids = register.filter((r) => r.impact === impact && r.likelihood === likelihood).map((r) => r.controlId);
        grid.append(el("div", { className: "heatmap-cell risk-" + level.toLowerCase() }, [
          el("span", { className: "heatmap-cell-level", text: level }),
          el("span", { className: "heatmap-cell-controls", text: ids.length ? (ids.length === 1 ? "Control " : "Controls ") + ids.join(", ") : "" })
        ]));
      });
    });
    grid.append(el("span", { className: "heatmap-corner" }));
    levels.forEach((likelihood) => grid.append(el("p", { className: "heatmap-level heatmap-level-likelihood", text: likelihood })));
    grid.append(el("p", { className: "heatmap-axis heatmap-axis-likelihood", text: "Likelihood" }));
    return h.section("report-heatmap", "Heat map", [
      grid,
      el("p", { className: "report-note", text: "Each Control is placed by its Impact and Likelihood. Impact comes from the kind of data the vendor handles; Likelihood comes from how widely its Safeguards are implemented." })
    ]);
  }

  window.TPT.report.parts.tables = { scorecard, register, heatmap };
})();
