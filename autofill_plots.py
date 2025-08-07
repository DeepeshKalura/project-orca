# autofill_plots.py (Version 3 - Final)
#
# PURPOSE:
# Reads the latest backtest .zip result file, extracts the data, and automatically
# generates the 'trades_to_plot' list for your plotting script.
#
# HOW TO USE:
# 1. Run your freqtrade backtest as usual.
# 2. Run this script: python3 autofill_plots.py
# 3. Copy the output from your terminal.
# 4. Paste it into the 'trades_to_plot' variable in 'generate_plots_locally.py'.

import os
import glob
import json
import zipfile
import io

# --- CONFIGURATION ---
HOST_USER_DATA_PATH = "./bot/user_data" 
NUM_TRADES_TO_SELECT = 3

# --- SCRIPT LOGIC ---
def find_latest_backtest_file(path):
    """Finds the most recent .zip file in the backtest results directory."""
    results_path = os.path.join(path, "backtest_results")
    if not os.path.isdir(results_path):
        print(f"ERROR: Directory not found: {results_path}")
        return None
    
    list_of_files = glob.glob(os.path.join(results_path, 'backtest-result-*.zip'))
    if not list_of_files:
        print(f"ERROR: No backtest .zip files found in {results_path}")
        return None
        
    latest_file = max(list_of_files, key=os.path.getctime)
    return latest_file

def analyze_trades(zip_filepath):
    """Reads a backtest ZIP file and extracts the biggest winning and losing trades."""
    print(f"--- Analyzing latest backtest file: {os.path.basename(zip_filepath)} ---\n")
    
    try:
        with zipfile.ZipFile(zip_filepath, 'r') as zip_ref:
            json_filename = next((name for name in zip_ref.namelist() if name.endswith('.json')), None)
            if not json_filename:
                print(f"ERROR: No .json file found inside {zip_filepath}")
                return

            with zip_ref.open(json_filename) as json_file:
                data = json.load(io.TextIOWrapper(json_file, 'utf-8'))

    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return

    strategy_name = list(data['strategy'].keys())[0]
    
    # *** THIS IS THE FIX: The key is 'trades', not 'results' ***
    trades = data['strategy'][strategy_name].get('trades', [])

    if not trades:
        print("No trades found in this backtest result.")
        return

    trades.sort(key=lambda x: x['profit_ratio'])
    
    num_losers = min(NUM_TRADES_TO_SELECT, len([t for t in trades if t['profit_ratio'] < 0]))
    num_winners = min(NUM_TRADES_TO_SELECT, len([t for t in trades if t['profit_ratio'] > 0]))

    losers = trades[:num_losers]
    winners = trades[-num_winners:] if num_winners > 0 else []
    
    print("Copy the following list and paste it into your 'generate_plots_locally.py' script:")
    print("---------------------------------------------------------------------------------")
    print("trades_to_plot = [")

    if losers:
        print("    # --- Biggest Losing Trades ---")
        for trade in losers:
            open_date = trade['open_date'].split('+')[0]
            label = f"LOSS_{trade['pair'].replace('/', '')}_{trade['profit_ratio']:.2%}"
            print(f'    {{"pair": "{trade["pair"]}", "open_date": "{open_date}", "label": "{label}"}},')

    if winners:
        print("\n    # --- Biggest Winning Trades ---")
        for trade in reversed(winners):
            open_date = trade['open_date'].split('+')[0]
            label = f"WIN_{trade['pair'].replace('/', '')}_{trade['profit_ratio']:.2%}"
            print(f'    {{"pair": "{trade["pair"]}", "open_date": "{open_date}", "label": "{label}"}},')

    print("]")
    print("---------------------------------------------------------------------------------")


if __name__ == "__main__":
    latest_file = find_latest_backtest_file(HOST_USER_DATA_PATH)
    if latest_file:
        analyze_trades(latest_file)