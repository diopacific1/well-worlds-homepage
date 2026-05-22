import { useState, FormEvent, useEffect } from 'react';
import { Search, Wallet, TrendingUp, TrendingDown, Activity, ChevronRight, BarChart2 } from 'lucide-react';

const MOCK_COINS: Record<string, any> = {
  'wormhole': {
    name: '웜홀',
    symbol: 'W',
    symbolLength: 'w-10 h-10',
    color: 'from-cyber to-blue-600',
    price: '$3.14',
    trend: '+4.18%',
    trendUp: true,
    volatility: '상승세',
    volLow: '$2.88',
    volHigh: '$3.25',
    marketCap: '$5.65B',
    rank: 'Rank #22',
    fdv: 'FDV: $31.4B',
    volume: '$482.5M',
    volChange: '↑ 12.4%',
    english: 'WORMHOLE',
    targetPrice: '$5.50',
    targetColor: 'text-bullish',
    volColor: 'bg-bullish',
    volPercent: '65%'
  },
  'bitcoin': {
    name: '비트코인',
    symbol: 'BTC',
    symbolLength: 'w-10 h-10 text-[11px]',
    color: 'from-[#F7931A] to-[#FFAB4A]',
    price: '$72,450',
    trend: '+1.25%',
    trendUp: true,
    volatility: '안정적',
    volLow: '$71,200',
    volHigh: '$73,100',
    marketCap: '$1.42T',
    rank: 'Rank #1',
    fdv: 'FDV: $1.52T',
    volume: '$35.2B',
    volChange: '↑ 4.2%',
    english: 'BITCOIN',
    targetPrice: '$100,000',
    targetColor: 'text-bullish',
    volColor: 'bg-[#F7931A]',
    volPercent: '50%'
  },
  'ethereum': {
    name: '이더리움',
    symbol: 'ETH',
    symbolLength: 'w-10 h-10 text-[11px]',
    color: 'from-[#627EEA] to-[#8A9CFF]',
    price: '$3,842',
    trend: '+8.45%',
    trendUp: true,
    volatility: '강한 상승세',
    volLow: '$3,450',
    volHigh: '$3,920',
    marketCap: '$460B',
    rank: 'Rank #2',
    fdv: 'FDV: $460B',
    volume: '$15.8B',
    volChange: '↑ 18.5%',
    english: 'ETHEREUM',
    targetPrice: '$5,000',
    targetColor: 'text-bullish',
    volColor: 'bg-[#627EEA]',
    volPercent: '85%'
  },
  'solana': {
    name: '솔라나',
    symbol: 'SOL',
    symbolLength: 'w-10 h-10 text-[11px]',
    color: 'from-[#14F195] to-[#9945FF]',
    price: '$145.20',
    trend: '-2.10%',
    trendUp: false,
    volatility: '하락세',
    volLow: '$135.00',
    volHigh: '$150.50',
    marketCap: '$65B',
    rank: 'Rank #4',
    fdv: 'FDV: $82B',
    volume: '$4.5B',
    volChange: '↓ 5.4%',
    english: 'SOLANA',
    targetPrice: '$250.00',
    targetColor: 'text-bearish',
    volColor: 'bg-bearish',
    volPercent: '30%'
  }
};

export default function CryptoDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCoinId, setActiveCoinId] = useState('bitcoin');
  const [insights, setInsights] = useState<any[]>([]);
  const [cryptoData, setCryptoData] = useState<any>(null);
  const [loadingCrypto, setLoadingCrypto] = useState(true);

  useEffect(() => {
    fetch('/api/news?q=가상화폐+비트코인+이더리움+솔라나')
      .then(res => res.json())
      .then(data => {
        if (data.items) {
          setInsights(data.items.slice(0, 5).map((item: any) => ({
            date: '최신',
            label: item.title,
            color: 'cyber',
            link: item.link
          })));
        }
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    setLoadingCrypto(true);
    fetch(`/api/crypto?id=${activeCoinId}`)
      .then(res => res.json())
      .then(data => {
         setCryptoData(data);
         setLoadingCrypto(false);
      })
      .catch(err => {
         console.error(err);
         setLoadingCrypto(false);
      });
  }, [activeCoinId]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const term = searchTerm.toLowerCase();
    
    if (term.includes('btc') || term.includes('bitcoin') || term.includes('비트')) {
      setActiveCoinId('bitcoin');
    } else if (term.includes('eth') || term.includes('ethereum') || term.includes('이더')) {
      setActiveCoinId('ethereum');
    } else if (term.includes('sol') || term.includes('solana') || term.includes('솔라')) {
      setActiveCoinId('solana');
    } else if (term.includes('w') || term.includes('wormhole') || term.includes('웜홀')) {
      setActiveCoinId('wormhole');
    } else {
      alert('검색된 코인이 없습니다 (예: 비트코인, 이더리움, 솔라나 지원)');
    }
  };

  const coin = MOCK_COINS[activeCoinId];
  
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
    <div className="p-4 lg:p-6 space-y-6 animate-in fade-in duration-700">
      
      {/* Search Header */}
      <form onSubmit={handleSearch} className="glass-card rounded-[8px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${coin.color} flex items-center justify-center font-bold text-slate-900`}>{coin.symbol}</div>
          <h2 className="font-bold text-xl uppercase tracking-tight">{coin.name} <span className="text-cyber opacity-70">/ USD</span></h2>
        </div>
        
        <div className="flex-1 max-w-lg relative w-full">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="시장, 자산 또는 주소를 검색하세요... (예: 비트코인)" 
            className="w-full bg-slate-50 border border-slate-200 rounded-[4px] py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-cyber/50 focus:ring-1 focus:ring-cyber/20 transition-all text-slate-900 placeholder:text-slate-400"
          />
          <button type="submit" className="absolute left-3.5 top-3">
             <Search className="w-4 h-4 text-slate-400 hover:text-slate-700 transition-colors" />
          </button>
        </div>

        <button type="button" className="whitespace-nowrap px-5 py-2.5 rounded-[4px] bg-cyber text-white font-bold text-sm uppercase tracking-tight hover:brightness-110 transition-all flex items-center gap-2">
          <Wallet className="w-4 h-4" /> 지갑 연결
        </button>
      </form>

      {/* Metrics Row */}
      <div className="flex overflow-x-auto pb-2 md:grid md:grid-cols-4 gap-4 no-scrollbar relative">
        {loadingCrypto && (
          <div className="absolute inset-0 z-10 bg-slate-50/50 backdrop-blur-sm flex items-center justify-center rounded-[8px]">
             <span className="text-sm font-bold text-cyber animate-pulse">실시간 데이터 동기화 중...</span>
          </div>
        )}
        <MetricCard 
          label="현재 가격" 
          value={cryptoData?.price || coin.price} 
          unit="USD"
          trend={cryptoData?.trend || coin.trend} 
          trendUp={cryptoData ? !cryptoData.trend.includes('-') : coin.trendUp}
        />
        <div className="glass-card min-w-[280px] p-5 rounded-[8px] relative overflow-hidden">
          <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">24시간 변동성</p>
          <div className="flex items-baseline gap-2">
            <h2 className={`text-3xl font-bold tracking-tighter ${coin.volatility.includes('하락') ? 'text-bearish' : 'text-bullish'}`}>{coin.volatility}</h2>
          </div>
          <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full ${coin.volColor} rounded-full`} style={{ width: cryptoData ? '50%' : coin.volPercent }}></div>
          </div>
          <div className="mt-2 flex justify-between text-[11px] font-mono text-slate-500">
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
          trendUp={!coin.volChange.includes('↓')}
          footerText="전일 대비"
        />
      </div>

      {/* Main Dashboard Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        {loadingCrypto && (
          <div className="absolute inset-0 z-10 bg-slate-50/50 backdrop-blur-sm flex justify-center rounded-[8px] pt-32">
             <span className="text-sm font-bold text-cyber animate-pulse block">인공지능 실시간 분석 중...</span>
          </div>
        )}
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price Chart */}
          <div className="glass-card p-6 rounded-[8px] min-h-[450px] relative flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">가격 시각화</h3>
                <p className="text-xs text-slate-500">7일 실시간 시세 (Web Search API)</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-bold hover:bg-slate-100 transition-all text-slate-600">1H</button>
                <button className="px-3 py-1 rounded-lg bg-cyber text-white text-[10px] font-bold cursor-default shadow-sm text-center">1D</button>
                <button className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-bold hover:bg-slate-100 transition-all text-slate-600">1W</button>
              </div>
            </div>
            
            <div className="flex-1 relative flex items-end justify-between gap-1.5 mt-4">
              {normalizedChartData.map((h: number, i: number) => {
                // Determine color based on trend
                let bgClass = "bg-cyber opacity-30";
                if (i > 0) {
                   const prev = normalizedChartData[i-1];
                   if (h > prev) bgClass = "bg-bullish opacity-40";
                   else if (h < prev) bgClass = "bg-bearish opacity-30";
                }
                if (i === normalizedChartData.length - 1) bgClass = "bg-cyber opacity-80";
                
                return (
                  <div 
                    key={i} 
                    className={`w-full rounded-t-sm transition-all duration-1000 ease-out hover:brightness-125 ${bgClass}`} 
                    style={{ height: `${h}%` }}
                  ></div>
                );
              })}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <span className="text-6xl font-black tracking-[0.5em] uppercase">{coin.english}</span>
              </div>
            </div>
            <div className="flex justify-between mt-4 text-[11px] font-mono text-slate-400">
              <span>7일전</span>
              <span>5일전</span>
              <span>3일전</span>
              <span>1일전</span>
              <span className="text-slate-600 font-bold border-b border-slate-300">오늘 (실시간)</span>
            </div>
          </div>

          {/* Indicators Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <IndicatorCard title="RSI (14)" value={cryptoData?.rsi || "62.4"} sub={parseFloat(cryptoData?.rsi || "62") > 70 ? "OVERBOUGHT" : parseFloat(cryptoData?.rsi || "62") < 30 ? "OVERSOLD" : "NEUTRAL"} barValue={parseFloat(cryptoData?.rsi || "62")} color="bullish" />
            <IndicatorCard title="MA (50)" value={cryptoData?.ma50 || "$2.82"} sub="단기 추세선" color="cyber" />
            <IndicatorCard title="MA (200)" value={cryptoData?.ma200 || "$2.15"} sub="장기 추세선" color="cyber" />
            <IndicatorCard title="변동성" value={cryptoData ? "Live" : "Low"} sub={coin.volatility} color="cyber" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Sentiment */}
          <div className="glass-card p-6 rounded-[8px] text-center">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-left text-slate-900">시장 심리</h3>
            <div className="relative w-48 h-24 mx-auto overflow-hidden transition-all duration-1000">
              <div className="sentiment-gauge w-48 h-48 rounded-full"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-20 bg-slate-900 origin-bottom rounded-full shadow-md transition-all duration-1000" style={{ transform: `translateX(-50%) rotate(${cryptoData?.sentimentScore ? (cryptoData.sentimentScore / 100) * 180 - 90 : 45}deg)` }}></div>
            </div>
            <div className="text-center mt-6">
              <h4 className="text-2xl font-black text-bullish uppercase tracking-tighter">{cryptoData?.sentimentStatus || "낙관적 (Optimistic)"}</h4>
              <p className="text-xs text-slate-500 mt-2 font-mono">탐욕/공포 인덱스: {cryptoData?.sentimentScore || 68}/100</p>
            </div>
          </div>

          {/* Insights */}
          <div className="glass-card p-6 rounded-[8px] flex-1 max-h-[500px] flex flex-col">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4">시장 인사이트</h3>
            <div className="space-y-4 overflow-y-auto pr-2 flex-1">
              {insights.length > 0 ? insights.map((item, idx) => (
                <a href={item.link} target="_blank" rel="noopener noreferrer" key={idx} className="block group">
                  <InsightItem date={item.date} label={item.label} color={item.color} />
                </a>
              )) : <span className="text-xs text-slate-500">인사이트 불러오는 중...</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Report Section */}
      <section className="glass-card p-8 md:p-12 rounded-[40px] mt-12 bg-white/90 border border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <span className="h-1.5 w-12 bg-cyber rounded-full"></span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">시장 및 기술 분석 보고서</h2>
          </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-sky-50 border border-sky-100 p-6 rounded-[8px]">
                <h3 className="text-sky-600 font-bold text-lg mb-4 flex items-center gap-2"><BarChart2 className="w-5 h-5"/> 주요 핵심 요약</h3>
                <ul className="space-y-3 text-sm font-mono text-slate-700">
                  <li className="flex items-start gap-2"><span className="text-sky-600 shrink-0">▶</span> 7일 프레임 기준 뚜렷한 "상승 저점(Higher-Low)" 패턴 형성.</li>
                  <li className="flex items-start gap-2"><span className="text-sky-600 shrink-0">▶</span> 저항선이었던 $3.00이 성공적으로 구조적 지지선으로 전환됨.</li>
                  <li className="flex items-start gap-2"><span className="text-sky-600 shrink-0">▶</span> ZK-Proof 기술 도입이 마켓 내 압도적 기술 우위를 점함.</li>
                </ul>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-[8px] flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-4 text-slate-900 flex items-center gap-2"><Activity className="w-5 h-5 text-slate-500"/> 프라이스 타겟</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                       <p className="text-xs text-slate-500 uppercase">단기 저항선</p>
                       <p className="text-xl font-mono border border-sky-200 bg-sky-50 px-2 rounded font-bold text-sky-600">$3.25</p>
                    </div>
                    <div className="flex justify-between items-center">
                       <p className="text-xs text-slate-500 uppercase">연말 목표가 (Y/E)</p>
                       <p className={`text-xl font-mono font-bold ${coin.targetColor}`}>{coin.targetPrice}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-10 text-slate-700 leading-relaxed text-[15px]">
              <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">1. 실시간 인공지능 시장 총평</h3>
                  <p>
                      {cryptoData?.analysis || `2026년 5월 말 기준, ${coin.name}(${coin.symbol})은(는) 주요 크립토 어셋으로서의 포지션을 단단히 굳히고 있습니다. 시가총액은 약 ${coin.marketCap}에 달하며, 전반적인 시장의 이목을 끌고 있습니다.`}
                  </p>
              </div>

              <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">2. 기술적 심층 분석 (검색 데이터 기반)</h3>
                  <p>
                      현재 14일 RSI 지표는 <strong>{cryptoData?.rsi || '62.4'}</strong>를 기록, 과매수 구간에 진입하지 않으면서도 안정적인 모멘텀을 유지하고 있습니다. 특히 {cryptoData?.ma50 || '$2.82'}의 50일 이동평균선 상단을 여유롭게 돌파하여 중기적 강세 기조가 유효함을 증명했습니다.
                  </p>
                  <blockquote className="border-l-2 border-primary bg-slate-50 p-5 rounded-r-2xl italic text-slate-600 my-4 shadow-sm border border-slate-200">
                      "최근 나타난 이동평균선과 현재 가격({cryptoData?.price || coin.price})의 구조적 시그널은 견고한 바닥을 형성하고 있습니다. (Google 웹검색 실시간 기반 예측)"
                  </blockquote>
              </div>
            </div>
        </div>
      </section>

    </div>
  );
}

function MetricCard({ label, value, unit, trend, trendUp, badges, footerText }: any) {
  return (
    <div className="glass-card min-w-[280px] p-5 rounded-[8px] relative overflow-hidden flex flex-col justify-between">
      <div>
        <p className="text-xs font-mono font-bold text-slate-600 uppercase tracking-widest mb-2 flex items-center justify-between">
          {label}
          {badges && badges.map((b: any, i: number) => (
            <span key={i} className={`px-2 py-0.5 rounded text-[10px] border ${b.isAccent ? 'bg-sky-50 border-sky-100 text-sky-600' : 'bg-slate-50 border-slate-200'}`}>
              {b.text}
            </span>
          ))}
        </p>
        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tighter">{value}</h2>
          {unit && <span className="text-xs font-mono text-slate-500">{unit}</span>}
        </div>
      </div>
      {(trend || footerText) && (
        <div className={`mt-4 flex items-center text-sm font-mono ${trendUp ? 'text-bullish' : 'text-slate-500'} gap-1.5`}>
          {trendUp && <TrendingUp className="w-3.5 h-3.5" />}
          {trend && <span>{trend}</span>}
          {footerText && <span className="text-slate-500 text-xs ml-1">{footerText}</span>}
        </div>
      )}
    </div>
  );
}

function IndicatorCard({ title, value, sub, color, barValue }: any) {
  const colorMap: any = {
    bullish: 'text-bullish bg-bullish',
    bearish: 'text-bearish bg-bearish',
    cyber: 'text-cyber bg-cyber',
  };
  const tColor = colorMap[color]?.split(' ')[0] || 'text-slate-900';
  const bgColor = colorMap[color]?.split(' ')[1] || 'bg-slate-200';

  return (
    <div className="glass-card p-4 rounded-[8px] border border-slate-200/50">
        <p className="text-[11px] font-mono font-bold text-slate-500 uppercase mb-2">{title}</p>
        <p className={`text-xl font-mono font-bold ${tColor}`}>{value}</p>
        
        {barValue ? (
          <div className="w-full h-1 bg-slate-100 mt-3 rounded-full overflow-hidden">
              <div className={`h-full ${bgColor}`} style={{ width: `${barValue}%` }}></div>
          </div>
        ) : (
          <p className={`text-[10px] font-mono ${tColor} mt-2`}>{sub}</p>
        )}
    </div>
  );
}

function InsightItem({ date, label, color }: any) {
  return (
    <div className={`p-4 rounded-[4px] bg-slate-50 border border-slate-200 border-l-[3px]`} style={{ borderLeftColor: color === 'cyber' ? 'var(--color-cyber)' : color === 'bullish' ? 'var(--color-bullish)' : color }}>
        <p className="text-[10px] font-mono mb-1.5 uppercase" style={{ color: color === 'cyber' ? 'var(--color-cyber)' : color === 'bullish' ? 'var(--color-bullish)' : color }}>{date}</p>
        <p className="text-sm leading-relaxed text-slate-700">{label}</p>
    </div>
  );
}
