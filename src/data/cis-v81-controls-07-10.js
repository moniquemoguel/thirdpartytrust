// CIS Critical Security Controls v8.1, Controls 7 to 10: names, descriptions, and Safeguards, verbatim from the CIS guide.
// CIS Controls content: Center for Internet Security, Inc., licensed under CC BY-NC-ND 4.0.
window.CIS_V81_CONTROLS = (window.CIS_V81_CONTROLS || []).concat([
  {
    "id": 7,
    "name": "Continuous Vulnerability Management",
    "description": "Develop a plan to continuously assess and track vulnerabilities on all enterprise assets within the enterprise’s infrastructure, in order to remediate, and minimize, the window of opportunity for attackers. Monitor public and private industry sources for new threat and vulnerability information.",
    "safeguards": [
      {
        "id": "7.1",
        "title": "Establish and Maintain a Vulnerability Management Process",
        "description": "Establish and maintain a documented vulnerability management process for enterprise assets. Review and update documentation annually, or when significant enterprise changes occur that could impact this Safeguard.",
        "assetType": "Documentation",
        "securityFunction": "Govern",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "7.2",
        "title": "Establish and Maintain a Remediation Process",
        "description": "Establish and maintain a risk-based remediation strategy documented in a remediation process, with monthly, or more frequent, reviews.",
        "assetType": "Documentation",
        "securityFunction": "Govern",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "7.3",
        "title": "Perform Automated Operating System Patch Management",
        "description": "Perform operating system updates on enterprise assets through automated patch management on a monthly, or more frequent, basis.",
        "assetType": "Software",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "7.4",
        "title": "Perform Automated Application Patch Management",
        "description": "Perform application updates on enterprise assets through automated patch management on a monthly, or more frequent, basis.",
        "assetType": "Software",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "7.5",
        "title": "Perform Automated Vulnerability Scans of Internal Enterprise Assets",
        "description": "Perform automated vulnerability scans of internal enterprise assets on a quarterly, or more frequent, basis. Conduct both authenticated and unauthenticated scans.",
        "assetType": "Software",
        "securityFunction": "Identify",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "7.6",
        "title": "Perform Automated Vulnerability Scans of Externally-Exposed Enterprise Assets",
        "description": "Perform automated vulnerability scans of externally-exposed enterprise assets. Perform scans on a monthly, or more frequent, basis.",
        "assetType": "Software",
        "securityFunction": "Identify",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "7.7",
        "title": "Remediate Detected Vulnerabilities",
        "description": "Remediate detected vulnerabilities in software through processes and tooling on a monthly, or more frequent, basis, based on the remediation process.",
        "assetType": "Software",
        "securityFunction": "Respond",
        "implementationGroups": ["IG2", "IG3"]
      }
    ]
  },
  {
    "id": 8,
    "name": "Audit Log Management",
    "description": "Collect, alert, review, and retain audit logs of events that could help detect, understand, or recover from an attack.",
    "safeguards": [
      {
        "id": "8.1",
        "title": "Establish and Maintain an Audit Log Management Process",
        "description": "Establish and maintain a documented audit log management process that defines the enterprise’s logging requirements. At a minimum, address the collection, review, and retention of audit logs for enterprise assets. Review and update documentation annually, or when significant enterprise changes occur that could impact this Safeguard.",
        "assetType": "Documentation",
        "securityFunction": "Govern",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "8.2",
        "title": "Collect Audit Logs",
        "description": "Collect audit logs. Ensure that logging, per the enterprise’s audit log management process, has been enabled across enterprise assets.",
        "assetType": "Data",
        "securityFunction": "Detect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "8.3",
        "title": "Ensure Adequate Audit Log Storage",
        "description": "Ensure that logging destinations maintain adequate storage to comply with the enterprise’s audit log management process.",
        "assetType": "Data",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "8.4",
        "title": "Standardize Time Synchronization",
        "description": "Standardize time synchronization. Configure at least two synchronized time sources across enterprise assets, where supported.",
        "assetType": "Network",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "8.5",
        "title": "Collect Detailed Audit Logs",
        "description": "Configure detailed audit logging for enterprise assets containing sensitive data. Include event source, date, username, timestamp, source addresses, destination addresses, and other useful elements that could assist in a forensic investigation.",
        "assetType": "Data",
        "securityFunction": "Detect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "8.6",
        "title": "Collect DNS Query Audit Logs",
        "description": "Collect DNS query audit logs on enterprise assets, where appropriate and supported.",
        "assetType": "Data",
        "securityFunction": "Detect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "8.7",
        "title": "Collect URL Request Audit Logs",
        "description": "Collect URL request audit logs on enterprise assets, where appropriate and supported.",
        "assetType": "Data",
        "securityFunction": "Detect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "8.8",
        "title": "Collect Command-Line Audit Logs",
        "description": "Collect command-line audit logs. Example implementations include collecting audit logs from PowerShell®, BASH™, and remote administrative terminals.",
        "assetType": "Data",
        "securityFunction": "Detect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "8.9",
        "title": "Centralize Audit Logs",
        "description": "Centralize, to the extent possible, audit log collection and retention across enterprise assets in accordance with the documented audit log management process. Example implementations primarily include leveraging a SIEM tool to centralize multiple log sources.",
        "assetType": "Data",
        "securityFunction": "Detect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "8.10",
        "title": "Retain Audit Logs",
        "description": "Retain audit logs across enterprise assets for a minimum of 90 days.",
        "assetType": "Data",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "8.11",
        "title": "Conduct Audit Log Reviews",
        "description": "Conduct reviews of audit logs to detect anomalies or abnormal events that could indicate a potential threat. Conduct reviews on a weekly, or more frequent, basis.",
        "assetType": "Data",
        "securityFunction": "Detect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "8.12",
        "title": "Collect Service Provider Logs",
        "description": "Collect service provider logs, where supported. Example implementations include collecting authentication and authorization events, data creation and disposal events, and user management events.",
        "assetType": "Data",
        "securityFunction": "Detect",
        "implementationGroups": ["IG3"]
      }
    ]
  },
  {
    "id": 9,
    "name": "Email and Web Browser Protections",
    "description": "Improve protections and detections of threats from email and web vectors, as these are opportunities for attackers to manipulate human behavior through direct engagement.",
    "safeguards": [
      {
        "id": "9.1",
        "title": "Ensure Use of Only Fully Supported Browsers and Email Clients",
        "description": "Ensure only fully supported browsers and email clients are allowed to execute in the enterprise, only using the latest version of browsers and email clients provided through the vendor.",
        "assetType": "Software",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "9.2",
        "title": "Use DNS Filtering Services",
        "description": "Use DNS filtering services on all end-user devices, including remote and on-premises assets, to block access to known malicious domains.",
        "assetType": "Devices",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "9.3",
        "title": "Maintain and Enforce Network-Based URL Filters",
        "description": "Enforce and update network-based URL filters to limit an enterprise asset from connecting to potentially malicious or unapproved websites. Example implementations include category-based filtering, reputation-based filtering, or through the use of block lists. Enforce filters for all enterprise assets.",
        "assetType": "Network",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "9.4",
        "title": "Restrict Unnecessary or Unauthorized Browser and Email Client Extensions",
        "description": "Restrict, either through uninstalling or disabling, any unauthorized or unnecessary browser or email client plugins, extensions, and add-on applications.",
        "assetType": "Software",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "9.5",
        "title": "Implement DMARC",
        "description": "To lower the chance of spoofed or modified emails from valid domains, implement DMARC policy and verification, starting with implementing the Sender Policy Framework (SPF) and the DomainKeys Identified Mail (DKIM) standards.",
        "assetType": "Network",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "9.6",
        "title": "Block Unnecessary File Types",
        "description": "Block unnecessary file types attempting to enter the enterprise’s email gateway.",
        "assetType": "Network",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "9.7",
        "title": "Deploy and Maintain Email Server Anti-Malware Protections",
        "description": "Deploy and maintain email server anti-malware protections, such as attachment scanning and/or sandboxing.",
        "assetType": "Network",
        "securityFunction": "Protect",
        "implementationGroups": ["IG3"]
      }
    ]
  },
  {
    "id": 10,
    "name": "Malware Defenses",
    "description": "Prevent or control the installation, spread, and execution of malicious applications, code, or scripts on enterprise assets.",
    "safeguards": [
      {
        "id": "10.1",
        "title": "Deploy and Maintain Anti-Malware Software",
        "description": "Deploy and maintain anti-malware software on all enterprise assets.",
        "assetType": "Devices",
        "securityFunction": "Detect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "10.2",
        "title": "Configure Automatic Anti-Malware Signature Updates",
        "description": "Configure automatic updates for anti-malware signature files on all enterprise assets.",
        "assetType": "Devices",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "10.3",
        "title": "Disable Autorun and Autoplay for Removable Media",
        "description": "Disable autorun and autoplay auto-execute functionality for removable media.",
        "assetType": "Devices",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "10.4",
        "title": "Configure Automatic Anti-Malware Scanning of Removable Media",
        "description": "Configure anti-malware software to automatically scan removable media.",
        "assetType": "Devices",
        "securityFunction": "Detect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "10.5",
        "title": "Enable Anti-Exploitation Features",
        "description": "Enable anti-exploitation features on enterprise assets and software, where possible, such as Microsoft® Data Execution Prevention (DEP), Windows® Defender Exploit Guard (WDEG), or Apple® System Integrity Protection (SIP) and Gatekeeper™.",
        "assetType": "Devices",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "10.6",
        "title": "Centrally Manage Anti-Malware Software",
        "description": "Centrally manage anti-malware software.",
        "assetType": "Devices",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "10.7",
        "title": "Use Behavior-Based Anti-Malware Software",
        "description": "Use behavior-based anti-malware software.",
        "assetType": "Devices",
        "securityFunction": "Detect",
        "implementationGroups": ["IG2", "IG3"]
      }
    ]
  }
]);
