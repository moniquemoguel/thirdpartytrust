// "Save to this device" screens for ThirdPartyTrust: create a passphrase, unlock, and the saved list.
// Uses tpt-device-store.js for all storage and encryption. Loads after tpt-dialogs.js.
(function () {
  const { el } = window.TPT.dom;
  const dialogs = window.TPT.dialogs;
  const store = window.TPT.deviceStore;
  const risk = window.TPT.risk;
  let expectedLock = false;

  // notify receives a message when saved assessments lock on their own after inactivity.
  function init(notify) {
    store.setOnLock(() => {
      if (!expectedLock) notify("Saved assessments were locked after 15 minutes of inactivity.");
      expectedLock = false;
    });
  }

  function lockNow() {
    expectedLock = true;
    store.lock();
  }

  async function eraseAll() {
    expectedLock = true;
    await store.removeAll();
  }

  function passphraseField(id, label, autocomplete) {
    const input = el("input", { id, type: "password", autocomplete, maxlength: String(store.MAX_LENGTH * 2) });
    return { input, field: el("div", { className: "field" }, [el("label", { for: id, text: label }), input]) };
  }

  function showToggle(inputs) {
    const box = el("input", { type: "checkbox" });
    box.addEventListener("change", () => inputs.forEach((i) => { i.type = box.checked ? "text" : "password"; }));
    return el("label", { className: "applicable-switch" }, [box, el("span", { text: "Show passphrase" })]);
  }

  function createVault(vendorName) {
    return new Promise((resolve) => {
      let done = false;
      const first = passphraseField("vault-new", "Passphrase", "new-password");
      const second = passphraseField("vault-confirm", "Confirm passphrase", "new-password");
      const note = el("p", { className: "field-hint", hidden: true, text: "Copy this passphrase into your password manager before continuing." });
      const toggle = showToggle([first.input, second.input]);
      const generate = el("button", { type: "button", className: "button", text: "Generate a strong passphrase" });
      generate.addEventListener("click", () => {
        const value = store.generatePassphrase();
        first.input.value = value;
        second.input.value = value;
        first.input.type = "text";
        second.input.type = "text";
        toggle.querySelector("input").checked = true;
        note.hidden = false;
      });
      dialogs.open({
        title: "Protect your saved assessments",
        intro: "Choose a passphrase of at least 15 characters. It encrypts everything you save on this device.",
        body: [
          el("p", { className: "dialog-warning", text: "A forgotten passphrase can't be recovered. Store it in a password manager." }),
          first.field, second.field, el("div", { className: "dialog-row" }, [generate, toggle]), note
        ],
        actions: [
          { label: "Cancel" },
          {
            label: "Create and save",
            primary: true,
            onClick: async (dialog) => {
              const problems = store.checkPassphrase(first.input.value, { vendorName });
              if (first.input.value !== second.input.value) problems.push("The two passphrases don't match.");
              if (problems.length) {
                dialogs.message(dialog, problems.join(" "), true);
                return false;
              }
              try {
                await store.create(first.input.value, { vendorName });
                done = true;
              } catch (error) {
                dialogs.message(dialog, error.message, true);
                return false;
              }
              return true;
            }
          }
        ],
        onClose: () => resolve(done)
      });
    });
  }

  function unlockVault(vendorName) {
    return new Promise((resolve) => {
      let result = false;
      const entry = passphraseField("vault-unlock", "Passphrase", "current-password");
      dialogs.open({
        title: "Unlock saved assessments",
        intro: "Enter your passphrase.",
        body: [entry.field, showToggle([entry.input])],
        actions: [
          { label: "Cancel" },
          {
            label: "Forgot your passphrase?",
            onClick: async () => {
              const erase = await dialogs.confirm(
                "Forgot your passphrase?",
                "There's no way to recover it. You can delete everything saved in this browser and start again. Files you downloaded aren't affected. Delete everything?",
                "Delete everything",
                true
              );
              if (erase) {
                await eraseAll();
                result = await createVault(vendorName);
              }
            }
          },
          {
            label: "Unlock",
            primary: true,
            onClick: async (dialog) => {
              try {
                await store.unlock(entry.input.value);
                result = true;
              } catch (error) {
                dialogs.message(dialog, error.message, true);
                return false;
              }
              return true;
            }
          }
        ],
        onClose: () => resolve(result)
      });
    });
  }

  // Resolves true once saved assessments on this device are unlocked.
  async function ensureUnlocked(vendorName) {
    if (!store.isSupported()) throw new Error("This browser can't save assessments on this device. Download a file instead.");
    if (store.isUnlocked()) return true;
    return (await store.exists()) ? unlockVault(vendorName) : createVault(vendorName);
  }

  function describe(parsed) {
    const d = parsed.assessment.details;
    const status = risk.computeAssessment(parsed.assessment).complete ? "Complete" : "Draft";
    return {
      vendor: d.vendorName || "Unnamed vendor",
      line: (d.assessmentDate || "No assessment date") + " \u00b7 " + status + " \u00b7 Saved " + parsed.savedAt.slice(0, 10),
      complete: status === "Complete"
    };
  }

  // options: { multiple, completeOnly }. Resolves an array of loaded assessments, or null if cancelled.
  async function chooseSaved(options) {
    const opts = options || {};
    if (!(await ensureUnlocked(""))) return null;
    const entries = (await store.list()).filter((p) => !p.ok || !opts.completeOnly || describe(p).complete);
    return new Promise((resolve) => {
      let picked = null;
      const selected = new Set();
      const list = el("ul", { className: "saved-list" });
      const dialog = dialogs.open({
        title: "Saved on this device",
        body: [entries.length ? list : el("p", { text: "Nothing is saved on this device yet." })],
        actions: [
          { label: "Lock", onClick: lockNow },
          { label: "Cancel" },
          opts.multiple ? {
            label: "Add selected",
            primary: true,
            onClick: () => { picked = entries.filter((p) => p.ok && selected.has(p.assessmentId)); }
          } : null
        ].filter(Boolean),
        onClose: () => resolve(picked)
      });
      entries.forEach((parsed) => {
        if (!parsed.ok) {
          list.append(el("li", { className: "saved-item" }, [el("span", { className: "saved-text", text: parsed.errors[0] })]));
          return;
        }
        const info = describe(parsed);
        parsed.label = "Saved on this device: " + info.vendor + ", " + (parsed.assessment.details.assessmentDate || "no date");
        const item = el("li", { className: "saved-item" }, [
          el("span", { className: "saved-text" }, [el("strong", { text: info.vendor }), el("span", { text: info.line })])
        ]);
        if (opts.multiple) {
          const box = el("input", { type: "checkbox", "aria-label": "Select " + info.vendor + " " + info.line });
          box.addEventListener("change", () => (box.checked ? selected.add(parsed.assessmentId) : selected.delete(parsed.assessmentId)));
          item.prepend(box);
        } else {
          const openButton = el("button", { type: "button", className: "button", text: "Open" });
          openButton.addEventListener("click", () => {
            picked = [parsed];
            dialogs.close(dialog);
          });
          item.append(openButton);
        }
        const remove = el("button", { type: "button", className: "button button-danger", text: "Delete" });
        remove.addEventListener("click", async () => {
          if (await dialogs.confirm("Delete saved assessment", "Delete this saved assessment? This can't be undone.", "Delete", true)) {
            await store.remove(parsed.assessmentId);
            item.remove();
          }
        });
        item.append(remove);
        list.append(item);
      });
    });
  }

  async function saveText(fileText, vendorName) {
    if (!(await ensureUnlocked(vendorName))) return false;
    await store.save(fileText);
    return true;
  }

  window.TPT.deviceUi = { init, ensureUnlocked, chooseSaved, saveText };
})();
