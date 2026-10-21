# ThirdPartyTrust

A browser-only vendor security assessment for small businesses, built on the CIS Critical Security
Controls v8.1.

**Live tool:** https://moniquemoguel.github.io/thirdpartytrust/src/index.html

## What it does

Small businesses adopt new software constantly, usually without a practical way to judge how each
vendor protects their data. ThirdPartyTrust rates a vendor against all 153 CIS Safeguards and
produces a score, a letter grade, a risk rating for each CIS Control, and an exportable report. It
runs entirely in the browser; nothing entered is sent to a server.

## How it works

1. **Details:** enter the vendor, the service provided, the respondent and reviewer, and the kind
   of data the vendor handles.
2. **Answer:** rate each Safeguard in the four CIS categories, or mark it as not applying and
   explain why. No scores are shown while answering.
3. **Results:** get the overall score and grade, Implementation Group scores, a Control
   scorecard, a risk register, and an Impact and Likelihood heat map.
4. **Report and save:** export the report as a PDF and save the assessment to continue later or to
   compare progress next time.

## Framework

- **Scope:** all 18 CIS Controls and all 153 Safeguards in CIS Controls v8.1 (56 in Implementation
  Group 1, 74 added at IG2, 23 added at IG3). Control and Safeguard titles and descriptions are
  reproduced verbatim, with each Safeguard's Asset Type and Security Function.
- **Scoring:** the CIS Advanced Scoring Method. Each Safeguard is rated in four categories (Policy
  Defined, Control Implemented, Control Automated, Control Reported) using CIS's own answer
  options, averaged by Safeguard, then by Control, then overall. Not Applicable ratings are left
  out of the calculation.
- **Verified:** the Control and Safeguard data was extracted from the official CIS guide twice,
  from the Control chapters and from the appendix index, and compared field by field.

## The tool's own method

CIS does not define a letter grade or a risk-rating method. These are the tool's own and are
labeled as such in every report:

- **Letter grade:** A 90 and above, B 80, C 70, D 60, F below 60, from the overall score, issued
  only when the assessment is complete.
- **Impact:** set by the kind of data the vendor handles (Low, Moderate, High, Critical).
- **Likelihood:** set for each Control by how widely its Safeguards are implemented; any IG1
  Safeguard not implemented makes it Critical.
- **Risk level:** Impact combined with Likelihood on four levels: Low, Moderate, High, Critical.
- **Recommended actions, Implementation Group scores, and gap to target** (points to the next
  grade and each Control's distance to full implementation).

## Progress over time

A vendor can be reassessed, for example each quarter. Loading up to 8 earlier assessments of the
same vendor adds a Progress over time section with a trend chart and the change since the previous
and the first assessment: overall, per Control, per CIS category, by Implementation Group, and by
risk level. Assessments are compared only when they share the same assessment series, the exact
vendor name, and the same CIS data version.

## Saving and privacy

- **Download file (recommended):** the assessment is saved as a file on the user's own computer.
  Scores are always recalculated from the answers when a file is loaded, and every loaded file is
  checked before use.
- **Save to this device (optional):** an encrypted copy is kept in the browser, protected by a
  passphrase of 15 to 128 characters. Encryption uses AES-GCM with a 256-bit key derived through
  1,000,000 rounds of PBKDF2. Saved assessments lock after 15 minutes of inactivity, and a
  forgotten passphrase cannot be recovered.
- **No server, no accounts, no tracking.** A Content-Security-Policy allows only the site's own
  files to run and blocks the page from sending data anywhere.

## What this tool is, and isn't

ThirdPartyTrust is a self-assessment, not a scanner. It never connects to or tests the vendor's
systems, and every result reflects what the respondent reports to be true.

## Project structure

- `src/index.html` -- the page
- `src/data/` -- CIS Controls v8.1 data and the tool's own methodology
- `src/scripts/` -- scoring and risk engine, saved assessments, progress, encrypted storage,
  questionnaire, report, and app wiring
- `src/styles/` -- brand tokens and page, dialog, report, and print styles
- `docs/ARCHITECTURE.md` -- technical detail

Plain JavaScript and CSS on GitHub Pages, with no build step and no external scripts, fonts, or
network calls.

## Credit and license

Safeguard titles and descriptions are from CIS Critical Security Controls(R) v8.1, Center for
Internet Security, Inc., licensed under CC BY-NC-ND 4.0. See
[cisecurity.org/controls](https://www.cisecurity.org/controls/) and the
[license terms](https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode). That license covers
the CIS content only; the code in this repository is licensed separately under the terms in
LICENSE.
