// Questionnaire for ThirdPartyTrust: builds one CIS Control at a time from the data files and keeps every
// answer in memory. Shows no score values. Loads after tpt-dom.js and tpt-questionnaire-details.js.
(function () {
  const controls = window.CIS_V81_CONTROLS;
  const source = window.CIS_V81_SOURCE;
  const scoring = window.TPT.scoring;
  const { el, hasText, textField } = window.TPT.dom;
  const details = window.TPT.questionnaireDetails;

  const CATEGORY_HELP = {
    policy: "How fully is this written into policy?",
    implemented: "How widely is it in place?",
    automated: "How widely is it enforced by tools?",
    reported: "How widely is its status reported to leadership?"
  };
  const JUSTIFICATION = [
    { id: "reason", label: "Reason" },
    { id: "risk", label: "Risk of not applying it" },
    { id: "mitigations", label: "Compensating measures" },
    { id: "reviewDate", label: "Date to review this decision", type: "date" }
  ];
  const EVIDENCE = [
    { id: "title", label: "Document or record name", max: 300 },
    { id: "location", label: "Where it's kept", max: 500 },
    { id: "date", label: "Document date", type: "date" }
  ];

  let state = emptyAssessment();
  let current = 0;
  let showErrors = false;
  let onChange = () => {};
  let root;

  function emptyAssessment() {
    return { details: { attested: false }, dataSensitivity: null, safeguards: {} };
  }

  function entryFor(id) {
    if (!state.safeguards[id]) {
      state.safeguards[id] = { applicable: true, ratings: {}, justification: {}, notes: "", evidence: {} };
    }
    return state.safeguards[id];
  }

  function safeguardDone(id) {
    const entry = state.safeguards[id];
    if (!entry) return false;
    if (entry.applicable === false) return JUSTIFICATION.every((f) => hasText(entry.justification[f.id]));
    return scoring.CATEGORY_IDS.every((c) => c in entry.ratings);
  }

  function changed() {
    updateNav();
    onChange();
  }

  function renderCategory(safeguard, category) {
    const entry = entryFor(safeguard.id);
    const name = "rating-" + safeguard.id + "-" + category.id;
    const options = el("div", { className: "rating-options" });
    category.options.forEach((option) => {
      const value = option.value === null ? "na" : String(option.value);
      const chosen = category.id in entry.ratings && (entry.ratings[category.id] === null ? "na" : String(entry.ratings[category.id])) === value;
      const input = el("input", { type: "radio", name, value, checked: chosen });
      input.addEventListener("change", () => {
        entry.ratings[category.id] = option.value;
        refreshCard(safeguard.id);
        changed();
      });
      options.append(el("label", { className: "rating" + (option.value === null ? " rating-na" : "") }, [input, el("span", { text: option.label })]));
    });
    return el("fieldset", { className: "category" }, [
      el("legend", { text: category.name }),
      el("p", { className: "category-help", text: CATEGORY_HELP[category.id] }),
      options
    ]);
  }

  function renderAnswerArea(safeguard) {
    const entry = entryFor(safeguard.id);
    const prefix = "sg-" + safeguard.id.replace(".", "-");
    if (entry.applicable === false) {
      const area = el("div", { className: "justification" }, [
        el("p", { className: "justification-intro", text: "Explain why this Safeguard doesn't apply to this vendor. All four fields are required and appear in the report." })
      ]);
      JUSTIFICATION.forEach((f) => {
        area.append(
          textField(prefix + "-" + f.id, f.label, entry.justification[f.id], (v) => {
            entry.justification[f.id] = v;
            refreshCard(safeguard.id);
            changed();
          }, { type: f.type, multiline: f.type !== "date", max: 2000 })
        );
      });
      if (showErrors && !safeguardDone(safeguard.id)) area.append(el("p", { className: "field-error", text: "Complete all four fields to explain why this Safeguard doesn't apply." }));
      return area;
    }
    const area = el("div", { className: "categories" });
    source.scoringMethod.categories.forEach((c) => area.append(renderCategory(safeguard, c)));
    if (showErrors && !safeguardDone(safeguard.id)) area.append(el("p", { className: "field-error", text: "Answer all four parts, or switch off Applies to this vendor." }));
    return area;
  }

  function renderEvidence(safeguard) {
    const entry = entryFor(safeguard.id);
    const prefix = "sg-" + safeguard.id.replace(".", "-") + "-evidence";
    const fields = el("div", { className: "evidence-fields" }, [
      textField(prefix + "-notes", "Notes", entry.notes, (v) => {
        entry.notes = v;
        changed();
      }, { multiline: true, max: 4000, extraClass: "field-notes" })
    ]);
    EVIDENCE.forEach((f) => {
      fields.append(
        textField(prefix + "-" + f.id, f.label, entry.evidence[f.id], (v) => {
          entry.evidence[f.id] = v;
          changed();
        }, { type: f.type, max: f.max })
      );
    });
    return el("details", {}, [el("summary", { text: "Notes and evidence (optional)" }), fields]);
  }

  function cardClass(id) {
    const entry = state.safeguards[id];
    if (entry && entry.applicable === false) return "safeguard is-not-applicable";
    return "safeguard" + (safeguardDone(id) ? " is-complete" : "");
  }

  function renderCard(safeguard) {
    const entry = entryFor(safeguard.id);
    const headingId = "sg-" + safeguard.id.replace(".", "-") + "-title";
    const toggle = el("input", { type: "checkbox", checked: entry.applicable !== false });
    const card = el("article", { className: cardClass(safeguard.id), id: "safeguard-" + safeguard.id, "aria-labelledby": headingId }, [
      el("div", { className: "safeguard-head" }, [
        el("span", { className: "safeguard-id", text: safeguard.id }),
        el("h3", { id: headingId, text: safeguard.title })
      ]),
      el("ul", { className: "safeguard-tags" }, [
        el("li", { className: "tag tag-ig", text: safeguard.implementationGroups[0] }),
        el("li", { className: "tag", text: "Asset type: " + safeguard.assetType }),
        el("li", { className: "tag", text: "Security function: " + safeguard.securityFunction })
      ]),
      el("details", {}, [el("summary", { text: "CIS description" }), el("p", { className: "cis-text", text: safeguard.description })]),
      el("label", { className: "applicable-switch" }, [toggle, el("span", { text: "Applies to this vendor" })]),
      renderAnswerArea(safeguard),
      renderEvidence(safeguard)
    ]);
    toggle.addEventListener("change", () => {
      entry.applicable = toggle.checked;
      card.replaceWith(renderCard(safeguard));
      changed();
    });
    return card;
  }

  function refreshCard(id) {
    const card = document.getElementById("safeguard-" + id);
    if (!card) return;
    card.className = cardClass(id);
    const error = card.querySelector(":scope > .categories > .field-error, :scope > .justification > .field-error");
    if (error && safeguardDone(id)) error.remove();
  }

  function controlCounts(control) {
    const done = control.safeguards.filter((s) => safeguardDone(s.id)).length;
    return { done, total: control.safeguards.length };
  }

  function updateNav() {
    controls.forEach((control, i) => {
      const { done, total } = controlCounts(control);
      const link = root.querySelector('.control-link[data-index="' + i + '"]');
      if (link) {
        link.classList.toggle("is-complete", done === total);
        link.querySelector(".control-count").textContent = done + "/" + total;
      }
      const option = root.querySelector('.control-picker option[value="' + i + '"]');
      if (option) option.textContent = control.id + " " + control.name + " (" + done + " of " + total + ")";
    });
  }

  function renderControl() {
    const control = controls[current];
    const section = root.querySelector(".control-panel");
    section.textContent = "";
    section.append(
      el("div", { className: "control-header" }, [
        el("h2", { id: "control-heading", tabindex: "-1", text: "Control " + control.id + ": " + control.name }),
        el("p", { text: control.description })
      ])
    );
    control.safeguards.forEach((s) => section.append(renderCard(s)));
    const pager = el("div", { className: "control-pager" });
    if (current > 0) pager.append(pagerButton("Previous: Control " + controls[current - 1].id, current - 1));
    if (current < controls.length - 1) pager.append(pagerButton("Next: Control " + controls[current + 1].id, current + 1));
    section.append(pager);
    root.querySelectorAll(".control-link").forEach((link) => {
      if (Number(link.dataset.index) === current) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
    root.querySelector(".control-picker select").value = String(current);
  }

  function pagerButton(label, index) {
    const button = el("button", { type: "button", className: "button", text: label });
    button.addEventListener("click", () => goTo(index, true));
    return button;
  }

  function goTo(index, focusHeading) {
    current = index;
    renderControl();
    if (focusHeading) {
      const heading = document.getElementById("control-heading");
      heading.scrollIntoView({ block: "start" });
      heading.focus({ preventScroll: true });
    }
  }

  function renderWorkspace() {
    const list = el("ol");
    const select = el("select", { "aria-label": "Choose a CIS Control" });
    controls.forEach((control, i) => {
      const link = el("button", { type: "button", className: "control-link", "data-index": String(i) }, [
        el("span", { className: "control-number", text: String(control.id) }),
        el("span", { text: control.name }),
        el("span", { className: "control-count" })
      ]);
      link.addEventListener("click", () => goTo(i, true));
      list.append(el("li", {}, [link]));
      select.append(el("option", { value: String(i) }));
    });
    select.addEventListener("change", () => goTo(Number(select.value), true));
    return el("div", { className: "workspace" }, [
      el("nav", { className: "control-nav", "aria-label": "CIS Controls" }, [list]),
      el("section", {}, [el("div", { className: "control-picker" }, [select]), el("div", { className: "control-panel" })])
    ]);
  }

  function render() {
    root.textContent = "";
    root.append(details.render(state, showErrors, changed), details.renderGuide(), renderWorkspace());
    renderControl();
    updateNav();
  }

  function firstUnanswered() {
    for (let i = 0; i < controls.length; i += 1) {
      const s = controls[i].safeguards.find((sg) => !safeguardDone(sg.id));
      if (s) return { index: i, id: s.id };
    }
    return null;
  }

  function goToNextUnanswered() {
    if (details.focusFirstMissing(state)) return true;
    const next = firstUnanswered();
    if (!next) return false;
    goTo(next.index, false);
    const card = document.getElementById("safeguard-" + next.id);
    card.scrollIntoView({ block: "start" });
    const target = card.querySelector('input[type="radio"]:not(:checked), textarea, input[type="date"]');
    if (target) target.focus({ preventScroll: true });
    return true;
  }

  window.TPT.questionnaire = {
    init(container, changeHandler) {
      root = container;
      onChange = changeHandler || (() => {});
      render();
    },
    load(assessment) {
      state = assessment;
      showErrors = false;
      current = 0;
      render();
    },
    reset() {
      state = emptyAssessment();
      showErrors = false;
      current = 0;
      render();
    },
    getAssessment() {
      return state;
    },
    showErrors() {
      showErrors = true;
      const scroll = window.scrollY;
      render();
      window.scrollTo(0, scroll);
    },
    goToNextUnanswered
  };
})();
