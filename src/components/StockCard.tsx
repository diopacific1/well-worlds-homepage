import React from 'react';

export interface StockData {
  code: string;
  name: string;
  price: number;
  prevPrice: number;
  change: number;
  changeRate: number;
  volume: number;
  tradingValue: number;
}

export const StockCard = ({ stock, onClick }: { stock?: StockData, onClick?: () => void }) => {
  if (!stock) {
    return (
      <div className="card p-6 flex flex-col gap-2 animate-pulse w-full border border-outline/20">
         <div className="flex justify-between items-center mb-2">
           <div className="h-5 bg-surface-dim rounded w-20"></div>
           <div className="h-5 bg-surface-dim rounded w-12"></div>
         </div>
         <div className="h-8 bg-surface-dim rounded w-32"></div>
         <div className="h-4 bg-surface-dim rounded w-24 mt-1"></div>
      </div>
    );
  }

  const isUp = stock.changeRate > 0;
  const isDown = stock.changeRate < 0;
  
  // Korean Stock Market Palette: Red for Rise, Blue for Fall
  const colorClass = isUp ? 'text-[#E13030]' : isDown ? 'text-[#1261C4]' : 'text-gray-500';
  const bgColorClass = isUp ? 'bg-[#E13030]/10' : isDown ? 'bg-[#1261C4]/10' : 'bg-gray-500/10';

  return (
    <div className="card p-6 flex flex-col justify-between hover:shadow-lg transition-all border border-outline/20 group cursor-pointer h-full" onClick={onClick}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-on-surface line-clamp-1">{stock.name}</h3>
          <span className="text-[10px] text-on-surface-variant font-mono">{stock.code}</span>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-md ${bgColorClass} ${colorClass} shrink-0`}>
          {isUp ? '+' : ''}{stock.changeRate.toFixed(2)}%
        </span>
      </div>
      <div>
        <div className={`text-2xl font-mono font-bold tracking-tight ${colorClass} group-hover:scale-[1.02] transition-transform origin-left`}>
          ₩{stock.price.toLocaleString()}
        </div>
        <div className="text-xs text-on-surface-variant mt-2 font-medium">
          거래대금: <span className="font-mono">₩{Math.floor(stock.tradingValue / 1000000).toLocaleString()}백만</span>
        </div>
      </div>
    </div>
  );
};
