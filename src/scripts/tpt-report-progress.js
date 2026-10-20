// Results report for ThirdPartyTrust: Progress over time, shown only when earlier assessments of the same
// vendor are loaded. Includes the trend chart and every delta. Loads after tpt-report-core.js.
(function () {
  const { el } = window.TPT.dom;
  const h = window.TPT.report.helpers;
  const RISK_ORDER = ["Low", "Moderate", "High", "Critical"];
  const CATEGORY_NAMES = { policy: "Policy", implemented: "Implemented", automated: "Automated", reported: "Reported" };
  const SVG_NS = "http://www.w3.org/2000/svg";

  function svg(tag, attrs, text) {
    const node = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs || {}).forEach(([k, v]) => node.setAttribute(k, v));
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function chart(points) {
    const width = 640;
    const height = 260;
    const left = 56;
    const right = 24;
    const top = 20;
    const bottom = 56;
    const plotW = width - left - right;
    const plotH = height - top - bottom;
    const x = (i) => left + (points.length === 1 ? plotW / 2 : (plotW * i) / (points.length - 1));
    const y = (hundredths) => top + plotH - (plotH * hundredths) / 10000;
    const root = svg("svg", { viewBox: "0 0 " + width + " " + height, class: "trend-chart", role: "img", "aria-labelledby": "trend-title" });
    root.append(svg("title", { id: "trend-title" }, "Overall score by assessment: " + points.map((p) => p.quarter.label + " " + p.overall.display).join(", ")));
    [0, 2500, 5000, 7500, 10000].forEach((v) => {
      root.append(svg("line", { x1: left, x2: width - right, y1: y(v), y2: y(v), class: "trend-grid" }));
      root.append(svg("text", { x: left - 8, y: y(v) + 4, class: "trend-tick", "text-anchor": "end" }, String(v / 100)));
    });
    root.append(svg("polyline", { points: points.map((p, i) => x(i) + "," + y(p.overall.hundredths)).join(" "), class: "trend-line" }));
    points.forEach((p, i) => {
      root.append(svg("circle", { cx: x(i), cy: y(p.overall.hundredths), r: 5, class: "trend-point" }));
      root.append(svg("text", { x: x(i), y: y(p.overall.hundredths) - 10, class: "trend-value", "text-anchor": "middle" }, p.overall.display));
      root.append(svg("text", { x: x(i), y: height - bottom + 20, class: "trend-tick", "text-anchor": "middle" }, p.quarter.label));
    });
    root.append(svg("text", { x: 14, y: top + plotH / 2, class: "trend-axis", "text-anchor": "middle", transform: "rotate(-90 14 " + (top + plotH / 2) + ")" }, "Overall score"));
    root.append(svg("text", { x: left + plotW / 2, y: height - 8, class: "trend-axis", "text-anchor": "middle" }, "Assessment"));
    return el("div", { className: "trend-wrap" }, [root]);
  }

  function riskMove(from, to) {
    if (!from || !to) return "Not comparable";
    if (from === to) return to + " (no change)";
    return from + " \u2192 " + to;
  }

  function summaryLine(trend) {
    const previous = trend.points[trend.points.length - 2];
    const latest = trend.points[trend.points.length - 1];
    const improved = trend.controlChanges.filter((c) => c.riskPrevious && c.riskLatest && RISK_ORDER.indexOf(c.riskLatest) < RISK_ORDER.indexOf(c.riskPrevious)).length;
    const sign = trend.overall.sincePrevious > 0 ? "+" : trend.overall.sincePrevious < 0 ? "\u2212" : "";
    return "Since " + previous.quarter.label + ": overall " + sign + h.score(Math.abs(trend.overall.sincePrevious)) +
      " (" + previous.overall.grade + " to " + latest.overall.grade + "), " + improved + (improved === 1 ? " Control" : " Controls") +
      " improved in risk level, Critical Controls " + previous.riskCounts.Critical + " \u2192 " + latest.riskCounts.Critical + ".";
  }

  function excludedNotes(trend) {
    return trend.excluded.map((x) => el("p", { className: "report-note", text: "Not included: " + x.label + ", " + x.reason }));
  }

  function render(trend) {
    if (!trend.ok) {
      return h.section("report-progress", "Progress over time", [el("p", { text: trend.reason })].concat(excludedNotes(trend)));
    }
    const children = [
      el("p", { className: "progress-summary", text: summaryLine(trend) }),
      chart(trend.points),
      h.table(["Assessment", "Date", "Score", "Grade", "Critical", "High"], trend.points.map((p) => [
        p.quarter.label, p.assessmentDate, p.overall.display, p.overall.grade, String(p.riskCounts.Critical), String(p.riskCounts.High)
      ])),
      el("h3", { text: "Change by Control" }),
      h.table(["Control", "Since previous", "Since first", "Risk level", "By category, since previous"], trend.controlChanges.map((c) => [
        c.controlId + " " + c.controlName,
        h.delta(c.sincePrevious),
        h.delta(c.sinceFirst),
        riskMove(c.riskPrevious, c.riskLatest),
        Object.keys(CATEGORY_NAMES).map((id) => CATEGORY_NAMES[id] + " " + h.delta(c.categories[id].sincePrevious)).join(" \u00b7 ")
      ])),
      el("h3", { text: "Implementation Groups and risk levels" }),
      h.table(["Measure", "Since previous", "Since first"], ["IG1", "IG2", "IG3"].map((g) => [g, h.delta(trend.groupChanges[g].sincePrevious), h.delta(trend.groupChanges[g].sinceFirst)])
        .concat(RISK_ORDER.slice().reverse().map((level) => [level + " Controls", h.countDelta(trend.riskCountChanges[level].sincePrevious), h.countDelta(trend.riskCountChanges[level].sinceFirst)])))
    ];
    const sg = trend.safeguardsSincePrevious;
    if (sg) {
      children.push(el("h3", { text: "Safeguards since the last assessment" }));
      [["Improved", sg.improved], ["Declined", sg.regressed], ["Applicability changed", sg.applicabilityChanged]].forEach(([label, list]) => {
        children.push(el("p", {}, [el("strong", { text: label + ": " }), document.createTextNode(list.length ? list.join(", ") : "None")]));
      });
    }
    children.push(...excludedNotes(trend));
    children.push(el("p", { className: "report-note", text: "Only complete assessments of the same vendor, assessment series and CIS data version are compared." }));
    return h.section("report-progress", "Progress over time", children);
  }

  window.TPT.report.parts.progress = { render };
})();
