const fs = require('fs');
let code = fs.readFileSync('src/pages/CryptoDashboard.tsx', 'utf8');

// 1. Add search dropdown state and autocomplete results
const importLine = `import { useState, FormEvent, useEffect, useMemo } from "react";`;
const newImportLine = `import { useState, FormEvent, useEffect, useMemo, useRef } from "react";`;
code = code.replace(importLine, newImportLine);

const stateHookLine = `  const [activeCoinId, setActiveCoinId] = useState("bitcoin");`;
const newStateHookLine = `  const [activeCoinId, setActiveCoinId] = useState("bitcoin");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchInputRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = useMemo(() => {
    if (!debouncedSearchTerm) return [];
    const term = debouncedSearchTerm.toLowerCase().trim();
    const results: string[] = [];
    for (const [id, keywords] of Object.entries(SEARCH_MAPPINGS)) {
      if (keywords.some((k) => k.toLowerCase().includes(term) || id.includes(term))) {
        results.push(id);
      }
    }
    return results;
  }, [debouncedSearchTerm]);`;
code = code.replace(stateHookLine, newStateHookLine);

// Update search UI
const searchUI = `            <div className="flex-1 max-w-2xl relative w-full">
              <label htmlFor="cryptoSearch" className="sr-only">
                검색어 입력
              </label>
              <Search
                className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="cryptoSearch"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="시장, 자산 검색 (예: 리플, 도지코인, 비트코인)"
                className="w-full input-field !pl-12 font-mono uppercase"
                aria-label="시장, 자산 검색"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary/10 text-primary rounded-md text-xs font-bold hover:bg-primary/20 transition-colors"
                aria-label="검색 실행"
              >
                검색
              </button>
            </div>`;

const newSearchUI = `            <div className="flex-1 max-w-2xl relative w-full" ref={searchInputRef}>
              <label htmlFor="cryptoSearch" className="sr-only">
                검색어 입력
              </label>
              <Search
                className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="cryptoSearch"
                type="text"
                value={searchTerm}
                onFocus={() => setShowSearchDropdown(true)}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSearchDropdown(true);
                }}
                placeholder="시장, 자산 검색 (예: 리플, 도지코인, 비트코인)"
                className="w-full input-field !pl-12 font-mono uppercase"
                aria-label="시장, 자산 검색"
                autoComplete="off"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary/10 text-primary rounded-md text-xs font-bold hover:bg-primary/20 transition-colors"
                aria-label="검색 실행"
              >
                검색
              </button>
              
              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-outline/20 rounded-xl shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto">
                  {searchResults.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setActiveCoinId(id);
                        setSearchTerm("");
                        setShowSearchDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-surface-dim transition-colors flex items-center gap-3 border-b border-outline/5 last:border-b-0"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-[10px] font-bold uppercase overflow-hidden">
                        {id.substring(0, 3)}
                      </div>
                      <span className="font-display font-bold text-on-surface uppercase">{id}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>`;
code = code.replace(searchUI, newSearchUI);

// 2. Add volume data to chart and adjust ComposedChart
const volumeDataGen = `      return {
        open: openVal,
        high: highVal,
        low: lowVal,
        close: closeVal
      };`;
const newVolumeDataGen = `      return {
        open: openVal,
        high: highVal,
        low: lowVal,
        close: closeVal,
        volume: 1000000 + hashVal * 50000 + (Math.random() * 200000)
      };`;
code = code.replace(volumeDataGen, newVolumeDataGen);

const rawChartDataVolume = `      close: closeKRW,
      bodyRange: [Math.min(openKRW, closeKRW), Math.max(openKRW, closeKRW)],
      isUp,`;
const newRawChartDataVolume = `      close: closeKRW,
      bodyRange: [Math.min(openKRW, closeKRW), Math.max(openKRW, closeKRW)],
      volume: candle.volume * USD_TO_KRW * 100, // scaled up for visualization
      isUp,`;
code = code.replace(rawChartDataVolume, newRawChartDataVolume);

const chartComponent = `                        <YAxis 
                          domain={chartDomain}
                          tickFormatter={(v) => \`₩\${Math.round(v).toLocaleString()}\`}
                          stroke="#1E293B" 
                          fontSize={11} 
                          fontWeight={600}
                          orientation="right"
                          axisLine={false}
                          tickLine={false}
                          dx={5}
                        />`;
const newChartComponent = `                        <YAxis 
                          yAxisId="price"
                          domain={chartDomain}
                          tickFormatter={(v) => \`₩\${Math.round(v).toLocaleString()}\`}
                          stroke="#1E293B" 
                          fontSize={11} 
                          fontWeight={600}
                          orientation="right"
                          axisLine={false}
                          tickLine={false}
                          dx={5}
                        />
                        <YAxis
                          yAxisId="volume"
                          orientation="left"
                          hide
                        />`;
code = code.replace(chartComponent, newChartComponent);

const chartCandlestick = `                        <Bar
                          dataKey="bodyRange"
                          shape={<CandlestickShape />}
                        />`;
const newChartCandlestick = `                        <Bar
                          dataKey="bodyRange"
                          yAxisId="price"
                          shape={<CandlestickShape />}
                        />
                        <Bar
                          dataKey="volume"
                          yAxisId="volume"
                          fill="#94A3B8"
                          opacity={0.3}
                          barSize={8}
                        />`;
code = code.replace(chartCandlestick, newChartCandlestick);

const chartLineMa5 = `                        <Line
                          type="monotone"
                          dataKey="ma5"`;
const newChartLineMa5 = `                        <Line
                          yAxisId="price"
                          type="monotone"
                          dataKey="ma5"`;
code = code.replace(chartLineMa5, newChartLineMa5);

const chartLineMa10 = `                        <Line
                          type="monotone"
                          dataKey="ma10"`;
const newChartLineMa10 = `                        <Line
                          yAxisId="price"
                          type="monotone"
                          dataKey="ma10"`;
code = code.replace(chartLineMa10, newChartLineMa10);

// 3. MetricCard Skeleton support & Loading State
const metricCardDecl = `function MetricCard({
  label,
  value,
  unit,
  trend,
  trendUp,
  badges,
  footerText,
}: {
  label: string;
  value: string;
  unit: string;
  trend?: string;
  trendUp?: boolean;
  badges?: { text: string; isAccent?: boolean }[];
  footerText?: string;
}) {
  return (
    <div className="card min-w-[280px] p-6 relative overflow-hidden flex flex-col justify-between">`;
const newMetricCardDecl = `function MetricCard({
  label,
  value,
  unit,
  trend,
  trendUp,
  badges,
  footerText,
  isLoading,
}: {
  label: string;
  value: string;
  unit: string;
  trend?: string;
  trendUp?: boolean;
  badges?: { text: string; isAccent?: boolean }[];
  footerText?: string;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="card min-w-[280px] p-6 relative overflow-hidden flex flex-col justify-between animate-pulse">
        <div>
          <div className="w-24 h-4 bg-outline/10 rounded mb-4"></div>
          <div className="w-3/4 h-10 bg-outline/10 rounded-lg mb-2"></div>
          <div className="w-1/2 h-4 bg-outline/10 rounded mt-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card min-w-[280px] p-6 relative overflow-hidden flex flex-col justify-between">`;
code = code.replace(metricCardDecl, newMetricCardDecl);

// Pass loadingCrypto to MetricCard
const loadingOverlay = `            {loadingCrypto && (
              <div className="absolute inset-0 z-10 bg-surface/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                <span className="text-sm font-bold text-primary animate-pulse">
                  실시간 데이터 동기화 중...
                </span>
              </div>
            )}`;
code = code.replace(loadingOverlay, ``);

code = code.replace(/<MetricCard\n              label="현재 가격"/g, `<MetricCard\n              isLoading={loadingCrypto}\n              label="현재 가격"`);
code = code.replace(/<MetricCard\n              label="24H 거래대금"/g, `<MetricCard\n              isLoading={loadingCrypto}\n              label="24H 거래대금"`);
code = code.replace(/<MetricCard\n              label="시가총액"/g, `<MetricCard\n              isLoading={loadingCrypto}\n              label="시가총액"`);
code = code.replace(/<MetricCard\n              label="주요 저항선"/g, `<MetricCard\n              isLoading={loadingCrypto}\n              label="주요 저항선"`);

// 4. Portfolio quick adjust buttons (Percentage or +/-)
const portfolioButtons = `                        <div className="flex gap-2">
                          <button type="button" onClick={() => handleQuantityChange(currentQuantity * 2)} className="text-primary hover:underline font-bold">2x 두배</button>
                          <span>|</span>
                          <button type="button" onClick={() => handleQuantityChange(Math.max(0, currentQuantity / 2))} className="text-primary hover:underline font-bold">절반</button>
                        </div>`;
const newPortfolioButtons = `                        <div className="flex gap-1">
                          <button type="button" onClick={() => handleQuantityChange(Math.max(0, currentQuantity * 0.5))} className="px-1.5 py-0.5 bg-surface-dim border border-outline/10 rounded text-[9px] hover:bg-outline/10 transition-colors font-bold text-on-surface-variant">-50%</button>
                          <button type="button" onClick={() => handleQuantityChange(Math.max(0, currentQuantity * 0.9))} className="px-1.5 py-0.5 bg-surface-dim border border-outline/10 rounded text-[9px] hover:bg-outline/10 transition-colors font-bold text-on-surface-variant">-10%</button>
                          <button type="button" onClick={() => handleQuantityChange(currentQuantity * 1.1)} className="px-1.5 py-0.5 bg-surface-dim border border-outline/10 rounded text-[9px] hover:bg-outline/10 transition-colors font-bold text-on-surface-variant">+10%</button>
                          <button type="button" onClick={() => handleQuantityChange(currentQuantity * 2)} className="px-1.5 py-0.5 bg-surface-dim border border-outline/10 rounded text-[9px] hover:bg-outline/10 transition-colors font-bold text-on-surface-variant">2x</button>
                        </div>`;
code = code.replace(portfolioButtons, newPortfolioButtons);

// 5. News item style upgrade
const newsSection = `                  <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface">
                    실시간 관련 뉴스
                  </h3>
                </div>
                <div className="p-6 space-y-3 overflow-y-auto pr-4 flex-1 relative hide-scrollbar bg-surface rounded-b-2xl">
                  {insights.length > 0 ? (
                    insights.map((item, idx) => (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={idx}
                        className="block group hover:-translate-y-1 transition-transform"
                      >
                        <InsightItem
                          date={item.date}
                          label={item.label}
                          color={item.color}
                        />
                      </a>
                    ))
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-primary animate-pulse">
                      뉴스를 분석 중입니다...
                    </div>
                  )}`;
const newNewsSection = `                  <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" /> 실시간 관련 뉴스
                  </h3>
                </div>
                <div className="p-4 md:p-6 space-y-3 overflow-y-auto flex-1 relative hide-scrollbar bg-surface rounded-b-2xl">
                  {insights.length > 0 ? (
                    insights.map((item, idx) => (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={idx}
                        className="block group p-4 rounded-xl border border-outline/10 bg-surface-container-lowest hover:bg-surface-dim hover:border-primary/30 transition-all shadow-sm"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-relaxed">
                            {item.label.replace(/(\\[[^\\]]*\\]| <[^>]*> )/g, '')}
                          </p>
                          <span className="shrink-0 text-[10px] font-mono text-on-surface-variant bg-surface-dim px-2 py-1 rounded-md">
                            {item.date}
                          </span>
                        </div>
                      </a>
                    ))
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-sm font-semibold text-primary/70 animate-pulse gap-3">
                      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      뉴스를 분석 중입니다...
                    </div>
                  )}`;
code = code.replace(newsSection, newNewsSection);

fs.writeFileSync('src/pages/CryptoDashboard.tsx', code);
console.log('Fixed CryptoDashboard');
