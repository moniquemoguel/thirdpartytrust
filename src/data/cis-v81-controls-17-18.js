// CIS Critical Security Controls v8.1, Controls 17 to 18: names, descriptions, and Safeguards, verbatim from the CIS guide.
// CIS Controls content: Center for Internet Security, Inc., licensed under CC BY-NC-ND 4.0.
window.CIS_V81_CONTROLS = (window.CIS_V81_CONTROLS || []).concat([
  {
    "id": 17,
    "name": "Incident Response Management",
    "description": "Establish a program to develop and maintain an incident response capability (e.g., policies, plans, procedures, defined roles, training, and communications) to prepare, detect, and quickly respond to an attack.",
    "safeguards": [
      {
        "id": "17.1",
        "title": "Designate Personnel to Manage Incident Handling",
        "description": "Designate one key person, and at least one backup, who will manage the enterprise’s incident handling process. Management personnel are responsible for the coordination and documentation of incident response and recovery efforts and can consist of employees internal to the enterprise, service providers, or a hybrid approach. If using a service provider, designate at least one person internal to the enterprise to oversee any third-party work. Review annually, or when significant enterprise changes occur that could impact this Safeguard.",
        "assetType": "Users",
        "securityFunction": "Respond",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "17.2",
        "title": "Establish and Maintain Contact Information for Reporting Security Incidents",
        "description": "Establish and maintain contact information for parties that need to be informed of security incidents. Contacts may include internal staff, service providers, law enforcement, cyber insurance providers, relevant government agencies, Information Sharing and Analysis Center (ISAC) partners, or other stakeholders. Verify contacts annually to ensure that information is up-to-date.",
        "assetType": "Documentation",
        "securityFunction": "Govern",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "17.3",
        "title": "Establish and Maintain an Enterprise Process for Reporting Incidents",
        "description": "Establish and maintain an documented enterprise process for the workforce to report security incidents. The process includes reporting timeframe, personnel to report to, mechanism for reporting, and the minimum information to be reported. Ensure the process is publicly available to all of the workforce. Review annually, or when significant enterprise changes occur that could impact this Safeguard.",
        "assetType": "Documentation",
        "securityFunction": "Govern",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "17.4",
        "title": "Establish and Maintain an Incident Response Process",
        "description": "Establish and maintain a documented incident response process that addresses roles and responsibilities, compliance requirements, and a communication plan. Review annually, or when significant enterprise changes occur that could impact this Safeguard.",
        "assetType": "Documentation",
        "securityFunction": "Govern",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "17.5",
        "title": "Assign Key Roles and Responsibilities",
        "description": "Assign key roles and responsibilities for incident response, including staff from legal, IT, information security, facilities, public relations, human resources, incident responders, analysts, and relevant third parties. Review annually, or when significant enterprise changes occur that could impact this Safeguard.",
        "assetType": "Users",
        "securityFunction": "Respond",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "17.6",
        "title": "Define Mechanisms for Communicating During Incident Response",
        "description": "Determine which primary and secondary mechanisms will be used to communicate and report during a security incident. Mechanisms can include phone calls, emails, secure chat, or notification letters. Keep in mind that certain mechanisms, such as emails, can be affected during a security incident. Review annually, or when significant enterprise changes occur that could impact this Safeguard.",
        "assetType": "Users",
        "securityFunction": "Respond",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "17.7",
        "title": "Conduct Routine Incident Response Exercises",
        "description": "Plan and conduct routine incident response exercises and scenarios for key personnel involved in the incident response process to prepare for responding to real-world incidents. Exercises need to test communication channels, decision making, and workflows. Conduct testing on an annual basis, at a minimum.",
        "assetType": "Users",
        "securityFunction": "Recover",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "17.8",
        "title": "Conduct Post-Incident Reviews",
        "description": "Conduct post-incident reviews. Post-incident reviews help prevent incident recurrence through identifying lessons learned and follow-up action.",
        "assetType": "Users",
        "securityFunction": "Recover",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "17.9",
        "title": "Establish and Maintain Security Incident Thresholds",
        "description": "Establish and maintain security incident thresholds, including, at a minimum, differentiating between an incident and an event. Examples can include: abnormal activity, security vulnerability, security weakness, data breach, privacy incident, etc. Review annually, or when significant enterprise changes occur that could impact this Safeguard.",
        "assetType": "Documentation",
        "securityFunction": "Recover",
        "implementationGroups": ["IG3"]
      }
    ]
  },
  {
    "id": 18,
    "name": "Penetration Testing",
    "description": "Test the effectiveness and resiliency of enterprise assets through identifying and exploiting weaknesses in controls (people, processes, and technology), and simulating the objectives and actions of an attacker.",
    "safeguards": [
      {
        "id": "18.1",
        "title": "Establish and Maintain a Penetration Testing Program",
        "description": "Establish and maintain a penetration testing program appropriate to the size, complexity, industry, and maturity of the enterprise. Penetration testing program characteristics include scope, such as network, web application, Application Programming Interface (API), hosted services, and physical premise controls; frequency; limitations, such as acceptable hours, and excluded attack types; point of contact information; remediation, such as how findings will be routed internally; and retrospective requirements.",
        "assetType": "Documentation",
        "securityFunction": "Govern",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "18.2",
        "title": "Perform Periodic External Penetration Tests",
        "description": "Perform periodic external penetration tests based on program requirements, no less than annually. External penetration testing must include enterprise and environmental reconnaissance to detect exploitable information. Penetration testing requires specialized skills and experience and must be conducted through a qualified party. The testing may be clear box or opaque box.",
        "assetType": "Network",
        "securityFunction": "Detect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "18.3",
        "title": "Remediate Penetration Test Findings",
        "description": "Remediate penetration test findings based on the enterprise’s documented vulnerability remediation process. This should include determining a timeline and level of effort based on the impact and prioritization of each identified finding.",
        "assetType": "Network",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "18.4",
        "title": "Validate Security Measures",
        "description": "Validate security measures after each penetration test. If deemed necessary, modify rulesets and capabilities to detect the techniques used during testing.",
        "assetType": "Network",
        "securityFunction": "Protect",
        "implementationGroups": ["IG3"]
      },
      {
        "id": "18.5",
        "title": "Perform Periodic Internal Penetration Tests",
        "description": "Perform periodic internal penetration tests based on program requirements, no less than annually. The testing may be clear box or opaque box.",
        "assetType": "Network",
        "securityFunction": "Detect",
        "implementationGroups": ["IG3"]
      }
    ]
  }
]);
