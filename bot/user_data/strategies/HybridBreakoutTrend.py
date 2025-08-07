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
    Hybrid Breakout & Trend Following Strategy - V10 (Final Version)
    - Two distinct sub-strategies for different market regimes.
    - TREND: Surgical entries via RSI & Proximity filters.
    - BREAKOUT: Momentum-confirmed entries to avoid false signals.
    - Advanced, tag-aware risk management for both strategies.
    """

    def __init__(self, config: dict) -> None:
        super().__init__(config)
        self.dp = None
        self.custom_info = {}

    # --- Strategy Hyperparameters ---
    adx_period = IntParameter(10, 20, default=14, space='buy', optimize=True)
    adx_threshold = IntParameter(20, 30, default=25, space='buy', optimize=True)
    bb_period = IntParameter(20, 40, default=20, space='buy', optimize=True)
    bb_stddev = DecimalParameter(1.5, 2.5, default=2.0, space='buy', optimize=True)
    ema_short_period = IntParameter(10, 30, default=21, space='buy', optimize=True)
    ema_long_period = IntParameter(40, 60, default=50, space='buy', optimize=True)
    atr_multiplier = DecimalParameter(1.5, 5.0, default=2.5, space='sell', optimize=True)

    # --- Strategy Configuration ---
    timeframe = '4h'
    minimal_roi = {"0": 1.0}
    stoploss = -0.99
    use_custom_stoploss = True

    def populate_indicators(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        dataframe['adx'] = ta.ADX(dataframe, timeperiod=self.adx_period.value)
        bollinger = qtpylib.bollinger_bands(qtpylib.typical_price(dataframe), window=self.bb_period.value, stds=self.bb_stddev.value)
        dataframe['bb_lowerband'] = bollinger['lower']
        dataframe['bb_middleband'] = bollinger['mid']
        dataframe['bb_upperband'] = bollinger['upper']
        dataframe['ema_short'] = ta.EMA(dataframe, timeperiod=self.ema_short_period.value)
        dataframe['ema_long'] = ta.EMA(dataframe, timeperiod=self.ema_long_period.value)
        dataframe['rsi'] = ta.RSI(dataframe)
        dataframe['atr'] = ta.ATR(dataframe, timeperiod=14)
        dataframe['ema_200'] = ta.EMA(dataframe, timeperiod=200)
        dataframe['bb_width'] = (dataframe['bb_upperband'] - dataframe['bb_middleband']) / dataframe['bb_middleband']
        dataframe['bb_width_rolling_mean'] = dataframe['bb_width'].rolling(48).mean()
        dataframe['volume_mean_slow'] = dataframe['volume'].rolling(window=30).mean()
        return dataframe

    def custom_stoploss(self, pair: str, trade: 'Trade', current_time: 'datetime',
                            current_rate: float, current_profit: float, **kwargs) -> float:
        if not self.dp:
            return -0.99
        
        if trade.enter_tag == 'breakout':
            return -0.02

        elif trade.enter_tag == 'trend':
            dataframe, _ = self.dp.get_analyzed_dataframe(pair, self.timeframe)
            entry_candle = dataframe.loc[dataframe['date'] == trade.open_date_utc]
            if entry_candle.empty: return -0.99
            entry_atr = entry_candle['atr'].iat[0]
            stop_price = trade.open_rate - (entry_atr * self.atr_multiplier.value)
            return (stop_price / trade.open_rate) - 1.0

        return -0.99

    def custom_exit(self, pair: str, trade: Trade, current_time: 'datetime', current_rate: float,
                        current_profit: float, **kwargs):
        dataframe, _ = self.dp.get_analyzed_dataframe(pair, self.timeframe)
        last_candle = dataframe.iloc[-1].squeeze()

        if current_profit > 0:
            if last_candle['rsi'] < 50:
                return 'rsi_profit_take'

            if trade.enter_tag == 'trend':
                stop_price = current_rate - (last_candle['atr'] * self.atr_multiplier.value)
                new_stop_loss = (stop_price / trade.open_rate) - 1.0
                return new_stop_loss
        return None
    
    def populate_entry_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        
        # --- Timeframe-Specific Parameter Adjustments ---
        if self.timeframe == '4h':
            # For 4h, we need different thresholds.
            # Breakouts need a QUIETER market, so a lower ADX.
            breakout_adx_threshold = 20
            # Trends need a STRONGER signal, so a higher ADX.
            trend_adx_threshold = 30
        else:
            # Default values for 1h timeframe
            breakout_adx_threshold = self.adx_threshold.value
            trend_adx_threshold = self.adx_threshold.value

        # --- SUB-STRATEGY 1: VOLATILITY BREAKOUT LOGIC ---
        breakout_conditions = []
        breakout_conditions.append(dataframe['adx'] < breakout_adx_threshold) # Using timeframe-specific value
        breakout_conditions.append(dataframe['bb_width'] < dataframe['bb_width_rolling_mean'] * 0.5)
        breakout_conditions.append(dataframe['rsi'] > 60)
        breakout_conditions.append(qtpylib.crossed_above(dataframe['close'], dataframe['bb_upperband']))
        breakout_conditions.append(dataframe['volume'] > dataframe['volume'].rolling(5).mean() * 2)
        
        if breakout_conditions:
            dataframe.loc[reduce(operator.and_, breakout_conditions), ['enter_long', 'enter_tag']] = (1, 'breakout')

        # --- SUB-STRATEGY 2: TREND FOLLOWING LOGIC ---
        trend_conditions = []
        trend_conditions.append(dataframe['close'] > dataframe['ema_200'])
        trend_conditions.append(dataframe['ema_short'] > dataframe['ema_long'])  
        trend_conditions.append(dataframe['adx'] > trend_adx_threshold) # Using timeframe-specific value
        trend_conditions.append(dataframe['rsi'].shift(1) < 45)
        trend_conditions.append(dataframe['rsi'] > dataframe['rsi'].shift(1))
        trend_conditions.append((dataframe['close'] / dataframe['ema_short']) < 1.015)
        trend_conditions.append(qtpylib.crossed_above(dataframe['close'], dataframe['ema_short']))
        trend_conditions.append(dataframe['bb_width'] < (dataframe['bb_width_rolling_mean'] * 2.0))
        trend_conditions.append(dataframe['volume_mean_slow'] > 0)
        
        if metadata['pair'] == 'BTC/USDT':
            trend_conditions.append(dataframe['adx'] >= 35) # Adjusted for 4h
            trend_conditions.append(dataframe['rsi'] < 75) 
        else:
            trend_conditions.append(dataframe['rsi'] < 70) 

        if trend_conditions:
            dataframe.loc[reduce(operator.and_, trend_conditions), ['enter_long', 'enter_tag']] = (1, 'trend')

        return dataframe

    
    def populate_exit_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        dataframe['exit_long'] = 0
        return dataframe