// CIS Critical Security Controls v8.1, Controls 15 to 16: names, descriptions, and Safeguards, verbatim from the CIS guide.
// CIS Controls content: Center for Internet Security, Inc., licensed under CC BY-NC-ND 4.0.
window.CIS_V81_CONTROLS = (window.CIS_V81_CONTROLS || []).concat([
  {
    "id": 15,
    "name": "Service Provider Management",
    "description": "Develop a process to evaluate service providers who hold sensitive data, or are responsible for an enterprise’s critical IT platforms or processes, to ensure these providers are protecting those platforms and data appropriately.",
    "safeguards": [
      {
        "id": "15.1",
        "title": "Establish and Maintain an Inventory of Service Providers",
        "description": "Establish and maintain an inventory of service providers. The inventory is to list all known service providers, include classification(s), and designate an enterprise contact for each service provider. Review and update the inventory annually, or when significant enterprise changes occur that could impact this Safeguard.",
        "assetType": "Users",
        "securityFunction": "Identify",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "15.2",
        "title": "Establish and Maintain a Service Provider Management Policy",
        "description": "Establish and maintain a service provider management policy. Ensure the policy addresses the classification, inventory, assessment, monitoring, and decommissioning of service providers. Review and update the policy annually, or when significant enterprise changes occur that could impact this Safeguard.",
        "assetType": "Documentation",
        "securityFunction": "Govern",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "15.3",
        "title": "Classify Service Providers",
        "description": "Classify service providers. Classification consideration may include one or more characteristics, such as data sensitivity, data volume, availability requirements, applicable regulations, inherent risk, and mitigated risk. Update and review classifications annually, or when significant enterprise changes occur that could impact this Safeguard.",
        "assetType": "Users",
        "securityFunction": "Govern",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "15.4",
        "title": "Ensure Service Provider Contracts Include Security Requirements",
        "description": "Ensure service provider contracts include security requirements. Example requirements may include minimum security program requirements, security incident and/or data breach notification and response, data encryption requirements, and data disposal commitments. These security requirements must be consistent with the enterprise’s service provider management policy. Review service provider contracts annually to ensure contracts are not missing security requirements.",
        "assetType": "Documentation",
        "securityFunction": "Govern",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "15.5",
        "title": "Assess Service Providers",
        "description": "Assess service providers consistent with the enterprise’s service provider management policy. Assessment scope may vary based on classification(s), and may include review of standardized assessment reports, such as Service Organization Control 2 (SOC 2) and Payment Card Industry (PCI) Attestation of Compliance (AoC), customized questionnaires, or other appropriately rigorous processes. Reassess service providers annually, at a minimum, or with new and renewed contracts.",
        "assetType": "Users",
        "securityFunction": "Govern",
        "implementationGroups": ["IG3"]
      },
      {
        "id": "15.6",
        "title": "Monitor Service Providers",
        "description": "Monitor service providers consistent with the enterprise’s service provider management policy. Monitoring may include periodic reassessment of service provider compliance, monitoring service provider release notes, and dark web monitoring.",
        "assetType": "Data",
        "securityFunction": "Govern",
        "implementationGroups": ["IG3"]
      },
      {
        "id": "15.7",
        "title": "Securely Decommission Service Providers",
        "description": "Securely decommission service providers. Example considerations include user and service account deactivation, termination of data flows, and secure disposal of enterprise data within service provider systems.",
        "assetType": "Data",
        "securityFunction": "Protect",
        "implementationGroups": ["IG3"]
      }
    ]
  },
  {
    "id": 16,
    "name": "Application Software Security",
    "description": "Manage the security life cycle of in-house developed, hosted, or acquired software to prevent, detect, and remediate security weaknesses before they can impact the enterprise.",
    "safeguards": [
      {
        "id": "16.1",
        "title": "Establish and Maintain a Secure Application Development Process",
        "description": "Establish and maintain a secure application development process. In the process, address such items as: secure application design standards, secure coding practices, developer training, vulnerability management, security of third-party code, and application security testing procedures. Review and update documentation annually, or when significant enterprise changes occur that could impact this Safeguard.",
        "assetType": "Documentation",
        "securityFunction": "Govern",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "16.2",
        "title": "Establish and Maintain a Process to Accept and Address Software Vulnerabilities",
        "description": "Establish and maintain a process to accept and address reports of software vulnerabilities, including providing a means for external entities to report. The process is to include such items as: a vulnerability handling policy that identifies reporting process, responsible party for handling vulnerability reports, and a process for intake, assignment, remediation, and remediation testing. As part of the process, use a vulnerability tracking system that includes severity ratings and metrics for measuring timing for identification, analysis, and remediation of vulnerabilities. Review and update documentation annually, or when significant enterprise changes occur that could impact this Safeguard. Third-party application developers need to consider this an externally-facing policy that helps to set expectations for outside stakeholders.",
        "assetType": "Documentation",
        "securityFunction": "Govern",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "16.3",
        "title": "Perform Root Cause Analysis on Security Vulnerabilities",
        "description": "Perform root cause analysis on security vulnerabilities. When reviewing vulnerabilities, root cause analysis is the task of evaluating underlying issues that create vulnerabilities in code, and allows development teams to move beyond just fixing individual vulnerabilities as they arise.",
        "assetType": "Software",
        "securityFunction": "Detect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "16.4",
        "title": "Establish and Manage an Inventory of Third-Party Software Components",
        "description": "Establish and manage an updated inventory of third-party components used in development, often referred to as a “bill of materials,” as well as components slated for future use. This inventory is to include any risks that each third-party component could pose. Evaluate the list at least monthly to identify any changes or updates to these components, and validate that the component is still supported.",
        "assetType": "Software",
        "securityFunction": "Identify",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "16.5",
        "title": "Use Up-to-Date and Trusted Third-Party Software Components",
        "description": "Use up-to-date and trusted third-party software components. When possible, choose established and proven frameworks and libraries that provide adequate security. Acquire these components from trusted sources or evaluate the software for vulnerabilities before use.",
        "assetType": "Software",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "16.6",
        "title": "Establish and Maintain a Severity Rating System and Process for Application Vulnerabilities",
        "description": "Establish and maintain a severity rating system and process for application vulnerabilities that facilitates prioritizing the order in which discovered vulnerabilities are fixed. This process includes setting a minimum level of security acceptability for releasing code or applications. Severity ratings bring a systematic way of triaging vulnerabilities that improves risk management and helps ensure the most severe bugs are fixed first. Review and update the system and process annually.",
        "assetType": "Documentation",
        "securityFunction": "Govern",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "16.7",
        "title": "Use Standard Hardening Configuration Templates for Application Infrastructure",
        "description": "Use standard, industry-recommended hardening configuration templates for application infrastructure components. This includes underlying servers, databases, and web servers, and applies to cloud containers, Platform as a Service (PaaS) components, and SaaS components. Do not allow in-house developed software to weaken configuration hardening.",
        "assetType": "Software",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "16.8",
        "title": "Separate Production and Non-Production Systems",
        "description": "Maintain separate environments for production and non-production systems.",
        "assetType": "Network",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "16.9",
        "title": "Train Developers in Application Security Concepts and Secure Coding",
        "description": "Ensure that all software development personnel receive training in writing secure code for their specific development environment and responsibilities. Training can include general security principles and application security standard practices. Conduct training at least annually and design in a way to promote security within the development team, and build a culture of security among the developers.",
        "assetType": "Users",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "16.10",
        "title": "Apply Secure Design Principles in Application Architectures",
        "description": "Apply secure design principles in application architectures. Secure design principles include the concept of least privilege and enforcing mediation to validate every operation that the user makes, promoting the concept of “never trust user input.” Examples include ensuring that explicit error checking is performed and documented for all input, including for size, data type, and acceptable ranges or formats. Secure design also means minimizing the application infrastructure attack surface, such as turning off unprotected ports and services, removing unnecessary programs and files, and renaming or removing default accounts.",
        "assetType": "Software",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "16.11",
        "title": "Leverage Vetted Modules or Services for Application Security Components",
        "description": "Leverage vetted modules or services for application security components, such as identity management, encryption, auditing, and logging. Using platform features in critical security functions will reduce developers’ workload and minimize the likelihood of design or implementation errors. Modern operating systems provide effective mechanisms for identification, authentication, and authorization and make those mechanisms available to applications. Use only standardized, currently accepted, and extensively reviewed encryption algorithms. Operating systems also provide mechanisms to create and maintain secure audit logs.",
        "assetType": "Software",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "16.12",
        "title": "Implement Code-Level Security Checks",
        "description": "Apply static and dynamic analysis tools within the application life cycle to verify that secure coding practices are being followed.",
        "assetType": "Software",
        "securityFunction": "Protect",
        "implementationGroups": ["IG3"]
      },
      {
        "id": "16.13",
        "title": "Conduct Application Penetration Testing",
        "description": "Conduct application penetration testing. For critical applications, authenticated penetration testing is better suited to finding business logic vulnerabilities than code scanning and automated security testing. Penetration testing relies on the skill of the tester to manually manipulate an application as an authenticated and unauthenticated user.",
        "assetType": "Software",
        "securityFunction": "Detect",
        "implementationGroups": ["IG3"]
      },
      {
        "id": "16.14",
        "title": "Conduct Threat Modeling",
        "description": "Conduct threat modeling. Threat modeling is the process of identifying and addressing application security design flaws within a design, before code is created. It is conducted through specially trained individuals who evaluate the application design and gauge security risks for each entry point and access level. The goal is to map out the application, architecture, and infrastructure in a structured way to understand its weaknesses.",
        "assetType": "Software",
        "securityFunction": "Protect",
        "implementationGroups": ["IG3"]
      }
    ]
  }
]);
