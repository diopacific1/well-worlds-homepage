const fs = require('fs');

let content = fs.readFileSync('src/data/mockData.ts', 'utf8');

const additionalStocks = `
  naver: {
    name: "NAVER",
    symbol: "035420",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Naver_Logotype.svg",
    symbolLength: "w-12 h-12 text-[11px]",
    color: "from-green-600 to-green-400",
    price: "210,000원",
    trend: "-0.2%",
    trendUp: false,
    volatility: "보통",
    volLow: "205,000원",
    volHigh: "215,000원",
    marketCap: "34조원",
    rank: "코스피 10위",
    fdv: "PER: 35.1",
    volume: "159만주",
    volChange: "↓ 1.2%",
    english: "NAVER",
    targetPrice: "250,000원",
    targetColor: "text-bullish",
    volColor: "bg-green-500",
    volPercent: "40%",
  },
  kakao: {
    name: "카카오",
    symbol: "035720",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Kakao_logo_%282014%29.svg",
    symbolLength: "w-12 h-12 text-[11px]",
    color: "from-yellow-500 to-yellow-300",
    price: "39,000원",
    trend: "-2.2%",
    trendUp: false,
    volatility: "약세",
    volLow: "38,500원",
    volHigh: "40,000원",
    marketCap: "17조원",
    rank: "코스피 15위",
    fdv: "PER: 42.1",
    volume: "75만주",
    volChange: "↓ 3.2%",
    english: "KAKAO",
    targetPrice: "45,000원",
    targetColor: "text-bearish",
    volColor: "bg-yellow-400",
    volPercent: "30%",
  },
`;

content = content.replace('};', additionalStocks + '\n};');
fs.writeFileSync('src/data/mockData.ts', content);
