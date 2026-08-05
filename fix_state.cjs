const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Re-add buyPrices and quantities
  const addMissingState = `
  const [buyPrices, setBuyPrices] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("crypto_buy_prices_v1");
    return saved ? JSON.parse(saved) : {};
  });
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("crypto_quantities_v1");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("crypto_buy_prices_v1", JSON.stringify(buyPrices));
  }, [buyPrices]);

  useEffect(() => {
    localStorage.setItem("crypto_quantities_v1", JSON.stringify(quantities));
  }, [quantities]);
  `;
  
  content = content.replace(
    '  // Mount effect',
    addMissingState + '\n  // Mount effect'
  );

  // Remove duplicate insights
  content = content.replace(/const \[insights, setInsights\] = useState<Array<\{ date: string; label: string \}>>\(\[\]\);\n\n  useEffect\(\(\) => \{[\s\S]*?\}, \[activeCoinId, refreshCount\]\);\n/, '');
  
  // Wait, there might be TWO of them, because I might have replaced and the original was further down.
  // We'll replace ALL instances, then put one back.
  content = content.replace(/const \[insights, setInsights\] = useState<Array<\{ date: string; label: string \}>>\(\[\]\);[\s\S]*?\}, \[activeCoinId, refreshCount\]\);/g, '');
  
  // I will just place the fresh one right before `const SEARCH_MAPPINGS`
  const insightsLogic = `
  const [insights, setInsights] = useState<Array<{ date: string; label: string }>>([]);
  useEffect(() => {
    const coinName = (file.includes('Stock') ? MOCK_STOCKS : MOCK_COINS)[activeCoinId]?.name || activeCoinId;
    fetch(\`/api/news?q=\${encodeURIComponent((file.includes('Stock') ? "주식 " : "가상화폐 ") + coinName + " when:7d")}\`)
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          const timeAgo = (dateStr: string) => {
            if (!dateStr) return "최신";
            const date = new Date(dateStr);
            const now = new Date();
            const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
            if (diffHours < 1) return "방금 전";
            if (diffHours < 24) return \`\${diffHours}시간 전\`;
            return \`\${Math.floor(diffHours / 24)}일 전\`;
          };

          const newInsights = data.items.map((item: any) => {
             const title = item.title.replace(/<[^>]*>?/gm, '');
             const isBullish = title.includes('상승') || title.includes('강세') || title.includes('급등') || title.includes('돌파') || title.includes('호실적');
             const isBearish = title.includes('하락') || title.includes('약세') || title.includes('급락') || title.includes('이탈') || title.includes('위기');
             let label = title;
             if (isBullish && !label.includes('[상승]')) label = \`[상승] \${label}\`;
             if (isBearish && !label.includes('[하락]')) label = \`[하락] \${label}\`;
             return { date: timeAgo(item.pubDate), label };
          });
          setInsights(newInsights.slice(0, 4));
        }
      })
      .catch(console.error);
  }, [activeCoinId, refreshCount]);
  `;
  
  let finalInsights = insightsLogic.replace(/file\.includes\('Stock'\)/g, file.includes('Stock') ? 'true' : 'false');
  if (file.includes('Stock')) {
     finalInsights = finalInsights.replace(/\(true \? MOCK_STOCKS : MOCK_COINS\)/g, 'MOCK_STOCKS');
     finalInsights = finalInsights.replace(/\(true \? "주식 " : "가상화폐 "\)/g, '"주식 "');
  } else {
     finalInsights = finalInsights.replace(/\(false \? MOCK_STOCKS : MOCK_COINS\)/g, 'MOCK_COINS');
     finalInsights = finalInsights.replace(/\(false \? "주식 " : "가상화폐 "\)/g, '"가상화폐 "');
  }

  content = content.replace(
    'const SEARCH_MAPPINGS: Record<string, string[]> = {',
    finalInsights + '\n  const SEARCH_MAPPINGS: Record<string, string[]> = {'
  );

  // In StockDashboard, "Import declaration conflicts with local declaration of 'CoinInfo'."
  // Ensure we don't define interface CoinInfo if we imported it.
  content = content.replace(/export interface CoinInfo \{[\s\S]*?\};\n/, '');
  content = content.replace(/interface CoinInfo \{[\s\S]*?\}\n/, '');

  fs.writeFileSync(file, content);
}

fix('src/pages/CryptoDashboard.tsx');
fix('src/pages/StockDashboard.tsx');
