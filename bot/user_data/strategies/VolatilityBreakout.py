# --- Do not remove these libs ---
from freqtrade.strategy import IStrategy, IntParameter, DecimalParameter
from pandas import DataFrame
# Technical analysis library
import talib.abstract as ta
# Quantstart technical library
import freqtrade.vendor.qtpylib.indicators as qtpylib


class VolatilityBreakout(IStrategy):
    """
    Volatility Breakout Strategy
    
    This strategy is designed to identify periods of low volatility (a "squeeze")
    and enter a trade when the price breaks out of this consolidation period.

    How it works:
    1.  It uses Bollinger Bandwidth to identify a "squeeze" where the bands are
        unusually tight. This is a sign of low volatility.
    2.  When a squeeze is detected, it waits for the price to close above the
        upper Bollinger Band, signaling a potential upward breakout.
    3.  The exit signal is a close below the middle Bollinger Band, which acts as
        a dynamic, trailing stop-loss to let profits run and cut losses.
    """

    # --- Strategy Hyperparameters ---
    
    # These are the parameters that can be optimized by Freqtrade's hyperopt
    # The numbers below are the "default" values we specified in Phase 2.

    # Bollinger Bands
    bb_period = IntParameter(20, 40, default=23, space='buy', optimize=True)
    bb_stddev = DecimalParameter(1.5, 2.5, default=2.12, space='buy', optimize=True)
    squeeze_period = IntParameter(20, 100, default=20, space='buy', optimize=True)
    squeeze_ratio = DecimalParameter(0.20, 0.60, default=0.372, space='buy', optimize=True)


    # --- Strategy Configuration ---
    
    # The timeframe for the analysis (we chose 4-hour)
    timeframe = '4h'

    # This strategy uses a custom exit signal, so we disable ROI and standard stop-loss.
    minimal_roi = {"0": 100}  # Set to a high value to effectively disable it
    stoploss = -0.99           # Set to a high value to effectively disable it
    
    # We don't need freqtrade's native trailing stop-loss because we use a custom one
    trailing_stop = False
    
    # Process only new candles
    process_only_new_candles = True


    def populate_indicators(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        """
        Adds all the necessary indicators to the Freqtrade dataframe.
        """
        
        # --- Bollinger Bands ---
        # Calculate Bollinger Bands using the qtpylib library
        bollinger = qtpylib.bollinger_bands(qtpylib.typical_price(dataframe), 
                                            window=self.bb_period.value, 
                                            stds=self.bb_stddev.value) # <--- THIS LINE IS NOW FIXED
        dataframe['bb_lowerband'] = bollinger['lower']
        dataframe['bb_middleband'] = bollinger['mid']
        dataframe['bb_upperband'] = bollinger['upper']

        # --- Bollinger Bandwidth (for Squeeze Detection) ---
        # This measures the distance between the upper and lower bands.
        dataframe['bb_width'] = (dataframe['bb_upperband'] - dataframe['bb_lowerband']) / dataframe['bb_middleband']

        # --- Squeeze Threshold ---
        # This calculates the value below which we consider the market to be "squeezed".
        # For example, a squeeze_ratio of 0.25 means we are looking for a bb_width
        # in the bottom 25% of its values over the last `squeeze_period` candles.
        dataframe['bb_width_quantile'] = dataframe['bb_width'].rolling(self.squeeze_period.value).quantile(self.squeeze_ratio.value)

        return dataframe

    def populate_entry_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        """
        Defines the conditions for entering a LONG (buy) trade.
        """
        
        # --- Conditions for Entry ---
        
        # Condition 1: The market is in a "squeeze".
        squeeze_condition = (
            dataframe['bb_width'] < dataframe['bb_width_quantile']
        )

        # Condition 2: The price has broken out above the upper band.
        breakout_condition = (
            qtpylib.crossed_above(dataframe['close'], dataframe['bb_upperband'])
        )

        # The final condition to enter a trade is when BOTH of the above are true.
        dataframe.loc[
            (
                squeeze_condition &
                breakout_condition
            ),
            'enter_long'] = 1  # Set the 'enter_long' column to 1 (meaning "BUY")

        return dataframe

    def populate_exit_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        """
        Defines the conditions for exiting a trade.
        """
        
        # --- Condition for Exit ---
        # We exit the trade if the price closes below the middle Bollinger Band.
        # This acts as our dynamic stop-loss and take-profit mechanism.
        exit_condition = (
            qtpylib.crossed_below(dataframe['close'], dataframe['bb_middleband'])
        )

        # The final condition to exit a trade.
        dataframe.loc[
            (
                exit_condition
            ),
            'exit_long'] = 1  # Set the 'exit_long' column to 1 (meaning "SELL")
            
        return dataframe