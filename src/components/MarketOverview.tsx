import React from 'react';
import { useUpbitTicker } from '../hooks/useUpbitTicker';
import { CoinCard } from './CoinCard';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export const MarketOverview = () => {
  const { prices, status } = useUpbitTicker();
  const codes = ['KRW-BTC', 'KRW-ETH', 'KRW-SOL', 'KRW-XRP', 'KRW-DOGE'];

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-on-surface">실시간 마켓 동향</h2>
          <p className="text-sm text-on-surface-variant mt-1">업비트(Upbit) 실시간 시세 (KRW 마켓)</p>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-2 bg-surface-container-lowest border border-outline/20 rounded-full shadow-sm w-fit">
          <span className="relative flex h-3 w-3">
            {status === 'CONNECTED' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${
              status === 'CONNECTED' ? 'bg-green-500' : 
              status === 'RECONNECTING' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></span>
          </span>
          <span className="text-xs font-mono font-bold text-on-surface-variant flex items-center gap-1.5">
            {status === 'CONNECTED' && <><Wifi className="w-3.5 h-3.5" /> 실시간 연결됨</>}
            {status === 'RECONNECTING' && <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> 연결 재시도 중...</>}
            {status === 'DISCONNECTED' && <><WifiOff className="w-3.5 h-3.5" /> 연결 끊김</>}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {codes.map(code => (
          <CoinCard key={code} code={code} ticker={prices[code]} />
        ))}
      </div>
    </div>
  );
};
