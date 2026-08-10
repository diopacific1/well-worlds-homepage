import { useState, FormEvent, useEffect, useMemo, useRef, useCallback, Suspense, lazy } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { toast } from "../components/Toast";
import { useAssetData } from "../hooks/useAssetData";
import { useAssetFavorites } from "../hooks/useAssetFavorites";
import { DashboardSkeleton } from "../components/dashboard/DashboardSkeleton";
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

const AssetChart = lazy(() => import("../components/dashboard/AssetChart"));

import { PriceTicker } from "../components/PriceTicker";
import { PriceProvider } from "../context/PriceContext";
import { AssetSearch } from "../components/dashboard/AssetSearch";
import { MarketOverview } from "../components/MarketOverview";
import { FearAndGreed } from "../components/dashboard/FearAndGreed";
import { MOCK_COINS, AssetInfo as CoinInfo } from "../data/mockData";
import {
  MetricCard,
  IndicatorCard,
  InsightItem,
  LiveBadge,
} from "../components/dashboard/SharedCards";



export default function CryptoDashboard() {
  const [activeCoinId, setActiveCoinId] = useState("bitcoin");

  // Watchlist (Favorites) state
  const { favorites, toggleFavorite } = useAssetFavorites("crypto_favorites_v1");

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on '/'
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        document.getElementById("assetSearch")?.focus();
      }
      // Escape to close dropdown or blur input
      if (e.key === "Escape") {
        if (document.activeElement?.id === "assetSearch") {
          (document.activeElement as HTMLElement).blur();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const [mounted, setMounted] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [timeframe, setTimeframe] = useState<"1H" | "1D" | "1W">("1D");

  const {
    data: cryptoData,
    loading: loadingCrypto,
    error: fetchError,
  } = useAssetData(activeCoinId, timeframe, "crypto", refreshCount);

  // Portfolio tracking state with persistence in KRW
  const [userBalance, setUserBalance] = useState<number>(() => {
    const saved = localStorage.getItem("crypto_balance_v1");
    return saved ? parseFloat(saved) : 10000000;
  });
  const [userPositions, setUserPositions] = useState<Record<string, number>>(
    () => {
      const saved = localStorage.getItem("crypto_positions_v1");
      return saved ? JSON.parse(saved) : {};
    },
  );

  useEffect(() => {
    localStorage.setItem("crypto_balance_v1", userBalance.toString());
    localStorage.setItem("crypto_positions_v1", JSON.stringify(userPositions));
  }, [userBalance, userPositions]);

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

  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // News fetching

  const [insights, setInsights] = useState<
    Array<{ date: string; label: string; link?: string; color?: string }>
  >([]);
  useEffect(() => {
    const coinName = MOCK_COINS[activeCoinId]?.name || activeCoinId;
    fetch(
      `/api/news?q=${encodeURIComponent("가상화폐 " + coinName + " when:7d")}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          const timeAgo = (dateStr: string) => {
            if (!dateStr) return "최신";
            const date = new Date(dateStr);
            const now = new Date();
            const diffHours = Math.floor(
              (now.getTime() - date.getTime()) / (1000 * 60 * 60),
            );
            if (diffHours < 1) return "방금 전";
            if (diffHours < 24) return `${diffHours}시간 전`;
            return `${Math.floor(diffHours / 24)}일 전`;
          };

          const newInsights = data.items.map((item: any) => {
            const title = item.title.replace(/<[^>]*>?/gm, "");
            const isBullish =
              title.includes("상승") ||
              title.includes("강세") ||
              title.includes("급등") ||
              title.includes("돌파") ||
              title.includes("호실적");
            const isBearish =
              title.includes("하락") ||
              title.includes("약세") ||
              title.includes("급락") ||
              title.includes("이탈") ||
              title.includes("위기");
            let label = title;
            if (isBullish && !label.includes("[상승]"))
              label = `[상승] ${label}`;
            if (isBearish && !label.includes("[하락]"))
              label = `[하락] ${label}`;
            return { date: timeAgo(item.pubDate), label };
          });
          setInsights(newInsights.slice(0, 4));
        }
      })
      .catch(console.error);
  }, [activeCoinId, refreshCount]);

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
    if (upper.includes("T")) multiplier = 1e12;
    else if (upper.includes("B")) multiplier = 1e9;
    else if (upper.includes("M")) multiplier = 1e6;
    else if (upper.includes("K")) multiplier = 1e3;
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

  const currentBuyPrice =
    buyPrices[activeCoinId] !== undefined
      ? buyPrices[activeCoinId]
      : Math.round(currentPriceKRW * 0.95);
  const currentQuantity =
    quantities[activeCoinId] !== undefined
      ? quantities[activeCoinId]
      : activeCoinId === "bitcoin"
        ? 0.25
        : activeCoinId === "ethereum"
          ? 1.5
          : activeCoinId === "solana"
            ? 15
            : 200;

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
  const roi =
    currentBuyPrice > 0
      ? ((currentPriceKRW - currentBuyPrice) / currentBuyPrice) * 100
      : 0;

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
      const volPct = 0.001 + hashVal / 1200;
      const highVal = maxOC * (1 + volPct);
      const lowVal = minOC * (1 - volPct);
      return {
        open: openVal,
        high: highVal,
        low: lowVal,
        close: closeVal,
        volume: 1000000 + hashVal * 50000 + Math.random() * 200000,
      };
    });
  };

  const processedChartData = useMemo(() => {
    const candles = getCandles();
    const rawChartData = candles.map(
      (
        candle: {
          open: number;
          high: number;
          low: number;
          close: number;
          volume?: number;
        },
        i: number,
      ) => {
        let label = "";
        const now = new Date();
        if (timeframe === "1H") {
          const d = new Date(now.getTime() - (11 - i) * 60 * 60 * 1000);
          label = d.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
        } else if (timeframe === "1D") {
          const d = new Date(now.getTime() - (11 - i) * 24 * 60 * 60 * 1000);
          label = `${d.getMonth() + 1}/${d.getDate()}`;
        } else {
          const d = new Date(
            now.getTime() - (11 - i) * 7 * 24 * 60 * 60 * 1000,
          );
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
      },
    );

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

  const footerLabels = useMemo(
    () => [
      processedChartData[0]?.time || "",
      processedChartData[3]?.time || "",
      processedChartData[6]?.time || "",
      processedChartData[9]?.time || "",
      processedChartData[11]?.time || "실시간",
    ],
    [processedChartData],
  );

  const chartDomain = useMemo(() => {
    const lows = processedChartData.map((d) => d.low);
    const highs = processedChartData.map((d) => d.high);
    const minLow = lows.length > 0 ? Math.min(...lows) : 0;
    const maxHigh = highs.length > 0 ? Math.max(...highs) : 100;
    return [minLow * 0.997, maxHigh * 1.003] as [number, number];
  }, [processedChartData]);

  // (Step 5) Algorithm Insights Analysis based on client-side properties
  const algoAction = useMemo(() => {
    const rsiVal = parseFloat(cryptoData?.rsi || "50");
    if (rsiVal < 30)
      return {
        label: "강력 매수 (과매도)",
        color: "text-kr-up",
        bg: "bg-kr-up/10",
      };
    if (rsiVal > 70)
      return {
        label: "강력 매도 (과매수)",
        color: "text-kr-down",
        bg: "bg-kr-down/10",
      };
    if (coin.trendUp)
      return {
        label: "보유 (상승 흐름)",
        color: "text-kr-up",
        bg: "bg-kr-up/10",
      };
    return {
      label: "관망 (중립)",
      color: "text-on-surface-variant",
      bg: "bg-surface-dim",
    };
  }, [cryptoData?.rsi, coin.trendUp]);
  const sentimentScoreVal = cryptoData?.sentimentScore || 68;
  const sentimentColorClass =
    sentimentScoreVal >= 50 ? "text-kr-up" : "text-kr-down";

  return (
    <PriceProvider>
      <Helmet>
        <title>
          {coin.name} ({coin.symbol}) 실시간 시세 및 AI 지표 분석 | 알고리즘
          트레이더
        </title>
        <meta
          name="description"
          content={`${coin.name}의 실시간 가격, 변동성, RSI, MAs 등 기술적 지표를 활용한 알고리즘 트레이딩 전문 리포트`}
        />
      </Helmet>
      <main className="w-full flex flex-col pb-20">
        <PriceTicker />
        <div className="p-4 lg:p-6 space-y-8 animate-in fade-in duration-700 max-w-[1280px] mx-auto w-full mt-4">
          <MarketOverview />
          <AssetSearch
            activeCoinId={activeCoinId}
            onSelectAsset={setActiveCoinId}
            favorites={favorites}
            onToggleFavorite={(id) => toggleFavorite(id, favorites)}
            searchMappings={SEARCH_MAPPINGS}
            placeholder="가상자산 검색 (예: 리플, 도지코인)"
            coinData={coin}
          />

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
                  className={`text-4xl font-display font-bold tracking-tight ${coin.volatility.includes("하락") ? "text-kr-down" : "text-kr-up"}`}
                >
                  {coin.volatility}
                </h2>
              </div>
              <div className="mt-6 h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                <div
                  className={`h-full ${coin.volatility.includes("하락") ? "bg-kr-down" : "bg-kr-up"} rounded-full`}
                  style={{ width: cryptoData ? "50%" : coin.volPercent }}
                ></div>
              </div>
              <div className="mt-3 flex justify-between text-[11px] font-mono font-semibold text-on-surface-variant">
                <span>
                  저가: {formatUSDToKRW(cryptoData?.low24h || coin.volLow)}
                </span>
                <span>
                  고가: {formatUSDToKRW(cryptoData?.high24h || coin.volHigh)}
                </span>
              </div>
            </div>
            <MetricCard
              isLoading={loadingCrypto}
              label="시가총액"
              value={formatUSDToKRWMacro(
                cryptoData?.marketCap || coin.marketCap,
              )}
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 relative">
            {loadingCrypto && <DashboardSkeleton />}

            {fetchError && (
              <div className="absolute inset-0 z-20 bg-surface/80 backdrop-blur-sm flex justify-center pt-32 p-6">
                <div className="bg-surface border border-red-500/30 p-6 rounded-2xl shadow-xl max-w-sm h-fit text-center">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h3 className="text-on-surface font-bold text-lg mb-2">
                    데이터를 불러오지 못했습니다
                  </h3>
                  <p className="text-on-surface-variant text-sm mb-6">
                    {fetchError}
                  </p>
                  <button
                    onClick={() => setRefreshCount((r) => r + 1)}
                  aria-label="데이터 다시 불러오기"
                  className="px-6 py-2 bg-primary text-white rounded-full font-bold text-sm hover:bg-primary/90 transition-colors"
                  >
                    다시 시도
                  </button>
                </div>
              </div>
            )}

            {/* Main Column */}
            <div className="lg:col-span-8 flex flex-col gap-6 lg:gap-8">
              {/* Price Chart */}
              <div className="card p-5 md:p-8 min-h-[450px] relative flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                  <div>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-on-surface flex items-center gap-2">
                      가격 시각화{" "}
                      <span className="text-primary font-mono text-sm uppercase">
                        /{" "}
                        {timeframe === "1H"
                          ? "1시간"
                          : timeframe === "1D"
                            ? "24시간"
                            : "12일"}{" "}
                        실시간 시세
                      </span>
                    </h3>
                    {mounted && cryptoData?.dataSource && (
                      <div className="flex items-center gap-1.5 text-xs text-on-surface-variant/80 mt-1.5 bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10 w-fit">
                        <Info className="w-3.5 h-3.5 text-primary" />
                        <span className="font-medium">
                          동적 연동국: {cryptoData.dataSource}
                        </span>
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
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${loadingCrypto ? "animate-spin text-primary" : ""}`}
                      />
                      <span>새로고침</span>
                    </button>

                    <div className="flex gap-1 border border-outline/20 p-1 rounded-lg bg-surface-container-lowest">
                      <button
                        type="button"
                        onClick={() => setTimeframe("1H")}
                        aria-pressed={timeframe === "1H"}
                        aria-label="1시간 차트 보기"
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
                        aria-pressed={timeframe === "1D"}
                        aria-label="1일 차트 보기"
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
                        aria-pressed={timeframe === "1W"}
                        aria-label="1주 차트 보기"
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
                    <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-on-surface-variant"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div></div>}>
                      <AssetChart
                        data={processedChartData}
                        domain={chartDomain}
                        timeframe={timeframe}
                        marketType="crypto"
                      />
                    </Suspense>
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
              </div>
              {/* Sidebar */}
              <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-8">
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
                    <h4
                      className={`text-3xl font-display font-bold tracking-tight ${sentimentColorClass}`}
                    >
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
                      <Activity className="w-4 h-4 text-primary" /> 실시간 관련
                      뉴스
                    </h3>
                  </div>
                  <div className="p-4 md:p-6 space-y-3 overflow-y-auto flex-1 relative hide-scrollbar bg-surface rounded-b-2xl">
                    {insights.length > 0 ? (
                      insights.map((item, idx) => (
                        <a
                          href={item.link} target="_blank" rel="noopener noreferrer"
                          key={idx}
                          className="block group p-4 rounded-xl border border-outline/10 bg-surface-container-lowest hover:bg-surface-dim hover:border-primary/30 transition-all shadow-sm"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-relaxed">
                              {item.label.replace(
                                /(\[[^\]]*\]| <[^>]*> )/g,
                                "",
                              )}
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
            <section className="card p-6 md:p-10 lg:p-12 mt-10 md:mt-12 bg-surface border border-outline/10">
              <article className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-outline/20">
                  <div className="flex items-center gap-4">
                    <span className="h-2 w-8 md:w-12 bg-primary rounded-full"></span>
                    <h2 className="text-2xl md:text-4xl font-display font-bold tracking-tight text-on-surface flex gap-3 items-center">
                      시장 및 기술 분석 보고서
                    </h2>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-xl font-bold font-mono tracking-widest text-sm flex items-center gap-2 border ${algoAction.bg} ${algoAction.color} border-current`}
                  >
                    <Activity className="w-4 h-4" /> AI 판독: {algoAction.label}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Narrative & Analysis */}
                  <div className="lg:col-span-7 xl:col-span-8 space-y-10">
                    <div className="space-y-5">
                      <h3 className="text-xl md:text-2xl font-display font-bold text-on-surface flex items-center gap-3">
                        <span className="text-primary text-sm font-mono tracking-widest uppercase bg-primary/10 px-2 py-1 rounded">
                          Sec 01
                        </span>
                        동적 시장 총평 및 실시간 분석
                      </h3>
                      <p className="text-on-surface-variant/90 leading-relaxed text-lg font-sans">
                        {cryptoData?.analysis ||
                          `로컬 알고리즘 분석 결과, ${coin.name}(${coin.symbol})은(는) 현재 RSI ${cryptoData?.rsi || "50"} 수준으로 ${algoAction.label} 포지션에 적합한 상태입니다. 실시간 동향과 단기 이평선(MA) 추세를 고려할 때 주의 깊은 접근이 요구됩니다.`}
                      </p>
                    </div>

                    <div className="space-y-5">
                      <h3 className="text-xl md:text-2xl font-display font-bold text-on-surface flex items-center gap-3">
                        <span className="text-primary text-sm font-mono tracking-widest uppercase bg-primary/10 px-2 py-1 rounded">
                          Sec 02
                        </span>
                        주요 관련 동향 브리핑
                      </h3>
                      <p className="text-on-surface-variant/90 leading-relaxed text-lg font-sans">
                        현재 모멘텀 지표(RSI)는{" "}
                        <strong className="text-on-surface">
                          {cryptoData?.rsi || "62.4"}
                        </strong>
                        를 기록하며, 전반적인 시장 추세를 반영하고 있습니다.
                        특히 검색된 최신 뉴스 기반 동향으로 볼 때 다음과 같은
                        인사이트를 도출할 수 있습니다.
                      </p>
                      <blockquote className="border-l-4 border-primary bg-primary/5 p-6 md:p-8 rounded-r-2xl italic text-on-surface-variant my-6 shadow-sm font-medium break-keep">
                        "
                        {insights.length > 0
                          ? `${insights[0].label.replace(/(\[[^\]]*\]| <[^>]*> )/g, "")} 등의 실시간 소식이 ${coin.name}의 투심에 영향을 미치고 있습니다.`
                          : `관련 뉴스를 기반으로 시장 동향을 파악하고 있습니다.`}
                        "
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
                              <span className="text-primary shrink-0 mt-0.5">
                                ●
                              </span>
                              {insight.label.replace(
                                /(\[[^\]]*\]| <[^>]*> )/g,
                                "",
                              )}
                            </li>
                          ))
                        ) : (
                          <li className="flex items-start gap-3">
                            <span className="text-primary shrink-0 mt-0.5 animate-pulse">
                              ●
                            </span>
                            실시간 동향 데이터를 불러오는 중입니다...
                          </li>
                        )}
                      </ul>
                    </div>

                    <FearAndGreed
                      score={cryptoData?.sentimentScore || 42}
                      label="AI 시장 공포/탐욕 지수"
                    />
                    <div className="bg-surface border border-outline/20 p-6 md:p-8 rounded-2xl shadow-sm">
                      <h3 className="font-display font-bold text-lg mb-6 text-on-surface flex items-center gap-2">
                        <Activity className="w-5 h-5 text-on-surface-variant" />{" "}
                        프라이스 타겟
                      </h3>
                      <div className="space-y-6">
                        <div className="flex justify-between items-center border-b border-outline/10 pb-4">
                          <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                            단기 저항선 (24H High 기반)
                          </p>
                          <p className="text-xl font-mono bg-surface-dim px-3 py-1 rounded-lg font-bold text-on-surface">
                            {formatUSDToKRW(cryptoData?.high24h || "$3.25")}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                            장기 목표가 (MA200 기반)
                          </p>
                          <p
                            className={`text-2xl font-mono font-bold ${coin.targetColor === "text-bullish" ? "text-green-500" : "text-primary"}`}
                          >
                            {formatUSDToKRW(
                              cryptoData?.ma200 || coin.targetPrice,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
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
