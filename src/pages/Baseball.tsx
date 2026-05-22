import { Trophy, CalendarDays, PlayCircle, Newspaper, MessageCircle, Users, Activity, ExternalLink, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const MOCK_CLUB_POSTS = [
  {
    id: 1,
    author: "열혈투수",
    time: "2시간 전",
    content: "이번 주 일요일 오전 7시, 한강시민공원 야구장에서 펼쳐지는 정기전 라인업 투표 시작합니다. 참석 가능하신 분들은 댓글 달아주세요! ⚾️ 이번 상대는 타격이 매서우니 투수진 컨디션 조절 잘 해주시고요.",
    likes: 12,
    comments: 5
  },
  {
    id: 2,
    author: "홈런만친다",
    time: "어제",
    content: "지난 주 회식 때 다들 고생하셨습니다. 새로 맞춘 동호회 유니폼 인증샷 올려요. 개인적으로 이번 배색 너무 마음에 듭니다! (사진은 상상에 맡기겠습니다 ㅎㅎ)",
    likes: 24,
    comments: 8
  }
];

export default function Baseball() {
  const [videoIndex, setVideoIndex] = useState(0);
  const VIDEOS = ["N1-Jmq7BIXI", "zQpEq2c50W4", "v8O833YxK8k"];
  
  const [lgNews, setLgNews] = useState<any[]>([]);
  const [generalNews, setGeneralNews] = useState<any[]>([]);
  const [matchResult, setMatchResult] = useState<any>(null);
  const [loadingMatch, setLoadingMatch] = useState(true);

  useEffect(() => {
    // Fetch LG Twins news
    fetch('/api/news?q=LG+트윈스')
      .then(res => res.json())
      .then(data => {
        if (data.items) {
          setLgNews(data.items.slice(0, 5).map((item: any) => ({
            title: item.title,
            time: '최신',
            link: item.link
          })));
        }
      });

    // Fetch General Baseball news
    fetch('/api/news?q=KBO+야구')
      .then(res => res.json())
      .then(data => {
        if (data.items) {
          setGeneralNews(data.items.slice(0, 5).map((item: any) => ({
             title: item.title,
             tag: 'KBO',
             link: item.link
          })));
        }
      });
      
    // Fetch Latest Match Result
    fetch('/api/match-result')
      .then(res => res.json())
      .then(data => {
        setMatchResult(data);
        setLoadingMatch(false);
      })
      .catch(err => {
        console.error("Failed to fetch match result", err);
        setLoadingMatch(false);
      });

    const videoInterval = setInterval(() => {
      setVideoIndex(prev => (prev + 1) % VIDEOS.length);
    }, 45000);
    return () => clearInterval(videoInterval);
  }, []);

  return (
    <div className="p-4 lg:p-6 space-y-8 animate-in fade-in duration-700 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-6 lg:mt-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-[4px] bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Trophy className="w-5 h-5" />
          </div>
          야구이야기
        </h2>
        <p className="text-slate-500">우리들의 야구동호회 소식부터 주요 경기 결과, LG 트윈스 및 리그 최신 소식까지.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Left Column (Scoreboard, Video, Club Story) - span 8 */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 경기 결과 및 하이라이트 */}
          <div className="glass-card rounded-[8px] p-6 relative overflow-hidden group shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-blue-600" /> 경기 결과 및 하이라이트
              </h3>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-[4px] text-xs font-bold border border-slate-200">
                {matchResult?.date ? `최근 경기 (${matchResult.date})` : "최신 경기 정보"}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Scoreboard Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-[4px] p-6 flex flex-col justify-center">
                {loadingMatch ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3 py-6">
                     <RefreshCw className="w-5 h-5 animate-spin" />
                     <span className="text-sm font-bold animate-pulse">최신 경기 결과를 가져보는 중...</span>
                  </div>
                ) : matchResult && matchResult.opponent ? (
                  <>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-xl font-black italic text-red-600 border-2 border-red-200 rounded-full w-14 h-14 flex items-center justify-center bg-white">LG</span>
                      <span className="text-sm font-bold text-slate-700">트윈스</span>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-black text-slate-900 shrink-0 mx-4 whitespace-nowrap"> {matchResult.lgScore} : {matchResult.opponentScore} </div>
                      {matchResult.winner?.includes("LG") ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] rounded-[4px] font-bold mt-2 inline-block">LG 승리</span>
                      ) : matchResult.winner?.includes("무승부") ? (
                        <span className="px-2 py-1 bg-slate-200 text-slate-700 text-[10px] rounded-[4px] font-bold mt-2 inline-block">무승부</span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] rounded-[4px] font-bold mt-2 inline-block">{matchResult.opponent} 승리</span>
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-xl font-black text-slate-600 border-2 border-slate-300 rounded-full w-14 h-14 flex items-center justify-center bg-white">{matchResult.opponent.charAt(0)}</span>
                      <span className="text-sm font-bold text-slate-500">{matchResult.opponent}</span>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap gap-4 text-xs text-slate-500 justify-center">
                     <span>MVP: <strong className="text-slate-700">{matchResult.mvp}</strong></span>
                     <span>승: <strong className="text-slate-700">{matchResult.winPitcher}</strong></span>
                     <span>세: <strong className="text-slate-700">{matchResult.savePitcher}</strong></span>
                  </div>
                  </>
                ) : (
                  <div className="text-center text-slate-500 font-medium">데이터를 불러올 수 없습니다.</div>
                )}
              </div>

              {/* Video Player */}
              <div className="relative w-full aspect-video rounded-[4px] overflow-hidden bg-slate-900 border border-slate-200 shadow-sm">
                 <iframe 
                   key={VIDEOS[videoIndex]}
                   className="absolute top-0 left-0 w-full h-full"
                   src={`https://www.youtube.com/embed/${VIDEOS[videoIndex]}?rel=0&autoplay=0`} 
                   title="KBO Highlight" 
                   allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                   allowFullScreen>
                 </iframe>
              </div>
            </div>
          </div>

          {/* 야구동호회 이야기 */}
          <div className="glass-card rounded-[8px] p-6 relative overflow-hidden shadow-sm border border-slate-200">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" /> 야구동호회 '피스메이커' 게시판
                </h3>
                <button className="text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-[4px] hover:bg-emerald-100 transition-colors font-bold">
                  새 글 쓰기
                </button>
             </div>
             <div className="space-y-4">
                {MOCK_CLUB_POSTS.map(post => (
                  <div key={post.id} className="bg-slate-50 border border-slate-200 p-5 rounded-[4px] hover:border-emerald-300 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-slate-800">{post.author} <span className="text-[10px] font-mono text-slate-500 ml-2 font-normal bg-white border border-slate-200 inset-shadow-sm px-2 py-0.5 rounded">{post.time}</span></span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs font-mono text-slate-500 border-t border-slate-200 pt-3">
                       <button className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors">
                         <Trophy className="w-3.5 h-3.5" /> 좋아요 {post.likes}
                       </button>
                       <button className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors">
                         <MessageCircle className="w-3.5 h-3.5" /> 댓글 {post.comments}
                       </button>
                    </div>
                  </div>
                ))}
             </div>
          </div>

        </div>

        {/* Right Column (News & Extras) - span 4 */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* LG Twins Story */}
          <div className="glass-card rounded-[8px] p-6 h-auto shadow-sm border border-slate-200 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
              <h3 className="text-md font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-red-600" /> LG 트윈스 이야기
                <RefreshCw className="w-3 h-3 text-slate-400 animate-[spin_4s_linear_infinite]" />
              </h3>
            </div>
            <div className="space-y-4">
              {lgNews.length > 0 ? lgNews.map((news, idx) => (
                <a href={news.link} target="_blank" rel="noopener noreferrer" key={idx} className="block group border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <span className="text-[10px] font-mono text-red-500 mb-1.5 block">{news.time}</span>
                  <h4 className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors line-clamp-2 leading-relaxed">
                    {news.title}
                  </h4>
                </a>
              )) : <span className="text-xs text-slate-500">실시간 뉴스를 가져오고 있습니다...</span>}
            </div>
            <button className="w-full mt-6 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-[4px] text-xs font-bold text-slate-600 transition-colors flex items-center justify-center gap-2">
              트윈스 커뮤니티 더보기 <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* 기타 야구관련 내용들 */}
          <div className="glass-card rounded-[8px] p-6 h-auto shadow-sm border border-slate-200 border-t-2 border-t-blue-500 relative overflow-hidden">
            <div className="mb-6 border-b border-slate-200 pb-4">
              <h3 className="text-md font-bold text-slate-900 flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-blue-600" /> 기타 야구 소식
              </h3>
            </div>
            <div className="space-y-4">
              {generalNews.length > 0 ? generalNews.map((news, idx) => (
                <a href={news.link} target="_blank" rel="noopener noreferrer" key={idx} className="block group border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-bold rounded-[2px] whitespace-nowrap mt-0.5">
                      {news.tag}
                    </span>
                    <h4 className="text-sm text-slate-600 group-hover:text-blue-700 transition-colors line-clamp-2">
                      {news.title}
                    </h4>
                  </div>
                </a>
              )) : <span className="text-xs text-slate-500">실시간 뉴스를 가져오고 있습니다...</span>}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-6">
               <button className="py-2 text-center bg-white border border-slate-200 rounded-[4px] text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors font-bold shadow-sm">KBO 순위표</button>
               <button className="py-2 text-center bg-white border border-slate-200 rounded-[4px] text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors font-bold shadow-sm">장비 장터</button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
