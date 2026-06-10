import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Leaf,
  ArrowRight,
  MessageSquareHeart,
  BookOpen,
  ChevronDown
} from "lucide-react";
import { motion, Variants, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import { Helmet } from "react-helmet-async";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  }
};

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  // Performance-optimized low-overhead mouse parallax using Framer Motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for mouse parallax updates
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Map mouse coordinates to deep light parallax coordinate styles directly
  const glow1X = useTransform(springX, (val) => val * -1.5);
  const glow1Y = useTransform(springY, (val) => val * -1.5);

  const glow2X = useTransform(springX, (val) => val * 1.5);
  const glow2Y = useTransform(springY, (val) => val * 1.5);

  const glow3X = useTransform(springX, (val) => val * 0.5);
  const glow3Y = useTransform(springY, (val) => val * 0.5);

  // Combine scroll offsets and mouse movements for perfectly smooth GPU-accelerated calculations
  const glow1CombinedY = useTransform([y1, glow1Y], ([latestY1, latestGlowY]) => (latestY1 as number) + (latestGlowY as number));
  const glow2CombinedY = useTransform([y2, glow2Y], ([latestY2, latestGlowY]) => (latestY2 as number) + (latestGlowY as number));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 30);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 30);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Generate stable particle arrays
  const [particles] = useState(() => 
    Array.from({ length: 20 }).map(() => ({
      width: Math.random() * 6 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 10,
    }))
  );

  return (
    <header className="relative pt-[140px] md:pt-[180px] pb-32 md:pb-40 flex flex-col items-center justify-center text-center min-h-[85vh] overflow-hidden">
      {/* Abstract Background Deep World Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background/80 via-background to-surface" />
        
        {/* Floating Particles simulating deep well / underwater focus */}
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute bg-primary/30 rounded-full blur-[1px]"
            style={{
              width: p.width,
              height: p.width,
              left: `${p.left}%`,
              top: `${p.top}%`,
            }}
            animate={{
              y: [0, -150],
              opacity: [0, 1, 0],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
            }}
          />
        ))}

        {/* Deep well ambient lights with Mouse Parallax (Optimized to skip React re-renders) */}
        <motion.div 
          style={{ x: glow1X, y: glow1CombinedY }}
          className="absolute top-[10%] left-[15%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-primary/20 rounded-full blur-[120px] md:blur-[160px] mix-blend-multiply animate-glow-pulse" 
        />
        <motion.div 
          style={{ x: glow2X, y: glow2CombinedY }}
          className="absolute bottom-[20%] right-[10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-secondary/15 rounded-full blur-[120px] md:blur-[150px] mix-blend-multiply animate-glow-pulse [animation-delay:4s]" 
        />
        <motion.div 
          style={{ x: glow3X, y: glow3Y }}
          className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[500px] h-[400px] bg-blue-300/10 rounded-full blur-[120px] md:blur-[160px] mix-blend-multiply animate-glow-pulse [animation-delay:2s]" 
        />
        
        {/* Subtle top glow simulating surface light */}
        <div className="absolute top-0 inset-x-0 h-[300px] bg-gradient-to-b from-primary/5 to-transparent blur-[80px]" />
      </div>

      <div
        className="relative z-10 w-full max-w-5xl mx-auto space-y-10 flex flex-col items-center px-4"
      >
        <div className="space-y-6 md:space-y-8 flex flex-col items-center opacity-0 animate-fade-in-up">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-variant/30 border border-outline/10 text-on-surface-variant text-xs sm:text-sm font-medium backdrop-blur-md mb-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            가상자산 · 반려식물 · 개인 아카이브
          </motion.div>

          <h1 className="text-[3.5rem] sm:text-6xl md:text-[5.5rem] lg:text-[7rem] font-display font-black tracking-tight text-on-surface leading-[1.1]">
            우물 속 깊은 곳, <br className="hidden md:block" />
            나만의 <span className="relative inline-block mt-2 md:mt-0 xl:ml-2">
              <span className="relative z-10 text-transparent bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text drop-shadow-sm">
                세계
              </span>
              <div className="absolute inset-x-0 bottom-1 md:bottom-3 h-3 md:h-6 bg-primary/20 -z-10 -rotate-1 skew-x-12 blur-[1px] md:blur-[2px]" />
            </span>를 만나다
          </h1>
          
          <p className="text-xl md:text-2xl text-on-surface-variant/80 font-medium max-w-2xl mx-auto mt-8 leading-relaxed tracking-wide break-keep">
            수면 아래 감춰진 고요한 심연.<br />
            오롯이 나만의 기록과 상상이 부유하는 비밀스러운 공간.
          </p>
        </div>

        <div 
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-10 md:pt-14 w-full sm:w-auto opacity-0 animate-fade-in-up [animation-delay:400ms]"
        >
          <Link 
            to="/plants" 
            className="group relative overflow-hidden w-full sm:w-auto px-10 py-4 md:py-5 bg-on-surface text-surface rounded-full font-bold text-lg md:text-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-[150%] group-hover:animate-[shimmer_1.5s_infinite]" />
            <span className="relative z-10 flex items-center gap-2">
              정원 가꾸기 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          
          <Link 
            to="/stories" 
            className="group relative w-full sm:w-auto px-10 py-4 md:py-5 bg-surface/40 backdrop-blur-xl text-on-surface border border-outline/30 rounded-full font-bold text-lg md:text-xl hover:border-primary/50 hover:bg-surface-variant/50 transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md"
          >
            <span className="relative z-10 flex items-center gap-2">
              기록 펼치기
            </span>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-on-surface-variant/40 hover:text-on-surface-variant/80 flex flex-col items-center gap-3 transition-colors cursor-pointer"
        onClick={() => window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' })}
      >
        <span className="text-xs font-semibold tracking-[0.2em] uppercase">Scroll</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </motion.div>
    </header>
  );
};

const BentoCard = ({ to, label, className = "", children }: { to: string; label: string; className?: string; children: React.ReactNode }) => (
  <motion.article 
    variants={itemVariants} 
    className={`group relative flex flex-col h-full rounded-[2rem] overflow-hidden content-visibility-auto will-change-transform ${className}`}
  >
    <Link
      to={to}
      aria-label={label}
      className="absolute inset-0 z-20 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-[2rem]"
    />
    {children}
  </motion.article>
);

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "우물 그리고 세계들",
    "url": window.location.href,
    "description": "다양한 데이터를 탐색하고 기록을 남기는 웹 공간. 가상자산 터미널, 반려식물 저널, 개인 기록실을 제공합니다."
  };

  return (
    <div className="space-y-12 md:space-y-24 pb-24 overflow-hidden relative">
      <Helmet>
        <title>디지털 정원과 가상자산 터미널 | 우물 그리고 세계들</title>
        <meta name="description" content="가상자산 동향, 반려식물 기록, 방명록이 함께하는 나만의 디지털 아카이브. 우물 속 다채로운 세계를 탐험하세요." />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <HeroSection />

      {/* Bento Grid Layer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(320px,auto)]" 
          aria-label="주요 서비스 목록"
        >
          {/* Digital Garden */}
          <BentoCard 
            to="/plants" 
            label="디지털 정원으로 이동" 
            className="md:col-span-7 bg-surface/40 backdrop-blur-xl border border-outline/10 hover:bg-surface/60 transition-colors shadow-sm hover:shadow-xl hover:shadow-[#5D7964]/5"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#5D7964]/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#5D7964]/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
            
            {/* Decorative Icon */}
            <div className="absolute right-[-10%] bottom-[-10%] opacity-[0.03] group-hover:opacity-[0.06] transition-all duration-700 group-hover:-translate-y-4 group-hover:-translate-x-4 rotate-[-15deg] pointer-events-none">
              <Leaf className="w-96 h-96 text-on-surface" />
            </div>

            <div className="flex flex-col h-full p-8 md:p-10 relative z-10 w-full justify-between">
              <div className="w-16 h-16 bg-[#5D7964]/10 text-[#5D7964] rounded-2xl flex items-center justify-center border border-[#5D7964]/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                <Leaf className="w-8 h-8" />
              </div>

              <div className="mt-12 max-w-md">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-on-surface mb-4 tracking-tight">
                  디지털 정원
                </h2>
                <p className="text-lg text-on-surface-variant/90 leading-relaxed font-medium">
                  조용히 자라나는 반려 식물의 기록. 시간의 흐름에 따라 변화하는 나의 정원을 가꾸어보세요.
                </p>
                
                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-[#5D7964] bg-[#5D7964]/10 w-fit px-4 py-2 rounded-full group-hover:bg-[#5D7964]/20 transition-colors">
                  정원 산책하기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Stories & Journals */}
          <BentoCard 
            to="/stories" 
            label="나의 세계로 이동" 
            className="md:col-span-5 bg-surface/40 backdrop-blur-xl border border-outline/10 hover:bg-surface/60 transition-colors shadow-sm hover:shadow-xl hover:shadow-secondary/5"
          >
            <div className="absolute inset-0 bg-gradient-to-bl from-secondary/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="absolute right-[-10%] bottom-[-10%] opacity-[0.03] group-hover:opacity-[0.06] transition-all duration-700 group-hover:-translate-y-4 group-hover:rotate-12 pointer-events-none">
              <MessageSquareHeart className="w-80 h-80 text-on-surface" />
            </div>

            <div className="flex flex-col h-full p-8 md:p-10 relative z-10 w-full justify-between">
              <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center border border-secondary/20 group-hover:scale-110 transition-all duration-500 shadow-inner">
                <MessageSquareHeart className="w-8 h-8" />
              </div>

              <div className="mt-12">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-on-surface mb-4">
                  나의 세계
                </h2>
                <p className="text-lg text-on-surface-variant/90 leading-relaxed font-medium">
                  온전히 나에게만 집중하는 시간. 내면의 목소리를 아카이브에 안전하게 기록합니다.
                </p>
                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-secondary bg-secondary/10 w-fit px-4 py-2 rounded-full group-hover:bg-secondary/20 transition-colors">
                  기록 시작하기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Crypto Dashboard */}
          <BentoCard 
            to="/crypto" 
            label="시장의 심연으로 이동" 
            className="md:col-span-5 bg-surface/40 backdrop-blur-xl border border-outline/10 hover:bg-surface/60 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-primary/10 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Simulated Live Data Visuals (Glassmorphic Window) */}
            <div className="absolute right-[-5%] top-[15%] w-[280px] sm:w-[320px] h-[180px] sm:h-[200px] border border-outline/20 bg-surface/40 backdrop-blur-3xl rounded-2xl p-4 opacity-30 group-hover:opacity-100 transition-all duration-700 group-hover:-translate-y-2 group-hover:-translate-x-4 shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex flex-col gap-3 rotate-[5deg] group-hover:rotate-[-2deg] pointer-events-none">
              <div className="flex justify-between items-center border-b border-outline/10 pb-2">
                <span className="text-xs font-mono text-on-surface-variant font-bold">ETH/KRW</span>
                <span className="text-xs font-mono text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> +2.4%
                </span>
              </div>
              <div className="flex-1 relative overflow-hidden flex items-end gap-1.5">
                 {/* Fake Bar Chart */}
                 {[40, 70, 45, 90, 65, 85, 100, 75, 50, 80].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-primary/30 to-primary/80 rounded-t-sm transition-all duration-700" style={{ height: `${h}%` }} />
                 ))}
                 <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-surface to-transparent" />
              </div>
            </div>

            <div className="flex flex-col h-full p-8 md:p-10 relative z-10 w-full justify-between">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500 shadow-inner">
                <LineChart className="w-8 h-8" />
              </div>

              <div className="mt-20 md:mt-12 md:max-w-[90%]">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-on-surface mb-4 group-hover:text-primary transition-colors duration-300">
                  시장의 심연
                </h2>
                <p className="text-lg text-on-surface-variant/90 leading-relaxed font-medium break-keep">
                  실시간 가상자산의 파동을 관측합니다. 차가운 데이터 속에서 시장의 깊이를 탐색하세요.
                </p>
                
                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 w-fit px-4 py-2 rounded-full group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-[0_0_0_rgba(var(--color-primary),0)] group-hover:shadow-[0_4px_15px_rgba(var(--color-primary),0.3)]">
                  관측소 접속 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Guestbook */}
          <BentoCard 
            to="/guestbook" 
            label="방명록으로 이동" 
            className="md:col-span-7 bg-surface/40 backdrop-blur-xl border border-outline/10 hover:bg-surface/60 transition-colors shadow-sm hover:shadow-xl hover:shadow-outline/5"
          >
            <div className="absolute inset-0 bg-gradient-to-tl from-surface-variant/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-surface-variant/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />

            <div className="absolute right-[-5%] bottom-[-20%] opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-700 group-hover:-translate-y-6 group-hover:rotate-12 pointer-events-none">
              <BookOpen className="w-[400px] h-[400px] text-on-surface" />
            </div>

            <div className="flex flex-col h-full p-8 md:p-10 relative z-10 w-full justify-between">
              <div className="w-16 h-16 bg-surface border border-outline/20 text-on-surface-variant rounded-2xl flex items-center justify-center group-hover:-translate-y-2 hover:shadow-lg transition-all duration-500 shadow-sm">
                <BookOpen className="w-8 h-8" />
              </div>

              <div className="mt-12 max-w-md">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-on-surface mb-4">
                  방명록
                </h2>
                <p className="text-lg text-on-surface-variant/90 leading-relaxed font-medium">
                  다른 세계의 탐험가들이 남긴 발자취를 확인하고, 여러분의 기록도 남겨보세요.
                </p>
                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-on-surface-variant bg-surface border border-outline/10 shadow-sm w-fit px-4 py-2 rounded-full group-hover:bg-surface-variant/30 transition-colors">
                  흔적 둘러보기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </BentoCard>
        </motion.section>
      </div>
    </div>
  );
}
