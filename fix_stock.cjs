const fs = require('fs');
let content = fs.readFileSync('src/pages/StockDashboard.tsx', 'utf8');

// Replace component name
content = content.replace(/CryptoDashboard/g, 'StockDashboard');

// Replace title
content = content.replace(/{coin.name} \({coin.symbol}\) 실시간 시세 및 AI 지표 분석 \| 알고리즘 트레이더/g, '{coin.name} ({coin.symbol}) 실시간 주가 및 AI 지표 분석 | 알고리즘 트레이더');

// Replace mock coins with mock stocks
content = content.replace(/const MOCK_COINS: Record<string, CoinInfo> = \{[\s\S]*?\};\n\nconst /m, `const MOCK_COINS: Record<string, CoinInfo> = {
  apple: {
    name: "애플",
    symbol: "AAPL",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    symbolLength: "w-10 h-10 text-[11px]",
    color: "from-gray-800 to-gray-500",
    price: "$173.50",
    trend: "+1.2%",
    trendUp: true,
    volatility: "안정적",
    volLow: "$171.00",
    volHigh: "$175.20",
    marketCap: "$2.6T",
    rank: "Rank #1",
    fdv: "P/E: 26.5",
    volume: "$48.2M",
    volChange: "↑ 2.4%",
    english: "APPLE INC",
    targetPrice: "$200.00",
    targetColor: "text-bullish",
    volColor: "bg-gray-800",
    volPercent: "60%",
  },
  tesla: {
    name: "테슬라",
    symbol: "TSLA",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
    symbolLength: "w-10 h-10 text-[11px]",
    color: "from-red-600 to-red-400",
    price: "$182.45",
    trend: "-3.5%",
    trendUp: false,
    volatility: "높음",
    volLow: "$178.50",
    volHigh: "$190.00",
    marketCap: "$580B",
    rank: "Rank #11",
    fdv: "P/E: 42.1",
    volume: "$120.5M",
    volChange: "↓ 5.4%",
    english: "TESLA INC",
    targetPrice: "$250.00",
    targetColor: "text-bearish",
    volColor: "bg-red-600",
    volPercent: "40%",
  },
  nvidia: {
    name: "엔비디아",
    symbol: "NVDA",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg",
    symbolLength: "w-10 h-10 text-[11px]",
    color: "from-green-600 to-green-400",
    price: "$850.20",
    trend: "+5.8%",
    trendUp: true,
    volatility: "강한 상승세",
    volLow: "$810.00",
    volHigh: "$865.50",
    marketCap: "$2.1T",
    rank: "Rank #3",
    fdv: "P/E: 75.3",
    volume: "$85.2M",
    volChange: "↑ 15.2%",
    english: "NVIDIA CORP",
    targetPrice: "$1000.00",
    targetColor: "text-bullish",
    volColor: "bg-green-600",
    volPercent: "90%",
  }
};

const `);

// Default to Apple
content = content.replace(/useState<string>\("wormhole"\)/g, 'useState<string>("apple")');

fs.writeFileSync('src/pages/StockDashboard.tsx', content);
