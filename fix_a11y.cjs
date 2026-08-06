const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Add aria-pressed and aria-label to timeframe buttons
  content = content.replace(
    /onClick=\{\(\) => setTimeframe\("1H"\)\}\s*className=\{`([^`]+)`\}/g,
    'onClick={() => setTimeframe("1H")}\n                        aria-pressed={timeframe === "1H"}\n                        aria-label="1시간 차트 보기"\n                        className={`$1`}'
  );
  content = content.replace(
    /onClick=\{\(\) => setTimeframe\("1D"\)\}\s*className=\{`([^`]+)`\}/g,
    'onClick={() => setTimeframe("1D")}\n                        aria-pressed={timeframe === "1D"}\n                        aria-label="1일 차트 보기"\n                        className={`$1`}'
  );
  content = content.replace(
    /onClick=\{\(\) => setTimeframe\("1W"\)\}\s*className=\{`([^`]+)`\}/g,
    'onClick={() => setTimeframe("1W")}\n                        aria-pressed={timeframe === "1W"}\n                        aria-label="1주 차트 보기"\n                        className={`$1`}'
  );
  
  // Refresh button in header
  content = content.replace(
    /onClick=\{\(\) => setRefreshCount\(\(p\) => p \+ 1\)\}\s*className="([^"]+)"\s*title="시세 데이터 새로고침"/g,
    'onClick={() => setRefreshCount((p) => p + 1)}\n                      className="$1"\n                      title="시세 데이터 새로고침"\n                      aria-label="시세 데이터 새로고침"'
  );
  
  // Refresh button in error state
  content = content.replace(
    /onClick=\{\(\) => setRefreshCount\(\(r\) => r \+ 1\)\}\s*className="px-6 py-2 bg-primary/g,
    'onClick={() => setRefreshCount((r) => r + 1)}\n                  aria-label="데이터 다시 불러오기"\n                  className="px-6 py-2 bg-primary'
  );

  fs.writeFileSync(file, content);
}

fix('src/pages/CryptoDashboard.tsx');
fix('src/pages/StockDashboard.tsx');

