// CIS Critical Security Controls v8.1: source details and the CIS Advanced Scoring Method.
// Safeguard data loads from the cis-v81-controls-*.js files that follow this one.
window.CIS_V81_SOURCE = {
  "version": "3.0.0",
  "framework": "CIS Critical Security Controls v8.1",
  "source": {
    "document": "CIS Critical Security Controls Version 8.1",
    "revision": "v8.1.2",
    "publisher": "Center for Internet Security, Inc.",
    "url": "https://www.cisecurity.org/controls/",
    "license": "CC BY-NC-ND 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode",
    "authoritativeSection": "Control chapters",
    "indexDiscrepancies": [
      {
        "safeguard": "2.7",
        "field": "description",
        "indexValue": "Use technical controls, such as digital signatures and version control, to ensure that only authorized scripts, such as specific .ps1 and .py files, are allowed to execute. Block unauthorized scripts from executing. Reassess bi-annually, or more frequently."
      },
      {
        "safeguard": "8.4",
        "field": "assetType",
        "indexValue": "Data"
      },
      {
        "safeguard": "16.3",
        "field": "securityFunction",
        "indexValue": "Protect"
      }
    ]
  },
  "scoringMethod": {
    "name": "CIS Advanced Scoring Method",
    "source": "CIS SecureSuite Platform Guide, Controls, Advanced Scoring Method",
    "sourceUrl": "https://cisecurity-securesuite-documentation.readthedocs-hosted.com/en/latest/Controls/",
    "categories": [
      {
        "id": "policy",
        "name": "Policy Defined",
        "options": [
          { "label": "No Policy", "value": 0 },
          { "label": "Informal Policy", "value": 25 },
          { "label": "Partial Written Policy", "value": 50 },
          { "label": "Written Policy", "value": 75 },
          { "label": "Approved Written Policy", "value": 100 },
          { "label": "Not Applicable", "value": null }
        ]
      },
      {
        "id": "implemented",
        "name": "Control Implemented",
        "options": [
          { "label": "Not Implemented", "value": 0 },
          { "label": "Parts of Policy Implemented", "value": 25 },
          { "label": "Implemented on Some Systems", "value": 50 },
          { "label": "Implemented on Most Systems", "value": 75 },
          { "label": "Implemented on All Systems", "value": 100 },
          { "label": "Not Applicable", "value": null }
        ]
      },
      {
        "id": "automated",
        "name": "Control Automated",
        "options": [
          { "label": "Not Implemented", "value": 0 },
          { "label": "Parts of Policy Implemented", "value": 25 },
          { "label": "Implemented on Some Systems", "value": 50 },
          { "label": "Implemented on Most Systems", "value": 75 },
          { "label": "Implemented on All Systems", "value": 100 },
          { "label": "Not Applicable", "value": null }
        ]
      },
      {
        "id": "reported",
        "name": "Control Reported",
        "options": [
          { "label": "Not Implemented", "value": 0 },
          { "label": "Parts of Policy Implemented", "value": 25 },
          { "label": "Implemented on Some Systems", "value": 50 },
          { "label": "Implemented on Most Systems", "value": 75 },
          { "label": "Implemented on All Systems", "value": 100 },
          { "label": "Not Applicable", "value": null }
        ]
      }
    ]
  }
};
