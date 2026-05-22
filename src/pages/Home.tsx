import { Link } from 'react-router-dom';
import { LineChart, Leaf, ArrowRight, MessageSquareHeart, Trophy, Activity, ArrowUpRight, BarChart3, Clock, Zap, ShieldCheck } from 'lucide-react';
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
    <div className="px-4 py-12 md:py-20 max-w-[1200px] mx-auto space-y-12">
      
      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6">
        
        {/* Crypto Terminal (Large Featured Card) */}
        <Link to="/crypto" className="md:col-span-8 group relative overflow-hidden rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-500 flex flex-col p-8 min-h-[320px]">
          {/* Subtle gradient background instead of heavy blur */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-sky-50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="flex justify-between items-start mb-auto relative z-10">
            <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded border border-sky-100 flex items-center justify-center">
              <LineChart className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
              <Activity className="w-3.5 h-3.5 text-sky-600" /> 실시간 마켓
            </div>
          </div>
          
          <div className="relative z-10 mt-12 w-full max-w-lg">
            <h2 className="text-2xl lg:text-3xl font-display font-medium text-slate-900 mb-3">금융 터미널</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              고급 가상자산 모니터링 시스템. 실시간 데이터, 변동성 지수 및 기관 최고 수준의 차트 기능을 제공합니다.
            </p>
            
            <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-6">
               <div>
                 <p className="text-xs text-slate-500 mb-1 font-mono">BTC/USD</p>
                 <p className="text-slate-900 font-medium">$64,230</p>
               </div>
               <div>
                 <p className="text-xs text-slate-500 mb-1 font-mono">ETH/USD</p>
                 <p className="text-slate-900 font-medium">$3,420</p>
               </div>
               <div>
                 <p className="text-xs text-slate-500 mb-1 font-mono">24h 변동</p>
                 <p className="text-sky-600 font-medium">+12.4%</p>
               </div>
            </div>
          </div>
          <ArrowUpRight className="absolute bottom-8 right-8 w-6 h-6 text-slate-300 group-hover:text-sky-600 transition-colors duration-300" />
        </Link>

        {/* Plant Journal (Vertical Card) */}
        <Link to="/plants" className="md:col-span-4 group relative overflow-hidden rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-500 flex flex-col p-8 min-h-[320px]">
          <div className="absolute bottom-0 right-0 w-full h-3/4 bg-gradient-to-tl from-sage/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="w-12 h-12 bg-sage/10 text-sage rounded border border-sage/20 flex items-center justify-center mb-auto relative z-10">
            <Leaf className="w-5 h-5" />
          </div>
          
          <div className="relative z-10 mt-12">
            <h2 className="text-xl font-display font-medium text-slate-900 mb-2">디지털 정원</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              조용한 식물 성장 기록. 유기적인 성장 지표와 사진 타임라인을 관리하세요.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-sage">
              일지 탐색 <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Stories (Square Card) */}
        <Link to="/stories" className="md:col-span-4 group relative overflow-hidden rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-500 flex flex-col p-8 min-h-[320px]">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-emerald-100/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded border border-emerald-100 flex items-center justify-center mb-auto relative z-10">
            <MessageSquareHeart className="w-5 h-5" />
          </div>
          
          <div className="relative z-10 mt-12">
            <h2 className="text-xl font-display font-medium text-slate-900 mb-2">소셜 허브</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              실시간 이야기, 다국적 커뮤니티 소통 및 다양한 주제에 대한 깊이 있는 토론 공간.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-emerald-600">
              토론 참여 <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Baseball (Wide Card) */}
        <Link to="/baseball" className="md:col-span-8 group relative overflow-hidden rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-500 flex flex-col p-8 min-h-[320px]">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="flex justify-between items-start mb-auto relative z-10">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded border border-blue-100 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="hidden sm:flex border border-slate-200 rounded-lg overflow-hidden bg-slate-50 text-xs font-medium">
               <div className="px-3 py-1.5 border-r border-slate-200 text-slate-600">라이브 매치</div>
               <div className="px-3 py-1.5 text-slate-900 bg-white">LG 6 : 4 DOOSAN</div>
            </div>
          </div>
          
          <div className="relative z-10 mt-12 max-w-lg">
            <h2 className="text-2xl lg:text-3xl font-display font-medium text-slate-900 mb-3">스포츠 디비전</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              KBO 리그 데이터, 구단 소식, 실시간 경기 하이라이트 및 야구 팬들을 위한 전문적인 통계 분석을 제공합니다.
            </p>
            <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
               <div className="flex items-center gap-2 text-slate-700 text-sm">
                 <ShieldCheck className="w-4 h-4 text-blue-500" /> 정규 시즌
               </div>
               <div className="flex items-center gap-2 text-slate-700 text-sm">
                 <BarChart3 className="w-4 h-4 text-blue-500" /> 순위표 보기
               </div>
            </div>
          </div>
          <ArrowUpRight className="absolute bottom-8 right-8 w-6 h-6 text-slate-300 group-hover:text-blue-500 transition-colors duration-300" />
        </Link>
      </div>
      
      {/* Security/Trust Footer */}
      <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500">
         <div className="flex items-center gap-4">
           <span>v2.0.4-stable</span>
           <span className="w-1 h-1 rounded-full bg-slate-300"></span>
           <span>대기 시간: 24ms</span>
         </div>
         <div>
           보안 통합 코어 인프라에 의해 보호됨
         </div>
      </div>
    </div>
  );
}
