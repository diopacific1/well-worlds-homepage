import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LineChart, Leaf, MessageSquareHeart, Trophy, Menu, X, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newsIndex, setNewsIndex] = useState(0);
  const [globalNews, setGlobalNews] = useState<string[]>([
    "최신 뉴스를 불러오는 중입니다..."
  ]);

  useEffect(() => {
    fetch('/api/news?q=특보')
      .then(res => res.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          setGlobalNews(data.items.map((item: any) => item.title));
        }
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNewsIndex((prev) => (globalNews.length > 0 ? (prev + 1) % globalNews.length : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, [globalNews]);

  const navItems = [
    { name: '홈', path: '/', icon: LayoutDashboard },
    { name: '금융 터미널', path: '/crypto', icon: LineChart },
    { name: '디지털 정원', path: '/plants', icon: Leaf },
    { name: '나의 세계', path: '/stories', icon: MessageSquareHeart },
  ];

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

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 py-12 md:py-16">
        <Outlet />
      </main>
    </div>
  );
}
