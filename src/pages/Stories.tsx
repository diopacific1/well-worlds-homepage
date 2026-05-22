import { MessageCircle, Image as ImageIcon, Send, Heart, Share2, MoreHorizontal, Radio, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const MOCK_POSTS = [
  {
    id: 1,
    author: '스토리텔러',
    avatar: 'bg-neon-cyan',
    time: '2시간 전',
    content: '테크 트렌드와 미니멀리즘 디자인이 결합된 이 인터페이스는 읽는 경험을 완전히 다르게 만듭니다. 긴 글을 읽어도 눈이 피로하지 않은 디자인 시스템, 정말 인상적이네요. 다들 이번 주말은 어떻게 보내시나요?',
    image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2670&auto=format&fit=crop',
    likes: 124,
    comments: 15,
    tag: '디자인'
  },
  {
    id: 2,
    author: '딥스페이스',
    avatar: 'bg-neon-purple',
    time: '5시간 전',
    content: '우주를 연상케 하는 어두운 캔버스 배경에 고대비 텍스트가 시선을 집중시킵니다. 글라스모피즘 효과가 더해지니 마치 미래의 헤드업 디스플레이(HUD)를 보는 것 같은 기분입니다 🚀',
    likes: 89,
    comments: 32,
    tag: '미래기술'
  },
  {
    id: 3,
    author: '일상기록가',
    avatar: 'bg-emerald-500',
    time: '어제',
    content: '올해 목표했던 개인 프로젝트를 방금 배포했습니다. 길고 힘든 시간이었지만 그만큼 뿌듯함도 크네요! 새로운 시작을 위해 잠시 휴식기를 가질 예정입니다.',
    likes: 245,
    comments: 64,
    tag: '성취'
  }
];

const MOCK_NEWS_HEADLINES = [
  "글로벌 증시, AI 사이클 기대감에 일제히 상승",
  "글라스모피즘 UI 트렌드, 새로운 웹 표준으로 자리잡나",
  "스페이스X 화성 탐사선 발사 초읽기 돌입",
  "실리콘밸리 스타트업, 의도적 미니멀리즘 선언",
  "MZ세대 새로운 라이프스타일, '디지털 디톡스'",
  "미래 반도체 기술 컨퍼런스, 혁신 아키텍처 공개",
  "친환경 자동차 배터리 충전 속도 2배 단축 기술 개발",
];

export default function Stories() {
  const [newPost, setNewPost] = useState('');
  const [feed, setFeed] = useState(() => {
    const saved = localStorage.getItem('stories_feed');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return MOCK_POSTS;
      }
    }
    return MOCK_POSTS;
  });
  
  // Real-time News State
  const [newsTicker, setNewsTicker] = useState<any[]>([]);

  useEffect(() => {
    localStorage.setItem('stories_feed', JSON.stringify(feed));
  }, [feed]);

  // Fetch real-time news
  useEffect(() => {
    fetch('/api/news?q=IT+테크')
      .then(res => res.json())
      .then(data => {
        if (data.items) {
          setNewsTicker(data.items.slice(0, 5).map((item: any, idx: number) => ({
            id: Date.now() + idx,
            title: item.title,
            time: '최신',
            link: item.link
          })));
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handlePost = () => {
    if(!newPost.trim()) return;
    const post = {
      id: Date.now(),
      author: '나',
      avatar: 'bg-white text-deep-space',
      time: '방금 전',
      content: newPost,
      likes: 0,
      comments: 0,
      tag: '새소식'
    };
    setFeed([post, ...feed]);
    setNewPost('');
  };

  return (
    <div className="p-4 lg:py-10 max-w-[1200px] mx-auto min-h-screen">
      
      {/* Cinematic Header */}
      <div className="flex flex-col gap-3 pb-8 mb-8 border-b border-slate-200">
        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-slate-900 flex items-center gap-4">
          세상사는 이야기 <span className="text-emerald-600 font-mono text-xl md:text-2xl mt-2 hidden sm:inline-block">/ PUBLIC_SQUARE</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 font-sans max-w-2xl">
          자유롭게 생각을 나누고 소통하는 딥스페이스 광장입니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Feed Sector */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Compose Box */}
          <div className="glass-card p-6 relative shadow-sm border border-slate-200">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-[4px] bg-slate-100 shrink-0 flex items-center justify-center font-bold text-slate-900 text-lg z-10">
                나
              </div>
              <div className="flex-1 space-y-4">
                <textarea 
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="새로운 서사를 기록해 보세요..." 
                  className="w-full bg-transparent border-b border-slate-200 text-slate-900 font-sans text-lg resize-none focus:outline-none focus:border-emerald-500 focus:shadow-[0_4px_15px_-3px_rgba(16,185,129,0.1)] min-h-[60px] pb-2 placeholder:text-slate-400 transition-all duration-300"
                />
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <button className="p-2 rounded-[4px] hover:bg-emerald-50 text-emerald-500 hover:text-emerald-600 transition-colors group">
                      <ImageIcon className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </button>
                  </div>
                  <button onClick={handlePost} className="px-6 py-2 rounded-[4px] font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm">
                    <Send className="w-4 h-4" /> 송신
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stories Feed */}
          <div className="space-y-6">
            <AnimatePresence>
              {feed.map(post => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={post.id} 
                  className="glass-card p-6 md:p-8 group/card shadow-sm border border-slate-200"
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-[4px] ${post.avatar} flex items-center justify-center text-white font-black text-xl shadow-sm`}>
                        {post.author[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="font-display font-semibold text-slate-900 tracking-wide text-lg">{post.author}</p>
                          <span className="font-mono text-[10px] uppercase bg-emerald-50 text-emerald-600 px-2 py-1 rounded-[4px] border border-emerald-100 shadow-sm">
                            {post.tag}
                          </span>
                        </div>
                        <p className="font-mono text-xs text-slate-500 uppercase tracking-widest mt-1">{post.time}</p>
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-emerald-600 transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="space-y-6 mb-8 text-slate-700">
                    <p className="text-lg">
                      {post.content}
                    </p>
                    {post.image && (
                      <div className="relative rounded-[4px] overflow-hidden max-h-[400px] border border-slate-200 opacity-90 group-hover/card:opacity-100 transition-opacity duration-500">
                        <img src={post.image} alt="Post attachment" className="w-full h-full object-cover transition-all duration-700 hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                      </div>
                    )}
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center gap-8 pt-6 border-t border-slate-100 text-slate-500 font-mono">
                    <button className="flex items-center gap-2 hover:text-emerald-600 transition-colors group">
                      <Heart className="w-5 h-5 group-hover:drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-emerald-600 transition-colors group">
                      <MessageCircle className="w-5 h-5 group-hover:drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-emerald-600 transition-colors group ml-auto">
                      <Share2 className="w-5 h-5 group-hover:drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Tactical UI Right Sidebar - Real-time News */}
        <div className="lg:col-span-4">
          <div className="sticky top-24">
            <div className="glass-card p-6 border-slate-200 shadow-sm">
              
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-600 animate-pulse" /> 실시간 속보
                </h3>
                <span className="font-mono text-[10px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded-[4px] border border-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  LIVE
                </span>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {newsTicker.map((newsItem) => (
                    <motion.a 
                      href={newsItem.link} 
                      target="_blank" rel="noopener noreferrer"
                      key={newsItem.id}
                      initial={{ opacity: 0, x: -20, backgroundColor: 'rgba(16,185,129,0.1)' }}
                      animate={{ opacity: 1, x: 0, backgroundColor: 'rgba(0,0,0,0)' }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5 }}
                      className="group block p-3 rounded-[4px] hover:bg-slate-50 transition-colors border-l-2 border-transparent hover:border-emerald-500 relative overflow-hidden"
                    >
                      <div className="flex flex-col gap-1 relative z-10">
                        <span className="font-mono text-[10px] text-emerald-600/80 uppercase">
                          {newsItem.time}
                        </span>
                        <h4 className="font-sans text-sm text-slate-700 group-hover:text-slate-900 transition-colors leading-relaxed">
                          {newsItem.title}
                        </h4>
                      </div>
                    </motion.a>
                  ))}
                </AnimatePresence>
              </div>
              
              <div className="mt-8 pt-4 border-t border-slate-200">
                <button className="w-full bg-slate-100 text-slate-700 px-6 py-2 rounded-[4px] font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:bg-slate-200 shadow-sm text-sm">
                  전체 뉴스 모니터링 <Radio className="w-4 h-4 ml-1" />
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
