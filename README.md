# ThirdPartyTrust

A browser-only vendor risk scoring tool for small businesses.

**Live demo:** https://moniquemoguel.github.io/thirdpartytrust/src/index.html

## What it does

Small businesses adopt new software constantly, usually without any way to judge what
that vendor does with their data. ThirdPartyTrust turns a short questionnaire into an
instant letter grade, a plain-English breakdown of the score, and an exportable
compliance task sheet — all of it running in the browser, with nothing sent to a server.

## A note for anyone testing this right now

This tool was recently expanded from 3 CIS controls to full coverage of CIS Critical
Security Controls v8.1.2, Implementation Group 1 -- 35 safeguards across 9 controls,
organized into 6 plain-English families. All 35 questions must be answered to
produce a grade; if any are left blank, the results panel will show "INCOMPLETE"
rather than a grade -- this is expected behavior, not an error.

## Build Progress

- [x] Project scaffold and documentation structure
- [x] Brand and UI system
- [x] Interface assembly
- [x] Scoring engine
- [x] Governance matrix (CIS Controls v8.1.2, Implementation Group 1 -- 35 safeguards, 9 controls, 6 families)
- [x] Export and reporting
- [x] Documentation and polish
- [ ] Testing evidence (full validation of the expanded 35-question model in progress)

## Stack

Vanilla JavaScript, CSS custom properties, hosted on GitHub Pages.

## Compliance framework

Scoring logic is mapped to CIS Critical Security Controls v8.1.2, Implementation
Group 1 -- CIS's own designation for organizations with limited IT and security
resources. Coverage spans 35 safeguards across 9 controls (1, 3, 5, 6, 7, 10, 11,
14, 15, 17), organized into 6 plain-English families for readability. Expanded from
an earlier 3-control version following direct instructor feedback that narrower
coverage was not realistically useful to an organization.

## Documentation

See docs/ARCHITECTURE.md for a full technical breakdown of how scoring, governance
mapping, and export work.
