const fs = require('fs');
let code = fs.readFileSync('src/pages/CryptoDashboard.tsx', 'utf8');

code = code.replace(
  'const CandlestickShape = (props: any) => {',
  `interface CandlestickProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: {
    open: number;
    high: number;
    low: number;
    close: number;
    isUp: boolean;
  };
}
const CandlestickShape = (props: CandlestickProps) => {`
);

code = code.replace(
  'const MOCK_COINS: Record<string, any> = {',
  `export interface CoinInfo {
  name: string;
  symbol: string;
  image: string;
  symbolLength: string;
  color: string;
  price: string;
  trend: string;
  trendUp: boolean;
  volatility: string;
  volLow: string;
  volHigh: string;
  marketCap: string;
  rank: string;
  fdv: string;
  volume: string;
  volChange: string;
  english: string;
  targetPrice: string;
}
const MOCK_COINS: Record<string, CoinInfo> = {`
);

code = code.replace(
  '  const [insights, setInsights] = useState<any[]>([]);',
  `  interface Insight {
    date: string;
    label: string;
    color: string;
    link?: string;
  }
  const [insights, setInsights] = useState<Insight[]>([]);`
);

code = code.replace(
  '  const [cryptoData, setCryptoData] = useState<any>(null);',
  `  interface CryptoData {
    price: string;
    trend: string;
    marketCap: string;
    volume: string;
    high24h: string;
    low24h: string;
    rsi: string;
    ma50: string;
    ma200: string;
    sentimentScore: number;
    sentimentStatus: string;
    analysis: string;
    candles: { open: number; high: number; low: number; close: number }[];
    dataSource?: string;
  }
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);`
);

code = code.replace(
  'data.items.slice(0, 8).map((item: any) => ({',
  'data.items.slice(0, 8).map((item: { pubDate: string; title: string; link: string }) => ({'
);

code = code.replace(
  'const rawChartData = candles.map((candle: any, i: number) => {',
  'const rawChartData = candles.map((candle: { open: number; high: number; low: number; close: number }, i: number) => {'
);

code = code.replace(
  'const processedChartData = rawChartData.map((item: any, i: number) => {',
  'const processedChartData = rawChartData.map((item, i: number) => {'
);

code = code.replace(
  'const lows = processedChartData.map((d: any) => d.low);',
  'const lows = processedChartData.map((d) => d.low);'
);

code = code.replace(
  'const highs = processedChartData.map((d: any) => d.high);',
  'const highs = processedChartData.map((d) => d.high);'
);

code = code.replace(
  '  badges,\n  footerText,\n}: any) {',
  `  badges,
  footerText,
}: {
  label: string;
  value: string;
  unit: string;
  trend?: string;
  trendUp?: boolean;
  badges?: { text: string; isAccent?: boolean }[];
  footerText?: string;
}) {`
);

code = code.replace(
  'badges.map((b: any, i: number) => (',
  'badges.map((b: { text: string; isAccent?: boolean }, i: number) => ('
);

code = code.replace(
  'function IndicatorCard({ title, value, sub, color, barValue }: any) {',
  `function IndicatorCard({ title, value, sub, color, barValue }: {
  title: string;
  value: string | number;
  sub: string;
  color: "bullish" | "bearish" | "neutral" | string;
  barValue?: number;
}) {`
);

code = code.replace(
  'function InsightItem({ date, label, color }: any) {',
  `function InsightItem({ date, label, color }: {
  date: string;
  label: string;
  color: "bullish" | "bearish" | "cyber" | string;
}) {`
);

fs.writeFileSync('src/pages/CryptoDashboard.tsx', code);
