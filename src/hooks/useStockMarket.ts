import { useState, useEffect } from 'react';
import { StockData } from '../components/StockCard';

export const useStockMarket = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [status, setStatus] = useState<'CONNECTED' | 'RECONNECTING' | 'DISCONNECTED'>('RECONNECTING');

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const fetchMarketData = async () => {
      try {
        const res = await fetch('/api/stock/market');
        if (!res.ok) throw new Error('API Error');
        const data = await res.json();
        if (data.stocks) {
          setStocks(data.stocks);
          setStatus('CONNECTED');
        } else {
          setStatus('DISCONNECTED');
        }
      } catch (err) {
        console.error(err);
        setStatus('DISCONNECTED');
      }
    };

    fetchMarketData();
    intervalId = setInterval(fetchMarketData, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId);
  }, []);

  return { stocks, status };
};
