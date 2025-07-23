# --- Standard Library Imports ---
from decimal import Decimal

# --- Third Party Imports ---
import talib.abstract as ta
from pandas import DataFrame

# --- Freqtrade Imports ---
from freqtrade.strategy import IStrategy, IntParameter


class KumaStrategy(IStrategy):
    # Strategy parameters (optimizable)
    fast_ema = IntParameter(10, 30, default=20, space="buy")
    slow_ema = IntParameter(40, 60, default=50, space="buy")
    rsi_buy = IntParameter(25, 40, default=30, space="buy")
    volume_multiplier = Decimal("1.5")  # Min volume vs. average

    # Hyperopt settings
    stoploss = -0.10
    timeframe = "5m"
    minimal_roi = {"0": 0.05, "30": 0.025, "60": 0.01}

    def populate_indicators(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        # Calculate EMAs
        dataframe["fast_ema"] = ta.EMA(dataframe, timeperiod=self.fast_ema.value)
        dataframe["slow_ema"] = ta.EMA(dataframe, timeperiod=self.slow_ema.value)

        # Volume filter: Compare to 20-period average
        dataframe["volume_ma"] = dataframe["volume"].rolling(window=20).mean()

        # RSI for momentum
        dataframe["rsi"] = ta.RSI(dataframe, timeperiod=14)

        return dataframe

    def populate_entry_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        dataframe.loc[
            (
                # EMA Crossover: Fast EMA above Slow EMA
                (dataframe["fast_ema"] > dataframe["slow_ema"]) &
                # Volume surge: Current volume > 1.5x average
               (dataframe["volume"] > float(self.volume_multiplier) * dataframe["volume_ma"]) &
                # RSI not overbought
                (dataframe["rsi"] < self.rsi_buy.value) &
                # Ensure safety: Price above slow EMA
                (dataframe["close"] > dataframe["slow_ema"])
            ),
            "enter_long"] = 1
        return dataframe

    def populate_exit_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        dataframe.loc[
            (
                # EMA Crossunder: Fast EMA below Slow EMA
                (dataframe["fast_ema"] < dataframe["slow_ema"]) |
                # RSI overbought
                (dataframe["rsi"] > 70)
            ),
            "exit_long"] = 1
        return dataframe