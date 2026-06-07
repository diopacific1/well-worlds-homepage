import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LineChart, Leaf, MessageSquareHeart, BookOpen, Settings, Info, Menu, X, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';

export default function Layout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newsIndex, setNewsIndex] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [globalNews, setGlobalNews] = useState<string[]>([
    "최신 뉴스를 불러오는 중입니다..."
  ]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!auth) {
      setIsAdmin(false);
      return;
    }
    // Firebase 인증 상태 리스너: 로그인된 관리자인지 확인
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news?q=특보');
        if (!res.ok) throw new Error('API fetch failed');
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          setGlobalNews(data.items.map((item: any) => item.title.replace(/<\/?[^>]+(>|$)/g, "").replace(/&quot;/g, '"')));
        } else {
          throw new Error('No items');
        }
      } catch (err) {
        // Fallback static strings
        setGlobalNews([
          "비트코인, 글로벌 금융 기관 채택 확대로 상승세 지속 의견 팽팽",
          "나스닥 및 S&P 500 등 주요 지수 보합권 내 등락 반복",
          "AI 및 친환경 테마 관련 스타트업 투자 유치 규모 역대 최고치 경신",
          "글로벌 긴축 기조 완화 기대감에 위험 자산 선호 심리 회복 조짐",
        ]);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNewsIndex((prev) => (globalNews.length > 0 ? (prev + 1) % globalNews.length : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, [globalNews]);

  const baseNavItems = [
    { name: '홈', path: '/', icon: LayoutDashboard },
    { name: '디지털 정원', path: '/plants', icon: Leaf },
    { name: '나의 세계', path: '/stories', icon: MessageSquareHeart },
    { name: '크립토 월드', path: '/crypto', icon: LineChart },
    { name: '게시판', path: '/board', icon: BookOpen },
  ];

  // 관리자일 때만 관리자 메뉴 추가
  const navItems = isAdmin 
    ? [...baseNavItems, { name: '관리자', path: '/admin/dashboard', icon: Settings }]
    : baseNavItems;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-outline/20 bg-surface/80 backdrop-blur-[20px] flex flex-col">
        {/* Main Header Bar */}
        <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between w-full">
          <Link to="/" className="flex items-center gap-3 group z-50">
            <div className="w-10 h-10 rounded-xl bg-on-surface flex items-center justify-center shadow-md relative overflow-hidden group-hover:bg-primary transition-colors duration-500">
              <div className="w-4 h-4 bg-surface rounded-sm rotate-45 transform group-hover:rotate-90 transition-transform duration-500"></div>
            </div>
            <h1 className="text-xl font-display font-bold tracking-tight text-on-surface flex items-center gap-2">
              우물 그리고 세계들 <span className="text-primary font-bold text-[10px] uppercase tracking-widest border border-primary/20 px-2 py-0.5 rounded-full bg-primary-light/30 hidden sm:inline-block">v2.0</span>
            </h1>
          </Link>

          <nav className="hidden lg:flex items-center gap-2" aria-label="메인 메뉴">
            {navItems.map((item) => {
              const active = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    active
                      ? 'bg-primary text-white shadow-[0_2px_4px_rgba(70,72,212,0.3)]'
                      : 'text-on-surface-variant hover:text-primary hover:bg-primary-light/30'
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center px-4 py-1.5 rounded-full bg-primary-light/40 border border-primary/20">
              <span className="relative flex h-1.5 w-1.5 mr-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
              </span>
              <span className="text-[11px] font-semibold tracking-wider text-primary uppercase" aria-live="polite">
                시스템 정상 작동
              </span>
            </div>
            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 text-on-surface-variant hover:text-on-surface z-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Global News Ticker */}
        <div className="w-full border-t border-outline/20 bg-surface-container-lowest">
          <div className="max-w-[1280px] mx-auto px-6 h-10 flex items-center overflow-hidden relative text-xs font-semibold">
            <div className="flex items-center gap-2 text-primary shrink-0 z-10 bg-surface-container-lowest pr-4 h-full">
               <Globe className="w-4 h-4" /> <span className="tracking-widest uppercase">LIVE 속보</span>
            </div>
            <div className="flex-1 relative h-full flex items-center overflow-hidden w-full px-2">
               <AnimatePresence mode="wait">
                 <motion.p
                   key={newsIndex}
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   exit={{ y: -20, opacity: 0 }}
                   transition={{ duration: 0.4 }}
                   className="absolute text-on-surface-variant whitespace-nowrap"
                 >
                   {globalNews[newsIndex]}
                 </motion.p>
               </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="모바일 메뉴"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 w-full bg-surface/95 backdrop-blur-xl border-b border-outline/20 flex flex-col p-6 gap-3 lg:hidden shadow-2xl z-40"
            >
              {navItems.map((item) => {
                const active = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-3 px-4 py-4 rounded-xl text-base font-bold transition-all ${
                      active
                        ? 'bg-primary text-white shadow-md'
                        : 'text-on-surface-variant hover:text-primary hover:bg-primary-light/20'
                    }`}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                    {item.name}
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-6 py-8 md:py-16">
        <Outlet />
      </main>
    </div>
  );
}
