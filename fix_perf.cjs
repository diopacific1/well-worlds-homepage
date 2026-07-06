const fs = require('fs');
let code = fs.readFileSync('src/pages/CryptoDashboard.tsx', 'utf8');

const target1 = `  const candles = getCandles();
  const rawChartData = candles.map((candle: { open: number; high: number; low: number; close: number; volume?: number }, i: number) => {`;
const replace1 = `  const processedChartData = useMemo(() => {
    const candles = getCandles();
    const rawChartData = candles.map((candle: { open: number; high: number; low: number; close: number; volume?: number }, i: number) => {`;

code = code.replace(target1, replace1);

const target2 = `  const processedChartData = rawChartData.map((item, i: number) => {`;
const replace2 = `    return rawChartData.map((item, i: number) => {`;

code = code.replace(target2, replace2);

const target3 = `    return {
      ...item,
      ma5: i >= 4 ? ma5 : undefined,
      ma10: i >= 9 ? ma10 : undefined,
    };
  });`;
const replace3 = `      return {
        ...item,
        ma5: i >= 4 ? ma5 : undefined,
        ma10: i >= 9 ? ma10 : undefined,
      };
    });
  }, [cryptoData?.candles, timeframe, activeCoinId]);`;

code = code.replace(target3, replace3);

fs.writeFileSync('src/pages/CryptoDashboard.tsx', code);
console.log('Optimized CryptoDashboard chart data processing');
