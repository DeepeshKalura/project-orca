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


class TrendRunner(IStrategy):
    """
    Final Optimized Strategy: Trend Runner
    - This strategy focuses SOLELY on the proven, high-performance trend-following logic.
    - Breakout logic has been permanently removed based on extensive testing.
    - All risk is controlled by a single, tunable 'atr_multiplier' parameter.
    """

    def __init__(self, config: dict) -> None:
        super().__init__(config)
        self.dp = None

    # --- Strategy Hyperparameters ---
    adx_period = IntParameter(10, 20, default=14, space='buy', optimize=True)
    adx_threshold = IntParameter(20, 30, default=25, space='buy', optimize=True)
    bb_period = IntParameter(20, 40, default=20, space='buy', optimize=True)
    bb_stddev = DecimalParameter(1.5, 2.5, default=2.0, space='buy', optimize=True)
    ema_short_period = IntParameter(10, 30, default=21, space='buy', optimize=True)
    ema_long_period = IntParameter(40, 60, default=50, space='buy', optimize=True)
    
    # We are setting the default to 2.9, based on our previous best Profit Factor.
    # This is the key lever to adjust for higher profits.
    atr_multiplier = DecimalParameter(2.0, 5.0, default=2.828, space='sell', optimize=True)

    # --- Strategy Configuration ---
    timeframe = '1h'
    minimal_roi = {"0": 1.0}
    stoploss = -0.99
    use_custom_stoploss = True

    def populate_indicators(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        dataframe['adx'] = ta.ADX(dataframe, timeperiod=self.adx_period.value)
        bollinger = qtpylib.bollinger_bands(qtpylib.typical_price(dataframe), window=self.bb_period.value, stds=self.bb_stddev.value)
        dataframe['bb_middleband'] = bollinger['mid']
        dataframe['ema_short'] = ta.EMA(dataframe, timeperiod=self.ema_short_period.value)
        dataframe['ema_long'] = ta.EMA(dataframe, timeperiod=self.ema_long_period.value)
        dataframe['rsi'] = ta.RSI(dataframe)
        dataframe['atr'] = ta.ATR(dataframe, timeperiod=14)
        dataframe['ema_200'] = ta.EMA(dataframe, timeperiod=200)
        dataframe['bb_width'] = (bollinger['upper'] - bollinger['lower']) / bollinger['mid']
        dataframe['bb_width_rolling_mean'] = dataframe['bb_width'].rolling(48).mean()
        dataframe['volume_mean_slow'] = dataframe['volume'].rolling(window=30).mean()
        return dataframe

    def custom_stoploss(self, pair: str, trade: 'Trade', current_time: 'datetime',
                            current_rate: float, current_profit: float, **kwargs) -> float:
        dataframe, _ = self.dp.get_analyzed_dataframe(pair, self.timeframe)
        entry_candle = dataframe.loc[dataframe['date'] == trade.open_date_utc]
        if entry_candle.empty: return -0.99
        entry_atr = entry_candle['atr'].iat[0]
        stop_price = trade.open_rate - (entry_atr * self.atr_multiplier.value)
        return (stop_price / trade.open_rate) - 1.0

    def custom_exit(self, pair: str, trade: Trade, current_time: 'datetime', current_rate: float,
                        current_profit: float, **kwargs):
        dataframe, _ = self.dp.get_analyzed_dataframe(pair, self.timeframe)
        last_candle = dataframe.iloc[-1].squeeze()

        if current_profit > 0:
            # Universal RSI-based profit take
            if last_candle['rsi'] < 50:
                return 'rsi_profit_take'

            # Dynamic ATR trailing stop
            stop_price = current_rate - (last_candle['atr'] * self.atr_multiplier.value)
            new_stop_loss = (stop_price / trade.open_rate) - 1.0
            return new_stop_loss
        return None
    
    def populate_entry_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        conditions = []
        conditions.append(dataframe['close'] > dataframe['ema_200'])
        conditions.append(dataframe['ema_short'] > dataframe['ema_long'])
        conditions.append(dataframe['adx'] > self.adx_threshold.value)
        conditions.append(dataframe['rsi'].shift(1) < 45)
        conditions.append(dataframe['rsi'] > dataframe['rsi'].shift(1))
        conditions.append((dataframe['close'] / dataframe['ema_short']) < 1.015)
        conditions.append(qtpylib.crossed_above(dataframe['close'], dataframe['ema_short']))
        conditions.append(dataframe['bb_width'] < (dataframe['bb_width_rolling_mean'] * 2.0))
        conditions.append(dataframe['volume_mean_slow'] > 0)
        
        if metadata['pair'] == 'BTC/USDT':
            conditions.append(dataframe['adx'] >= 30)
            conditions.append(dataframe['rsi'] < 75)
        else:
            conditions.append(dataframe['rsi'] < 70)

        if conditions:
            dataframe.loc[reduce(operator.and_, conditions), ['enter_long', 'enter_tag']] = (1, 'trend')

        return dataframe
    
    def populate_exit_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        dataframe['exit_long'] = 0
        return dataframe