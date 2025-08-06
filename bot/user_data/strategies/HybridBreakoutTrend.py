# --- Do not remove these libs ---
from freqtrade.strategy import IStrategy, IntParameter, DecimalParameter
from pandas import DataFrame
from functools import reduce
import operator
from freqtrade.persistence import Trade

# Technical analysis library
import talib.abstract as ta
# Quantstart technical library
import freqtrade.vendor.qtpylib.indicators as qtpylib


class HybridBreakoutTrend(IStrategy):
    """
    Hybrid Breakout & Trend Following Strategy (HybridBreakoutTrend) - V8 (Robust)

    This is a multi-regime strategy for SPOT TRADING.

    V8 Changes:
    - Reverted to the robust V7 parameters after Hyperopt led to overfitting.
    - Introduced pair-specific logic: a more conservative trend confirmation
      (higher ADX) is now required for BTC/USDT.
    """

    # --- Strategy Hyperparameters (Reverted to robust V7 defaults) ---
    adx_period = IntParameter(10, 20, default=14, space='buy', optimize=True)
    adx_threshold = IntParameter(20, 30, default=25, space='buy', optimize=True)
    bb_period = IntParameter(20, 40, default=20, space='buy', optimize=True)
    bb_stddev = DecimalParameter(1.5, 2.5, default=2.0, space='buy', optimize=True)
    squeeze_period = IntParameter(20, 100, default=20, space='buy', optimize=True)
    squeeze_ratio = DecimalParameter(0.20, 0.60, default=0.25, space='buy', optimize=True)
    ema_short_period = IntParameter(10, 30, default=21, space='buy', optimize=True)
    ema_long_period = IntParameter(40, 60, default=50, space='buy', optimize=True)

    # --- Strategy Configuration ---
    timeframe = '1h'

    # --- Risk Management ---
    minimal_roi = {
        "60": 0.03,
        "180": 0.02,
        "360": 0.01,
        "0": 0.05
    }
    stoploss = -0.10
    trailing_stop = False


    def populate_indicators(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        for col in ['open', 'high', 'low', 'close', 'volume']:
            dataframe[col] = dataframe[col].astype('float')

        dataframe['adx'] = ta.ADX(dataframe, timeperiod=self.adx_period.value)

        bollinger = qtpylib.bollinger_bands(qtpylib.typical_price(dataframe),
                                            window=self.bb_period.value,
                                            stds=self.bb_stddev.value)
        dataframe['bb_lowerband'] = bollinger['lower']
        dataframe['bb_middleband'] = bollinger['mid']
        dataframe['bb_upperband'] = bollinger['upper']
        dataframe['bb_width'] = (dataframe['bb_upperband'] - dataframe['bb_middleband']) / dataframe['bb_middleband']
        dataframe['bb_width_quantile'] = dataframe['bb_width'].rolling(self.squeeze_period.value).quantile(self.squeeze_ratio.value)

        dataframe['ema_short'] = ta.EMA(dataframe, timeperiod=self.ema_short_period.value)
        dataframe['ema_long'] = ta.EMA(dataframe, timeperiod=self.ema_long_period.value)
        
        dataframe['volume_mean_slow'] = dataframe['volume'].rolling(window=30).mean()
        dataframe['rsi'] = ta.RSI(dataframe)
        dataframe['atr'] = ta.ATR(dataframe, timeperiod=14)

        return dataframe

    def populate_entry_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        
        # --- SUB-STRATEGY 1: VOLATILITY BREAKOUT LOGIC ---
        breakout_conditions = []
        breakout_conditions.append(dataframe['volume_mean_slow'] > 0)
        breakout_conditions.append(dataframe['adx'] < self.adx_threshold.value)
        breakout_conditions.append((dataframe['atr'] / dataframe['close']) < 0.04)
        breakout_conditions.append(dataframe['bb_width'] < dataframe['bb_width_quantile'])
        breakout_conditions.append(qtpylib.crossed_above(dataframe['close'], dataframe['bb_upperband']))
        breakout_conditions.append(dataframe['volume'] > dataframe['volume'].rolling(5).mean() * 1.5)
        
        dataframe.loc[reduce(operator.and_, breakout_conditions), ['enter_long', 'enter_tag']] = (1, 'breakout')

        # --- SUB-STRATEGY 2: TREND FOLLOWING LOGIC with PAIR-SPECIFIC RULE ---
        trend_conditions = []
        trend_conditions.append(dataframe['volume_mean_slow'] > 0)
        
        # NEW: PAIR-SPECIFIC LOGIC
        # For BTC, require a stronger trend signal (higher ADX)
        if metadata['pair'] == 'BTC/USDT':
            trend_conditions.append(dataframe['adx'] >= 30)
            trend_conditions.append(dataframe['rsi'] < 75) 
        else:
            trend_conditions.append(dataframe['adx'] >= self.adx_threshold.value)
            trend_conditions.append(dataframe['rsi'] < 70) 
            
        trend_conditions.append(dataframe['ema_short'] > dataframe['ema_long'])
        trend_conditions.append(qtpylib.crossed_above(dataframe['ema_short'], dataframe['ema_long']))


        
        dataframe.loc[reduce(operator.and_, trend_conditions), ['enter_long', 'enter_tag']] = (1, 'trend')

        dataframe.loc[dataframe['enter_long'] == 1, 'exit_long'] = 0
        
        return dataframe

    def populate_exit_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        
        dataframe.loc[((dataframe['rsi'] < 45)), 'exit_long'] = 1
        dataframe.loc[dataframe['exit_long'] == 1, 'enter_long'] = 0
            
        return dataframe

    def custom_exit(self, pair: str, trade: Trade, current_time: 'datetime', current_rate: float,
                    current_profit: float, **kwargs):
        
        dataframe, _ = self.dp.get_analyzed_dataframe(pair, self.timeframe)
        last_candle = dataframe.iloc[-1].squeeze()

        if current_profit > 0 and (last_candle['rsi'] < 50):
            return 'rsi_profit_take'
            
        if (current_time - trade.open_date_utc).days >= 1 and current_profit < 0:
            return 'loss_timeout'

        return None