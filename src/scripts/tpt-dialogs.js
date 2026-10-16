// Dialogs for ThirdPartyTrust, built on the browser's native <dialog> element, which keeps keyboard focus
// inside the dialog and closes on Escape. All text is set with textContent. Loads after tpt-dom.js.
(function () {
  const { el } = window.TPT.dom;
  let count = 0;

  // options: { title, intro, body: [nodes], actions: [{ label, primary, danger, onClick }], onClose }
  // An action's onClick may return false to keep the dialog open.
  function open(options) {
    count += 1;
    const titleId = "dialog-title-" + count;
    const dialog = el("dialog", { className: "tpt-dialog", "aria-labelledby": titleId });
    const actions = el("div", { className: "dialog-actions" });
    (options.actions || []).forEach((action) => {
      const button = el("button", {
        type: "button",
        className: "button" + (action.primary ? " button-primary" : "") + (action.danger ? " button-danger" : ""),
        text: action.label
      });
      button.addEventListener("click", async () => {
        const keepOpen = action.onClick ? (await action.onClick(dialog)) === false : false;
        if (!keepOpen) close(dialog);
      });
      actions.append(button);
    });
    [el("h2", { id: titleId, text: options.title }), options.intro ? el("p", { className: "dialog-intro", text: options.intro }) : null]
      .concat(options.body || [], [actions])
      .forEach((node) => node && dialog.append(node));
    dialog.addEventListener("close", () => {
      dialog.remove();
      if (options.onClose) options.onClose();
    });
    document.body.append(dialog);
    dialog.showModal();
    return dialog;
  }

  function close(dialog) {
    if (dialog.open) dialog.close();
  }

  function message(dialog, text, isError) {
    let note = dialog.querySelector(".dialog-message");
    if (!note) {
      note = el("p", { className: "dialog-message", role: "alert" });
      dialog.querySelector(".dialog-actions").before(note);
    }
    note.classList.toggle("is-error", Boolean(isError));
    note.textContent = text;
  }

  // Resolves true when the user confirms, false when they cancel or press Escape.
  function confirm(title, text, confirmLabel, danger) {
    return new Promise((resolve) => {
      let answer = false;
      open({
        title,
        intro: text,
        actions: [
          { label: "Cancel" },
          { label: confirmLabel, primary: !danger, danger, onClick: () => { answer = true; } }
        ],
        onClose: () => resolve(answer)
      });
    });
  }

  // A choice dialog: each option is a full-width button with a short description.
  function choose(title, choices) {
    return new Promise((resolve) => {
      let picked = null;
      const list = el("div", { className: "dialog-choices" });
      const dialog = open({ title, body: [list], actions: [{ label: "Cancel" }], onClose: () => resolve(picked) });
      choices.forEach((choice) => {
        if (choice.hidden) return;
        const button = el("button", { type: "button", className: "dialog-choice" }, [
          el("span", { className: "dialog-choice-label", text: choice.label }),
          el("span", { className: "dialog-choice-text", text: choice.text })
        ]);
        button.addEventListener("click", () => {
          picked = choice.id;
          close(dialog);
        });
        list.append(button);
      });
    });
  }

  window.TPT.dialogs = { open, close, message, confirm, choose };
})();
