const fs = require('fs');
let code = fs.readFileSync('src/pages/CryptoDashboard.tsx', 'utf8');

const target1 = `  const processedChartData = useMemo(() => {
    const candles = getCandles();
    const rawChartData = candles.map((candle: { open: number; high: number; low: number; close: number; volume?: number }, i: number) => {`;
const target2 = `  const candles = getCandles();
  const rawChartData = candles.map((candle: { open: number; high: number; low: number; close: number; volume?: number }, i: number) => {`;

if (code.includes(target1)) {
    code = code.replace(target1, target2);
}

const target3 = `    return rawChartData.map((item, i: number) => {`;
const target4 = `  const processedChartData = rawChartData.map((item, i: number) => {`;
if (code.includes(target3)) {
    code = code.replace(target3, target4);
}

const target5 = `      return {
        ...item,
        ma5: i >= 4 ? ma5 : undefined,
        ma10: i >= 9 ? ma10 : undefined,
      };
    });
  }, [cryptoData?.candles, timeframe, activeCoinId]);`;
const target6 = `      return {
        ...item,
        ma5: i >= 4 ? ma5 : undefined,
        ma10: i >= 9 ? ma10 : undefined,
      };
    });`;

if (code.includes(target5)) {
    code = code.replace(target5, target6);
}
fs.writeFileSync('src/pages/CryptoDashboard.tsx', code);
