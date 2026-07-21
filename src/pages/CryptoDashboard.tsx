
import { useState, FormEvent, useEffect, useMemo, useRef } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { Helmet } from "react-helmet-async";
import {
  Search,
  Wallet,
  TrendingUp,
  TrendingDown,
  Activity,
  ChevronRight,
  BarChart2,
  List,
  RefreshCw,
  Info,
  Star,
  Command,
} from "lucide-react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { MarketOverview } from "../components/MarketOverview";
import { PriceTicker } from "../components/PriceTicker";
import { PriceProvider } from "../context/PriceContext";

// Upbit/Stock-Market style custom Candlestick rendering shape
interface CandlestickProps {
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
const CandlestickShape = (props: CandlestickProps) => {
  const { x, y, width, height, payload } = props;
  if (!payload) return null;
  const { open, high, low, close, isUp } = payload;

  // Upbit Palette: Bright Red (#E13030) for Bullish trend, Cool Indigo Blue (#1261C4) for Bearish trend
  const strokeColor = isUp ? "#E13030" : "#1261C4";
  const fillColor = isUp ? "#E13030" : "#1261C4";

  const bodyDelta = Math.abs(open - close);
  const pxPerPrice = bodyDelta > 0 ? height / bodyDelta : 1;

  const maxOC = Math.max(open, close);
  const minOC = Math.min(open, close);

  // Position shadows relative to coordinate layout
  const highY = y - (high - maxOC) * pxPerPrice;
  const lowY = y + height + (minOC - low) * pxPerPrice;

  const centerX = x + width / 2;

  return (
    <g>
      {/* Candlestick shadow line */}
      <line
        x1={centerX}
        y1={highY}
        x2={centerX}
        y2={lowY}
        stroke={strokeColor}
        strokeWidth={1.5}
      />
      {/* Candlestick body */}
      <rect
        x={x}
        y={y}
        width={width}
        height={Math.max(2, height)}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={1}
      />
    </g>
  );
};

export interface CoinInfo {
  id?: string;
  name: string;
  symbol: string;
  symbolLength?: string;
  color: string;
  price: string;
  trend: string;
  trendUp: boolean;
  volatility: string;
  volLow: string;
  volHigh: string;
  marketCap: string;
  rank: string;
  desc?: string;
  targetPrice: string;
  english: string;
  targetColor?: string;
  volPercent?: string;
  volColor?: string;
  image?: string;
  fdv?: string;
  volume?: string;
  volChange?: string;
}
const MOCK_COINS: Record<string, CoinInfo> = {
  wormhole: {
    name: "웜홀",
    symbol: "W",
    image:
      "https://assets.coingecko.com/coins/images/35856/standard/wormhole_logo_w.png",
    symbolLength: "w-10 h-10",
    color: "from-cyber to-blue-600",
    price: "$3.14",
    trend: "+4.18%",
    trendUp: true,
    volatility: "상승세",
    volLow: "$2.88",
    volHigh: "$3.25",
    marketCap: "$5.65B",
    rank: "Rank #22",
    fdv: "FDV: $31.4B",
    volume: "$482.5M",
    volChange: "↑ 12.4%",
    english: "WORMHOLE",
    targetPrice: "$5.50",
    targetColor: "text-bullish",
    volColor: "bg-bullish",
    volPercent: "65%",
  },
  bitcoin: {
    name: "비트코인",
    symbol: "BTC",
    image: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=029",
    symbolLength: "w-10 h-10 text-[11px]",
    color: "from-[#F7931A] to-[#FFAB4A]",
    price: "$72,450",
    trend: "+1.25%",
    trendUp: true,
    volatility: "안정적",
    volLow: "$71,200",
    volHigh: "$73,100",
    marketCap: "$1.42T",
    rank: "Rank #1",
    fdv: "FDV: $1.52T",
    volume: "$35.2B",
    volChange: "↑ 4.2%",
    english: "BITCOIN",
    targetPrice: "$100,000",
    targetColor: "text-bullish",
    volColor: "bg-[#F7931A]",
    volPercent: "50%",
  },
  ethereum: {
    name: "이더리움",
    symbol: "ETH",
    image: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029",
    symbolLength: "w-10 h-10 text-[11px]",
    color: "from-[#627EEA] to-[#8A9CFF]",
    price: "$3,842",
    trend: "+8.45%",
    trendUp: true,
    volatility: "강한 상승세",
    volLow: "$3,450",
    volHigh: "$3,920",
    marketCap: "$460B",
    rank: "Rank #2",
    fdv: "FDV: $460B",
    volume: "$15.8B",
    volChange: "↑ 18.5%",
    english: "ETHEREUM",
    targetPrice: "$5,000",
    targetColor: "text-bullish",
    volColor: "bg-[#627EEA]",
    volPercent: "85%",
  },
  solana: {
    name: "솔라나",
    symbol: "SOL",
    image: "https://cryptologos.cc/logos/solana-sol-logo.svg?v=029",
    symbolLength: "w-10 h-10 text-[11px]",
    color: "from-[#14F195] to-[#9945FF]",
    price: "$145.20",
    trend: "-2.10%",
    trendUp: false,
    volatility: "하락세",
    volLow: "$135.00",
    volHigh: "$150.50",
    marketCap: "$65B",
    rank: "Rank #4",
    fdv: "FDV: $82B",
    volume: "$4.5B",
    volChange: "↓ 5.4%",
    english: "SOLANA",
    targetPrice: "$250.00",
    targetColor: "text-bearish",
    volColor: "bg-bearish",
    volPercent: "30%",
  },
  ripple: {
    name: "리플",
    symbol: "XRP",
    image: "https://cryptologos.cc/logos/ripple-xrp-logo.svg?v=029",
    symbolLength: "w-10 h-10",
    color: "from-[#23292F] to-[#006097]",
    price: "$0.52",
    trend: "+0.45%",
    trendUp: true,
    volatility: "안정적",
    volLow: "$0.50",
    volHigh: "$0.54",
    marketCap: "$28B",
    rank: "Rank #7",
    fdv: "FDV: $52B",
    volume: "$1.2B",
    volChange: "↑ 2.1%",
    english: "RIPPLE",
    targetPrice: "$1.20",
    targetColor: "text-[#00C853]",
    volColor: "bg-[#00a3e0]",
    volPercent: "45%",
  },
  dogecoin: {
    name: "도지코인",
    symbol: "DOGE",
    image: "https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=029",
    symbolLength: "w-10 h-10",
    color: "from-[#C2A633] to-[#8C741F]",
    price: "$0.14",
    trend: "-1.85%",
    trendUp: false,
    volatility: "높은 변동성",
    volLow: "$0.13",
    volHigh: "$0.16",
    marketCap: "$20B",
    rank: "Rank #8",
    fdv: "FDV: $20B",
    volume: "$2.5B",
    volChange: "↓ 4.8%",
    english: "DOGECOIN",
    targetPrice: "$0.35",
    targetColor: "text-bearish",
    volColor: "bg-[#C2A633]",
    volPercent: "60%",
  },
};

export default function CryptoDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [activeCoinId, setActiveCoinId] = useState("bitcoin");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchInputRef = useRef<HTMLDivElement>(null);
  
  // Watchlist (Favorites) state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("crypto_favorites_v1");
      return saved ? JSON.parse(saved) : ["bitcoin", "ethereum", "solana"];
    } catch {
      return ["bitcoin", "ethereum", "solana"];
    }
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const updated = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem("crypto_favorites_v1", JSON.stringify(updated));
      return updated;
    });
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on '/'
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        document.getElementById("cryptoSearch")?.focus();
      }
      // Escape to close dropdown or blur input
      if (e.key === "Escape") {
        setShowSearchDropdown(false);
        if (document.activeElement?.id === "cryptoSearch") {
          (document.activeElement as HTMLElement).blur();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  
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
  }, [debouncedSearchTerm]);
  interface Insight {
    date: string;
    label: string;
    color: string;
    link?: string;
  }
  const [insights, setInsights] = useState<Insight[]>([]);
  interface CryptoData {
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
    candles: { open: number; high: number; low: number; close: number; volume?: number }[];
    dataSource?: string;
  }
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
  const [loadingCrypto, setLoadingCrypto] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [timeframe, setTimeframe] = useState<"1H" | "1D" | "1W">("1D");

  // Portfolio tracking state with persistence in KRW
  const [buyPrices, setBuyPrices] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem("crypto_buy_prices_krw_v2");
      return saved ? JSON.parse(saved) : {
        bitcoin: 90000000,
        ethereum: 4500000,
        solana: 170000,
        wormhole: 3500,
        ripple: 630,
        dogecoin: 154,
      };
    } catch {
      return {
        bitcoin: 90000000,
        ethereum: 4500000,
        solana: 170000,
        wormhole: 3500,
        ripple: 630,
        dogecoin: 154,
      };
    }
  });

  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem("crypto_quantities_v2");
      return saved ? JSON.parse(saved) : {
        bitcoin: 0.25,
        ethereum: 1.5,
        solana: 12,
        wormhole: 500,
        ripple: 2000,
        dogecoin: 10000,
      };
    } catch {
      return { bitcoin: 0.25, ethereum: 1.5, solana: 12, wormhole: 500, ripple: 2000, dogecoin: 10000 };
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const coinName = MOCK_COINS[activeCoinId]?.name || activeCoinId;
    fetch(`/api/news?q=${encodeURIComponent("가상화폐 " + coinName + " when:7d")}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          const timeAgo = (dateStr: string) => {
            if (!dateStr) return "최신";
            const date = new Date(dateStr);
            const now = new Date();
            const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
            if (diffHours < 1) return "방금 전";
            if (diffHours < 24) return `${diffHours}시간 전`;
            return `${Math.floor(diffHours/24)}일 전`;
          };
          setInsights(
            data.items.slice(0, 8).map((item: { pubDate: string; title: string; link: string }) => ({
              date: timeAgo(item.pubDate),
              label: item.title,
              color: "cyber",
              link: item.link,
            })),
          );
        }
      })
      .catch((err) => console.error(err));
  }, [activeCoinId, refreshCount]);

  useEffect(() => {
    setLoadingCrypto(true);

    const cacheKey = `crypto_data_v1_${activeCoinId}_${timeframe}`;
    const cachedData = sessionStorage.getItem(cacheKey);
    const now = Date.now();

    if (cachedData) {
      try {
        const { timestamp, data } = JSON.parse(cachedData);
        // 캐시 유효기간: 3분 (180000ms) - API 호출 최소화로 서버 비용 절감 및 성능 1단계 개선
        if (now - timestamp < 180000) {
          setCryptoData(data);
          setLoadingCrypto(false);
          return;
        }
      } catch (e) {
        sessionStorage.removeItem(cacheKey);
      }
    }

    const fetchController = new AbortController();

    fetch(`/api/crypto?id=${activeCoinId}&timeframe=${timeframe}`, {
      signal: fetchController.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error("API Error:", data.error);
          setCryptoData(null);
        } else {
          sessionStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data }));
          setCryptoData(data);
        }
        setLoadingCrypto(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err);
          setCryptoData(null);
          setLoadingCrypto(false);
        }
      });

      return () => fetchController.abort();
  }, [activeCoinId, refreshCount, timeframe]);

  const SEARCH_MAPPINGS: Record<string, string[]> = {
    bitcoin: ["btc", "bitcoin", "비트코인", "비트"],
    ethereum: ["eth", "ethereum", "이더리움", "이더"],
    solana: ["sol", "solana", "솔라나", "솔"],
    wormhole: ["w", "wormhole", "웜홀"],
    ripple: ["xrp", "ripple", "리플"],
    dogecoin: ["doge", "dogecoin", "도지코인", "도지"],
    stacks: ["stx", "stacks", "스택스"],
    stellar: ["xlm", "stellar", "스텔라루멘", "스텔라"],
    pyth: ["pyth", "피스네트워크", "피스"],
    sui: ["sui", "수이"],
    aptos: ["apt", "aptos", "앱토스"],
    arbitrum: ["arb", "arbitrum", "아비트럼"],
    optimism: ["op", "optimism", "옵티미즘"],
    polygon: ["matic", "polygon", "폴리곤", "폴리"],
    chainlink: ["link", "chainlink", "체인링크", "링크"],
    near: ["near", "니어프로토콜", "니어"],
    avalanche: ["avax", "avalanche", "아발란체", "아바스"],
    cardano: ["ada", "cardano", "에이다", "카르다노"],
    tron: ["trx", "tron", "트론"],
    shiba: ["shib", "shiba", "시바이누", "시바"],
    bch: ["bch", "bitcoin cash", "비트코인캐시"],
    etc: ["etc", "ethereum classic", "이더리움클래식"],
    eos: ["eos", "이오스"],
    theta: ["theta", "쎄타토큰", "쎄타"],
    sand: ["sand", "sandbox", "샌드박스", "샌드"],
    mana: ["mana", "decentraland", "디센트럴랜드"],
    axs: ["axs", "axie infinity", "엑시인피니티", "엑시"],
    neo: ["neo", "네오"],
    vet: ["vet", "vechain", "비체인"],
    chz: ["chz", "chiliz", "칠리즈"],
    mkr: ["mkr", "maker", "메이커"],
    aave: ["aave", "에이브"],
    qtum: ["qtum", "퀀텀"],
    algo: ["algo", "algorand", "알고랜드"],
    hbar: ["hbar", "hedera", "헤데라"],
    sei: ["sei", "세이"],
    mina: ["mina", "미나"],
    blur: ["blur", "블러"],
    pepe: ["pepe", "페페"],
    wld: ["wld", "worldcoin", "월드코인"],
    tia: ["tia", "celestia", "셀레스티아"],
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const term = debouncedSearchTerm.toLowerCase().trim();
    if (!term) return;

    let foundId = term;
    for (const [id, keywords] of Object.entries(SEARCH_MAPPINGS)) {
      if (keywords.some((k) => term.includes(k) || term === k)) {
        foundId = id;
        break;
      }
    }
    setActiveCoinId(foundId);
  };

  const coin = MOCK_COINS[activeCoinId] || {
    name: activeCoinId.toUpperCase(),
    symbol: activeCoinId.substring(0, 4).toUpperCase(),
    symbolLength: "w-10 h-10",
    color: "from-slate-700 to-slate-900 border border-outline/30",
    price: cryptoData?.price || "$0.00",
    trend: cryptoData?.trend || "0.00%",
    trendUp: cryptoData?.trend ? !cryptoData.trend.includes("-") : true,
    volatility: "실시간 분석 자산",
    volLow: cryptoData?.low24h || "-",
    volHigh: cryptoData?.high24h || "-",
    marketCap: cryptoData?.marketCap || "-",
    rank: "Live API",
    fdv: "실시간 연동국",
    volume: cryptoData?.volume || "-",
    volChange: "Live",
    english: activeCoinId.toUpperCase(),
    targetPrice: cryptoData?.ma50 || "-",
    targetColor: "text-primary",
    volColor: "bg-primary",
    volPercent: "50%",
  };

  // Helper properties to parse prices for the calculations
  const parseUSD = (str: string) => {
    if (!str) return 0;
    const clean = str.replace(/[^0-9.]/g, "");
    return parseFloat(clean) || 0;
  };

  const parseUSDWithUnit = (str: string) => {
    if (!str) return 0;
    let multiplier = 1;
    const upper = str.toUpperCase();
    if (upper.includes('T')) multiplier = 1e12;
    else if (upper.includes('B')) multiplier = 1e9;
    else if (upper.includes('M')) multiplier = 1e6;
    else if (upper.includes('K')) multiplier = 1e3;
    const clean = str.replace(/[^0-9.]/g, "");
    return (parseFloat(clean) || 0) * multiplier;
  };

  const USD_TO_KRW = 1400; // 원/달러 고밀도 실시간 고정 변환율 적용

  const formatUSDToKRW = (usdStr: string) => {
    if (!usdStr || usdStr === "-") return "-";
    const usdVal = parseUSD(usdStr);
    return `₩${Math.round(usdVal * USD_TO_KRW).toLocaleString()}`;
  };

  const formatUSDToKRWMacro = (usdStr: string) => {
    if (!usdStr || usdStr === "-") return "-";
    const usdVal = parseUSDWithUnit(usdStr);
    const krwVal = usdVal * USD_TO_KRW;
    if (krwVal >= 1e12) return `₩${(krwVal / 1e12).toFixed(1)}조`;
    if (krwVal >= 1e8) return `₩${Math.round(krwVal / 1e8).toLocaleString()}억`;
    return `₩${krwVal.toLocaleString()}`;
  };

  const currentPriceUSD = parseUSD(cryptoData?.price || coin.price);
  const currentPriceKRW = currentPriceUSD * USD_TO_KRW;

  const currentBuyPrice = buyPrices[activeCoinId] !== undefined ? buyPrices[activeCoinId] : Math.round(currentPriceKRW * 0.95);
  const currentQuantity = quantities[activeCoinId] !== undefined ? quantities[activeCoinId] : (activeCoinId === "bitcoin" ? 0.25 : activeCoinId === "ethereum" ? 1.5 : activeCoinId === "solana" ? 15 : 200);

  const handleBuyPriceChange = (val: number) => {
    const updated = { ...buyPrices, [activeCoinId]: val };
    setBuyPrices(updated);
    localStorage.setItem("crypto_buy_prices_krw_v2", JSON.stringify(updated));
  };

  const handleQuantityChange = (val: number) => {
    const updated = { ...quantities, [activeCoinId]: val };
    setQuantities(updated);
    localStorage.setItem("crypto_quantities_v2", JSON.stringify(updated));
  };

  const totalInvested = currentBuyPrice * currentQuantity;
  const currentValue = currentPriceKRW * currentQuantity;
  const profitLoss = currentValue - totalInvested;
  const roi = currentBuyPrice > 0 ? ((currentPriceKRW - currentBuyPrice) / currentBuyPrice) * 100 : 0;

  // Chart calculation
  const defaultChartData = [40, 35, 45, 38, 55, 65, 75, 70, 85, 80, 90, 95];
  const baseData = cryptoData?.candles || defaultChartData;

  const getCandles = () => {
    if (cryptoData?.candles && cryptoData.candles.length > 0) {
      return cryptoData.candles;
    }
    // Fallback candle generation directly in frontend using USD charts
    let currentOpen = (baseData[0] as any) * 0.992;
    return (baseData as number[]).map((closeVal: number, i: number) => {
      const openVal = i === 0 ? currentOpen : (baseData as number[])[i - 1];
      const minOC = Math.min(openVal, closeVal);
      const maxOC = Math.max(openVal, closeVal);
      const hashVal = ((activeCoinId.charCodeAt(0) + i) * 17) % 25;
      const volPct = 0.001 + (hashVal / 1200);
      const highVal = maxOC * (1 + volPct);
      const lowVal = minOC * (1 - volPct);
      return {
        open: openVal,
        high: highVal,
        low: lowVal,
        close: closeVal,
        volume: 1000000 + hashVal * 50000 + (Math.random() * 200000)
      };
    });
  };

  const processedChartData = useMemo(() => {
    const candles = getCandles();
    const rawChartData = candles.map((candle: { open: number; high: number; low: number; close: number; volume?: number }, i: number) => {
    let label = "";
    const now = new Date();
    if (timeframe === "1H") {
      const d = new Date(now.getTime() - (11 - i) * 60 * 60 * 1000);
      label = d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
    } else if (timeframe === "1D") {
      const d = new Date(now.getTime() - (11 - i) * 24 * 60 * 60 * 1000);
      label = `${d.getMonth() + 1}/${d.getDate()}`;
    } else {
      const d = new Date(now.getTime() - (11 - i) * 7 * 24 * 60 * 60 * 1000);
      label = `${d.getMonth() + 1}/${d.getDate()}주`;
    }

    const { open, high, low, close } = candle;
    const openKRW = open * USD_TO_KRW;
    const highKRW = high * USD_TO_KRW;
    const lowKRW = low * USD_TO_KRW;
    const closeKRW = close * USD_TO_KRW;
    const isUp = closeKRW >= openKRW;

    return {
      time: label,
      open: openKRW,
      high: highKRW,
      low: lowKRW,
      close: closeKRW,
      bodyRange: [Math.min(openKRW, closeKRW), Math.max(openKRW, closeKRW)],
      volume: (candle.volume || 1000000) * USD_TO_KRW * 100, // scaled up for visualization
      isUp,
    };
  });

    return rawChartData.map((item, i: number) => {
    // 5-period moving average
    let sum5 = 0;
    let count5 = 0;
    for (let j = Math.max(0, i - 4); j <= i; j++) {
      sum5 += rawChartData[j].close;
      count5++;
    }
    const ma5 = sum5 / count5;

    // 10-period moving average
    let sum10 = 0;
    let count10 = 0;
    for (let j = Math.max(0, i - 9); j <= i; j++) {
      sum10 += rawChartData[j].close;
      count10++;
    }
    const ma10 = sum10 / count10;

      return {
        ...item,
        ma5: i >= 4 ? ma5 : undefined,
        ma10: i >= 9 ? ma10 : undefined,
      };
    });
  }, [cryptoData?.candles, timeframe, activeCoinId]);

  const footerLabels = useMemo(() => [
    processedChartData[0]?.time || "",
    processedChartData[3]?.time || "",
    processedChartData[6]?.time || "",
    processedChartData[9]?.time || "",
    processedChartData[11]?.time || "실시간"
  ], [processedChartData]);

  const chartDomain = useMemo(() => {
    const lows = processedChartData.map((d) => d.low);
    const highs = processedChartData.map((d) => d.high);
    const minLow = lows.length > 0 ? Math.min(...lows) : 0;
    const maxHigh = highs.length > 0 ? Math.max(...highs) : 100;
    return [minLow * 0.997, maxHigh * 1.003];
  }, [processedChartData]);

  // (Step 5) Algorithm Insights Analysis based on client-side properties
  const algoAction = useMemo(() => {
    const rsiVal = parseFloat(cryptoData?.rsi || "50");
    if (rsiVal < 30) return { label: "강력 매수 (과매도)", color: "text-[#E13030]", bg: "bg-[#E13030]/10" };
    if (rsiVal > 70) return { label: "강력 매도 (과매수)", color: "text-[#1261C4]", bg: "bg-[#1261C4]/10" };
    if (coin.trendUp) return { label: "보유 (상승 흐름)", color: "text-[#E13030]", bg: "bg-[#E13030]/10" };
    return { label: "관망 (중립)", color: "text-on-surface-variant", bg: "bg-surface-dim" };
  }, [cryptoData?.rsi, coin.trendUp]);
  const sentimentScoreVal = cryptoData?.sentimentScore || 68;
  const sentimentColorClass = sentimentScoreVal >= 50 ? "text-[#E13030]" : "text-[#1261C4]";

  return (
    <PriceProvider>
      <Helmet>
        <title>{coin.name} ({coin.symbol}) 실시간 시세 및 AI 지표 분석 | 알고리즘 트레이더</title>
        <meta name="description" content={`${coin.name}의 실시간 가격, 변동성, RSI, MAs 등 기술적 지표를 활용한 알고리즘 트레이딩 전문 리포트`} />
      </Helmet>
      <main className="w-full flex flex-col pb-20">
        <PriceTicker />
        <div className="p-4 lg:p-6 space-y-8 animate-in fade-in duration-700 max-w-[1280px] mx-auto w-full mt-4">
          <MarketOverview />

          <div className="card p-5 md:p-6 flex flex-col gap-5 transition-none">
            <form
              onSubmit={handleSearch}
              className="flex flex-col md:flex-row items-center justify-between gap-5 md:gap-6 w-full"
              aria-label="가상자산 검색"
            >
              <div className="flex items-center gap-4">
                {coin.image ? (
                  <img
                    src={coin.image}
                    alt={`${coin.name} 로고`}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="high"
                    className="w-12 h-12 rounded-full object-contain bg-surface p-1 border border-outline/20 shadow-sm content-visibility-auto"
                  />
                ) : (
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${coin.color} flex items-center justify-center font-bold text-white shadow-sm text-sm p-1`}
                  >
                    {coin.symbol}
                  </div>
                )}
                <div className="flex flex-col">
                  <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight text-on-surface uppercase flex items-center gap-3">
                    {coin.name}{" "}
                    <span className="text-primary font-mono text-xl md:text-2xl opacity-80 mt-1">
                      / USD
                    </span>
                  </h1>
                </div>
              </div>

              <div className="flex-1 max-w-2xl relative w-full flex flex-col gap-3" ref={searchInputRef}>
                <div className="relative">
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
                    placeholder="시장, 자산 검색 (예: 리플, 도지코인)"
                    className="w-full input-field !pl-12 !pr-24 font-mono uppercase"
                    aria-label="시장, 자산 검색"
                    autoComplete="off"
                  />
                  <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 pointer-events-none opacity-50">
                    <kbd className="px-2 py-1 bg-surface-dim rounded text-[10px] font-mono border border-outline/10 text-on-surface-variant">/</kbd>
                  </div>
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
                </div>
              </div>
            </form>

            <div className="flex items-center justify-between border-t border-outline/10 pt-4 mt-1">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5 whitespace-nowrap mr-2">
                  <Star className="w-3.5 h-3.5" /> 관심 자산
                </span>
                {favorites.length > 0 ? (
                  favorites.map(id => (
                    <button
                      key={id}
                      onClick={() => setActiveCoinId(id)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-mono font-bold whitespace-nowrap transition-colors border ${activeCoinId === id ? "bg-primary text-white border-primary" : "bg-surface-dim border-outline/10 text-on-surface hover:bg-surface-container"}`}
                    >
                      {id.toUpperCase()}
                    </button>
                  ))
                ) : (
                  <span className="text-[11px] text-on-surface-variant/50 font-mono">별 아이콘을 눌러 추가하세요</span>
                )}
              </div>
              <button
                onClick={() => toggleFavorite(activeCoinId)}
                className={`ml-4 flex-shrink-0 p-2 rounded-full transition-colors border ${favorites.includes(activeCoinId) ? "bg-amber-400/10 border-amber-400/30 text-amber-500" : "bg-surface-dim border-outline/10 text-on-surface-variant hover:text-on-surface hover:bg-surface-container"}`}
                title={favorites.includes(activeCoinId) ? "관심 자산에서 제거" : "관심 자산에 추가"}
              >
                <Star className={`w-4 h-4 ${favorites.includes(activeCoinId) ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>
          {/* Metrics Row */}
          <div className="flex overflow-x-auto pb-2 md:grid md:grid-cols-4 gap-6 no-scrollbar relative">
          {/* Metrics Row */}
            <MetricCard
              isLoading={loadingCrypto}
              label="현재 가격"
              value={formatUSDToKRW(cryptoData?.price || coin.price)}
              unit="KRW"
              trend={cryptoData?.trend || coin.trend}
              trendUp={
                cryptoData?.trend
                  ? !cryptoData.trend.includes("-")
                  : coin.trendUp
              }
            />
            <div className="card min-w-[280px] p-5 md:p-6 relative overflow-hidden flex flex-col justify-between">
              <p className="text-[11px] font-mono font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                24시간 변동성
              </p>
              <div className="flex items-baseline gap-2">
                <h2
                  className={`text-4xl font-display font-bold tracking-tight ${coin.volatility.includes("하락") ? "text-[#ba1a1a]" : "text-[#00C853]"}`}
                >
                  {coin.volatility}
                </h2>
              </div>
              <div className="mt-6 h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                <div
                  className={`h-full ${coin.volatility.includes("하락") ? "bg-[#ba1a1a]" : "bg-[#00C853]"} rounded-full`}
                  style={{ width: cryptoData ? "50%" : coin.volPercent }}
                ></div>
              </div>
              <div className="mt-3 flex justify-between text-[11px] font-mono font-semibold text-on-surface-variant">
                <span>저가: {formatUSDToKRW(cryptoData?.low24h || coin.volLow)}</span>
                <span>고가: {formatUSDToKRW(cryptoData?.high24h || coin.volHigh)}</span>
              </div>
            </div>
            <MetricCard
              isLoading={loadingCrypto}
              label="시가총액"
              value={formatUSDToKRWMacro(cryptoData?.marketCap || coin.marketCap)}
              unit=""
              badges={[{ text: coin.rank, isAccent: true }]}
              footerText={coin.fdv}
            />
            <MetricCard
              label="24시간 거래량"
              value={formatUSDToKRWMacro(cryptoData?.volume || coin.volume)}
              unit=""
              trend={coin.volChange}
              trendUp={!coin.volChange?.includes("↓")}
              footerText="전일 대비"
            />
          </div>

          {/* Main Dashboard Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
            {loadingCrypto && (
              <div className="absolute inset-0 z-20 bg-surface/30 backdrop-blur-sm flex justify-center rounded-2xl pt-32">
                <span className="text-sm font-bold text-primary animate-pulse block">
                  인공지능 실시간 분석 중...
                </span>
              </div>
            )}

            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Price Chart */}
              <div className="card p-5 md:p-8 min-h-[450px] relative flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                  <div>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-on-surface flex items-center gap-2">
                      가격 시각화{" "}
                      <span className="text-primary font-mono text-sm uppercase">
                        / {timeframe === "1H" ? "1시간" : timeframe === "1D" ? "24시간" : "12일"} 실시간 시세
                      </span>
                    </h3>
                    {mounted && cryptoData?.dataSource && (
                      <div className="flex items-center gap-1.5 text-xs text-on-surface-variant/80 mt-1.5 bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10 w-fit">
                        <Info className="w-3.5 h-3.5 text-primary" />
                        <span className="font-medium">동적 연동국: {cryptoData.dataSource}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button 
                      type="button"
                      onClick={() => setRefreshCount((p) => p + 1)}
                      disabled={loadingCrypto}
                      className="px-3 py-1.5 border border-outline/20 rounded-lg hover:bg-surface-dim/40 transition-all text-on-surface flex items-center gap-1.5 text-xs font-bold"
                      title="시세 데이터 새로고침"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingCrypto ? "animate-spin text-primary" : ""}`} />
                      <span>새로고침</span>
                    </button>

                    <div className="flex gap-1 border border-outline/20 p-1 rounded-lg bg-surface-container-lowest">
                      <button 
                        type="button"
                        onClick={() => setTimeframe("1H")}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                          timeframe === "1H" 
                            ? "bg-primary text-white font-bold shadow-sm" 
                            : "bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-dim/30"
                        }`}
                      >
                        1H
                      </button>
                      <button 
                        type="button"
                        onClick={() => setTimeframe("1D")}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                          timeframe === "1D" 
                            ? "bg-primary text-white font-bold shadow-sm" 
                            : "bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-dim/30"
                        }`}
                      >
                        1D
                      </button>
                      <button 
                        type="button"
                        onClick={() => setTimeframe("1W")}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                          timeframe === "1W" 
                            ? "bg-primary text-white font-bold shadow-sm" 
                            : "bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-dim/30"
                        }`}
                      >
                        1W
                      </button>
                    </div>
                  </div>
                </div>
 
                <div className="w-full h-[320px] md:h-[360px] relative mt-4">
                  {mounted && process.env.NODE_ENV !== "test" && (
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={processedChartData}
                        margin={{ top: 15, right: 10, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#E2E8F0"
                        />
                        <XAxis 
                          dataKey="time" 
                          stroke="#1E293B" 
                          fontSize={11}
                          fontWeight={600}
                          tickLine={false} 
                          axisLine={false} 
                          dy={10}
                        />
                        <YAxis 
                          yAxisId="price"
                          domain={chartDomain} 
                          tickFormatter={(v) => `₩${Math.round(v).toLocaleString()}`}
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
                          domain={[0, (dataMax: number) => dataMax * 5]}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              const isUp = data.isUp;
                              const formatPrice = (v: number) => `₩${Math.round(v).toLocaleString()} 원`;
                              const timeframeLabel = timeframe === "1H" ? "시간봉" : timeframe === "1D" ? "일봉" : "주봉";
                              return (
    
      <div className="bg-[#151b2e]/98 text-white p-4 rounded-xl border border-white/10 shadow-2xl backdrop-blur-md text-xs font-mono space-y-1.5 min-w-[210px]">
                                  <div className="text-[11px] font-bold text-slate-400 border-b border-white/10 pb-1 mb-1.5 flex justify-between items-center">
                                    <span>{data.time}</span>
                                    <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-white/80">업비트형 {timeframeLabel}</span>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <span className="text-slate-400">시가 (Open)</span>
                                    <span className="font-bold text-slate-200">{formatPrice(data.open)}</span>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <span className="text-slate-400">고가 (High)</span>
                                    <span className="font-bold text-[#E13030]">{formatPrice(data.high)}</span>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <span className="text-slate-400">저가 (Low)</span>
                                    <span className="font-bold text-[#1261C4]">{formatPrice(data.low)}</span>
                                  </div>
                                  <div className="flex justify-between gap-4 border-t border-white/10 pt-1.5 mt-1.5 flex-wrap">
                                    <span className="text-slate-400 font-sans">종가 (Close)</span>
                                    <span className={`font-bold ${isUp ? "text-[#E13030]" : "text-[#1261C4]"}`}>
                                      {formatPrice(data.close)} {isUp ? "▲ 상승" : "▼ 하락"}
                                    </span>
                                  </div>
                                  {data.ma5 && (
                                    <div className="flex justify-between gap-4 text-[10px] text-slate-300">
                                      <span className="flex items-center gap-1 font-sans">
                                        <span className="inline-block w-2 h-2 rounded-full bg-[#F59E0B]" />
                                        5선 이평선
                                      </span>
                                      <span className="font-bold">{formatPrice(data.ma5)}</span>
                                    </div>
                                  )}
                                  {data.ma10 && (
                                    <div className="flex justify-between gap-4 text-[10px] text-slate-300">
                                      <span className="flex items-center gap-1 font-sans">
                                        <span className="inline-block w-2 h-2 rounded-full bg-[#8B5CF6]" />
                                        10선 이평선
                                      </span>
                                      <span className="font-bold">{formatPrice(data.ma10)}</span>
                                    </div>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar
                          dataKey="bodyRange"
                          yAxisId="price"
                          shape={<CandlestickShape />}
                        />
                        <Bar
                          dataKey="volume"
                          yAxisId="volume"
                          fill="#94A3B8"
                          opacity={0.25}
                          barSize={12}
                        />
                        {/* 5-Period Moving Average line */}
                        <Line
                          yAxisId="price"
                          type="monotone"
                          dataKey="ma5"
                          stroke="#F59E0B"
                          strokeWidth={1.5}
                          dot={false}
                          activeDot={{ r: 4 }}
                          name="5선"
                        />
                        {/* 10-Period Moving Average line */}
                        <Line
                          yAxisId="price"
                          type="monotone"
                          dataKey="ma10"
                          stroke="#8B5CF6"
                          strokeWidth={1.5}
                          dot={false}
                          activeDot={{ r: 4 }}
                          name="10선"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <span className="text-7xl font-display font-black tracking-widest uppercase">
                      {coin.english}
                    </span>
                  </div>
                </div>
              </div>

              {/* Indicators Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <IndicatorCard
                  title="RSI (14)"
                  value={cryptoData?.rsi || "62.4"}
                  sub={
                    parseFloat(cryptoData?.rsi || "62") > 70
                      ? "OVERBOUGHT"
                      : parseFloat(cryptoData?.rsi || "62") < 30
                        ? "OVERSOLD"
                        : "NEUTRAL"
                  }
                  barValue={parseFloat(cryptoData?.rsi || "62")}
                  color="bullish"
                />
                <IndicatorCard
                  title="MA (50)"
                  value={formatUSDToKRW(cryptoData?.ma50 || "$2.82")}
                  sub="단기 추세선"
                  color="cyber"
                />
                <IndicatorCard
                  title="MA (200)"
                  value={formatUSDToKRW(cryptoData?.ma200 || "$2.15")}
                  sub="장기 추세선"
                  color="cyber"
                />
                <IndicatorCard
                  title="변동성"
                  value={cryptoData ? "Live" : "Low"}
                  sub={coin.volatility}
                  color="cyber"
                />
              {/* Portfolio ROI Analysis Simulator */}
              <div className="card p-6 md:p-8 relative flex flex-col border border-primary/10 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-outline/10">
                  <div>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-on-surface flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      내 투자 자산 실시간 분석 센터
                    </h3>
                    <p className="text-xs text-on-surface-variant font-medium mt-1">
                      현재 선택된 <span className="font-bold text-primary">{coin.name} ({coin.symbol})</span> 실시간 수치에 기반해 수익률을 즉각 분석합니다.
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[11px] font-mono font-bold tracking-wider">
                    ROI ESTIMATOR v2.5
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                  {/* Left Controls */}
                  <div className="space-y-5 flex flex-col justify-center">
                    <div>
                      <label htmlFor="buyPriceInput" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                        평균 매수 단가 (₩)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-on-surface-variant">₩</span>
                        <input
                          id="buyPriceInput"
                          type="number"
                          value={currentBuyPrice || ""}
                          onChange={(e) => handleBuyPriceChange(parseFloat(e.target.value) || 0)}
                          className="w-full input-field !pl-9 font-mono font-bold"
                          placeholder="매수 가격 입력 (원)"
                          step="any"
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-on-surface-variant mt-1.5 px-1 flex-wrap gap-2">
                        <span>현재 시세: ₩{Math.round(currentPriceKRW).toLocaleString()}</span>
                        <button 
                          type="button"
                          onClick={() => handleBuyPriceChange(Math.round(currentPriceKRW * 0.95))}
                          className="text-primary hover:underline font-bold"
                        >
                          현재 시세 -5% 자동 대입
                        </button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="quantityInput" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                        보유 수량 ({coin.symbol})
                      </label>
                      <div className="relative">
                        <input
                          id="quantityInput"
                          type="number"
                          value={currentQuantity || ""}
                          onChange={(e) => handleQuantityChange(parseFloat(e.target.value) || 0)}
                          className="w-full input-field font-mono font-bold"
                          placeholder="보유 가상자산 수량 입력"
                          step="any"
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-on-surface-variant mt-2 px-1">
                        <span>수량 빠른 조절</span>
                        <div className="flex gap-1.5">
                          <button type="button" onClick={() => handleQuantityChange(0)} className="px-2 py-0.5 bg-surface-dim border border-outline/10 rounded text-[10px] hover:bg-outline/10 transition-colors font-bold text-on-surface-variant text-center min-w-[36px]">0</button>
                          <button type="button" onClick={() => handleQuantityChange(Math.max(0, currentQuantity * 0.5))} className="px-2 py-0.5 bg-surface-dim border border-outline/10 rounded text-[10px] hover:bg-outline/10 transition-colors font-bold text-on-surface-variant text-center min-w-[36px]">½</button>
                          <button type="button" onClick={() => handleQuantityChange(currentQuantity + 0.1)} className="px-2 py-0.5 bg-surface-dim border border-outline/10 rounded text-[10px] hover:bg-outline/10 transition-colors font-bold text-on-surface-variant text-center min-w-[36px]">+0.1</button>
                          <button type="button" onClick={() => handleQuantityChange(currentQuantity + 1)} className="px-2 py-0.5 bg-surface-dim border border-outline/10 rounded text-[10px] hover:bg-outline/10 transition-colors font-bold text-on-surface-variant text-center min-w-[36px]">+1</button>
                          <button type="button" onClick={() => handleQuantityChange(currentQuantity * 2)} className="px-2 py-0.5 bg-surface-dim border border-outline/10 rounded text-[10px] hover:bg-outline/10 transition-colors font-bold text-on-surface-variant text-center min-w-[36px]">2x</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Asset comparison visualizer */}
                  <div className="bg-surface-dim/40 rounded-2xl p-5 border border-outline/10 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3 flex items-center gap-1.5">
                        <BarChart2 className="w-3.5 h-3.5 text-primary" />
                        자산 총 가치 대비 현황 비교
                      </h4>
                      <div className="w-full h-24 relative mt-1">
                        {mounted && (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                              data={[
                                { name: "투자 원금", 금액: Math.round(totalInvested), color: "#94A3B8" },
                                { name: "평가 총액", 금액: Math.round(currentValue), color: profitLoss >= 0 ? "#E13030" : "#1261C4" }
                              ]} 
                              layout="vertical" 
                              margin={{ left: 0, right: 15, top: 5, bottom: 5 }}
                            >
                              <XAxis type="number" hide />
                              <YAxis dataKey="name" type="category" fontSize={11} stroke="#64748B" width={64} axisLine={false} tickLine={false} />
                              <Bar dataKey="금액" radius={[0, 6, 6, 0]} barSize={12}>
                                <Cell fill="#94A3B8" />
                                <Cell fill={profitLoss >= 0 ? "#E13030" : "#1261C4"} />
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-outline/10 text-[11px] font-mono text-on-surface-variant">
                      <span>매수가: ₩{Math.round(currentBuyPrice).toLocaleString()} 원</span>
                      <span className="font-bold text-on-surface">잔고: {currentQuantity.toLocaleString()} {coin.symbol}</span>
                    </div>
                  </div>
                </div>

                {/* Bento dynamic stats indicators */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                  <div className="bg-surface border border-outline/10 p-5 rounded-xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-primary/30 transition-colors">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-surface-dim/50 rounded-full blur-xl pointer-events-none group-hover:bg-primary/5 transition-colors"></div>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                      총 매수 금액 (원금)
                    </span>
                    <h4 className="text-xl md:text-2xl font-mono font-bold text-on-surface mt-3 tracking-tight">
                      ₩{Math.round(totalInvested).toLocaleString()} <span className="text-sm font-sans font-medium text-on-surface-variant">원</span>
                    </h4>
                  </div>
                  <div className="bg-surface border border-outline/10 p-5 rounded-xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-primary/30 transition-colors">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-surface-dim/50 rounded-full blur-xl pointer-events-none group-hover:bg-primary/5 transition-colors"></div>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                      현재 평가 금액
                    </span>
                    <h4 className="text-xl md:text-2xl font-mono font-bold text-on-surface mt-3 tracking-tight">
                      ₩{Math.round(currentValue).toLocaleString()} <span className="text-sm font-sans font-medium text-on-surface-variant">원</span>
                    </h4>
                  </div>
                  <div className={`border p-5 rounded-xl flex flex-col justify-between shadow-sm relative overflow-hidden transition-colors ${profitLoss >= 0 ? "bg-[#E13030]/5 border-[#E13030]/20 hover:border-[#E13030]/40" : "bg-[#1261C4]/5 border-[#1261C4]/20 hover:border-[#1261C4]/40"}`}>
                    <div className={`absolute top-0 right-0 w-16 h-16 rounded-full blur-xl pointer-events-none ${profitLoss >= 0 ? "bg-[#E13030]/10" : "bg-[#1261C4]/10"}`}></div>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                      평가 손익 (Net Profit)
                    </span>
                    <h4 className={`text-xl md:text-2xl font-mono font-bold mt-3 tracking-tight ${profitLoss >= 0 ? "text-[#E13030]" : "text-[#1261C4]"}`}>
                      {profitLoss > 0 ? "+" : ""}₩{Math.round(profitLoss).toLocaleString()} <span className={`text-sm font-sans font-medium ${profitLoss >= 0 ? "text-[#E13030]/70" : "text-[#1261C4]/70"}`}>원</span>
                    </h4>
                  </div>
                  <div className={`border p-5 rounded-xl flex flex-col justify-between shadow-sm relative overflow-hidden transition-colors ${roi >= 0 ? "bg-gradient-to-br from-[#E13030]/10 to-transparent border-[#E13030]/30 hover:border-[#E13030]/50" : "bg-gradient-to-br from-[#1261C4]/10 to-transparent border-[#1261C4]/30 hover:border-[#1261C4]/50"}`}>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                      수익률 (ROI)
                    </span>
                    <h4 className={`text-3xl md:text-4xl font-display font-black mt-2 flex items-center gap-1 tracking-tighter ${roi >= 0 ? "text-[#E13030]" : "text-[#1261C4]"}`}>
                      {roi > 0 ? "+" : ""}{roi.toFixed(2)}<span className="text-xl">%</span>
                    </h4>
                  </div>
                </div>
              </div>

            </div>
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Sentiment */}
              <div className="card p-5 md:p-8 text-center flex items-center justify-center flex-col min-h-[300px]">
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-8 text-on-surface-variant px-4 py-1.5 border border-outline/20 rounded-full">
                  공포 / 탐욕 지수
                </h3>
                <div className="relative w-48 h-24 mx-auto overflow-hidden transition-all duration-1000">
                  <div className="sentiment-gauge w-48 h-48 rounded-full"></div>
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-20 bg-on-surface origin-bottom rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all duration-1000"
                    style={{
                      transform: `translateX(-50%) rotate(${cryptoData?.sentimentScore ? (cryptoData.sentimentScore / 100) * 180 - 90 : 45}deg)`,
                    }}
                  ></div>
                </div>
                <div className="text-center mt-6">
                  <h4 className={`text-3xl font-display font-bold tracking-tight ${sentimentColorClass}`}>
                    {cryptoData?.sentimentStatus || "낙관적"}
                  </h4>
                  <p className="text-sm font-semibold text-on-surface-variant mt-2">
                    인덱스: {sentimentScoreVal}/100
                  </p>
                </div>
              </div>

              {/* Related News */}
              <div className="card p-0 flex-1 flex flex-col h-[520px]">
                <div className="p-6 border-b border-outline/20 bg-surface-container-low rounded-t-2xl">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface flex items-center gap-2">
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
                            {item.label.replace(/(\[[^\]]*\]| <[^>]*> )/g, '')}
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
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Report Section */}
          <section className="card p-5 md:p-12 mt-10 md:mt-12 bg-surface border border-primary/20">
            <article className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-10 pb-4 md:pb-6 border-b border-outline/20">
                <span className="h-2 w-8 md:w-12 bg-primary rounded-full"></span>
                <h2 className="text-2xl md:text-4xl font-display font-bold tracking-tight text-on-surface flex gap-3 items-center">
                  시장 및 기술 분석 보고서
                  <span className={`text-sm px-3 py-1 rounded-full font-bold font-mono tracking-widest ${algoAction.bg} ${algoAction.color}`}>
                    AI 판독: {algoAction.label}
                  </span>
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-12">
                <div className="bg-primary/5 border border-primary/10 p-6 md:p-8 rounded-2xl">
                  <h3 className="text-primary font-display font-bold text-xl mb-6 flex items-center gap-3">
                    <BarChart2 className="w-6 h-6" /> 주요 핵심 요약 (실시간 데이터 연동)
                  </h3>
                  <ul className="space-y-4 text-base font-medium text-on-surface leading-relaxed">
                    {insights.length > 0 ? (
                      insights.slice(0, 3).map((insight, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-primary shrink-0 mt-1">●</span>
                          실시간 이슈: {insight.label.replace(/(\[[^\]]*\]| <[^>]*> )/g, '')}
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-start gap-3">
                          <span className="text-primary shrink-0 mt-1 animate-pulse">●</span> 
                          실시간 동향 데이터를 불러오는 중입니다...
                        </li>
                      </>
                    )}
                  </ul>
                </div>
                <div className="bg-surface border border-outline/20 p-6 md:p-8 rounded-2xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-xl mb-6 text-on-surface flex items-center gap-3">
                      <Activity className="w-6 h-6 text-on-surface-variant" />{" "}
                      프라이스 타겟
                    </h3>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center border-b border-outline/10 pb-4">
                        <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                          단기 저항선 (24H High 기반)
                        </p>
                        <p className="text-2xl font-mono border border-primary/20 bg-primary-light/30 px-3 py-1 rounded-lg font-bold text-primary">
                          {formatUSDToKRW(cryptoData?.high24h || "$3.25")}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                          장기 목표가 (MA200 기반)
                        </p>
                        <p
                          className={`text-2xl font-mono font-bold ${coin.targetColor === "text-bullish" ? "text-green-500" : "text-primary"}`}
                        >
                          {formatUSDToKRW(cryptoData?.ma200 || coin.targetPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-10 text-on-surface leading-relaxed text-lg font-sans">
                <div className="space-y-4">
                  <h3 className="text-2xl font-display font-bold text-on-surface mb-2">
                    01. 동적 시장 총평 및 실시간 분석
                  </h3>
                  <p className="text-on-surface-variant">
                    {cryptoData?.analysis ||
                      `로컬 알고리즘 분석 결과, ${coin.name}(${coin.symbol})은(는) 현재 RSI ${cryptoData?.rsi || "50"} 수준으로 ${algoAction.label} 포지션에 적합한 상태입니다. 실시간 동향과 단기 이평선(MA) 추세를 고려할 때 주의 깊은 접근이 요구됩니다.`}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-display font-bold text-on-surface mb-2">
                    02. 주요 관련 동향 브리핑
                  </h3>
                  <p className="text-on-surface-variant">
                    현재 모멘텀 지표(RSI)는{" "}
                    <strong>{cryptoData?.rsi || "62.4"}</strong>를 기록하며, 전반적인 시장 추세를 반영하고 있습니다. 특히 검색된 최신 뉴스 기반 동향으로 볼 때 다음과 같은 인사이트를 도출할 수 있습니다.
                  </p>
                  <blockquote className="border-l-4 border-primary bg-primary-light/20 p-6 xl:p-8 rounded-r-2xl italic text-primary/80 my-6 shadow-sm border-r border-y border-outline/10 font-medium break-keep">
                    "{insights.length > 0 ? `${insights[0].label.replace(/(\[[^\]]*\]| <[^>]*> )/g, '')} 등의 소식이 ${coin.name}의 투심에 영향을 주고 있습니다. (서버 비용을 최적화한 무료 RSS 통합 데이터)` : `관련 뉴스를 기반으로 시장 동향을 파악하고 있습니다. (Google 웹검색 실시간 기반 예측)`}"
                  </blockquote>
                </div>
              </div>
            </article>
          </section>
        </div>
        </div>
      </main>
    </PriceProvider>
  );
}

function MetricCard({
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
    <div className="card min-w-[280px] p-6 relative overflow-hidden flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-mono font-bold text-on-surface-variant uppercase tracking-widest">
            {label}
          </p>
          {badges &&
            badges.map((b: { text: string; isAccent?: boolean }, i: number) => (
              <span
                key={i}
                className={`px-2.5 py-1 rounded text-[10px] font-semibold tracking-wider ${b.isAccent ? "bg-primary border border-primary text-white" : "bg-surface-dim border border-outline/20"}`}
              >
                {b.text}
              </span>
            ))}
        </div>
        <div className="flex items-baseline gap-2">
          <h2 className="text-4xl font-display font-bold text-on-surface tracking-tight">
            {value}
          </h2>
          {unit && (
            <span className="text-sm font-semibold font-mono text-on-surface-variant">
              {unit}
            </span>
          )}
        </div>
      </div>
      {(trend || footerText) && (
        <div
          className={`mt-6 flex items-center text-sm font-semibold font-mono ${trendUp ? "text-[#00C853]" : "text-on-surface-variant"} gap-1.5 bg-surface-container-lowest p-2 rounded-lg w-fit border border-outline/10`}
        >
          {trendUp && <TrendingUp className="w-4 h-4" />}
          {trend && <span>{trend}</span>}
          {footerText && (
            <span className="text-on-surface-variant text-xs ml-1 font-sans">
              {footerText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function IndicatorCard({ title, value, sub, color, barValue }: {
  title: string;
  value: string | number;
  sub: string;
  color: "bullish" | "bearish" | "neutral" | string;
  barValue?: number;
}) {
  const isBullish = color === "bullish";
  const tColor = isBullish ? "text-[#00C853]" : "text-primary";
  const bgColor = isBullish ? "bg-[#00C853]" : "bg-primary";

  return (
    <div className="bg-surface rounded-xl p-5 border border-outline/20 shadow-sm flex flex-col justify-center">
      <p className="text-[10px] font-semibold text-on-surface-variant uppercase mb-2 tracking-wider">
        {title}
      </p>
      <p className={`text-2xl font-display font-bold ${tColor}`}>{value}</p>

      {barValue ? (
        <div className="w-full h-1.5 bg-surface-container mt-4 rounded-full overflow-hidden">
          <div
            className={`h-full ${bgColor}`}
            style={{ width: `${barValue}%` }}
          ></div>
        </div>
      ) : (
        <p
          className={`text-xs font-semibold ${tColor} mt-3 uppercase tracking-wider`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function InsightItem({ date, label, color }: {
  date: string;
  label: string;
  color: "bullish" | "bearish" | "cyber" | string;
}) {
  const isBullish = color === "bullish";
  const itemColor = isBullish ? "#00C853" : "var(--color-primary)";

  return (
    <div
      className={`p-4 rounded-xl bg-surface border border-outline/20 shadow-sm transition-all`}
      style={{ borderLeftWidth: "4px", borderLeftColor: itemColor }}
    >
      <p
        className="text-[10px] font-mono font-bold mb-2 uppercase tracking-wider"
        style={{ color: itemColor }}
      >
        {date}
      </p>
      <p className="text-sm leading-relaxed text-on-surface font-medium">
        {label}
      </p>
    </div>
    
  );
}
