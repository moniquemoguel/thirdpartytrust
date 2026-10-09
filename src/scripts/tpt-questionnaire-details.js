// Assessment details for ThirdPartyTrust: vendor and respondent fields, data sensitivity, the attestation,
// and the "How to answer" guide. Loads after tpt-dom.js and before tpt-questionnaire.js.
(function () {
  const { el, hasText, textField } = window.TPT.dom;
  const method = window.TPT_METHODOLOGY;
  const source = window.CIS_V81_SOURCE;

  const FIELDS = [
    { id: "vendorName", label: "Vendor name", missing: "Enter the vendor name." },
    { id: "serviceProvided", label: "Service provided", missing: "Enter the service provided." },
    { id: "respondentName", label: "Respondent name", missing: "Enter the respondent name." },
    { id: "respondentRole", label: "Respondent role", missing: "Enter the respondent role." },
    { id: "reviewer", label: "Reviewer", missing: "Enter the reviewer." },
    { id: "assessmentDate", label: "Assessment date", missing: "Enter the assessment date.", type: "date" }
  ];
  const ATTESTATION =
    "I confirm these answers are accurate to the best of my knowledge, reflect the vendor's current practices, and have been reviewed by the reviewer named above.";

  function isMissing(state) {
    return FIELDS.some((f) => !hasText(state.details[f.id])) || !state.dataSensitivity || state.details.attested !== true;
  }

  function render(state, showErrors, changed) {
    const panel = el("section", { className: "details-panel", id: "details", tabindex: "-1", "aria-labelledby": "details-heading" }, [
      el("h2", { id: "details-heading", text: "Assessment details" })
    ]);
    const grid = el("div", { className: "details-grid" });
    FIELDS.forEach((f) => {
      grid.append(
        textField("detail-" + f.id, f.label, state.details[f.id], (value) => {
          state.details[f.id] = value;
          changed();
        }, { type: f.type, error: showErrors && !hasText(state.details[f.id]) ? f.missing : null })
      );
    });
    panel.append(grid);

    const options = el("div", { className: "sensitivity-options" });
    method.dataSensitivity.options.forEach((o) => {
      const input = el("input", { type: "radio", name: "data-sensitivity", value: o.id, checked: state.dataSensitivity === o.id });
      input.addEventListener("change", () => {
        state.dataSensitivity = o.id;
        const error = panel.querySelector(".sensitivity .field-error");
        if (error) error.remove();
        changed();
      });
      options.append(el("label", { className: "rating" }, [input, el("span", { text: o.label })]));
    });
    const sensitivity = el("fieldset", { className: "sensitivity field" }, [
      el("legend", { text: method.dataSensitivity.question }),
      el("p", { className: "field-hint", text: method.dataSensitivity.caption }),
      options
    ]);
    if (showErrors && !state.dataSensitivity) sensitivity.append(el("p", { className: "field-error", text: "Choose the kind of data this vendor handles." }));
    panel.append(sensitivity);

    const box = el("input", { type: "checkbox", id: "attestation", checked: state.details.attested === true });
    const attestation = el("div", { className: "attestation-block" }, [
      el("label", { className: "attestation", for: "attestation" }, [box, el("span", { text: ATTESTATION })])
    ]);
    if (showErrors && state.details.attested !== true) attestation.append(el("p", { className: "field-error", text: "Confirm the attestation to get results." }));
    box.addEventListener("change", () => {
      state.details.attested = box.checked;
      const error = attestation.querySelector(".field-error");
      if (error && box.checked) error.remove();
      changed();
    });
    panel.append(attestation);
    return panel;
  }

  function renderGuide() {
    return el("details", { className: "answer-guide" }, [
      el("summary", { text: "How to answer" }),
      el("p", { text: "Each Safeguard has four parts. Choose the option that best describes the vendor today." }),
      el("p", { text: "For Control Automated and Control Reported, read \u201cImplemented on\u2026\u201d as automated on, or reported for, those systems." }),
      el("p", { text: "If a Safeguard doesn't apply to this vendor, switch off Applies to this vendor and explain why. Choose Not Applicable inside a part only when that part can't apply." }),
      el("p", {}, [el("a", { href: source.scoringMethod.sourceUrl, target: "_blank", rel: "noopener noreferrer", text: "How CIS defines these four parts" })])
    ]);
  }

  // Moves focus to the first unfinished detail. Returns false when every detail is complete.
  function focusFirstMissing(state) {
    if (!isMissing(state)) return false;
    const panel = document.getElementById("details");
    panel.scrollIntoView({ block: "start" });
    const field = FIELDS.find((f) => !hasText(state.details[f.id]));
    const target = field
      ? document.getElementById("detail-" + field.id)
      : !state.dataSensitivity
        ? panel.querySelector('input[name="data-sensitivity"]')
        : document.getElementById("attestation");
    target.focus({ preventScroll: true });
    return true;
  }

  window.TPT.questionnaireDetails = { render, renderGuide, focusFirstMissing, isMissing };
})();
