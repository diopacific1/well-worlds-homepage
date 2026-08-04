const fs = require('fs');
let content = fs.readFileSync('src/pages/StockDashboard.tsx', 'utf8');

// Replace the mock block
const startIndex = content.indexOf('const MOCK_STOCKS: Record<string, CoinInfo> = {');
let endIndex = content.indexOf('const [activeCoinId, setActiveCoinId]', startIndex);
// backtrack to the previous '};' before const [activeCoinId
const closingIndex = content.lastIndexOf('};\n', endIndex);

if (startIndex !== -1 && closingIndex !== -1) {
  const newMockStocks = `const MOCK_STOCKS: Record<string, CoinInfo> = {
  samsung: {
    name: "삼성전자",
    symbol: "005930",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
    symbolLength: "w-12 h-12 text-[11px]",
    color: "from-blue-700 to-blue-500",
    price: "72,500원",
    trend: "+1.2%",
    trendUp: true,
    volatility: "안정적",
    volLow: "71,000원",
    volHigh: "73,200원",
    marketCap: "432조원",
    rank: "코스피 1위",
    fdv: "PER: 15.2",
    volume: "1,245만주",
    volChange: "↑ 2.4%",
    english: "SAMSUNG ELEC",
    targetPrice: "85,000원",
    targetColor: "text-bullish",
    volColor: "bg-blue-600",
    volPercent: "60%",
  },
  hynix: {
    name: "SK하이닉스",
    symbol: "000660",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/ea/SK_hynix_logo.svg",
    symbolLength: "w-12 h-12 text-[11px]",
    color: "from-red-600 to-red-400",
    price: "154,200원",
    trend: "-1.5%",
    trendUp: false,
    volatility: "높음",
    volLow: "151,000원",
    volHigh: "156,000원",
    marketCap: "112조원",
    rank: "코스피 2위",
    fdv: "PER: 24.1",
    volume: "354만주",
    volChange: "↓ 1.4%",
    english: "SK HYNIX",
    targetPrice: "180,000원",
    targetColor: "text-bearish",
    volColor: "bg-red-600",
    volPercent: "40%",
  },
  hyundai: {
    name: "현대차",
    symbol: "005380",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/44/Hyundai_Motor_Company_logo.svg",
    symbolLength: "w-12 h-12 text-[11px]",
    color: "from-blue-900 to-blue-700",
    price: "245,000원",
    trend: "+3.8%",
    trendUp: true,
    volatility: "강한 상승세",
    volLow: "238,000원",
    volHigh: "248,500원",
    marketCap: "52조원",
    rank: "코스피 3위",
    fdv: "PER: 5.3",
    volume: "112만주",
    volChange: "↑ 15.2%",
    english: "HYUNDAI MOTOR",
    targetPrice: "300,000원",
    targetColor: "text-bullish",
    volColor: "bg-blue-800",
    volPercent: "90%",
  }
};\n\n`;

  // Actually, we don't know exactly where MOCK_STOCKS ends before export default function.
  // Let's just find "export default function StockDashboard" and replace everything from MOCK_STOCKS to there.
  const componentStart = content.indexOf('export default function StockDashboard() {');
  
  content = content.substring(0, startIndex) + newMockStocks + content.substring(componentStart);
}

// Replace string instances of 'bitcoin' with 'samsung' etc.
content = content.replace(/useState\("bitcoin"\)/g, 'useState("samsung")');
content = content.replace(/useState<string>\("bitcoin"\)/g, 'useState<string>("samsung")');

// buyPrices default state
content = content.replace(/\{ bitcoin: 90000000.*?\}/g, '{ samsung: 71000, hynix: 156000, hyundai: 230000 }');

// quantities default state
content = content.replace(/\{ bitcoin: 0\.25.*?\}/g, '{ samsung: 100, hynix: 50, hyundai: 30 }');

// fallback for quantites
content = content.replace(/activeCoinId === "bitcoin" \? 0\.25 : activeCoinId === "ethereum" \? 1\.5 : activeCoinId === "solana" \? 15 : 200/g, 'activeCoinId === "samsung" ? 100 : activeCoinId === "hynix" ? 50 : 30');

// Coin->Stock labels
content = content.replace(/코인 실시간 시세/g, '주식 실시간 시세');
content = content.replace(/코인 선택/g, '주목할 종목');
content = content.replace(/관심 코인/g, '관심 종목');
content = content.replace(/코인명 검색/g, '종목명 검색');
content = content.replace(/가상화폐 /g, '주식 ');
content = content.replace(/코인/g, '종목'); // Generic replace, hope it doesn't break vars

// Remove some crypto-specific logic or correct it
content = content.replace(/formatUSDToKRW/g, 'formatKRW');
content = content.replace(/formatUSDToKRWMacro/g, 'formatKRWMacro');
content = content.replace(/parseUSD/g, 'parseKRW');

fs.writeFileSync('src/pages/StockDashboard.tsx', content);
