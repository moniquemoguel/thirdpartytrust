# ThirdPartyTrust

A browser-only vendor risk scoring tool for small businesses.

**Live demo:** https://moniquemoguel.github.io/thirdpartytrust/src/index.html

## What it does

Small businesses adopt new software constantly, usually without any way to judge what
that vendor does with their data. ThirdPartyTrust turns a short questionnaire into an
instant letter grade, a plain-English breakdown of the score, and an exportable
compliance task sheet — all of it running in the browser, with nothing sent to a server.

## Build Progress

- [x] Project scaffold and documentation structure
- [x] Brand and UI system
- [x] Interface assembly
- [ ] Scoring engine (in transition -- expanding to full CIS v8.1.2 IG1 coverage)
- [ ] Governance matrix (in transition -- expanding from 3 controls to 9 controls, 35 safeguards)
- [x] Export and reporting
- [x] Documentation and polish
- [ ] Testing evidence

## Stack

Vanilla JavaScript, CSS custom properties, hosted on GitHub Pages.

## Compliance framework

Being expanded to cite CIS Critical Security Controls v8.1.2, Implementation Group 1 --
35 safeguards across 9 Controls, organized into 6 plain-English families. Previous
version covered 3 controls; this expansion follows direct instructor feedback that a
narrower set was not realistically useful to an organization.

## Documentation

See docs/ARCHITECTURE.md for a full technical breakdown of how scoring, governance
mapping, and export work.
