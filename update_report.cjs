const fs = require('fs');

function rewriteReport(file, formatHigh24h, formatMa200) {
  let content = fs.readFileSync(file, 'utf8');

  // Find where the report section starts
  const reportStartIdx = content.indexOf('{/* Report Section */}');
  if (reportStartIdx === -1) {
    console.log(`Report section not found in ${file}`);
    return;
  }
  
  // Find where it ends (the end of the component, just before `</PriceProvider>`)
  const priceProviderEndIdx = content.indexOf('</PriceProvider>', reportStartIdx);
  if (priceProviderEndIdx === -1) {
    console.log(`</PriceProvider> not found in ${file}`);
    return;
  }
  
  // Find the closing main tag
  const mainEndIdx = content.lastIndexOf('</main>', priceProviderEndIdx);

  const prefix = content.substring(0, reportStartIdx);
  const suffix = content.substring(mainEndIdx);

  const newReport = `          {/* Report Section */}
          <section className="card p-6 md:p-10 lg:p-12 mt-10 md:mt-12 bg-surface border border-outline/10">
            <article className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-outline/20">
                <div className="flex items-center gap-4">
                  <span className="h-2 w-8 md:w-12 bg-primary rounded-full"></span>
                  <h2 className="text-2xl md:text-4xl font-display font-bold tracking-tight text-on-surface flex gap-3 items-center">
                    시장 및 기술 분석 보고서
                  </h2>
                </div>
                <div className={\`px-4 py-2 rounded-xl font-bold font-mono tracking-widest text-sm flex items-center gap-2 border \${algoAction.bg} \${algoAction.color} \${algoAction.border}\`}>
                  <Activity className="w-4 h-4" /> AI 판독: {algoAction.label}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Narrative & Analysis */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-10">
                  <div className="space-y-5">
                    <h3 className="text-xl md:text-2xl font-display font-bold text-on-surface flex items-center gap-3">
                      <span className="text-primary text-sm font-mono tracking-widest uppercase bg-primary/10 px-2 py-1 rounded">Sec 01</span>
                      동적 시장 총평 및 실시간 분석
                    </h3>
                    <p className="text-on-surface-variant/90 leading-relaxed text-lg font-sans">
                      {cryptoData?.analysis ||
                        \`로컬 알고리즘 분석 결과, \${coin.name}(\${coin.symbol})은(는) 현재 RSI \${cryptoData?.rsi || "50"} 수준으로 \${algoAction.label} 포지션에 적합한 상태입니다. 실시간 동향과 단기 이평선(MA) 추세를 고려할 때 주의 깊은 접근이 요구됩니다.\`}
                    </p>
                  </div>

                  <div className="space-y-5">
                    <h3 className="text-xl md:text-2xl font-display font-bold text-on-surface flex items-center gap-3">
                      <span className="text-primary text-sm font-mono tracking-widest uppercase bg-primary/10 px-2 py-1 rounded">Sec 02</span>
                      주요 관련 동향 브리핑
                    </h3>
                    <p className="text-on-surface-variant/90 leading-relaxed text-lg font-sans">
                      현재 모멘텀 지표(RSI)는{" "}
                      <strong className="text-on-surface">{cryptoData?.rsi || "62.4"}</strong>를 기록하며, 전반적인 시장 추세를 반영하고 있습니다. 특히 검색된 최신 뉴스 기반 동향으로 볼 때 다음과 같은 인사이트를 도출할 수 있습니다.
                    </p>
                    <blockquote className="border-l-4 border-primary bg-primary/5 p-6 md:p-8 rounded-r-2xl italic text-on-surface-variant my-6 shadow-sm font-medium break-keep">
                      "{insights.length > 0 ? \`\${insights[0].label.replace(/(\\[[^\\]]*\\]| <[^>]*> )/g, '')} 등의 실시간 소식이 \${coin.name}의 투심에 영향을 미치고 있습니다.\` : \`관련 뉴스를 기반으로 시장 동향을 파악하고 있습니다.\`}"
                    </blockquote>
                  </div>
                </div>

                {/* Right Column: Key Data & Targets */}
                <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
                  <div className="bg-surface-dim/30 border border-outline/10 p-6 md:p-8 rounded-2xl flex flex-col h-full">
                    <h3 className="text-primary font-display font-bold text-lg mb-6 flex items-center gap-2">
                      <BarChart2 className="w-5 h-5" /> 핵심 요약
                    </h3>
                    <ul className="space-y-4 text-sm font-medium text-on-surface-variant leading-relaxed flex-1">
                      {insights.length > 0 ? (
                        insights.slice(0, 3).map((insight, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="text-primary shrink-0 mt-0.5">●</span>
                            {insight.label.replace(/(\\[[^\\]]*\\]| <[^>]*> )/g, '')}
                          </li>
                        ))
                      ) : (
                        <li className="flex items-start gap-3">
                          <span className="text-primary shrink-0 mt-0.5 animate-pulse">●</span> 
                          실시간 동향 데이터를 불러오는 중입니다...
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="bg-surface border border-outline/20 p-6 md:p-8 rounded-2xl shadow-sm">
                    <h3 className="font-display font-bold text-lg mb-6 text-on-surface flex items-center gap-2">
                      <Activity className="w-5 h-5 text-on-surface-variant" /> 프라이스 타겟
                    </h3>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center border-b border-outline/10 pb-4">
                        <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                          단기 저항선 (24H High 기반)
                        </p>
                        <p className="text-xl font-mono bg-surface-dim px-3 py-1 rounded-lg font-bold text-on-surface">
                          ${formatHigh24h}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                          장기 목표가 (MA200 기반)
                        </p>
                        <p
                          className={\`text-2xl font-mono font-bold \${coin.targetColor === "text-bullish" ? "text-green-500" : "text-primary"}\`}
                        >
                          ${formatMa200}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </section>
        </div>
`;
  
  fs.writeFileSync(file, prefix + newReport + suffix);
  console.log(`Updated ${file}`);
}

rewriteReport('src/pages/StockDashboard.tsx', '{formatKRW(cryptoData?.high24h || "$3.25")}', '{formatKRW(String(cryptoData?.ma200 || coin.targetPrice))}');
rewriteReport('src/pages/CryptoDashboard.tsx', '{formatUSDToKRW(cryptoData?.high24h || "$3.25")}', '{formatUSDToKRW(cryptoData?.ma200 || coin.targetPrice)}');

