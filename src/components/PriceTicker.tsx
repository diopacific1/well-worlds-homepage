import React from 'react';
import { useUpbitTicker } from '../hooks/useUpbitTicker';
import { nameMap } from './CoinCard';

export const PriceTicker = () => {
  const { prices } = useUpbitTicker();
  const codes = ['KRW-BTC', 'KRW-ETH', 'KRW-SOL', 'KRW-XRP', 'KRW-DOGE'];

  const renderTickerItems = () => (
    codes.map(code => {
      const ticker = prices[code];
      if (!ticker) {
        return (
          <div key={code} className="flex items-center gap-2 text-sm font-mono text-on-surface-variant mx-4">
             <span className="font-bold">{nameMap[code]}</span>
             <span>로딩중...</span>
          </div>
        );
      }
      
      const isUp = ticker.change === 'RISE';
      const isDown = ticker.change === 'FALL';
      const colorClass = isUp ? 'text-green-500' : isDown ? 'text-red-500' : 'text-gray-500';

      return (
        <div key={code} className="flex items-center gap-3 text-sm font-mono mx-6 whitespace-nowrap">
          <span className="font-bold text-on-surface">{nameMap[code]}</span>
          <span className={`${colorClass} font-semibold transition-colors duration-300`}>
            ₩{ticker.trade_price.toLocaleString()}
          </span>
          <span className={`${colorClass} text-xs px-1.5 py-0.5 rounded ${isUp ? 'bg-green-500/10' : isDown ? 'bg-red-500/10' : 'bg-gray-500/10'}`}>
            {isUp ? '▲' : isDown ? '▼' : '-'} {(ticker.signed_change_rate * 100).toFixed(2)}%
          </span>
        </div>
      );
    })
  );

  return (
    <div className="w-full bg-surface-container-lowest border-b border-outline/20 py-2.5 overflow-hidden flex relative z-10 shadow-sm">
      <div className="flex animate-[ticker_30s_linear_infinite] hover:[animation-play-state:paused] pointer-events-auto">
        {renderTickerItems()}
        {/* Duplicate items for seamless continuous scrolling */}
        <div className="mx-6 w-px h-4 bg-outline/30"></div>
        {renderTickerItems()}
        <div className="mx-6 w-px h-4 bg-outline/30"></div>
        {renderTickerItems()}
      </div>
    </div>
  );
};
