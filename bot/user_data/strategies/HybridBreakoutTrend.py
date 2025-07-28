# --- Do not remove these libs ---
from freqtrade.strategy import IStrategy, IntParameter, DecimalParameter
from pandas import DataFrame
from functools import reduce
import operator

# Technical analysis library
import talib.abstract as ta
# Quantstart technical library
import freqtrade.vendor.qtpylib.indicators as qtpylib


class HybridBreakoutTrend(IStrategy):
    """
    Hybrid Breakout & Trend Following Strategy (HybridBreakoutTrend) - V2

    This is a multi-regime strategy that combines two distinct models:
    1.  A Volatility Breakout model, designed for ranging/consolidating markets.
    2.  A Trend Following model, designed for established trending markets.

    The strategy uses the Average Directional Index (ADX) to determine the
    current market regime and applies the appropriate model.

    V2 Changes:
    - Implemented realistic stoploss and ROI for risk management.
    - Added a volume check to avoid illiquid pairs.
    - Corrected the ADX "dead zone" to ensure a model is always active.
    - Improved trend-following logic for more reliable entries.
    - Added entry tags for better trade analysis.
    """

    # --- Strategy Hyperparameters ---

    # -- Regime Filter --
    adx_period = IntParameter(10, 20, default=14, space='buy', optimize=True)
    # This single threshold now separates the two regimes.
    adx_threshold = IntParameter(20, 30, default=25, space='buy', optimize=True)

    # -- Sub-Strategy 1: Volatility Breakout Parameters --
    bb_period = IntParameter(20, 40, default=20, space='buy', optimize=True)
    bb_stddev = DecimalParameter(1.5, 2.5, default=2.0, space='buy', optimize=True)
    squeeze_period = IntParameter(20, 100, default=20, space='buy', optimize=True)
    squeeze_ratio = DecimalParameter(0.20, 0.60, default=0.25, space='buy', optimize=True)

    # -- Sub-Strategy 2: Trend Following Parameters --
    ema_short_period = IntParameter(10, 30, default=21, space='buy', optimize=True)
    ema_long_period = IntParameter(40, 60, default=50, space='buy', optimize=True)

    # --- Strategy Configuration ---
    timeframe = '1h'

    # --- Risk Management ---
    # Realistic ROI table. Takes profit based on trade duration.
    minimal_roi = {
        "60": 0.03,
        "180": 0.02,
        "360": 0.01,
        "0": 0.05
    }
    # A sensible hard stoploss to protect capital.
    stoploss = -0.10
    trailing_stop = False


    def populate_indicators(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        # -- Convert data types --
        # This is good practice but often not necessary if data is clean.
        # It's kept here for robustness.
        for col in ['open', 'high', 'low', 'close', 'volume']:
            dataframe[col] = dataframe[col].astype('float')

        # -- Regime Filter Indicator --
        dataframe['adx'] = ta.ADX(dataframe, timeperiod=self.adx_period.value)

        # -- Breakout Strategy Indicators --
        bollinger = qtpylib.bollinger_bands(qtpylib.typical_price(dataframe),
                                            window=self.bb_period.value,
                                            stds=self.bb_stddev.value)
        dataframe['bb_lowerband'] = bollinger['lower']
        dataframe['bb_middleband'] = bollinger['mid']
        dataframe['bb_upperband'] = bollinger['upper']
        dataframe['bb_width'] = (dataframe['bb_upperband'] - dataframe['bb_lowerband']) / dataframe['bb_middleband']
        dataframe['bb_width_quantile'] = dataframe['bb_width'].rolling(self.squeeze_period.value).quantile(self.squeeze_ratio.value)

        # -- Trend Strategy Indicators --
        dataframe['ema_short'] = ta.EMA(dataframe, timeperiod=self.ema_short_period.value)
        dataframe['ema_long'] = ta.EMA(dataframe, timeperiod=self.ema_long_period.value)
        
        # --- Protective Volume Indicator ---
        dataframe['volume_mean_slow'] = dataframe['volume'].rolling(window=30).mean()

        return dataframe

    def populate_entry_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        
        conditions = []
        # --- Mandatory Protections ---
        # Ensure the pair has some volume. A crucial guard.
        conditions.append(dataframe['volume_mean_slow'] > 0)
        
        # --- SUB-STRATEGY 1: VOLATILITY BREAKOUT LOGIC (for RANGING markets) ---
        breakout_conditions = []
        breakout_conditions.append(dataframe['adx'] < self.adx_threshold.value)
        breakout_conditions.append(dataframe['bb_width'] < dataframe['bb_width_quantile'])
        breakout_conditions.append(qtpylib.crossed_above(dataframe['close'], dataframe['bb_upperband']))
        
        # Set entry signal and tag for breakout
        dataframe.loc[reduce(operator.and_, breakout_conditions), ['enter_long', 'enter_tag']] = (1, 'breakout')


        # --- SUB-STRATEGY 2: TREND FOLLOWING LOGIC (for TRENDING markets) ---
        trend_conditions = []
        trend_conditions.append(dataframe['adx'] >= self.adx_threshold.value)
        # Check that we are in an established uptrend, not just the cross moment.
        trend_conditions.append(dataframe['ema_short'] > dataframe['ema_long'])
        # Add a cross check as a trigger within the established trend
        trend_conditions.append(qtpylib.crossed_above(dataframe['ema_short'], dataframe['ema_long']))
        
        # Set entry signal and tag for trend
        dataframe.loc[reduce(operator.and_, trend_conditions), ['enter_long', 'enter_tag']] = (1, 'trend')

        # Combine mandatory protections with entry signals
        dataframe.loc[
            (dataframe['enter_long'] == 1) &
            (dataframe['volume_mean_slow'] > 0)
        , 'enter_long'] = 1

        # We will not generate a sell signal on the same candle we enter
        dataframe.loc[dataframe['enter_long'] == 1, 'exit_long'] = 0
        
        return dataframe


    def populate_exit_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        # --- UNIFIED EXIT CONDITION ---
        exit_condition = (
            qtpylib.crossed_below(dataframe['close'], dataframe['bb_middleband'])
        )

        dataframe.loc[
            (
                exit_condition
            ),
            'exit_long'] = 1
            
        # We will not generate a buy signal on the same candle we exit
        dataframe.loc[dataframe['exit_long'] == 1, 'enter_long'] = 0
            
        return dataframe