import { Link } from 'react-router-dom';
import { LineChart, Leaf, ArrowRight, MessageSquareHeart, Activity, ArrowUpRight, BarChart3, Clock, Zap, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Home() {
  const [latestPlant, setLatestPlant] = useState<any>(null);
  const [latestStory, setLatestStory] = useState<any>(null);

  useEffect(() => {
    try {
      const savedPlants = localStorage.getItem('plant_journal_entries');
      if (savedPlants) {
        const parsedPlants = JSON.parse(savedPlants);
        if (parsedPlants && parsedPlants.length > 0) {
          setLatestPlant(parsedPlants[0]);
        }
      }

      const savedStories = localStorage.getItem('stories_feed');
      if (savedStories) {
        const parsedStories = JSON.parse(savedStories);
        if (parsedStories && parsedStories.length > 0) {
          setLatestStory(parsedStories[0]);
        }
      }
    } catch (e) {
      console.error('Failed to parse local storage', e);
    }
  }, []);

  return (
    <div className="max-w-[1280px] mx-auto space-y-12 pb-12">
      
      {/* Cinematic Header */}
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-display font-bold text-on-surface mb-6 tracking-tight leading-tight">
          다양한 세계를<br/>
          탐험하세요
        </h1>
        <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed font-sans">
          여러 주제로 분리된 공간에서 흥미로운 데이터를 탐색하고, 기록을 남기며, 다른 이들의 이야기에 귀 기울여보세요.
        </p>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Crypto Terminal (Large Featured Card) */}
        <Link to="/crypto" className="md:col-span-8 group relative flex flex-col min-h-[320px] card overflow-hidden p-0">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-700 pointer-events-none" />
          
          <div className="p-8 md:p-10 flex flex-col h-full relative z-10">
            <div className="flex justify-between items-start mb-auto">
              <div className="w-14 h-14 bg-primary-light/50 text-primary rounded-xl border border-primary/10 flex items-center justify-center shadow-sm">
                <LineChart className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-dim/30 border border-outline/20 text-xs font-semibold text-on-surface-variant">
                <Activity className="w-3.5 h-3.5 text-primary" /> 실시간 마켓
              </div>
            </div>
            
            <div className="mt-12 w-full max-w-lg">
              <h2 className="text-3xl font-display font-bold text-on-surface mb-4">금융 터미널</h2>
              <p className="text-base md:text-lg text-on-surface-variant leading-relaxed mb-8">
                고급 가상자산 모니터링 시스템. 실시간 데이터, 변동성 지수 및 기관 최고 수준의 차트 기능을 제공합니다.
              </p>
              
              <div className="grid grid-cols-3 gap-6 border-t border-outline/20 pt-6">
                 <div>
                   <p className="text-[11px] text-on-surface-variant/70 mb-1 font-semibold uppercase tracking-wider">BTC/USD</p>
                   <p className="text-on-surface text-lg font-bold font-mono">$64,230</p>
                 </div>
                 <div>
                   <p className="text-[11px] text-on-surface-variant/70 mb-1 font-semibold uppercase tracking-wider">ETH/USD</p>
                   <p className="text-on-surface text-lg font-bold font-mono">$3,420</p>
                 </div>
                 <div>
                   <p className="text-[11px] text-on-surface-variant/70 mb-1 font-semibold uppercase tracking-wider">24h 변동</p>
                   <p className="text-[#00C853] text-lg font-bold font-mono">+12.4%</p>
                 </div>
              </div>
            </div>
          </div>
          <ArrowUpRight className="absolute bottom-8 right-8 w-6 h-6 text-outline-variant group-hover:text-primary group-hover:scale-110 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300" />
        </Link>

        {/* Plant Journal (Vertical Card) */}
        <Link to="/plants" className="md:col-span-4 group relative flex flex-col min-h-[320px] card">
          <div className="w-14 h-14 bg-[#5D7964]/10 text-[#5D7964] rounded-xl flex items-center justify-center mb-auto relative z-10 group-hover:scale-110 transition-transform duration-500">
            <Leaf className="w-6 h-6" />
          </div>
          
          <div className="relative z-10 mt-12 w-full">
            <h2 className="text-3xl font-display font-bold text-on-surface mb-4 tracking-tight">디지털 정원</h2>
            <p className="text-base md:text-lg text-on-surface-variant leading-relaxed">
              조용한 식물 성장 기록. 유기적인 성장 지표와 사진 타임라인을 관리하세요.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#5D7964]">
              일지 탐색 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Stories (Wide Card) */}
        <Link to="/stories" className="md:col-span-12 group relative flex flex-col md:flex-row gap-8 items-center min-h-[280px] card overflow-hidden p-0">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="p-8 md:p-10 w-full md:w-2/3 h-full flex flex-col justify-between flex-1 relative z-10">
            <div className="w-14 h-14 bg-[#f0dbff] text-[#6900b3] rounded-xl border border-[#ddb7ff] flex items-center justify-center mb-8 md:mb-auto group-hover:scale-110 transition-transform duration-500">
              <MessageSquareHeart className="w-6 h-6" />
            </div>
            
            <div className="mt-auto">
              <h2 className="text-3xl font-display font-bold text-on-surface mb-4">나의 세계</h2>
              <p className="text-base md:text-lg text-on-surface-variant leading-relaxed max-w-2xl">
                자유롭게 생각을 나누고 소통하는 공간. 일기, 칼럼, 그리고 소설 등 나만의 글을 기록해보세요.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary">
                기록 남기기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
          
          {/* Callout Visual for Stories */}
          <div className="w-full md:w-1/3 bg-surface-container-low rounded-xl p-8 border border-outline/10 hidden md:block group-hover:bg-primary-light/20 transition-all duration-500 shadow-inner my-8 mr-8">
            <div className="space-y-4">
              <div className="w-3/4 h-2.5 bg-outline-variant/40 rounded-full"></div>
              <div className="w-full h-2.5 bg-outline-variant/40 rounded-full"></div>
              <div className="w-5/6 h-2.5 bg-outline-variant/40 rounded-full"></div>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20"></div>
              <div className="w-24 h-2.5 bg-primary/20 rounded-full"></div>
            </div>
          </div>
        </Link>
      </div>
      
      {/* Security/Trust Footer */}
      <div className="pt-8 border-t border-outline/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-on-surface-variant">
         <div className="flex items-center gap-4">
           <span>v2.0.4-stable</span>
           <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
           <span>대기 시간: 24ms</span>
         </div>
         <div>
           보안 통합 코어 인프라에 의해 보호됨
         </div>
      </div>
    </div>
  );
}
