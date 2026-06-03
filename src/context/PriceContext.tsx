import React, { createContext, useState, useEffect, useRef } from 'react';
import { upbitSocket, TickerData } from '../services/upbitSocket';

export const PriceContext = createContext<{ 
  prices: Record<string, TickerData>; 
  status: string;
}>({ 
  prices: {}, 
  status: 'DISCONNECTED' 
});

export const PriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prices, setPrices] = useState<Record<string, TickerData>>({});
  const [status, setStatus] = useState<string>('DISCONNECTED');
  
  // Track mount status deeply to avoid state updates on unmounted components
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    
    // Connect to WebSocket purely once per component mount (React 18 StrictMode safe)
    upbitSocket.connect();
    
    const handleUpdate = (ticker: TickerData) => {
      if (!isMounted.current) return;
      setPrices(prev => ({ 
        ...prev, 
        [ticker.code]: ticker 
      }));
    };
    
    const handleStatus = (newStatus: string) => {
      if (!isMounted.current) return;
      setStatus(newStatus);
    };

    upbitSocket.subscribe(handleUpdate);
    upbitSocket.subscribeStatus(handleStatus);
    
    // Initial status set
    setStatus(upbitSocket.status);

    return () => {
      isMounted.current = false;
      upbitSocket.unsubscribe(handleUpdate);
      upbitSocket.unsubscribeStatus(handleStatus);
      upbitSocket.disconnect(); // Disconnect cleanly on unmount (solves StrictMode dupe issues if any)
    };
  }, []);

  return (
    <PriceContext.Provider value={{ prices, status }}>
      {children}
    </PriceContext.Provider>
  );
};
