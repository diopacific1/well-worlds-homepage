import React from 'react';
import { useStockMarket } from '../hooks/useStockMarket';

export const StockPriceTicker = React.memo(() => {
  const { stocks } = useStockMarket();
  const codes = ['005930', '000660', '005380', '035420', '035720'];

  const renderTickerItems = () => {
    if (stocks.length === 0) {
      const nameMap: Record<string, string> = {
        '005930': '삼성전자',
        '000660': 'SK하이닉스',
        '005380': '현대차',
        '035420': 'NAVER',
        '035720': '카카오'
      };
      return codes.map(code => (
        <div key={code} className="flex items-center gap-2 text-sm font-mono text-on-surface-variant mx-4">
           <span className="font-bold">{nameMap[code]}</span>
           <span>로딩중...</span>
        </div>
      ));
    }
    
    return stocks.map(stock => {
      const isUp = stock.changeRate > 0;
      const isDown = stock.changeRate < 0;
      const colorClass = isUp ? 'text-[#E13030]' : isDown ? 'text-[#1261C4]' : 'text-gray-500';
      
      return (
        <div key={stock.code} className="flex items-center gap-3 text-sm font-mono mx-6 whitespace-nowrap">
          <span className="font-bold text-on-surface">{stock.name}</span>
          <span className={`${colorClass} font-semibold transition-colors duration-300`}>
            ₩{stock.price.toLocaleString()}
          </span>
          <span className={`${colorClass} text-xs px-1.5 py-0.5 rounded ${isUp ? 'bg-[#E13030]/10' : isDown ? 'bg-[#1261C4]/10' : 'bg-gray-500/10'}`}>
            {isUp ? '▲' : isDown ? '▼' : '-'} {stock.changeRate.toFixed(2)}%
          </span>
        </div>
      );
    });
  };

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
});
