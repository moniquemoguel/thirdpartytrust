// CIS Critical Security Controls v8.1, Controls 11 to 14: names, descriptions, and Safeguards, verbatim from the CIS guide.
// CIS Controls content: Center for Internet Security, Inc., licensed under CC BY-NC-ND 4.0.
window.CIS_V81_CONTROLS = (window.CIS_V81_CONTROLS || []).concat([
  {
    "id": 11,
    "name": "Data Recovery",
    "description": "Establish and maintain data recovery practices sufficient to restore in-scope enterprise assets to a pre-incident and trusted state.",
    "safeguards": [
      {
        "id": "11.1",
        "title": "Establish and Maintain a Data Recovery Process",
        "description": "Establish and maintain a documented data recovery process that includes detailed backup procedures. In the process, address the scope of data recovery activities, recovery prioritization, and the security of backup data. Review and update documentation annually, or when significant enterprise changes occur that could impact this Safeguard.",
        "assetType": "Documentation",
        "securityFunction": "Govern",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "11.2",
        "title": "Perform Automated Backups",
        "description": "Perform automated backups of in-scope enterprise assets. Run backups weekly, or more frequently, based on the sensitivity of the data.",
        "assetType": "Data",
        "securityFunction": "Recover",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "11.3",
        "title": "Protect Recovery Data",
        "description": "Protect recovery data with equivalent controls to the original data. Reference encryption or data separation, based on requirements.",
        "assetType": "Data",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "11.4",
        "title": "Establish and Maintain an Isolated Instance of Recovery Data",
        "description": "Establish and maintain an isolated instance of recovery data. Example implementations include, version controlling backup destinations through offline, cloud, or off-site systems or services.",
        "assetType": "Data",
        "securityFunction": "Recover",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "11.5",
        "title": "Test Data Recovery",
        "description": "Test backup recovery quarterly, or more frequently, for a sampling of in-scope enterprise assets.",
        "assetType": "Data",
        "securityFunction": "Recover",
        "implementationGroups": ["IG2", "IG3"]
      }
    ]
  },
  {
    "id": 12,
    "name": "Network Infrastructure Management",
    "description": "Establish, implement, and actively manage (track, report, correct) network devices, in order to prevent attackers from exploiting vulnerable network services and access points.",
    "safeguards": [
      {
        "id": "12.1",
        "title": "Ensure Network Infrastructure is Up-to-Date",
        "description": "Ensure network infrastructure is kept up-to-date. Example implementations include running the latest stable release of software and/or using currently supported network as a service (NaaS) offerings. Review software versions monthly, or more frequently, to verify software support.",
        "assetType": "Network",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "12.2",
        "title": "Establish and Maintain a Secure Network Architecture",
        "description": "Design and maintain a secure network architecture. A secure network architecture must address segmentation, least privilege, and availability, at a minimum. Example implementations may include documentation, policy, and design components.",
        "assetType": "Network",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "12.3",
        "title": "Securely Manage Network Infrastructure",
        "description": "Securely manage network infrastructure. Example implementations include version-controlled-infrastructure-as-code, and the use of secure network protocols, such as SSH and HTTPS.",
        "assetType": "Network",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "12.4",
        "title": "Establish and Maintain Architecture Diagram(s)",
        "description": "Establish and maintain architecture diagram(s) and/or other network system documentation. Review and update documentation annually, or when significant enterprise changes occur that could impact this Safeguard.",
        "assetType": "Documentation",
        "securityFunction": "Govern",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "12.5",
        "title": "Centralize Network Authentication, Authorization, and Auditing (AAA)",
        "description": "Centralize network AAA.",
        "assetType": "Network",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "12.6",
        "title": "Use of Secure Network Management and Communication Protocols",
        "description": "Adopt secure network management protocols (e.g., 802.1X) and secure communication protocols (e.g., Wi-Fi Protected Access 2 (WPA2) Enterprise or more secure alternatives).",
        "assetType": "Network",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "12.7",
        "title": "Ensure Remote Devices Utilize a VPN and are Connecting to an Enterprise’s AAA Infrastructure",
        "description": "Require users to authenticate to enterprise-managed VPN and authentication services prior to accessing enterprise resources on end-user devices.",
        "assetType": "Devices",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "12.8",
        "title": "Establish and Maintain Dedicated Computing Resources for All Administrative Work",
        "description": "Establish and maintain dedicated computing resources, either physically or logically separated, for all administrative tasks or tasks requiring administrative access. The computing resources should be segmented from the enterprise’s primary network and not be allowed internet access.",
        "assetType": "Devices",
        "securityFunction": "Protect",
        "implementationGroups": ["IG3"]
      }
    ]
  },
  {
    "id": 13,
    "name": "Network Monitoring and Defense",
    "description": "Operate processes and tooling to establish and maintain comprehensive network monitoring and defense against security threats across the enterprise’s network infrastructure and user base.",
    "safeguards": [
      {
        "id": "13.1",
        "title": "Centralize Security Event Alerting",
        "description": "Centralize security event alerting across enterprise assets for log correlation and analysis. Best practice implementation requires the use of a SIEM, which includes vendor-defined event correlation alerts. A log analytics platform configured with security-relevant correlation alerts also satisfies this Safeguard.",
        "assetType": "Network",
        "securityFunction": "Detect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "13.2",
        "title": "Deploy a Host-Based Intrusion Detection Solution",
        "description": "Deploy a host-based intrusion detection solution on enterprise assets, where appropriate and/or supported.",
        "assetType": "Devices",
        "securityFunction": "Detect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "13.3",
        "title": "Deploy a Network Intrusion Detection Solution",
        "description": "Deploy a network intrusion detection solution on enterprise assets, where appropriate. Example implementations include the use of a Network Intrusion Detection System (NIDS) or equivalent cloud service provider (CSP) service.",
        "assetType": "Network",
        "securityFunction": "Detect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "13.4",
        "title": "Perform Traffic Filtering Between Network Segments",
        "description": "Perform traffic filtering between network segments, where appropriate.",
        "assetType": "Network",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "13.5",
        "title": "Manage Access Control for Remote Assets",
        "description": "Manage access control for assets remotely connecting to enterprise resources. Determine amount of access to enterprise resources based on: up-to-date anti-malware software installed, configuration compliance with the enterprise’s secure configuration process, and ensuring the operating system and applications are up-to-date.",
        "assetType": "Devices",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "13.6",
        "title": "Collect Network Traffic Flow Logs",
        "description": "Collect network traffic flow logs and/or network traffic to review and alert upon from network devices.",
        "assetType": "Network",
        "securityFunction": "Detect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "13.7",
        "title": "Deploy a Host-Based Intrusion Prevention Solution",
        "description": "Deploy a host-based intrusion prevention solution on enterprise assets, where appropriate and/or supported. Example implementations include use of an Endpoint Detection and Response (EDR) client or host-based IPS agent.",
        "assetType": "Devices",
        "securityFunction": "Protect",
        "implementationGroups": ["IG3"]
      },
      {
        "id": "13.8",
        "title": "Deploy a Network Intrusion Prevention Solution",
        "description": "Deploy a network intrusion prevention solution, where appropriate. Example implementations include the use of a Network Intrusion Prevention System (NIPS) or equivalent CSP service.",
        "assetType": "Network",
        "securityFunction": "Protect",
        "implementationGroups": ["IG3"]
      },
      {
        "id": "13.9",
        "title": "Deploy Port-Level Access Control",
        "description": "Deploy port-level access control. Port-level access control utilizes 802.1x, or similar network access control protocols, such as certificates, and may incorporate user and/or device authentication.",
        "assetType": "Network",
        "securityFunction": "Protect",
        "implementationGroups": ["IG3"]
      },
      {
        "id": "13.10",
        "title": "Perform Application Layer Filtering",
        "description": "Perform application layer filtering. Example implementations include a filtering proxy, application layer firewall, or gateway.",
        "assetType": "Network",
        "securityFunction": "Protect",
        "implementationGroups": ["IG3"]
      },
      {
        "id": "13.11",
        "title": "Tune Security Event Alerting Thresholds",
        "description": "Tune security event alerting thresholds monthly, or more frequently.",
        "assetType": "Network",
        "securityFunction": "Detect",
        "implementationGroups": ["IG3"]
      }
    ]
  },
  {
    "id": 14,
    "name": "Security Awareness and Skills Training",
    "description": "Establish and maintain a security awareness program to influence behavior among the workforce to be security conscious and properly skilled to reduce cybersecurity risks to the enterprise.",
    "safeguards": [
      {
        "id": "14.1",
        "title": "Establish and Maintain a Security Awareness Program",
        "description": "Establish and maintain a security awareness program. The purpose of a security awareness program is to educate the enterprise’s workforce on how to interact with enterprise assets and data in a secure manner. Conduct training at hire and, at a minimum, annually. Review and update content annually, or when significant enterprise changes occur that could impact this Safeguard.",
        "assetType": "Documentation",
        "securityFunction": "Govern",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "14.2",
        "title": "Train Workforce Members to Recognize Social Engineering Attacks",
        "description": "Train workforce members to recognize social engineering attacks, such as phishing, business email compromise (BEC), pretexting, and tailgating.",
        "assetType": "Users",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "14.3",
        "title": "Train Workforce Members on Authentication Best Practices",
        "description": "Train workforce members on authentication best practices. Example topics include MFA, password composition, and credential management.",
        "assetType": "Users",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "14.4",
        "title": "Train Workforce on Data Handling Best Practices",
        "description": "Train workforce members on how to identify and properly store, transfer, archive, and destroy sensitive data. This also includes training workforce members on clear screen and desk best practices, such as locking their screen when they step away from their enterprise asset, erasing physical and virtual whiteboards at the end of meetings, and storing data and assets securely.",
        "assetType": "Users",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "14.5",
        "title": "Train Workforce Members on Causes of Unintentional Data Exposure",
        "description": "Train workforce members to be aware of causes for unintentional data exposure. Example topics include mis-delivery of sensitive data, losing a portable end-user device, or publishing data to unintended audiences.",
        "assetType": "Users",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "14.6",
        "title": "Train Workforce Members on Recognizing and Reporting Security Incidents",
        "description": "Train workforce members to be able to recognize a potential incident and be able to report such an incident.",
        "assetType": "Users",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "14.7",
        "title": "Train Workforce on How to Identify and Report if Their Enterprise Assets are Missing Security Updates",
        "description": "Train workforce to understand how to verify and report out-of-date software patches or any failures in automated processes and tools. Part of this training should include notifying IT personnel of any failures in automated processes and tools.",
        "assetType": "Users",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "14.8",
        "title": "Train Workforce on the Dangers of Connecting to and Transmitting Enterprise Data Over Insecure Networks",
        "description": "Train workforce members on the dangers of connecting to, and transmitting data over, insecure networks for enterprise activities. If the enterprise has remote workers, training must include guidance to ensure that all users securely configure their home network infrastructure.",
        "assetType": "Users",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "14.9",
        "title": "Conduct Role-Specific Security Awareness and Skills Training",
        "description": "Conduct role-specific security awareness and skills training. Example implementations include secure system administration courses for IT professionals, OWASP® Top 10 vulnerability awareness and prevention training for web application developers, and advanced social engineering awareness training for high-profile roles.",
        "assetType": "Users",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      }
    ]
  }
]);
