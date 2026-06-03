import { useState, FormEvent, useEffect } from "react";
import {
  Search,
  Wallet,
  TrendingUp,
  TrendingDown,
  Activity,
  ChevronRight,
  BarChart2,
  List,
} from "lucide-react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MarketOverview } from "../components/MarketOverview";
import { PriceTicker } from "../components/PriceTicker";
import { PriceProvider } from "../context/PriceContext";

const MOCK_COINS: Record<string, any> = {
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
};

export default function CryptoDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCoinId, setActiveCoinId] = useState("bitcoin");
  const [insights, setInsights] = useState<any[]>([]);
  const [cryptoData, setCryptoData] = useState<any>(null);
  const [loadingCrypto, setLoadingCrypto] = useState(true);

  useEffect(() => {
    const coinName = MOCK_COINS[activeCoinId]?.name || activeCoinId;
    fetch(`/api/news?q=${encodeURIComponent("가상화폐 " + coinName)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          setInsights(
            data.items.slice(0, 8).map((item: any) => ({
              date: "최신 관련 뉴스",
              label: item.title,
              color: "cyber",
              link: item.link,
            })),
          );
        }
      })
      .catch((err) => console.error(err));
  }, [activeCoinId]);

  useEffect(() => {
    setLoadingCrypto(true);
    fetch(`/api/crypto?id=${activeCoinId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error("API Error:", data.error);
          setCryptoData(null);
        } else {
          setCryptoData(data);
        }
        setLoadingCrypto(false);
      })
      .catch((err) => {
        console.error(err);
        setCryptoData(null);
        setLoadingCrypto(false);
      });
  }, [activeCoinId]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const term = searchTerm.toLowerCase().trim();
    if (!term) return;

    if (
      term.includes("btc") ||
      term.includes("bitcoin") ||
      term.includes("비트코인")
    ) {
      setActiveCoinId("bitcoin");
    } else if (
      term.includes("eth") ||
      term.includes("ethereum") ||
      term.includes("이더리움")
    ) {
      setActiveCoinId("ethereum");
    } else if (
      term.includes("sol") ||
      term.includes("solana") ||
      term.includes("솔라나")
    ) {
      setActiveCoinId("solana");
    } else if (
      term.includes("w") ||
      term.includes("wormhole") ||
      term.includes("웜홀")
    ) {
      setActiveCoinId("wormhole");
    } else {
      setActiveCoinId(term);
    }
  };

  const coin = MOCK_COINS[activeCoinId] || {
    name: activeCoinId.toUpperCase(),
    symbol: activeCoinId.substring(0, 3).toUpperCase(),
    symbolLength: "w-10 h-10",
    color: "from-slate-600 to-slate-800",
    price: "$0.00",
    trend: "0.00%",
    trendUp: true,
    volatility: "검색된 자산",
    volLow: "-",
    volHigh: "-",
    marketCap: "-",
    rank: "Rank -",
    fdv: "-",
    volume: "-",
    volChange: "-",
    english: activeCoinId.toUpperCase(),
    targetPrice: "-",
    targetColor: "text-cyber",
    volColor: "bg-cyber",
    volPercent: "50%",
  };

  // Chart calculation
  const defaultChartData = [40, 35, 45, 38, 55, 65, 75, 70, 85, 80, 90, 95];
  const chartData = cryptoData?.chartData || defaultChartData;
  const minChart = Math.min(...chartData);
  const maxChart = Math.max(...chartData);
  const normalizedChartData = chartData.map((v: number) => {
    if (maxChart === minChart) return 50;
    // normalize between 10% and 100%
    return 10 + ((v - minChart) / (maxChart - minChart)) * 90;
  });

  return (
    <PriceProvider>
      <div className="w-full flex flex-col pb-20">
        <PriceTicker />
        <div className="p-4 lg:p-6 space-y-8 animate-in fade-in duration-700 max-w-[1280px] mx-auto w-full mt-4">
          <MarketOverview />

          {/* Search Header */}
          <form
            onSubmit={handleSearch}
            className="card p-6 flex flex-col sm:flex-row items-center justify-between gap-6 transition-none"
            aria-label="가상자산 검색"
          >
            <div className="flex items-center gap-4">
              {coin.image ? (
                <img
                  src={coin.image}
                  alt={`${coin.name} 로고`}
                  loading="lazy"
                  className="w-12 h-12 rounded-full object-contain bg-surface p-1 border border-outline/20 shadow-sm"
                />
              ) : (
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${coin.color} flex items-center justify-center font-bold text-white shadow-sm`}
                >
                  {coin.symbol}
                </div>
              )}
              <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight text-on-surface uppercase flex items-center gap-3">
                {coin.name}{" "}
                <span className="text-primary font-mono text-xl md:text-2xl opacity-80 mt-1">
                  / USD
                </span>
              </h1>
            </div>

            <div className="flex-1 max-w-xl relative w-full">
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
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="시장, 자산 검색 (예: 비트코인)"
                className="w-full input-field !pl-12 font-mono uppercase"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary/10 text-primary rounded-md text-xs font-bold hover:bg-primary/20 transition-colors"
                aria-label="검색 실행"
              >
                검색
              </button>
            </div>

            <button
              type="button"
              className="w-full sm:w-auto btn-primary uppercase tracking-wider text-sm"
            >
              <Wallet className="w-4 h-4" /> 지갑 연결
            </button>
          </form>

          {/* Metrics Row */}
          <div className="flex overflow-x-auto pb-2 md:grid md:grid-cols-4 gap-6 no-scrollbar relative">
            {loadingCrypto && (
              <div className="absolute inset-0 z-10 bg-surface/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                <span className="text-sm font-bold text-primary animate-pulse">
                  실시간 데이터 동기화 중...
                </span>
              </div>
            )}
            <MetricCard
              label="현재 가격"
              value={cryptoData?.price || coin.price}
              unit="USD"
              trend={cryptoData?.trend || coin.trend}
              trendUp={
                cryptoData?.trend
                  ? !cryptoData.trend.includes("-")
                  : coin.trendUp
              }
            />
            <div className="card min-w-[280px] p-6 relative overflow-hidden flex flex-col justify-between">
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
                <span>저가: {cryptoData?.low24h || coin.volLow}</span>
                <span>고가: {cryptoData?.high24h || coin.volHigh}</span>
              </div>
            </div>
            <MetricCard
              label="시가총액"
              value={cryptoData?.marketCap || coin.marketCap}
              badges={[{ text: coin.rank, isAccent: true }]}
              footerText={coin.fdv}
            />
            <MetricCard
              label="24시간 거래량"
              value={cryptoData?.volume || coin.volume}
              trend={coin.volChange}
              trendUp={!coin.volChange.includes("↓")}
              footerText="전일 대비"
            />
          </div>

          {/* Main Dashboard Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
            {loadingCrypto && (
              <div className="absolute inset-0 z-10 bg-surface/50 backdrop-blur-sm flex justify-center rounded-2xl pt-32">
                <span className="text-sm font-bold text-primary animate-pulse block">
                  인공지능 실시간 분석 중...
                </span>
              </div>
            )}

            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Price Chart */}
              <div className="card p-8 min-h-[450px] relative flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-on-surface flex items-center gap-2">
                      가격 시각화{" "}
                      <span className="text-primary font-mono text-sm uppercase">
                        / 7일 실시간 시세
                      </span>
                    </h3>
                  </div>
                  <div className="flex gap-2 border border-outline/20 p-1 rounded-lg bg-surface-container-lowest">
                    <button className="px-4 py-1.5 rounded-md bg-transparent text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-dim/30 transition-all">
                      1H
                    </button>
                    <button className="px-4 py-1.5 rounded-md bg-primary text-white text-xs font-bold shadow-sm transition-all">
                      1D
                    </button>
                    <button className="px-4 py-1.5 rounded-md bg-transparent text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-dim/30 transition-all">
                      1W
                    </button>
                  </div>
                </div>

                <div className="flex-1 relative mt-4 -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData.map((v: number, i: number) => ({
                        time: i,
                        value: v,
                      }))}
                    >
                      <defs>
                        <linearGradient
                          id="colorValue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#4648d4"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#4648d4"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#E2E8F0"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          borderRadius: "12px",
                          border: "1px solid #e2e7ff",
                          boxShadow: "0 12px 24px -4px rgba(70,72,212,0.1)",
                        }}
                        itemStyle={{
                          color: "#131b2e",
                          fontWeight: "bold",
                          fontFamily: "monospace",
                        }}
                        labelStyle={{ display: "none" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#4648d4"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <span className="text-7xl font-display font-black tracking-widest uppercase">
                      {coin.english}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between mt-6 pt-4 border-t border-outline/20 text-xs font-mono font-semibold text-on-surface-variant">
                  <span>7일전</span>
                  <span>5일전</span>
                  <span>3일전</span>
                  <span>1일전</span>
                  <span className="text-primary font-bold border-b-2 border-primary pb-1">
                    오늘 (실시간)
                  </span>
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
                  value={cryptoData?.ma50 || "$2.82"}
                  sub="단기 추세선"
                  color="cyber"
                />
                <IndicatorCard
                  title="MA (200)"
                  value={cryptoData?.ma200 || "$2.15"}
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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Sentiment */}
              <div className="card p-8 text-center flex items-center justify-center flex-col min-h-[300px]">
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
                  <h4 className="text-3xl font-display font-bold text-[#00C853] tracking-tight">
                    {cryptoData?.sentimentStatus || "낙관적"}
                  </h4>
                  <p className="text-sm font-semibold text-on-surface-variant mt-2">
                    인덱스: {cryptoData?.sentimentScore || 68}/100
                  </p>
                </div>
              </div>

              {/* Related News */}
              <div className="card p-0 flex-1 flex flex-col h-[520px]">
                <div className="p-6 border-b border-outline/20 bg-surface-container-low rounded-t-2xl">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface">
                    실시간 관련 뉴스
                  </h3>
                </div>
                <div className="p-6 space-y-3 overflow-y-auto pr-4 flex-1 relative hide-scrollbar bg-surface rounded-b-2xl">
                  {insights.length > 0 ? (
                    insights.map((item, idx) => (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={idx}
                        className="block group hover:-translate-y-1 transition-transform"
                      >
                        <InsightItem
                          date={item.date}
                          label={item.label}
                          color={item.color}
                        />
                      </a>
                    ))
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-primary animate-pulse">
                      뉴스를 분석 중입니다...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Report Section */}
          <section className="card p-8 md:p-12 mt-12 bg-surface border border-primary/20">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-outline/20">
                <span className="h-2 w-12 bg-primary rounded-full"></span>
                <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-on-surface">
                  시장 및 기술 분석 보고서
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-primary/5 border border-primary/10 p-8 rounded-2xl">
                  <h3 className="text-primary font-display font-bold text-xl mb-6 flex items-center gap-3">
                    <BarChart2 className="w-6 h-6" /> 주요 핵심 요약
                  </h3>
                  <ul className="space-y-4 text-base font-medium text-on-surface leading-relaxed">
                    <li className="flex items-start gap-3">
                      <span className="text-primary shrink-0 mt-1">●</span> 7일
                      프레임 기준 뚜렷한 "상승 저점(Higher-Low)" 패턴 형성.
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary shrink-0 mt-1">●</span>{" "}
                      저항선이었던 $3.00이 성공적으로 구조적 지지선으로 전환됨.
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary shrink-0 mt-1">●</span>{" "}
                      ZK-Proof 기술 도입이 마켓 내 압도적 기술 우위를 점함.
                    </li>
                  </ul>
                </div>
                <div className="bg-surface border border-outline/20 p-8 rounded-2xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-xl mb-6 text-on-surface flex items-center gap-3">
                      <Activity className="w-6 h-6 text-on-surface-variant" />{" "}
                      프라이스 타겟
                    </h3>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center border-b border-outline/10 pb-4">
                        <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                          단기 저항선
                        </p>
                        <p className="text-2xl font-mono border border-primary/20 bg-primary-light/30 px-3 py-1 rounded-lg font-bold text-primary">
                          $3.25
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                          연말 목표가 (Y/E)
                        </p>
                        <p
                          className={`text-2xl font-mono font-bold ${coin.targetColor === "text-bullish" ? "text-[#00C853]" : "text-primary"}`}
                        >
                          {coin.targetPrice}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-10 text-on-surface leading-relaxed text-lg font-sans">
                <div className="space-y-4">
                  <h3 className="text-2xl font-display font-bold text-on-surface mb-2">
                    01. 실시간 인공지능 시장 총평
                  </h3>
                  <p className="text-on-surface-variant">
                    {cryptoData?.analysis ||
                      `2026년 5월 말 기준, ${coin.name}(${coin.symbol})은(는) 주요 크립토 어셋으로서의 포지션을 단단히 굳히고 있습니다. 시가총액은 약 ${coin.marketCap}에 달하며, 전반적인 시장의 이목을 끌고 있습니다.`}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-display font-bold text-on-surface mb-2">
                    02. 기술적 심층 분석 (검색 데이터 기반)
                  </h3>
                  <p className="text-on-surface-variant">
                    현재 14일 RSI 지표는{" "}
                    <strong>{cryptoData?.rsi || "62.4"}</strong>를 기록, 과매수
                    구간에 진입하지 않으면서도 안정적인 모멘텀을 유지하고
                    있습니다. 특히 {cryptoData?.ma50 || "$2.82"}의 50일
                    이동평균선 상단을 여유롭게 돌파하여 중기적 강세 기조가
                    유효함을 증명했습니다.
                  </p>
                  <blockquote className="border-l-4 border-primary bg-primary-light/20 p-6 xl:p-8 rounded-r-2xl italic text-primary/80 my-6 shadow-sm border-r border-y border-outline/10 font-medium">
                    "최근 나타난 이동평균선과 현재 가격(
                    {cryptoData?.price || coin.price})의 구조적 시그널은 견고한
                    바닥을 형성하고 있습니다. (Google 웹검색 실시간 기반 예측)"
                  </blockquote>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
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
}: any) {
  return (
    <div className="card min-w-[280px] p-6 relative overflow-hidden flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-mono font-bold text-on-surface-variant uppercase tracking-widest">
            {label}
          </p>
          {badges &&
            badges.map((b: any, i: number) => (
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

function IndicatorCard({ title, value, sub, color, barValue }: any) {
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

function InsightItem({ date, label, color }: any) {
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
