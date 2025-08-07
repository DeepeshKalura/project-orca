# --- ScorpionStrike.py (Final All-in-One Version) ---
# A self-contained tool for a single, high-leverage, manually-configured trade.

import os
from freqtrade.strategy import IStrategy, DecimalParameter
from pandas import DataFrame
from freqtrade.persistence import Trade
import talib.abstract as ta

class ScorpionStrike(IStrategy):
    
    # === MANUAL TRADE CONFIGURATION ===
    #
    # 1. Set your target pair
    MANUAL_TARGET_PAIR = 'SOL/USDT:USDT'
    # 2. Set your trade direction ('long' or 'short')
    MANUAL_TRADE_SIDE = 'long'
    # 3. Set your absolute stop-loss price
    MANUAL_STOP_PRICE = 162.50
    #
    # =================================

    # --- Strategy Configuration ---
    timeframe = '1h'
    stoploss = -0.99
    can_short = True

    # --- Hyperparameters ---
    # This now ONLY controls the trailing stop when in profit.
    atr_multiplier = DecimalParameter(3.0, 8.0, default=5.0, space='sell')

    def populate_indicators(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        dataframe['atr'] = ta.ATR(dataframe, timeperiod=14)
        return dataframe

    def populate_entry_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        # The entry signal is now read from the internal configuration.
        if metadata['pair'] == self.MANUAL_TARGET_PAIR:
            if self.MANUAL_TRADE_SIDE == 'long':
                dataframe.loc[dataframe.index[-1], ['enter_long', 'enter_tag']] = (1, f'strike_{self.MANUAL_STOP_PRICE}')
            elif self.MANUAL_TRADE_SIDE == 'short':
                 dataframe.loc[dataframe.index[-1], ['enter_short', 'enter_tag']] = (1, f'strike_{self.MANUAL_STOP_PRICE}')
        return dataframe

    def populate_exit_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        return dataframe

    def custom_stake_amount(self, pair: str, current_time, current_rate: float,
                            proposed_stake: float, min_stake: float, max_stake: float,
                            leverage: float, entry_tag: str, side: str, **kwargs) -> float:
        RISK_PER_TRADE_USD = 20.0
        stop_price = float(entry_tag.split('_')[1])
        stoploss_distance = abs(current_rate - stop_price)
        if stoploss_distance == 0: return 0
        position_size_coins = RISK_PER_TRADE_USD / stoploss_distance
        stake_amount_usd = position_size_coins * current_rate
        return stake_amount_usd

    def custom_stoploss(self, pair: str, trade: 'Trade', current_time,
                        current_rate: float, current_profit: float, **kwargs) -> float:
        stop_price = float(trade.enter_tag.split('_')[1])
        initial_stop = (stop_price / trade.open_rate) - 1.0

        if current_profit > 0:
            dataframe, _ = self.dp.get_analyzed_dataframe(pair, self.timeframe)
            last_candle_atr = dataframe.iloc[-1]['atr']
            trailing_stop_price = current_rate - (last_candle_atr * self.atr_multiplier.value)
            trailing_stop_relative = (trailing_stop_price / trade.open_rate) - 1.0
            return max(initial_stop, trailing_stop_relative)

        return initial_stop

    def leverage(self, pair: str, current_time, current_rate: float,
                 proposed_leverage: float, max_leverage: float, entry_tag: str, side: str,
                 **kwargs) -> float:
        return max_leverage