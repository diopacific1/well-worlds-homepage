const fs = require('fs');

function update(file, isStock) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Add imports
  if (!content.includes('useAssetData')) {
    content = content.replace(
      'import { useDebounce } from "../hooks/useDebounce";',
      'import { useDebounce } from "../hooks/useDebounce";\nimport { useAssetData } from "../hooks/useAssetData";\nimport { DashboardSkeleton } from "../components/dashboard/DashboardSkeleton";'
    );
  }

  const typeStr = isStock ? '"stock"' : '"crypto"';

  // Replace old fetching logic
  // Find the exact block we want to replace
  const stateStart = content.indexOf('  interface CryptoData {');
  if (stateStart === -1) {
    console.log('State block not found in', file);
    return;
  }
  
  const stateEnd = content.indexOf('const SEARCH_MAPPINGS: Record<string, string[]> = {');
  
  // Actually SEARCH_MAPPINGS is inside the component
  const replacement = `
  const [mounted, setMounted] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [timeframe, setTimeframe] = useState<"1H" | "1D" | "1W">("1D");

  const { data: cryptoData, loading: loadingCrypto } = useAssetData(activeCoinId, timeframe, ${typeStr}, refreshCount);

  // Portfolio tracking state with persistence in KRW
  const [userBalance, setUserBalance] = useState<number>(() => {
    const saved = localStorage.getItem("crypto_balance_v1");
    return saved ? parseFloat(saved) : 10000000; 
  });
  const [userPositions, setUserPositions] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("crypto_positions_v1");
    return saved ? JSON.parse(saved) : {};
  });
  
  useEffect(() => {
    localStorage.setItem("crypto_balance_v1", userBalance.toString());
    localStorage.setItem("crypto_positions_v1", JSON.stringify(userPositions));
  }, [userBalance, userPositions]);

  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // News fetching
  const [insights, setInsights] = useState<Array<{ date: string; label: string }>>([]);
  useEffect(() => {
    const coinName = (isStock ? MOCK_STOCKS : MOCK_COINS)[activeCoinId]?.name || activeCoinId;
    fetch(\`/api/news?q=\${encodeURIComponent((isStock ? "주식 " : "가상화폐 ") + coinName + " when:7d")}\`)
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
             // Mock bullish/bearish simple logic based on title
             const title = item.title.replace(/<[^>]*>?/gm, '');
             const isBullish = title.includes('상승') || title.includes('강세') || title.includes('급등') || title.includes('돌파') || title.includes('호실적');
             const isBearish = title.includes('하락') || title.includes('약세') || title.includes('급락') || title.includes('이탈') || title.includes('위기');
             let label = title;
             if (isBullish && !label.includes('[상승]')) label = \`[상승] \${label}\`;
             if (isBearish && !label.includes('[하락]')) label = \`[하락] \${label}\`;
             return {
                date: timeAgo(item.pubDate),
                label
             };
          });
          setInsights(newInsights.slice(0, 4));
        }
      })
      .catch(console.error);
  }, [activeCoinId, refreshCount]);

  `;

  // We need to carefully replace only the fetching block.
  // We can just use the search mapping and portfolio to anchor.
  
  // First, fix the isStock mock data variable
  let finalReplacement = replacement;
  if (isStock) {
    finalReplacement = finalReplacement.replace(/\(isStock \? MOCK_STOCKS : MOCK_COINS\)/g, 'MOCK_STOCKS');
    finalReplacement = finalReplacement.replace(/\(isStock \? "주식 " : "가상화폐 "\)/g, '"주식 "');
  } else {
    finalReplacement = finalReplacement.replace(/\(isStock \? MOCK_STOCKS : MOCK_COINS\)/g, 'MOCK_COINS');
    finalReplacement = finalReplacement.replace(/\(isStock \? "주식 " : "가상화폐 "\)/g, '"가상화폐 "');
  }

  // Remove the old interface CryptoData up to SEARCH_MAPPINGS
  const beforeState = content.slice(0, stateStart);
  const afterState = content.slice(stateEnd);
  
  content = beforeState + finalReplacement + afterState;

  // Replace Loading Overlay with DashboardSkeleton
  content = content.replace(
    /<div className="absolute inset-0 z-20 bg-surface\/30 backdrop-blur-sm flex justify-center rounded-2xl pt-32">[\s\S]*?<\/div>/,
    '<DashboardSkeleton />'
  );
  
  // In StockDashboard, there's a difference in `cryptoData` to `stockData`, actually they both use `cryptoData` right now! So we can leave it.

  fs.writeFileSync(file, content);
}

update('src/pages/CryptoDashboard.tsx', false);
update('src/pages/StockDashboard.tsx', true);

