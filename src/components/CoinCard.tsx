import React from 'react';
import { TickerData } from '../services/upbitSocket';

export const nameMap: Record<string, string> = {
  'KRW-BTC': '비트코인',
  'KRW-ETH': '이더리움',
  'KRW-XRP': '리플',
  'KRW-SOL': '솔라나',
  'KRW-DOGE': '도지코인',
};

export const CoinCard = ({ ticker, code }: { ticker?: TickerData, code: string }) => {
  if (!ticker) {
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

  const isUp = ticker.change === 'RISE';
  const isDown = ticker.change === 'FALL';
  
  // 상승: Red(Upbit standard) vs Green(Global)? 
  // User Prompt: "상승: 녹색, 하락: 빨간색, 보합: 회색" 
  // Very explicitly asked for Green=Up, Red=Down
  const colorClass = isUp ? 'text-green-500' : isDown ? 'text-red-500' : 'text-gray-500';
  const bgColorClass = isUp ? 'bg-green-500/10' : isDown ? 'bg-red-500/10' : 'bg-gray-500/10';

  return (
    <div className="card p-6 flex flex-col justify-between hover:shadow-lg transition-all border border-outline/20 group">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-on-surface">{nameMap[code] || code.replace('KRW-', '')}</h3>
          <span className="text-[10px] text-on-surface-variant font-mono">{code.replace('KRW-', '')}</span>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-md ${bgColorClass} ${colorClass}`}>
          {isUp ? '+' : ''}{(ticker.signed_change_rate * 100).toFixed(2)}%
        </span>
      </div>
      <div>
        <div className={`text-2xl font-mono font-bold tracking-tight ${colorClass} group-hover:scale-[1.02] transition-transform origin-left`}>
          ₩{ticker.trade_price.toLocaleString()}
        </div>
        <div className="text-xs text-on-surface-variant mt-2 font-medium">
          거래대금: <span className="font-mono">₩{Math.floor(ticker.acc_trade_price_24h / 1000000).toLocaleString()}백만</span>
        </div>
      </div>
    </div>
  );
};
