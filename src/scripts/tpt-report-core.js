// Results report for ThirdPartyTrust, core: shared formatting, rendering the report into the page, clearing
// it, and exporting it to PDF with the browser's print dialog. The report sections live in the other
// tpt-report-*.js files, which load after this one. All text is set with textContent.
(function () {
  const { el } = window.TPT.dom;
  const scoring = window.TPT.scoring;
  const source = window.CIS_V81_SOURCE;
  const method = window.TPT_METHODOLOGY;
  const parts = {};

  function score(hundredths) {
    return hundredths === null || hundredths === undefined ? "Not applicable" : scoring.formatScore(hundredths);
  }

  // A signed score change with a word, for example "+7.75 Improved" or "−5.00 Declined".
  function delta(hundredths) {
    if (hundredths === null || hundredths === undefined) return "Not comparable";
    if (hundredths === 0) return "No change";
    const sign = hundredths > 0 ? "+" : "\u2212";
    return sign + scoring.formatScore(Math.abs(hundredths)) + " " + (hundredths > 0 ? "Improved" : "Declined");
  }

  function countDelta(change) {
    if (change === null || change === undefined) return "Not comparable";
    if (change === 0) return "No change";
    return (change > 0 ? "+" : "\u2212") + Math.abs(change);
  }

  function riskBadge(level) {
    if (!level) return el("span", { className: "risk-badge risk-none", text: "Not applicable" });
    return el("span", { className: "risk-badge risk-" + level.toLowerCase(), text: level });
  }

  function optionLabel(categoryId, value) {
    const category = source.scoringMethod.categories.find((c) => c.id === categoryId);
    const option = category && category.options.find((o) => o.value === value);
    return option ? option.label : "Not answered";
  }

  function sensitivityLabel(id) {
    const option = method.dataSensitivity.options.find((o) => o.id === id);
    return option ? option.label : "";
  }

  function section(className, title, children, collapsible) {
    if (collapsible) {
      return el("details", { className: "report-section report-collapsible " + className }, [el("summary", { text: title })].concat(children));
    }
    return el("section", { className: "report-section " + className }, [el("h2", { text: title })].concat(children));
  }

  function table(headings, rows, caption) {
    const head = el("tr", {}, headings.map((h) => el("th", { scope: "col", text: h })));
    const body = rows.map((cells) => el("tr", {}, cells.map((c) => el("td", {}, [typeof c === "string" ? document.createTextNode(c) : c]))));
    return el("div", { className: "table-wrap" }, [
      el("table", { className: "report-table" }, [caption ? el("caption", { text: caption }) : null, el("thead", {}, [head]), el("tbody", {}, body)])
    ]);
  }

  // Closed report sections open while printing, however printing starts, so the PDF holds the full report.
  let openedForPrint = [];
  window.addEventListener("beforeprint", () => {
    const closed = Array.from(document.querySelectorAll(".report details:not([open])"));
    closed.forEach((d) => { d.open = true; });
    openedForPrint = openedForPrint.concat(closed);
  });
  window.addEventListener("afterprint", () => {
    openedForPrint.forEach((d) => { d.open = false; });
    openedForPrint = [];
  });

  function render(container, payload) {
    container.textContent = "";
    const actions = el("div", { className: "report-actions" });
    const exportButton = el("button", { type: "button", className: "button button-primary", text: "Export report (PDF)" });
    exportButton.addEventListener("click", () => window.print());
    const saveButton = el("button", { type: "button", className: "button", text: "Save this assessment" });
    saveButton.addEventListener("click", () => payload.onSave && payload.onSave());
    actions.append(exportButton, saveButton);

    const report = el("article", { className: "report", "aria-label": "Assessment results" }, [
      parts.summary.seal(payload),
      actions,
      parts.summary.executive(payload),
      payload.trend ? parts.progress.render(payload.trend) : null,
      parts.summary.groups(payload),
      parts.tables.scorecard(payload),
      parts.tables.register(payload),
      parts.tables.heatmap(payload),
      parts.details.findings(payload),
      parts.details.notApplicable(payload),
      parts.details.method(payload)
    ].filter(Boolean));
    container.append(report);
  }

  function clear(container) {
    container.textContent = "";
  }

  window.TPT.report = {
    render,
    clear,
    parts,
    helpers: { score, delta, countDelta, riskBadge, optionLabel, sensitivityLabel, section, table }
  };
})();
