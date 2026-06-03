import { useContext } from 'react';
import { PriceContext } from '../context/PriceContext';

export const useUpbitTicker = () => {
  const context = useContext(PriceContext);
  if (!context) {
    throw new Error('useUpbitTicker must be used within a PriceProvider');
  }
  return context;
};
