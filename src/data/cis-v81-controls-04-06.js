// CIS Critical Security Controls v8.1, Controls 4 to 6: names, descriptions, and Safeguards, verbatim from the CIS guide.
// CIS Controls content: Center for Internet Security, Inc., licensed under CC BY-NC-ND 4.0.
window.CIS_V81_CONTROLS = (window.CIS_V81_CONTROLS || []).concat([
  {
    "id": 4,
    "name": "Secure Configuration of Enterprise Assets and Software",
    "description": "Establish and maintain the secure configuration of enterprise assets (end-user devices, including portable and mobile; network devices; non-computing/IoT devices; and servers) and software (operating systems and applications).",
    "safeguards": [
      {
        "id": "4.1",
        "title": "Establish and Maintain a Secure Configuration Process",
        "description": "Establish and maintain a documented secure configuration process for enterprise assets (end-user devices, including portable and mobile, non-computing/IoT devices, and servers) and software (operating systems and applications). Review and update documentation annually, or when significant enterprise changes occur that could impact this Safeguard.",
        "assetType": "Documentation",
        "securityFunction": "Govern",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "4.2",
        "title": "Establish and Maintain a Secure Configuration Process for Network Infrastructure",
        "description": "Establish and maintain a documented secure configuration process for network devices. Review and update documentation annually, or when significant enterprise changes occur that could impact this Safeguard.",
        "assetType": "Documentation",
        "securityFunction": "Govern",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "4.3",
        "title": "Configure Automatic Session Locking on Enterprise Assets",
        "description": "Configure automatic session locking on enterprise assets after a defined period of inactivity. For general purpose operating systems, the period must not exceed 15 minutes. For mobile end-user devices, the period must not exceed 2 minutes.",
        "assetType": "Devices",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "4.4",
        "title": "Implement and Manage a Firewall on Servers",
        "description": "Implement and manage a firewall on servers, where supported. Example implementations include a virtual firewall, operating system firewall, or a third-party firewall agent.",
        "assetType": "Devices",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "4.5",
        "title": "Implement and Manage a Firewall on End-User Devices",
        "description": "Implement and manage a host-based firewall or port-filtering tool on end-user devices, with a default-deny rule that drops all traffic except those services and ports that are explicitly allowed.",
        "assetType": "Devices",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "4.6",
        "title": "Securely Manage Enterprise Assets and Software",
        "description": "Securely manage enterprise assets and software. Example implementations include managing configuration through version-controlled Infrastructure-as-Code (IaC) and accessing administrative interfaces over secure network protocols, such as Secure Shell (SSH) and Hypertext Transfer Protocol Secure (HTTPS). Do not use insecure management protocols, such as Telnet (Teletype Network) and HTTP, unless operationally essential.",
        "assetType": "Devices",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "4.7",
        "title": "Manage Default Accounts on Enterprise Assets and Software",
        "description": "Manage default accounts on enterprise assets and software, such as root, administrator, and other pre-configured vendor accounts. Example implementations can include: disabling default accounts or making them unusable.",
        "assetType": "Users",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "4.8",
        "title": "Uninstall or Disable Unnecessary Services on Enterprise Assets and Software",
        "description": "Uninstall or disable unnecessary services on enterprise assets and software, such as an unused file sharing service, web application module, or service function.",
        "assetType": "Devices",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "4.9",
        "title": "Configure Trusted DNS Servers on Enterprise Assets",
        "description": "Configure trusted DNS servers on network infrastructure. Example implementations include configuring network devices to use enterprise-controlled DNS servers and/or reputable externally accessible DNS servers.",
        "assetType": "Devices",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "4.10",
        "title": "Enforce Automatic Device Lockout on Portable End-User Devices",
        "description": "Enforce automatic device lockout following a predetermined threshold of local failed authentication attempts on portable end-user devices, where supported. For laptops, do not allow more than 20 failed authentication attempts; for tablets and smartphones, no more than 10 failed authentication attempts. Example implementations include Microsoft® InTune Device Lock and Apple® Configuration Profile maxFailedAttempts.",
        "assetType": "Devices",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "4.11",
        "title": "Enforce Remote Wipe Capability on Portable End-User Devices",
        "description": "Remotely wipe enterprise data from enterprise-owned portable end-user devices when deemed appropriate such as lost or stolen devices, or when an individual no longer supports the enterprise.",
        "assetType": "Data",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "4.12",
        "title": "Separate Enterprise Workspaces on Mobile End-User Devices",
        "description": "Ensure separate enterprise workspaces are used on mobile end-user devices, where supported. Example implementations include using an Apple® Configuration Profile or Android™ Work Profile to separate enterprise applications and data from personal applications and data.",
        "assetType": "Data",
        "securityFunction": "Protect",
        "implementationGroups": ["IG3"]
      }
    ]
  },
  {
    "id": 5,
    "name": "Account Management",
    "description": "Use processes and tools to assign and manage authorization to credentials for user accounts, including administrator accounts, as well as service accounts, to enterprise assets and software.",
    "safeguards": [
      {
        "id": "5.1",
        "title": "Establish and Maintain an Inventory of Accounts",
        "description": "Establish and maintain an inventory of all accounts managed in the enterprise. The inventory must at a minimum include user, administrator, and service accounts. The inventory, at a minimum, should contain the person’s name, username, start/stop dates, and department. Validate that all active accounts are authorized, on a recurring schedule at a minimum quarterly, or more frequently.",
        "assetType": "Users",
        "securityFunction": "Identify",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "5.2",
        "title": "Use Unique Passwords",
        "description": "Use unique passwords for all enterprise assets. Best practice implementation includes, at a minimum, an 8-character password for accounts using Multi-Factor Authentication (MFA) and a 14-character password for accounts not using MFA.",
        "assetType": "Users",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "5.3",
        "title": "Disable Dormant Accounts",
        "description": "Delete or disable any dormant accounts after a period of 45 days of inactivity, where supported.",
        "assetType": "Users",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "5.4",
        "title": "Restrict Administrator Privileges to Dedicated Administrator Accounts",
        "description": "Restrict administrator privileges to dedicated administrator accounts on enterprise assets. Conduct general computing activities, such as internet browsing, email, and productivity suite use, from the user’s primary, non-privileged account.",
        "assetType": "Users",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "5.5",
        "title": "Establish and Maintain an Inventory of Service Accounts",
        "description": "Establish and maintain an inventory of service accounts. The inventory, at a minimum, must contain department owner, review date, and purpose. Perform service account reviews to validate that all active accounts are authorized, on a recurring schedule at a minimum quarterly, or more frequently.",
        "assetType": "Users",
        "securityFunction": "Identify",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "5.6",
        "title": "Centralize Account Management",
        "description": "Centralize account management through a directory or identity service.",
        "assetType": "Users",
        "securityFunction": "Govern",
        "implementationGroups": ["IG2", "IG3"]
      }
    ]
  },
  {
    "id": 6,
    "name": "Access Control Management",
    "description": "Use processes and tools to create, assign, manage, and revoke access credentials and privileges for user, administrator, and service accounts for enterprise assets and software.",
    "safeguards": [
      {
        "id": "6.1",
        "title": "Establish an Access Granting Process",
        "description": "Establish and follow a documented process, preferably automated, for granting access to enterprise assets upon new hire or role change of a user.",
        "assetType": "Documentation",
        "securityFunction": "Govern",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "6.2",
        "title": "Establish an Access Revoking Process",
        "description": "Establish and follow a process, preferably automated, for revoking access to enterprise assets, through disabling accounts immediately upon termination, rights revocation, or role change of a user. Disabling accounts, instead of deleting accounts, may be necessary to preserve audit trails.",
        "assetType": "Documentation",
        "securityFunction": "Govern",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "6.3",
        "title": "Require MFA for Externally-Exposed Applications",
        "description": "Require all externally-exposed enterprise or third-party applications to enforce MFA, where supported. Enforcing MFA through a directory service or SSO provider is a satisfactory implementation of this Safeguard.",
        "assetType": "Users",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "6.4",
        "title": "Require MFA for Remote Network Access",
        "description": "Require MFA for remote network access.",
        "assetType": "Users",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "6.5",
        "title": "Require MFA for Administrative Access",
        "description": "Require MFA for all administrative access accounts, where supported, on all enterprise assets, whether managed on-site or through a service provider.",
        "assetType": "Users",
        "securityFunction": "Protect",
        "implementationGroups": ["IG1", "IG2", "IG3"]
      },
      {
        "id": "6.6",
        "title": "Establish and Maintain an Inventory of Authentication and Authorization Systems",
        "description": "Establish and maintain an inventory of the enterprise’s authentication and authorization systems, including those hosted on-site or at a remote service provider. Review and update the inventory, at a minimum, annually, or more frequently.",
        "assetType": "Software",
        "securityFunction": "Identify",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "6.7",
        "title": "Centralize Access Control",
        "description": "Centralize access control for all enterprise assets through a directory service or SSO provider, where supported.",
        "assetType": "Users",
        "securityFunction": "Protect",
        "implementationGroups": ["IG2", "IG3"]
      },
      {
        "id": "6.8",
        "title": "Define and Maintain Role-Based Access Control",
        "description": "Define and maintain role-based access control, through determining and documenting the access rights necessary for each role within the enterprise to successfully carry out its assigned duties. Perform access control reviews of enterprise assets to validate that all privileges are authorized, on a recurring schedule at a minimum annually, or more frequently.",
        "assetType": "Users",
        "securityFunction": "Govern",
        "implementationGroups": ["IG3"]
      }
    ]
  }
]);
