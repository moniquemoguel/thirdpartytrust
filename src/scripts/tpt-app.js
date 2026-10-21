// ThirdPartyTrust app: the progress bar, Save, Open, reassessment, progress comparison, Get results, and the
// leave-page warning. Results are drawn by the tpt-report-*.js files. Nothing is sent anywhere. Loads last.
(function () {
  const TPT = window.TPT;
  const { el } = TPT.dom;
  const files = TPT.assessmentFile;

  const state = { assessmentId: files.newId(), seriesId: files.newId(), dirty: false, priors: [], showingResults: false };
  let ui;

  function say(text) {
    ui.message.textContent = text;
  }

  function counts() {
    return TPT.risk.computeAssessment(TPT.questionnaire.getAssessment());
  }

  function updateProgress() {
    const results = counts();
    if (!results.available) return;
    const c = results.counts;
    ui.label.textContent = "";
    ui.label.append(el("strong", { text: c.ratingsAnswered + " of " + c.ratingsRequired }), document.createTextNode(" ratings answered"));
    ui.progress.max = c.ratingsRequired || 1;
    ui.progress.value = c.ratingsAnswered;
  }

  function onAnswerChange() {
    state.dirty = true;
    updateProgress();
    TPT.deviceStore.touch();
    if (state.showingResults) {
      state.showingResults = false;
      TPT.report.clear(ui.results);
      say("Your answers changed. Select Get results again to update the report.");
    }
  }

  function startNew() {
    state.assessmentId = files.newId();
    state.seriesId = files.newId();
    state.priors = [];
    state.dirty = false;
    state.showingResults = false;
    TPT.questionnaire.reset();
    TPT.report.clear(ui.results);
    updateProgress();
  }

  function currentFile() {
    return files.buildFile(TPT.questionnaire.getAssessment(), { assessmentId: state.assessmentId, seriesId: state.seriesId });
  }

  function download(built) {
    const url = URL.createObjectURL(new Blob([built.text], { type: "application/json" }));
    const link = el("a", { href: url, download: built.fileName });
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function save() {
    const choice = await TPT.dialogs.choose("Save this assessment", [
      { id: "file", label: "Download file (recommended)", text: "Saves a file to your computer. Keep it to continue later or to compare progress next time. The file stays with you; nothing is sent anywhere." },
      { id: "device", label: "Save to this device", text: "Keeps an encrypted copy in this browser, protected by a passphrase. It works only on this computer and this browser, and clearing your browser data erases it." }
    ]);
    if (!choice) return;
    const built = currentFile();
    try {
      if (choice === "file") {
        download(built);
        say("Saved as " + built.fileName + ". Keep this file to continue later. It stays on your device.");
      } else {
        if (!(await TPT.deviceUi.saveText(built.text, built.record.assessment.details.vendorName))) return;
        say("Saved on this device, encrypted with your passphrase.");
      }
      state.dirty = false;
    } catch (error) {
      say(error.message);
    }
  }

  function readFiles(multiple) {
    return new Promise((resolve) => {
      const input = el("input", { type: "file", accept: ".json,application/json", hidden: true, multiple });
      input.addEventListener("change", async () => {
        const picked = [];
        for (const file of Array.from(input.files)) {
          if (file.size > files.MAX_FILE_CHARACTERS) {
            picked.push({ ok: false, label: file.name, errors: ["The file is too large to be a ThirdPartyTrust assessment."] });
            continue;
          }
          const parsed = files.parseFile(await file.text());
          parsed.label = file.name;
          picked.push(parsed);
        }
        input.remove();
        resolve(picked);
      });
      input.addEventListener("cancel", () => {
        input.remove();
        resolve(null);
      });
      document.body.append(input);
      input.click();
    });
  }

  async function pickSource(multiple, completeOnly) {
    const deviceReady = TPT.deviceStore.isSupported() && (await TPT.deviceStore.exists());
    const source = deviceReady
      ? await TPT.dialogs.choose("Where is it saved?", [
          { id: "file", label: "A downloaded file", text: multiple ? "Choose one or more files from your computer." : "Choose a file from your computer." },
          { id: "device", label: "This device", text: "Unlock the assessments saved in this browser." }
        ])
      : "file";
    if (!source) return null;
    return source === "file" ? readFiles(multiple) : TPT.deviceUi.chooseSaved({ multiple, completeOnly });
  }

  function firstValid(picked) {
    if (!picked || !picked.length) return null;
    const bad = picked.find((p) => !p.ok);
    if (bad) {
      say("This file couldn't be loaded: " + bad.errors[0]);
      return null;
    }
    return picked[0];
  }

  async function confirmLeaveUnsaved() {
    return !state.dirty || TPT.dialogs.confirm("Unsaved answers", "You have unsaved answers. Leave without saving?", "Leave without saving", true);
  }

  async function continueAssessment() {
    if (!(await confirmLeaveUnsaved())) return;
    const record = firstValid(await pickSource(false, false));
    if (!record) return;
    Object.assign(state, { assessmentId: record.assessmentId, seriesId: record.seriesId, priors: [], dirty: false });
    TPT.questionnaire.load(record.assessment, {});
    TPT.report.clear(ui.results);
    updateProgress();
    say("Loaded the assessment saved on " + record.savedAt.slice(0, 10) + "." + (record.methodologyChanged ? " This file was saved under an earlier version of the scoring rules. Results use the current rules." : ""));
  }

  async function startReassessment() {
    if (!(await confirmLeaveUnsaved())) return;
    const record = firstValid(await pickSource(false, true));
    if (!record) return;
    if (!TPT.risk.computeAssessment(record.assessment).complete) {
      say("A reassessment starts from a complete assessment. This one is still a draft.");
      return;
    }
    const answers = JSON.parse(JSON.stringify(record.assessment));
    answers.details.assessmentDate = "";
    answers.details.attested = false;
    Object.assign(state, { assessmentId: files.newId(), seriesId: record.seriesId, priors: [record], dirty: false });
    TPT.questionnaire.load(answers, { vendorLocked: true });
    TPT.report.clear(ui.results);
    updateProgress();
    say("Review each answer and confirm the attestation again for this assessment.");
  }

  async function compareProgress() {
    const picked = await pickSource(true, true);
    if (!picked || !picked.length) return;
    const notes = [];
    picked.forEach((p) => {
      if (!p.ok) notes.push("Not included: " + p.label + ", " + p.errors[0]);
      else if (!state.priors.some((q) => q.assessmentId === p.assessmentId)) state.priors.push(p);
    });
    say("Added " + picked.filter((p) => p.ok).length + " earlier assessment(s). They'll be compared when you select Get results." + (notes.length ? " " + notes.join(" ") : ""));
  }

  async function openMenu() {
    const choice = await TPT.dialogs.choose("Open an assessment", [
      { id: "continue", label: "Continue an assessment", text: "Pick up a draft or review a completed assessment." },
      { id: "reassess", label: "Start a reassessment", text: "Begin a new assessment of the same vendor, starting from a previous one's answers, so progress can be compared." },
      { id: "compare", label: "Compare progress", text: "Add up to 8 earlier complete assessments of this vendor to see the change over time." },
      { id: "new", label: "Start a new vendor", text: "Clear the form and begin a new vendor." }
    ]);
    if (choice === "continue") await continueAssessment();
    if (choice === "reassess") await startReassessment();
    if (choice === "compare") await compareProgress();
    if (choice === "new" && (await confirmLeaveUnsaved())) {
      startNew();
      say("Started a new vendor.");
    }
  }

  function progressSummary(trend) {
    const notes = trend.excluded.map((x) => "Not included: " + x.label + ", " + x.reason);
    if (!trend.ok) return [trend.reason].concat(notes).join(" ");
    const first = trend.points[0].quarter.label;
    const last = trend.points[trend.points.length - 1].quarter.label;
    return ["Included: " + trend.points.length + " assessments (" + first + " to " + last + ")."].concat(notes).join(" ");
  }

  function getResults() {
    const assessment = TPT.questionnaire.getAssessment();
    const results = TPT.risk.computeAssessment(assessment);
    if (!results.complete) {
      const m = results.missing;
      const details = m.details.length + (m.dataSensitivity ? 1 : 0) + m.justifications;
      TPT.questionnaire.showErrors();
      say(m.ratings + " ratings and " + details + " details still need answers. Use Next unanswered to find them.");
      return;
    }
    const current = { assessmentId: state.assessmentId, seriesId: state.seriesId, savedAt: new Date().toISOString(), assessment, label: "This assessment" };
    const trend = state.priors.length ? TPT.progress.buildTrend(state.priors.concat([current]), current) : null;
    TPT.report.render(ui.results, { assessment, results, trend, gaps: TPT.progress.gaps(results), assessmentId: state.assessmentId, onSave: save });
    state.showingResults = true;
    say(trend ? progressSummary(trend) : "Results are ready below. Save this assessment to compare your progress next time.");
    ui.results.scrollIntoView({ block: "start" });
  }

  function buildBar() {
    const label = el("p", { className: "progress-label" });
    const progress = el("progress", { max: "612", value: "0", "aria-label": "Ratings answered" });
    const message = el("p", { className: "file-message", role: "status", "aria-live": "polite" });
    const button = (text, onClick, primary) => {
      const b = el("button", { type: "button", className: "button" + (primary ? " button-primary" : ""), text });
      b.addEventListener("click", onClick);
      return b;
    };
    const bar = el("div", { className: "progress-bar" }, [
      el("div", { className: "progress-inner" }, [
        el("div", { className: "progress-status" }, [label, progress]),
        el("div", { className: "progress-actions" }, [
          button("Next unanswered", () => {
            if (!TPT.questionnaire.goToNextUnanswered()) say("Every question is answered. Select Get results.");
          }),
          button("Save", save),
          button("Open", openMenu),
          button("Get results", getResults, true)
        ]),
        message
      ])
    ]);
    document.body.append(bar);
    return { label, progress, message };
  }

  function init() {
    const root = document.getElementById("questionnaire");
    const results = document.getElementById("results");
    ui = buildBar();
    ui.results = results;
    if (!TPT.risk.computeAssessment({}).available || !TPT.report) {
      say("The assessment couldn't load. Reload the page. If this keeps happening, a file is missing from the site.");
      return;
    }
    TPT.questionnaire.init(root, onAnswerChange);
    TPT.deviceUi.init(say);
    updateProgress();
    window.addEventListener("beforeunload", (event) => {
      if (!state.dirty) return;
      event.preventDefault();
      event.returnValue = "";
    });
  }

  init();
})();
