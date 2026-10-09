// Shared page-building helpers for ThirdPartyTrust. Every piece of text is set with textContent, so
// nothing a user types or loads from a file is ever treated as HTML.
(function () {
  function el(tag, props, children) {
    const node = document.createElement(tag);
    Object.entries(props || {}).forEach(([key, value]) => {
      if (key === "text") node.textContent = value;
      else if (key === "className") node.className = value;
      else if (value !== undefined && value !== null && value !== false) node.setAttribute(key, value === true ? "" : value);
    });
    (children || []).forEach((child) => child && node.append(child));
    return node;
  }

  function hasText(value) {
    return typeof value === "string" && value.trim() !== "";
  }

  // A labelled text, date, or multi-line field. Its error message clears as soon as the field has text.
  function textField(id, label, value, onInput, options) {
    const opts = options || {};
    const input = el(opts.multiline ? "textarea" : "input", {
      id,
      type: opts.multiline ? undefined : opts.type || "text",
      maxlength: opts.type === "date" ? undefined : opts.max || 200,
      value: opts.multiline ? undefined : value || ""
    });
    if (opts.multiline) input.value = value || "";
    input.addEventListener("input", () => {
      onInput(input.value);
      const error = input.parentElement.querySelector(".field-error");
      if (error && hasText(input.value)) error.remove();
    });
    const field = el("div", { className: "field" + (opts.extraClass ? " " + opts.extraClass : "") }, [
      el("label", { for: id, text: label }),
      input
    ]);
    if (opts.error) field.append(el("p", { className: "field-error", text: opts.error }));
    return field;
  }

  window.TPT = window.TPT || {};
  window.TPT.dom = { el, hasText, textField };
})();
