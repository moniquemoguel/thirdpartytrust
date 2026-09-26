# Architecture

## Overview

ThirdPartyTrust is a static, client-side web page. There is no server, no database, and no build step -- the files in src/ are exactly what GitHub Pages serves, unmodified. Every calculation happens in the visitor's browser; nothing entered into the form is transmitted anywhere.

## File structure

- src/index.html -- Page structure: questionnaire, results panel, export button
- src/styles/tokens.css -- Brand colors and type, as CSS custom properties
- src/styles/layout.css -- Page layout and component styling
- src/styles/print.css -- Print-only rules for the exported task sheet
- src/scripts/governance-matrix.json -- CIS-mapped scoring weights (source of truth)
- src/scripts/scoring-engine.js -- Pure scoring logic, no DOM access
- src/scripts/ui.js -- Wires the form to the engine, updates the page

## Compliance framework

Scoring is built on CIS Critical Security Controls v8.1.2, Implementation Group 1 (IG1) -- CIS's own designation for organizations with limited IT and security resources, which matches this tool's target market directly. Coverage spans all 35 verified IG1 safeguards across 9 controls, organized into 6 plain-English families so the assessment reads clearly to a non-technical user:

- **Data Protection & Privacy** -- CIS Control 3 (5 safeguards)
- **Access & Identity Management** -- CIS Controls 5 & 6 (9 safeguards)
- **Vulnerability & Threat Management** -- CIS Controls 7 & 10 (6 safeguards)
- **Network & System Hygiene** -- CIS Controls 1 & 11 (5 safeguards)
- **Vendor & Service Provider Oversight** -- CIS Control 15 (1 safeguard)
- **Security Awareness & Incident Response** -- CIS Controls 14 & 17 (9 safeguards)

Each family is worth an equal ~16.67 of the 100-point total, regardless of how many safeguards it contains. This was a deliberate choice: weighting by safeguard count would have made Vendor & Service Provider Oversight worth only ~3 points despite being the tool's core purpose, since Control 15 has only one safeguard at the IG1 level -- every other Control 15 safeguard (contracts, classification, monitoring) sits at IG2/IG3, beyond basic cyber hygiene. Equal family weighting keeps vendor oversight meaningful in the final grade.

This structure replaced an earlier 3-control version.

## How an assessment is scored

Each safeguard is answered on a three-tier scale (Fully implemented / Partially implemented / Not implemented), consistent with standard maturity-based self-assessment practice. `scoring-engine.js` embeds a copy of the governance matrix as a JavaScript object, rather than fetching the JSON file at runtime -- static sites opened directly from disk can fail to load local JSON via `fetch()`, so embedding the matrix keeps scoring reliable regardless of how the page is served. `governance-matrix.json` remains the canonical, human-readable source for what those weights are and why.

`computeAssessment()` sums each family's earned points against its maximum, returning both the overall score/grade and a full breakdown: every safeguard's title, tier, points earned, and CIS citation.

## What's shown where

The results seal (on screen) shows only the letter grade, vendor name and numeric score. The full family-by-family, safeguard-by-safeguard breakdown is reserved for the exported task sheet: `layout.css` hides `.result-breakdown` by default, and `print.css` reveals it specifically inside the `@media print` block, so the same data exists in both places but is presented at the right level of detail for each context.

## Export mechanism

The "Export task sheet" button calls the browser's native `window.print()` -- no PDF library is used. `print.css` hides the questionnaire and footer, reformats the results panel into a single-page-style certificate layout, and forces color printing on, since browsers strip background colors from printed pages by default. The export button itself is hidden from the printed output via a `!important` rule, since it's shown in the live page via an inline style set by JavaScript, which would otherwise override a normal stylesheet rule.

## Security notes

- Vendor names and other user input are inserted into the page using `textContent`, never `innerHTML`, closing off the one realistic XSS vector in a form-driven page.
- No external scripts, fonts, or stylesheets are loaded from any third party. Type is set using system font stacks already present on the visitor's device.
- No `localStorage`, `sessionStorage`, or cookies are used anywhere. Closing the tab clears everything; nothing persists unless the visitor exports it themselves.

## What this tool is not

ThirdPartyTrust is a self-assessment questionnaire, not an automated scanner. It never visits, fetches, or independently verifies the vendor's actual website or security posture -- the grade only reflects what the person filling out the form reports to be true. This is a deliberate scope boundary, not a limitation to work around.
