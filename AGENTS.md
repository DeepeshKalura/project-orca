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