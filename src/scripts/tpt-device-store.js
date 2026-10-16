// Optional, encrypted "Save to this device" for ThirdPartyTrust. Assessments are stored in this browser's
// IndexedDB only after the user sets a passphrase; nothing is ever sent anywhere. Key: PBKDF2-HMAC-SHA-256
// (count stored with the data so it can be raised later). Data: AES-GCM, 256-bit key, a fresh 12-byte IV for
// every write, and the stored header bound in as associated data so any edit makes decryption fail.
// Passphrases are 15 to 128 characters with no composition rules. Stored files are re-validated on load.
(function () {
  const DB_NAME = "thirdpartytrust";
  const STORE = "vault";
  const FORMAT = "thirdpartytrust-vault";
  const FORMAT_VERSION = 1;
  const ITERATIONS = 1000000;
  const MIN_ITERATIONS = 600000;
  const SALT_BYTES = 16;
  const IV_BYTES = 12;
  const MIN_LENGTH = 15;
  const MAX_LENGTH = 128;
  const AUTO_LOCK_MS = 15 * 60 * 1000;
  const GENERATED_LENGTH = 24;
  const GENERATOR_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const CHECK_TEXT = "thirdpartytrust-vault-check";
  const ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

  const files = window.TPT.assessmentFile;
  const subtle = window.crypto && window.crypto.subtle;
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let key = null;
  let meta = null;
  let lockTimer = null;
  let onLock = () => {};

  function isSupported() {
    return Boolean(subtle && window.indexedDB);
  }

  function toBase64(bytes) {
    let text = "";
    bytes.forEach((b) => {
      text += String.fromCharCode(b);
    });
    return btoa(text);
  }

  function openDb() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: "id" });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error("This browser blocked on-device storage."));
    });
  }

  async function run(mode, action) {
    const db = await openDb();
    try {
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const request = action(tx.objectStore(STORE));
        let result;
        if (request) request.onsuccess = () => {
          result = request.result;
        };
        tx.oncomplete = () => resolve(result);
        tx.onerror = () => reject(new Error("On-device storage could not be read or written."));
        tx.onabort = () => reject(new Error("On-device storage could not be read or written."));
      });
    } finally {
      db.close();
    }
  }

  // Associated data: the stored header plus the record's own ID, so headers and records can't be swapped.
  function associatedData(header, id) {
    return encoder.encode([FORMAT, header.formatVersion, header.iterations, toBase64(header.salt), id].join("|"));
  }

  async function deriveKey(passphrase, header) {
    const material = await subtle.importKey("raw", encoder.encode(passphrase.normalize("NFC")), "PBKDF2", false, ["deriveKey"]);
    return subtle.deriveKey(
      { name: "PBKDF2", hash: "SHA-256", salt: header.salt, iterations: header.iterations },
      material,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async function encrypt(withKey, header, id, text) {
    const iv = window.crypto.getRandomValues(new Uint8Array(IV_BYTES));
    const data = await subtle.encrypt({ name: "AES-GCM", iv, additionalData: associatedData(header, id) }, withKey, encoder.encode(text));
    return { id, iv, data: new Uint8Array(data) };
  }

  async function decrypt(withKey, header, record) {
    const plain = await subtle.decrypt({ name: "AES-GCM", iv: record.iv, additionalData: associatedData(header, record.id) }, withKey, record.data);
    return decoder.decode(plain);
  }

  function validHeader(record) {
    return Boolean(record) && record.format === FORMAT && record.formatVersion === FORMAT_VERSION &&
      Number.isInteger(record.iterations) && record.iterations >= MIN_ITERATIONS &&
      record.salt instanceof Uint8Array && record.salt.length === SALT_BYTES;
  }

  function scheduleLock() {
    clearTimeout(lockTimer);
    lockTimer = setTimeout(lock, AUTO_LOCK_MS);
  }

  function lock() {
    clearTimeout(lockTimer);
    key = null;
    meta = null;
    onLock();
  }

  function requireUnlocked() {
    if (!key) throw new Error("Unlock your saved assessments first.");
    scheduleLock();
  }

  // Returns a list of problems; an empty list means the passphrase is acceptable.
  function checkPassphrase(passphrase, context) {
    const problems = [];
    const text = typeof passphrase === "string" ? passphrase.normalize("NFC") : "";
    const length = Array.from(text).length;
    if (length < MIN_LENGTH) problems.push("Use at least " + MIN_LENGTH + " characters.");
    if (length > MAX_LENGTH) problems.push("Use no more than " + MAX_LENGTH + " characters.");
    const plain = text.trim().toLowerCase();
    const vendor = ((context && context.vendorName) || "").trim().toLowerCase();
    if (plain && /^(.)\1*$/u.test(plain)) problems.push("Don't use a single repeated character.");
    if (plain === "thirdpartytrust" || (vendor && plain === vendor)) problems.push("Don't use the vendor's name or the name of this tool.");
    return problems;
  }

  function generatePassphrase() {
    const limit = 256 - (256 % GENERATOR_ALPHABET.length);
    let out = "";
    while (out.length < GENERATED_LENGTH) {
      const bytes = window.crypto.getRandomValues(new Uint8Array(GENERATED_LENGTH * 2));
      for (const b of bytes) {
        if (b < limit && out.length < GENERATED_LENGTH) out += GENERATOR_ALPHABET[b % GENERATOR_ALPHABET.length];
      }
    }
    return out;
  }

  async function exists() {
    return Boolean(await run("readonly", (s) => s.get("meta")));
  }

  async function create(passphrase, context) {
    const problems = checkPassphrase(passphrase, context);
    if (problems.length) throw new Error(problems.join(" "));
    if (await exists()) throw new Error("Saved assessments already exist on this device. Unlock them, or delete them first.");
    const header = { id: "meta", format: FORMAT, formatVersion: FORMAT_VERSION, iterations: ITERATIONS, salt: window.crypto.getRandomValues(new Uint8Array(SALT_BYTES)) };
    const newKey = await deriveKey(passphrase, header);
    const check = await encrypt(newKey, header, "check", CHECK_TEXT);
    await run("readwrite", (s) => {
      s.put(header);
      s.put(check);
    });
    key = newKey;
    meta = header;
    scheduleLock();
  }

  async function unlock(passphrase) {
    const header = await run("readonly", (s) => s.get("meta"));
    if (!validHeader(header)) throw new Error("No usable saved assessments were found on this device.");
    const check = await run("readonly", (s) => s.get("check"));
    const candidate = await deriveKey(typeof passphrase === "string" ? passphrase : "", header);
    try {
      if (!check || (await decrypt(candidate, header, check)) !== CHECK_TEXT) throw new Error("mismatch");
    } catch (error) {
      throw new Error("That passphrase doesn't unlock the saved assessments.");
    }
    key = candidate;
    meta = header;
    scheduleLock();
  }

  // fileText comes from tpt-assessment-file.js buildFile; re-saving the same assessment replaces it.
  async function save(fileText) {
    requireUnlocked();
    const parsed = files.parseFile(fileText);
    if (!parsed.ok) throw new Error("This assessment could not be saved: " + parsed.errors[0]);
    const record = await encrypt(key, meta, parsed.assessmentId, fileText);
    await run("readwrite", (s) => {
      s.put(record);
    });
    return parsed.assessmentId;
  }

  async function readRecord(record) {
    let text;
    try {
      text = await decrypt(key, meta, record);
    } catch (error) {
      return { ok: false, errors: ["A saved assessment on this device was altered and can't be opened."] };
    }
    const parsed = files.parseFile(text);
    if (parsed.ok && parsed.assessmentId !== record.id) return { ok: false, errors: ["A saved assessment on this device doesn't match its label."] };
    return parsed;
  }

  async function list() {
    requireUnlocked();
    const records = await run("readonly", (s) => s.getAll());
    const results = [];
    for (const record of records) {
      if (!ID_PATTERN.test(record.id)) continue;
      results.push(await readRecord(record));
    }
    return results;
  }

  async function load(assessmentId) {
    requireUnlocked();
    if (!ID_PATTERN.test(assessmentId)) throw new Error("That saved assessment was not found.");
    const record = await run("readonly", (s) => s.get(assessmentId));
    if (!record) throw new Error("That saved assessment was not found.");
    return readRecord(record);
  }

  async function remove(assessmentId) {
    requireUnlocked();
    if (!ID_PATTERN.test(assessmentId)) return;
    await run("readwrite", (s) => s.delete(assessmentId));
  }

  // Deletes every saved assessment and the passphrase settings from this browser.
  async function removeAll() {
    lock();
    await new Promise((resolve, reject) => {
      const request = window.indexedDB.deleteDatabase(DB_NAME);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error("Saved assessments could not be deleted."));
      request.onblocked = () => reject(new Error("Close other ThirdPartyTrust tabs, then try again."));
    });
  }

  window.TPT.deviceStore = {
    isSupported,
    exists,
    create,
    unlock,
    lock,
    isUnlocked: () => key !== null,
    touch: () => key && scheduleLock(),
    setOnLock: (handler) => {
      onLock = handler || (() => {});
    },
    save,
    list,
    load,
    remove,
    removeAll,
    checkPassphrase,
    generatePassphrase,
    MIN_LENGTH,
    MAX_LENGTH
  };
})();
