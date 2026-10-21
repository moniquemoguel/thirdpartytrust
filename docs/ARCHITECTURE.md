# Architecture

## Overview

ThirdPartyTrust is a static web page served by GitHub Pages. There is no server, no database, no
account system, and no build step: the files in `src/` are exactly what the browser loads. Every
calculation happens in the visitor's browser, and nothing entered is transmitted anywhere.

## File structure

The page loads 30 files, in this order: the icon, five style sheets, the CIS data, the engine, and
the interface. Each file is small and has one job.

- `src/index.html` -- page shell, security policy, and load order
- `src/assets/favicon.svg` -- site icon
- `src/styles/tokens.css` -- brand colors, risk-level colors, and system font stacks
- `src/styles/app.css` -- page base and questionnaire
- `src/styles/dialogs.css` -- pop-up dialogs and the saved-on-device list
- `src/styles/report.css` -- results report on screen
- `src/styles/report-print.css` -- exported PDF
- `src/data/cis-v81-source.js` -- source details and the CIS Advanced Scoring Method
- `src/data/cis-v81-controls-*.js` (6 files) -- the 18 Controls and 153 Safeguards, verbatim
- `src/data/thirdpartytrust-methodology.js` -- the tool's own grade bands, Impact levels, and
  risk table
- `src/scripts/tpt-scoring.js` -- CIS Advanced Scoring roll-up, rounding, grade, completeness
- `src/scripts/tpt-risk.js` -- risk register, Implementation Group scores, recommended actions
- `src/scripts/tpt-assessment-file.js` -- saved assessment files: build, validate, compare
- `src/scripts/tpt-progress.js` -- progress over time, deltas, gap to target
- `src/scripts/tpt-device-store.js` -- encrypted on-device storage
- `src/scripts/tpt-dom.js` -- shared page-building helpers
- `src/scripts/tpt-questionnaire-details.js` -- assessment details, attestation, answer guide
- `src/scripts/tpt-questionnaire.js` -- the 18-Control questionnaire
- `src/scripts/tpt-dialogs.js` -- dialogs built on the browser's native dialog element
- `src/scripts/tpt-app-device.js` -- passphrase, unlock, and saved-list screens
- `src/scripts/tpt-report-core.js` and four `tpt-report-*.js` files -- the results report
- `src/scripts/tpt-app.js` -- progress bar, save, open, results, and the leave-page warning

The CIS data loads through script tags rather than being fetched over the network, which the
page's security policy blocks entirely. There is one copy of the data to keep correct.

## CIS data layer

The data files hold only content taken from CIS. The tool's own rules live separately in the
methodology file, so the CIS data contains nothing invented.

- **Scope:** all 18 Controls and 153 Safeguards of CIS Critical Security Controls v8.1 (56 in
  IG1, 74 first introduced at IG2, 23 first introduced at IG3), each with its title, description,
  Implementation Group tags, Asset Type, and Security Function.
- **Verification:** every Control and Safeguard was extracted twice from the official CIS guide,
  once from the Control chapters and once from the appendix index, and the two were compared field
  by field.
- **Discrepancies inside the CIS guide:** three fields differ between the chapters and the index.
  The Control chapters are treated as authoritative, and each index value is recorded in the source
  file: Safeguard 8.4 Asset Type (chapter: Network; index: Data), Safeguard 16.3 Security Function
  (chapter: Detect; index: Protect), and the wording of Safeguard 2.7's description.
- **Extraction fixes:** four words split across a line break in the guide were rejoined exactly as
  printed (Safeguards 9.3, 12.3, 9.7, and 13.2).
- **CIS wording kept as published:** Safeguard 4.9's title names enterprise assets while its
  description names network infrastructure, and Safeguard 17.3 reads "an documented". Both are
  reproduced exactly as CIS published them.

## Scoring (CIS Advanced Scoring Method)

- Each Safeguard is rated in four categories: Policy Defined, Control Implemented, Control
  Automated, and Control Reported. Each answer is worth 0, 25, 50, 75, or 100, or is Not
  Applicable.
- A Safeguard's score is the average of its categories; Not Applicable ratings are left out. A
  Control's score is the average of its applicable Safeguards, and the overall score is the
  average of the Controls with at least one applicable Safeguard.
- CIS's documentation is internally inconsistent in two places: one note gives Not Applicable a
  score instead of excluding it, and a worked example values "Implemented on Some Systems" at 25
  rather than 50. The tool follows CIS's scoring table in both cases.
- Control Automated and Control Reported use the answer labels from CIS's options table, which
  repeat the "Implemented on..." wording; the answer guide explains how to read them.
- All averaging uses exact fractions, with a single half-up rounding to two decimals at the end.

## The tool's own method

CIS defines no letter grade or risk-rating method. Everything in this section is the tool's own
and is labeled as such in every report.

- **Letter grade:** A 90.00 and above, B 80.00, C 70.00, D 60.00, F below 60.00, taken from the
  displayed two-decimal score. A grade is issued only when every applicable Safeguard has all four
  ratings, every not-applicable Safeguard has a full justification, and every detail, the
  data-sensitivity question, and the attestation are complete.
- **Impact,** from the kind of data the vendor handles: public information is Low, internal
  business data Moderate, customer or employee records High, and regulated data Critical.
- **Likelihood,** set for each Control from its Control Implemented answers: Critical if any IG1
  Safeguard is Not Implemented; otherwise High if any Safeguard is Not Implemented or Parts of
  Policy Implemented; otherwise Moderate if the lowest answer is Some or Most Systems; Low when
  every applicable Safeguard is Implemented on All Systems.
- **Risk level,** read from Impact and Likelihood. Each line lists the risk level for Low,
  Moderate, High, and Critical Likelihood, in that order:
  - Critical Impact: Moderate, High, Critical, Critical
  - High Impact: Low, Moderate, High, Critical
  - Moderate Impact: Low, Moderate, High, High
  - Low Impact: Low, Low, Moderate, High
- **Recommended actions:** prioritize every Not Implemented Safeguard; otherwise strengthen every
  Safeguard below Implemented on All Systems; IG1 first, then IG2, then IG3.
- **Implementation Group scores:** the CIS averaging applied to each group's applicable
  Safeguards. The groups are cumulative, so the IG3 score always equals the overall score.
- **Gap to target:** points to the next letter grade, and each Control's distance to 100.

## Saved assessments and progress over time

- A saved file holds answers only, never scores. Scores are recalculated whenever a file is
  loaded, so an edited number in a file cannot change a result.
- Every loaded file is treated as untrusted: it is size-limited (4,000,000 characters), must name
  CIS Controls v8.1 and the same CIS data version, may contain only known fields and CIS rating
  values, and is rejected if it contains a prototype-key field. The app uses a rebuilt copy, never
  the file itself.
- Each file carries an assessment ID and an assessment series ID. A reassessment keeps the series
  ID and locks the vendor name, so progress always compares the same company.
- Progress over time combines up to 8 complete assessments of one series with the exact same
  vendor name, labeled by calendar quarter. Anything excluded is listed with its reason. Deltas are
  reported since the previous and the first assessment: overall, per Control, per CIS category,
  by Implementation Group, and by risk-level count.

## Encrypted on-device storage

- Optional and off until the user sets a passphrase. Data is stored in the browser's IndexedDB on
  that device only.
- The key is derived with PBKDF2-HMAC-SHA-256 at 1,000,000 rounds with a 16-byte random salt. The
  round count is stored with the data so it can be raised later, and any stored count below
  600,000 is refused.
- Each save is encrypted with AES-GCM and a 256-bit key, using a fresh 12-byte random value. The
  stored settings and each assessment's ID are bound into the encryption, so any edit makes
  decryption fail.
- The key cannot be exported and the passphrase is never stored. Storage locks on request, after
  15 minutes of inactivity, or when the tab closes.
- Passphrases are 15 to 128 characters with no composition rules, may be pasted, and are checked
  against the vendor name, the tool's name, and single repeated characters. An optional generator
  creates a 24-character random passphrase.
- Everything is encrypted, including vendor names. A forgotten passphrase cannot be recovered.

## Interface and report

- The questionnaire is built from the CIS data, one Control at a time, and shows no scores or point
  values while answering.
- Dialogs use the browser's native dialog element, which keeps keyboard focus inside and closes on
  Escape.
- Text colors are limited to pairs measured at 4.5:1 contrast or higher, every risk level is shown
  as text as well as color, and all choices are real keyboard-usable controls.
- The report shows the seal, progress over time, Implementation Group scores and gap to target, the
  Control scorecard, the risk register, and the heat map. Detailed findings, the not-applicable
  register, and the method section are collapsed on screen. When printing starts, every section
  opens, and the executive summary appears only in the exported PDF.

## Security

- All text, including anything typed or loaded from a file, is inserted as plain text and never
  treated as code.
- A Content-Security-Policy allows only the site's own scripts, styles, and icon; blocks all
  network requests from the page; and closes plugin, base-address, and form-submission routes.
- No external scripts, fonts, or style sheets are loaded.
- The page warns before closing when there are unsaved answers.
- **Known limit:** a policy set inside the page cannot prevent other sites from embedding it in a
  frame. That protection requires a server setting, which GitHub Pages does not allow.

## Limitations

- Results are self-reported. The tool never connects to or tests a vendor's systems.
- Saved files are not tamper-proof: answers in a file can be edited, although scores are always
  recalculated from those answers.
- On-device storage is tied to one browser on one computer, and clearing browser data erases it.

## Credit and license

Safeguard titles and descriptions are from CIS Critical Security Controls(R) v8.1, Center for
Internet Security, Inc., licensed under CC BY-NC-ND 4.0
(https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode). See
https://www.cisecurity.org/controls/. That license covers the CIS content only; the code in this
repository is licensed separately under the terms in LICENSE.
