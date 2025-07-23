# --- Do not remove these libs ---
from freqtrade.strategy import IStrategy, IntParameter
from pandas import DataFrame
import talib.abstract as ta
import freqtrade.vendor.qtpylib.indicators as qtpylib
import numpy as np
from scipy.signal import argrelextrema

class MarketStructureStrategy(IStrategy):
    """
    This strategy is based on market structure, identifying pivot points (higher highs and lower lows)
    and trading based on demand zones created from these structures.
    """

    # Strategy interface version - attribute needed by Freqtrade
    INTERFACE_VERSION = 2

    # Minimal ROI designed for the strategy.
    minimal_roi = {
        "0": 0.15,
        "30": 0.10,
        "60": 0.05
    }

    # Stoploss:
    stoploss = -0.10

    # Trailing stop:
    trailing_stop = True
    trailing_stop_positive = 0.01
    trailing_stop_positive_offset = 0.02
    trailing_only_offset_is_reached = True

    # Optimal timeframe for the strategy
    timeframe = '5m'

    # Parameters for pivot points
    pivot_window = IntParameter(5, 20, default=8, space="buy")

    def populate_indicators(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        """
        Adds several different TA indicators to the given DataFrame
        """
        # Pivot Points
        n = self.pivot_window.value
        dataframe['pivot_high'] = (dataframe['high'].rolling(window=2*n+1, center=True).max() == dataframe['high']).astype(int)
        dataframe['pivot_low'] = (dataframe['low'].rolling(window=2*n+1, center=True).min() == dataframe['low']).astype(int)

        return dataframe

    def populate_entry_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        """
        Based on TA indicators, populates the entry signal for the given dataframe
        """
        dataframe['enter_long'] = 0

        pivots_high = dataframe[dataframe['pivot_high'] == 1]
        pivots_low = dataframe[dataframe['pivot_low'] == 1]

        if len(pivots_low) < 2 or len(pivots_high) < 2:
            return dataframe

        last_pivot_low = pivots_low.index[-1]
        second_last_pivot_low = pivots_low.index[-2]
        last_pivot_high = pivots_high.index[-1]
        second_last_pivot_high = pivots_high.index[-2]

        # Identify Higher High and Higher Low
        if (pivots_high.loc[last_pivot_high, 'high'] > pivots_high.loc[second_last_pivot_high, 'high'] and
                pivots_low.loc[last_pivot_low, 'low'] > pivots_low.loc[second_last_pivot_low, 'low']):

            # Find the demand zone (last bearish candle before the up-move)
            up_move_start_index = second_last_pivot_low
            demand_zone_candle = dataframe.loc[up_move_start_index - 1] # Previous candle

            if demand_zone_candle['close'] < demand_zone_candle['open']: # It's a bearish candle
                demand_zone_top = demand_zone_candle['open']
                demand_zone_bottom = demand_zone_candle['close']

                # Potential entry when price touches the demand zone
                for i in range(last_pivot_low, len(dataframe)):
                    if dataframe.loc[i, 'low'] <= demand_zone_top:
                        entry_price = demand_zone_top
                        stop_loss_price = demand_zone_bottom
                        take_profit_price = pivots_high.loc[last_pivot_high, 'high']

                        # Risk/Reward Ratio Check
                        if (entry_price - stop_loss_price) > 0:
                            rr_ratio = (take_profit_price - entry_price) / (entry_price - stop_loss_price)
                            if rr_ratio >= 2.5:
                                dataframe.loc[i, 'enter_long'] = 1
                                break # Exit loop after finding an entry

        return dataframe

    def populate_exit_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        """
        Based on TA indicators, populates the exit signal for the given dataframe
        """
        dataframe['exit_long'] = 0
        return dataframe
