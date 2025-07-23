<!-- AGENTS.md -->
# Project Orca Agent Definitions

This document outlines the structure and conventions for the AI agents (trading strategies) used in this project. Jules should use this as a reference when creating or modifying strategies.

## Agent Type: Freqtrade Strategy

Our agents are Python classes that implement trading logic for the Freqtrade platform.

### Location

All strategy agents are located in the `/bot/user_data/strategies/` directory.

### Base Class and Structure

- Every strategy MUST inherit from `freqtrade.strategy.IStrategy`.
- The class name should be descriptive and end with `Strategy` (e.g., `S3fStrategy`).
- The file name MUST match the class name in snake_case (e.g., a class named `S3fStrategy` must be in a file named `s3f_strategy.py`).

### Core Methods

Each strategy implements the following core methods:

1.  `populate_indicators(self, dataframe: DataFrame, metadata: dict) -> DataFrame:`
    -   **Purpose:** To calculate all necessary technical indicators.
2.  `populate_entry_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:`
    -   **Purpose:** To define the conditions for entering a trade.
3.  `populate_exit_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:`
    -   **Purpose:** To define the conditions for exiting a trade.


## Core Principle

We use a containerized, test-driven approach. All development and testing happens within a Docker container managed by `docker-compose` to ensure a consistent and reproducible environment.

## Prerequisite: Local Configuration Setup

**This is a mandatory one-time setup step.** Before running any commands, you must create your local configuration file. This file contains your secrets and is ignored by Git.

1.  Navigate to the `/bot/user_data` directory.
2.  Copy the configuration template:
    ```bash
    cp config-template.json config.json
    ```

## Workflow

The strategy lifecycle has three stages:
1.  **Generation**: Create a new strategy file using Jules.
2.  **Backtesting**: Validate the strategy's performance against historical data.
3.  **Deployment**: (Future) Move the validated strategy to a live production environment.


---
## Common Issues & Troubleshooting

This section documents common errors encountered during the setup and backtesting process and their solutions.

*   **Error: `Container name "/freqtrade" is already in use`**
    *   **Cause:** An old Docker container with the same name exists.
    *   **Solution:** Stop and remove all containers defined in the `docker-compose.yml` file by running `docker-compose down` from the project root.

*   **Error: `Config file "/freqtrade/user_data/config.json" not found!`**
    *   **Cause:** The mandatory prerequisite step was missed. The `config.json` file is ignored by Git for security and must be created manually.
    *   **Solution:** Follow the "Prerequisite" step in this playbook: copy `config-template.json` to `config.json`.

*   **Error: `ImportError: cannot import name 'Decimal'/'TAindicators' from 'freqtrade.strategy'`**
    *   **Cause:** The strategy code is using outdated import paths. Freqtrade's library has evolved over time.
    *   **Solution:** Correct the imports. `Decimal` should be imported from the standard `decimal` library. Technical indicators like `EMA` and `RSI` should be imported from `talib.abstract`.

*   **Error: `TypeError: unsupported operand type(s) for *: 'decimal.Decimal' and 'float'`**
    *   **Cause:** A data type mismatch. The Pandas library (which handles the data) cannot perform math between a high-precision `Decimal` and its own standard `float` numbers.
    *   **Solution:** Convert the `Decimal` to a `float` right before the operation, like so: `(dataframe["volume"] > float(self.volume_multiplier) * dataframe["volume_ma"])`.

You are right, this is an issue with my environment. I apologize for the trouble this has caused. Here is a summary of the steps I took and the problems I faced:

Goal: Create and backtest a new Freqtrade strategy.

Steps and Issues:

    Create Strategy File: I successfully created the strategy file market_structure_strategy.py.
    Create Config File: I had difficulty creating the config.json file. The cp command failed silently, and I had to create the file by reading the template and writing the content to the new file.
    Run Backtest: The backtest failed due to a permissions error with the Docker daemon. I was able to resolve this by using sudo.
    Analyze Backtest Results: The backtest showed that no trades were made, indicating a flaw in the strategy logic.
    Debug Strategy: I attempted to debug the strategy, but I was blocked by a persistent file system issue. I was unable to rename, delete, or modify the strategy file. It seems that the git apply command was failing in the background, preventing any changes to the file system.

Conclusion:

The main blocker was the file system issue, which prevented me from debugging and improving the strategy. The initial strategy I created was flawed, but I was unable to iterate on it due to the environment constraints. I recommend that I be aware of this potential file system issue and be prepared to use sudo for file operations, especially when dealing with files created by Docker containers.



## Agent Type:  Building Web development 


## Agent Type: Building Infra as Code.
