# Strategy Deployment Guide

This document outlines the standard operating procedure for deploying a locally tested and validated Freqtrade strategy to a remote production server.

## Overview

The process involves securely copying the final strategy `.py` file from your local development environment to the server where your live Freqtrade instance is running.

---

## Prerequisites

Before you can deploy, ensure you have the following:

1.  **A Validated Strategy:** The strategy file you intend to deploy has been thoroughly backtested using the workflow in `PLAYBOOK.md`.
2.  **Production Server:** You have a remote server running Freqtrade, preferably via Docker Compose.
3.  **SSH Access:** You have SSH access to the production server, configured for key-based authentication (passwordless login).
4.  **SSH Alias (Recommended):** To keep your server's IP address and username private and to simplify the command, it is highly recommended to configure an SSH alias on your local machine.

### How to Configure an SSH Alias

If you don't have one, you can create an alias by editing or creating the `~/.ssh/config` file on your local computer.

**SSH Config Template (`~/.ssh/config`):**
```
Host <YOUR_ALIAS_NAME>
  HostName <YOUR_SERVER_IP_ADDRESS>
  User <YOUR_USERNAME_ON_THE_SERVER>
  IdentityFile <PATH_TO_YOUR_PRIVATE_SSH_KEY>
```

**Example:**
```
Host project-orca
  HostName 123.45.67.89
  User freqtrader
  IdentityFile ~/.ssh/id_rsa
```

---

## Deployment Process

### Step 1: Securely Copy the Strategy File

Use the `scp` (secure copy) command to transfer your strategy file. Using an SSH alias makes this command clean and secure.

**Command Template:**
```bash
scp <path/to/local/strategy.py> <YOUR_SSH_ALIAS>:<path/to/remote/strategies_folder/>
```

**Example Command:**

This command copies the `KumaStrategy.py` file to the production server you've configured with the alias `project-orca`.

```bash
scp bot/user_data/strategies/KumaStrategy.py project-orca:~/ft_userdata/user_data/strategies/
```

### Step 2: Restart the Production Bot

For the live Freqtrade bot to load the new strategy file, you must restart the service.

1.  **SSH into your server:**
    ```bash
    ssh <YOUR_SSH_ALIAS>
    ```
    *Example: `ssh project-orca`*

2.  **Navigate to your bot's directory:**
    ```bash
    cd ~/ft_userdata/
    ```

3.  **Restart the Freqtrade container:**
    *If you are using Docker Compose (recommended), this is the safest way to restart the bot.*
    ```bash
    docker-compose restart
    ```

### Step 3: Verify the Deployment

Check the logs of your production bot to ensure it started without errors and successfully loaded the new strategy.

```bash
docker-compose logs -f
```

You should see a log line similar to:
`INFO - Using resolved strategy KumaStrategy from '/freqtrade/user_data/strategies/KumaStrategy.py'...`

The deployment is now complete.
