const fs = require('fs');
let code = fs.readFileSync('src/pages/CryptoDashboard.tsx', 'utf8');

const target1 = `  const footerLabels = [
    processedChartData[0]?.time || "",
    processedChartData[3]?.time || "",
    processedChartData[6]?.time || "",
    processedChartData[9]?.time || "",
    processedChartData[11]?.time || "실시간"
  ];

  const lows = processedChartData.map((d) => d.low);
  const highs = processedChartData.map((d) => d.high);
  const minLow = lows.length > 0 ? Math.min(...lows) : 0;
  const maxHigh = highs.length > 0 ? Math.max(...highs) : 100;
  const chartDomain = [minLow * 0.997, maxHigh * 1.003];`;

const replace1 = `  const footerLabels = useMemo(() => [
    processedChartData[0]?.time || "",
    processedChartData[3]?.time || "",
    processedChartData[6]?.time || "",
    processedChartData[9]?.time || "",
    processedChartData[11]?.time || "실시간"
  ], [processedChartData]);

  const chartDomain = useMemo(() => {
    const lows = processedChartData.map((d) => d.low);
    const highs = processedChartData.map((d) => d.high);
    const minLow = lows.length > 0 ? Math.min(...lows) : 0;
    const maxHigh = highs.length > 0 ? Math.max(...highs) : 100;
    return [minLow * 0.997, maxHigh * 1.003];
  }, [processedChartData]);`;

if (code.includes(target1)) {
    code = code.replace(target1, replace1);
} else {
    console.log('could not find target1');
}

fs.writeFileSync('src/pages/CryptoDashboard.tsx', code);
