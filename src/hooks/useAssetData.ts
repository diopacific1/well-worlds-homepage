import { useState, useEffect } from "react";

interface CryptoData {
  price: string;
  trend: string;
  marketCap: string;
  volume: string;
  high24h: string;
  low24h: string;
  rsi: string;
  ma50: string;
  ma200: string;
  sentimentScore: number;
  sentimentStatus: string;
  analysis: string;
  candles: { open: number; high: number; low: number; close: number; volume?: number }[];
  dataSource?: string;
}

export function useAssetData(activeCoinId: string, timeframe: "1H" | "1D" | "1W", type: "crypto" | "stock", refreshCount: number) {
  const [data, setData] = useState<CryptoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchController = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const cacheKey = `asset_data_v2_${type}_${activeCoinId}_${timeframe}`;
      const cachedData = sessionStorage.getItem(cacheKey);
      const now = Date.now();

      if (cachedData) {
        try {
          const { timestamp, data: parsedData } = JSON.parse(cachedData);
          if (now - timestamp < 10000 && refreshCount === 0) {
            if (isMounted) {
              setData(parsedData);
              setLoading(false);
            }
            return;
          }
        } catch (e) {
          console.error("Cache parsing error", e);
        }
      }

      try {
        const response = await fetch(`/api/${type}?id=${activeCoinId}&timeframe=${timeframe}`, {
          signal: fetchController.signal,
        });
        
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const json = await response.json();
        
        if (json.error) {
          throw new Error(json.error);
        }

        if (isMounted) {
          sessionStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data: json }));
          setData(json);
          setLoading(false);
        }
      } catch (err: any) {
        if (err.name !== "AbortError" && isMounted) {
          console.error("API Error:", err.message);
          setError(err.message);
          setData(null);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      fetchController.abort();
    };
  }, [activeCoinId, timeframe, type, refreshCount]);

  return { data, loading, error };
}
