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
    { name: '식물 일지', path: '/plants', icon: Leaf },
    { name: '세상사는 이야기', path: '/stories', icon: MessageSquareHeart },
    { name: '야구이야기', path: '/baseball', icon: Trophy },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-[20px] flex flex-col">
        {/* Main Header Bar */}
        <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between w-full">
          <Link to="/" className="flex items-center gap-3 group z-50">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-sm relative overflow-hidden">
              <div className="w-4 h-4 bg-white rounded-sm rotate-45 transform group-hover:rotate-90 transition-transform duration-500"></div>
            </div>
            <h1 className="text-xl font-display font-medium tracking-tight text-slate-900">
              우물 그리고 세계들 <span className="text-slate-500 font-mono text-xs ml-2 border border-slate-200 px-2 py-0.5 rounded-full bg-slate-100">v2.0</span>
            </h1>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            {navItems.map((item) => {
              const active = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200">
              <span className="relative flex h-1.5 w-1.5 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono text-emerald-700 uppercase">
                시스템 정상 작동
              </span>
            </div>
            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 text-slate-500 hover:text-slate-900 z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Global News Ticker */}
        <div className="w-full border-t border-slate-200 bg-sky-50">
          <div className="max-w-[1600px] mx-auto px-4 h-8 flex items-center overflow-hidden relative text-[11px] sm:text-xs">
            <div className="flex items-center gap-2 font-mono font-bold text-sky-600 shrink-0 z-10 bg-white/80 pr-3 h-full backdrop-blur-sm">
               <Globe className="w-3.5 h-3.5" /> LIVE 속보
            </div>
            <div className="flex-1 relative h-full flex items-center overflow-hidden w-full">
               <AnimatePresence mode="wait">
                 <motion.p
                   key={newsIndex}
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   exit={{ y: -20, opacity: 0 }}
                   transition={{ duration: 0.4 }}
                   className="absolute text-slate-600 whitespace-nowrap"
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
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 flex flex-col p-4 gap-2 lg:hidden shadow-2xl z-40"
            >
              {navItems.map((item) => {
                const active = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-[4px] text-sm font-bold transition-colors ${
                      active
                        ? 'bg-sky-100 text-sky-700 border border-sky-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 w-full max-w-[1600px] mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
