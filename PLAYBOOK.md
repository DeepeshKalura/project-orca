### Step 1: Generate a New Strategy

To have Jules create a new strategy, use a prompt that is clear, specific, and references our agent definition.

**Template Prompt for Jules:**



### **1. Market Structure (Defining the Trend)**

This is the most critical part. To identify a "Higher High" (HH) or "Higher Low" (HL), we first need to programmatically define what constitutes a significant "high" or "low" (often called pivot points).

*   A common way to do this is to define a **pivot high** as a candle whose `high` is greater than the `high` of `N` candles to its left and `N` candles to its right. The same logic applies to pivot lows.
*   **Question:** How many candles to the left and right should we use to confirm a pivot point? A small number (e.g., 3-5) will be very sensitive to small price swings, while a larger number (e.g., 10-20) will only identify major market turns. What's your preference here?

### **2. Zone Identification (Defining Supply & Demand)**

Once we have a reliable way to find pivot points (HHs and HLs), we can define the zones. Your algorithm states the demand zone is the "last bearish candle right before that strong upward move."

*   Let's assume the "strong upward move" is the price action that goes from our last confirmed **Higher Low (HL)** pivot up to our new **Higher High (HH)** pivot.
*   **Question:** When you say "the last bearish candle," does that mean we look for the last red candle *immediately before the candle that formed the HL pivot*? Or is it the entire body of that red candle? This will define the exact upper and lower boundaries of our zone.

### **3. Trade Execution (The R/R Filter)**

This is a fantastic rule. It acts as a final quality check on every potential trade. The key implementation detail is that we must calculate this *before* placing the trade.

*   This means for every candle where the price touches a valid demand zone, our code must:
    1.  Get the potential `entry_price` (top of the zone).
    2.  Get the `stop_loss_price` (bottom of the zone).
    3.  Get the `take_profit_price` (the last HH).
    4.  Calculate the ratio: `(take_profit_price - entry_price) / (entry_price - stop_loss_price)`.
    5.  Only then, if the ratio is `>= 2.5`, do we set `enter_long = 1`.

*   **Question:** This seems correct, but I want to confirm: is my understanding of this sequence of operations right? We filter *after* identifying the setup, not before.

Your answers to these questions will give us the precise logic we need to start building this exciting strategy.

---

### Step 2: Backtest the Strategy

Once Jules has created the file, instruct it to run a backtest using our Docker environment.

**Template Prompt for Jules:**


Now, run a backtest for the 'SmaCrossStrategy'.

Use the docker-compose environment in the `/bot` directory.

The command should:
1.  Download historical data for BTC/USDT on the 5m timeframe for the last 30 days.
2.  Run the backtest using the downloaded data.

The full command will look something like this:
`docker-compose run --rm freqtrade backtesting --config /freqtrade/user_data/config.json --strategy SmaCrossStrategy`

But first, you need to download the data with:
`docker-compose run --rm freqtrade download-data --config /freqtrade/user_data/config.json --days 30 -t 5m -p BTC/USDT`

Show me the final backtest result summary.


This structured approach ensures that every new idea is rigorously tested in a consistent environment before it ever gets considered for production.


### Step 3: Deploy to Server (Manual)

*(This is a placeholder for our next mission. The goal will be to document the commands needed to securely copy a validated strategy to the production server and restart the bot.)*

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