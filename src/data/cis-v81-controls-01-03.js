// CIS Critical Security Controls v8.1, Controls 1 to 3: names, descriptions, and Safeguards, verbatim from the CIS guide.
// CIS Controls content: Center for Internet Security, Inc., licensed under CC BY-NC-ND 4.0.
window.CIS_V81_CONTROLS = (window.CIS_V81_CONTROLS || []).concat([
  {
    "id": 1,
    "name": "Inventory and Control of Enterprise Assets",
    "description": "Actively manage (inventory, track, and correct) all enterprise assets (end-user devices, including portable and mobile; network devices; non-computing/Internet of Things (IoT) devices; and servers) connected to the infrastructure physically, virtually, remotely, and those within cloud environments, to accurately know the totality of assets that need to be monitored and protected within the enterprise. This will also support identifying unauthorized and unmanaged assets to remove or remediate.",
    "safeguards": [
      {
        "id": "1.1",
        "title": "Establish and Maintain Detailed Enterprise Asset Inventory",
        "description": "Establish and maintain an accurate, detailed, and up-to-date inventory of all enterprise assets with the potential to store or process data, to include: end-user devices (including portable and mobile), network devices, non-computing/IoT devices, and servers. Ensure the inventory records the network address (if static), hardware address, machine name, enterprise asset owner, department for each asset, and whether the asset has been approved to connect to the network. For mobile end-user devices, MDM type tools can support this process, where appropriate. This inventory includes assets connected to the infrastructure physically, virtually, remotely, and those within cloud environments. Additionally, it includes assets that are regularly connected to the enterprise’s network infrastructure, even if they are not under control of the enterprise. Review and update the inventory of all enterprise assets bi-annually, or more frequently.",
        "assetType": "Devices",
        "securityFunction": "Identify",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "1.2",
        "title": "Address Unauthorized Assets",
        "description": "Ensure that a process exists to address unauthorized assets on a weekly basis. The enterprise may choose to remove the asset from the network, deny the asset from connecting remotely to the network, or quarantine the asset.",
        "assetType": "Devices",
        "securityFunction": "Respond",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "1.3",
        "title": "Utilize an Active Discovery Tool",
        "description": "Utilize an active discovery tool to identify assets connected to the enterprise’s network. Configure the active discovery tool to execute daily, or more frequently.",
        "assetType": "Devices",
        "securityFunction": "Detect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "1.4",
        "title": "Use Dynamic Host Configuration Protocol (DHCP) Logging to Update Enterprise Asset Inventory",
        "description": "Use DHCP logging on all DHCP servers or Internet Protocol (IP) address management tools to update the enterprise’s asset inventory. Review and use logs to update the enterprise’s asset inventory weekly, or more frequently.",
        "assetType": "Devices",
        "securityFunction": "Identify",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "1.5",
        "title": "Use a Passive Asset Discovery Tool",
        "description": "Use a passive discovery tool to identify assets connected to the enterprise’s network. Review and use scans to update the enterprise’s asset inventory at least weekly, or more frequently.",
        "assetType": "Devices",
        "securityFunction": "Detect",
        "implementationGroups": ["IG3"]
      }
    ]
  },
  {
    "id": 2,
    "name": "Inventory and Control of Software Assets",
    "description": "Actively manage (inventory, track, and correct) all software (operating systems and applications) on the network so that only authorized software is installed and can execute, and that unauthorized and unmanaged software is found and prevented from installation or execution.",
    "safeguards": [
      {
        "id": "2.1",
        "title": "Establish and Maintain a Software Inventory",
        "description": "Establish and maintain a detailed inventory of all licensed software installed on enterprise assets. The software inventory must document the title, publisher, initial install/use date, and business purpose for each entry; where appropriate, include the Uniform Resource Locator (URL), app store(s), version(s), deployment mechanism, decommission date, and number of licenses. Review and update the software inventory bi-annually, or more frequently.",
        "assetType": "Software",
        "securityFunction": "Identify",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "2.2",
        "title": "Ensure Authorized Software is Currently Supported",
        "description": "Ensure that only currently supported software is designated as authorized in the software inventory for enterprise assets. If software is unsupported, yet necessary for the fulfillment of the enterprise’s mission, document an exception detailing mitigating controls and residual risk acceptance. For any unsupported software without an exception documentation, designate as unauthorized. Review the software list to verify software support at least monthly, or more frequently.",
        "assetType": "Software",
        "securityFunction": "Identify",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "2.3",
        "title": "Address Unauthorized Software",
        "description": "Ensure that unauthorized software is either removed from use on enterprise assets or receives a documented exception. Review monthly, or more frequently.",
        "assetType": "Software",
        "securityFunction": "Respond",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "2.4",
        "title": "Utilize Automated Software Inventory Tools",
        "description": "Utilize software inventory tools, when possible, throughout the enterprise to automate the discovery and documentation of installed software.",
        "assetType": "Software",
        "securityFunction": "Detect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "2.5",
        "title": "Allowlist Authorized Software",
        "description": "Use technical controls, such as application allowlisting, to ensure that only authorized software can execute or be accessed. Reassess bi-annually, or more frequently.",
        "assetType": "Software",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "2.6",
        "title": "Allowlist Authorized Libraries",
        "description": "Use technical controls to ensure that only authorized software libraries, such as specific .dll, .ocx, and .so files, are allowed to load into a system process. Block unauthorized libraries from loading into a system process. Reassess bi-annually, or more frequently.",
        "assetType": "Software",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "2.7",
        "title": "Allowlist Authorized Scripts",
        "description": "Use technical controls, such as digital signatures and version control, to ensure that only authorized scripts, such as specific .ps1, and .py files are allowed to execute. Block unauthorized scripts from executing. Reassess bi-annually, or more frequently.",
        "assetType": "Software",
        "securityFunction": "Protect",
        "implementationGroups": ["IG3"]
      }
    ]
  },
  {
    "id": 3,
    "name": "Data Protection",
    "description": "Develop processes and technical controls to identify, classify, securely handle, retain, and dispose of data.",
    "safeguards": [
      {
        "id": "3.1",
        "title": "Establish and Maintain a Data Management Process",
        "description": "Establish and maintain a documented data management process. In the process, address data sensitivity, data owner, handling of data, data retention limits, and disposal requirements, based on sensitivity and retention standards for the enterprise. Review and update documentation annually, or when significant enterprise changes occur that could impact this Safeguard.",
        "assetType": "Data",
        "securityFunction": "Govern",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "3.2",
        "title": "Establish and Maintain a Data Inventory",
        "description": "Establish and maintain a data inventory based on the enterprise’s data management process. Inventory sensitive data, at a minimum. Review and update inventory annually, at a minimum, with a priority on sensitive data.",
        "assetType": "Data",
        "securityFunction": "Identify",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "3.3",
        "title": "Configure Data Access Control Lists",
        "description": "Configure data access control lists based on a user’s need to know. Apply data access control lists, also known as access permissions, to local and remote file systems, databases, and applications.",
        "assetType": "Data",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "3.4",
        "title": "Enforce Data Retention",
        "description": "Retain data according to the enterprise’s documented data management process. Data retention must include both minimum and maximum timelines.",
        "assetType": "Data",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "3.5",
        "title": "Securely Dispose of Data",
        "description": "Securely dispose of data as outlined in the enterprise’s documented data management process. Ensure the disposal process and method are commensurate with the data sensitivity.",
        "assetType": "Data",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "3.6",
        "title": "Encrypt Data on End-User Devices",
        "description": "Encrypt data on end-user devices containing sensitive data. Example implementations can include: Windows BitLocker®, Apple FileVault®, Linux® dm-crypt.",
        "assetType": "Data",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "3.7",
        "title": "Establish and Maintain a Data Classification Scheme",
        "description": "Establish and maintain an overall data classification scheme for the enterprise. Enterprises may use labels, such as “Sensitive,” “Confidential,” and “Public,” and classify their data according to those labels. Review and update the classification scheme annually, or when significant enterprise changes occur that could impact this Safeguard.",
        "assetType": "Data",
        "securityFunction": "Identify",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "3.8",
        "title": "Document Data Flows",
        "description": "Document data flows. Data flow documentation includes service provider data flows and should be based on the enterprise’s data management process. Review and update documentation annually, or when significant enterprise changes occur that could impact this Safeguard.",
        "assetType": "Data",
        "securityFunction": "Identify",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "3.9",
        "title": "Encrypt Data on Removable Media",
        "description": "Encrypt data on removable media.",
        "assetType": "Data",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "3.10",
        "title": "Encrypt Sensitive Data in Transit",
        "description": "Encrypt sensitive data in transit. Example implementations can include: Transport Layer Security (TLS) and Open Secure Shell (OpenSSH).",
        "assetType": "Data",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "3.11",
        "title": "Encrypt Sensitive Data at Rest",
        "description": "Encrypt sensitive data at rest on servers, applications, and databases. Storage-layer encryption, also known as server-side encryption, meets the minimum requirement of this Safeguard. Additional encryption methods may include application-layer encryption, also known as client-side encryption, where access to the data storage device(s) does not permit access to the plain-text data.",
        "assetType": "Data",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "3.12",
        "title": "Segment Data Processing and Storage Based on Sensitivity",
        "description": "Segment data processing and storage based on the sensitivity of the data. Do not process sensitive data on enterprise assets intended for lower sensitivity data.",
        "assetType": "Data",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "3.13",
        "title": "Deploy a Data Loss Prevention Solution",
        "description": "Implement an automated tool, such as a host-based Data Loss Prevention (DLP) tool to identify all sensitive data stored, processed, or transmitted through enterprise assets, including those located onsite or at a remote service provider, and update the enterprise’s data inventory.",
        "assetType": "Data",
        "securityFunction": "Protect",
        "implementationGroups": ["IG3"]
      },
      {
        "id": "3.14",
        "title": "Log Sensitive Data Access",
        "description": "Log sensitive data access, including modification and disposal.",
        "assetType": "Data",
        "securityFunction": "Detect",
        "implementationGroups": ["IG3"]
      }
    ]
  }
]);
