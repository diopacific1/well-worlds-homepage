const fs = require('fs');

function refactorChart(file, marketType) {
  let content = fs.readFileSync(file, 'utf8');

  // Add Suspense and lazy imports if not there
  if (!content.includes('import { Suspense, lazy }')) {
    content = content.replace(
      'import { useState, FormEvent, useEffect, useMemo, useRef, useCallback } from "react";',
      'import { useState, FormEvent, useEffect, useMemo, useRef, useCallback, Suspense, lazy } from "react";'
    );
  }

  // Add AssetChart lazy import
  if (!content.includes('const AssetChart = lazy')) {
    content = content.replace(
      'import { Helmet } from "react-helmet-async";',
      'import { Helmet } from "react-helmet-async";\nconst AssetChart = lazy(() => import("../components/dashboard/AssetChart"));'
    );
  }

  // Remove recharts imports
  content = content.replace(/import\s*\{[\s\S]*?\}\s*from\s*"recharts";/m, '');

  // Remove CandlestickShape (which I already copied over)
  content = content.replace(/interface CandlestickProps \{[\s\S]*?const CandlestickShape = \(props: CandlestickProps\) => \{[\s\S]*?\}\s*\};\s*\}\s*;/m, ''); // Wait, regex for the component might be hard to match precisely without parsing.

  // Let's replace CandlestickShape and interface CandlestickProps more carefully.
  content = content.replace(/interface CandlestickProps \{[\s\S]*?x\?: number;[\s\S]*?y\?: number;[\s\S]*?width\?: number;[\s\S]*?height\?: number;[\s\S]*?payload\?: any;[\s\S]*?\}[\s\S]*?const CandlestickShape = \(props: CandlestickProps\) => \{[\s\S]*?return \([\s\S]*?<g>[\s\S]*?<\/g>\s*\);\s*\};/m, '');
  
  // Replace the ComposedChart JSX block
  // We can just find `<ResponsiveContainer width="100%" height="100%">` down to `</ResponsiveContainer>` and replace it
  const chartBlockRegex = /<ResponsiveContainer width="100%" height="100%">[\s\S]*?<\/ResponsiveContainer>/m;
  const lazyChartStr = `<Suspense fallback={<div className="w-full h-full flex items-center justify-center text-on-surface-variant"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div></div>}>
                      <AssetChart
                        data={processedChartData}
                        domain={chartDomain}
                        timeframe={timeframe}
                        marketType="${marketType}"
                      />
                    </Suspense>`;
  
  content = content.replace(chartBlockRegex, lazyChartStr);

  fs.writeFileSync(file, content);
}

refactorChart('src/pages/CryptoDashboard.tsx', 'crypto');
refactorChart('src/pages/StockDashboard.tsx', 'stock');

