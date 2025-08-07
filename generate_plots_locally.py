# generate_plots_locally.py (Version 4 - Host/Container Aware)
import subprocess
import os
import time
from datetime import datetime, timedelta
import shlex
import pathlib # Used for creating file URIs

# --- CONFIGURE YOUR TRADES FOR PLOTTING HERE ---
trades_to_plot = [
    # --- Biggest Losing Trades ---
    {"pair": "ETH/USDT", "open_date": "2025-08-06 06:00:00", "label": "LOSS_ETHUSDT_-0.16%"},

    # --- Biggest Winning Trades ---
    {"pair": "LINK/USDT", "open_date": "2024-11-24 19:00:00", "label": "WIN_LINKUSDT_2.02%"},
    {"pair": "AVAX/USDT", "open_date": "2025-04-14 01:00:00", "label": "WIN_AVAXUSDT_0.96%"},
    {"pair": "LINK/USDT", "open_date": "2025-01-18 09:00:00", "label": "WIN_LINKUSDT_0.86%"},
]
# --- SCRIPT CONFIGURATION ---
HOST_USER_DATA_PATH = "./bot/user_data"
CONTAINER_USER_DATA_PATH = "/freqtrade/user_data"

# --- SCRIPT LOGIC ---
def run_freqtrade_in_container(command_list, label=""):
    """Runs a freqtrade subcommand inside the docker container."""
    base_command = ["docker", "compose", "run", "--rm", "freqtrade"]
    full_command = base_command + command_list
    try:
        subprocess.run(full_command, check=True, capture_output=True, text=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"  ERROR for {label}: Freqtrade command failed.")
        print(f"  Command: {' '.join(full_command)}")
        print(f"  Stderr: {e.stderr.strip()}")
        return False

def run_command_on_host(command_list, label=""):
    """Runs a command directly on the host machine."""
    try:
        subprocess.run(command_list, check=True, capture_output=True, text=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"  ERROR for {label}: Host command failed.")
        print(f"  Command: {' '.join(command_list)}")
        print(f"  Stderr: {e.stderr.strip()}")
        return False
    except FileNotFoundError:
        print(f"  ERROR for {label}: Command not found on host. Is '{command_list[0]}' installed and in your PATH?")
        return False

def process_trade(trade):
    """Processes a single trade: plots on container, screenshots on host."""
    pair = trade["pair"]
    label = trade["label"]
    safe_label = label.replace('%','').replace('/','').replace(':','').replace('-', '')

    print(f"--- Processing: {label} ---")

    open_dt = datetime.strptime(trade["open_date"], "%Y-%m-%d %H:%M:%S")
    start_dt, end_dt = open_dt - timedelta(days=2), open_dt + timedelta(days=2)
    timerange = f"{start_dt.strftime('%Y%m%d')}-{end_dt.strftime('%Y%m%d')}"

    # 1. Generate HTML plot (runs in Docker)
    plot_command = [
        "plot-dataframe", "--config", f"{CONTAINER_USER_DATA_PATH}/config.json",
        "--strategy", "HybridBreakoutTrend", "--pair", pair, "--timerange", timerange
    ]
    if not run_freqtrade_in_container(plot_command, f"Plot for {label}"):
        return

    time.sleep(1)

    # 2. Rename the plot file (on Host)
    pair_fn = pair.replace('/', '_')
    default_html_fn = f"freqtrade-plot-{pair_fn}-1h.html"
    custom_html_fn = f"plot_{safe_label}.html"
    
    host_default_path = os.path.join(HOST_USER_DATA_PATH, "plot", default_html_fn)
    host_custom_path = os.path.join(HOST_USER_DATA_PATH, "plot", custom_html_fn)

    try:
        if os.path.exists(host_custom_path):
            os.remove(host_custom_path)
        os.rename(host_default_path, host_custom_path)
        print(f"  SUCCESS: HTML plot saved to {host_custom_path}")
    except Exception as e:
        print(f"  ERROR renaming file for {label}: {e}")
        return

    # 3. Screenshot the renamed file (runs on Host)
    # Get the absolute path for the host machine
    abs_html_path = os.path.abspath(host_custom_path)
    abs_png_path = abs_html_path.replace('.html', '.png')
    # Convert path to a URI like 'file:///path/to/your/file.html'
    html_uri = pathlib.Path(abs_html_path).as_uri()

    screenshot_command = [
        "firefox", "--headless", "--screenshot", abs_png_path, html_uri
    ]
    
    if run_command_on_host(screenshot_command, f"Screenshot for {label}"):
        print(f"  SUCCESS: Screenshot saved to {abs_png_path}")
    else:
        print(f"  INFO: Screenshot failed. You can view the HTML file directly at {html_uri}")


if __name__ == "__main__":
    print("--- Starting Local Trade Plot Generator (v4 - Host/Container Aware) ---")
    plot_dir = os.path.join(HOST_USER_DATA_PATH, "plot")
    if not os.path.exists(plot_dir):
        print(f"Creating plot directory: {plot_dir}")
        os.makedirs(plot_dir)
        
    if not trades_to_plot:
        print("\nWARNING: 'trades_to_plot' list is empty. Run autofill_plots.py first.")
    else:
        for trade in trades_to_plot:
            process_trade(trade)
            
    print("\n--- All plot generation tasks complete! ---")