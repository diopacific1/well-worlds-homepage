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
import { motion, Variants, useScroll, useTransform } from "motion/react";
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

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 30, // Max 15px movement
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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

        {/* Deep well ambient lights with Mouse Parallax */}
        <motion.div 
          style={{ y: y1 }}
          animate={{ x: mousePosition.x * -1.5, y: mousePosition.y * -1.5 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="absolute top-[10%] left-[15%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-primary/20 rounded-full blur-[120px] md:blur-[160px] mix-blend-multiply animate-glow-pulse" 
        />
        <motion.div 
          style={{ y: y2 }}
          animate={{ x: mousePosition.x * 1.5, y: mousePosition.y * 1.5 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="absolute bottom-[20%] right-[10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-secondary/15 rounded-full blur-[120px] md:blur-[150px] mix-blend-multiply animate-glow-pulse [animation-delay:4s]" 
        />
        <motion.div 
          animate={{ x: mousePosition.x * 0.5, y: mousePosition.y * 0.5 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[500px] h-[400px] bg-blue-300/10 rounded-full blur-[120px] md:blur-[160px] mix-blend-multiply animate-glow-pulse [animation-delay:2s]" 
        />
        
        {/* Subtle top glow simulating surface light */}
        <div className="absolute top-0 inset-x-0 h-[300px] bg-gradient-to-b from-primary/5 to-transparent blur-[80px]" />
      </div>

      <div
        className="relative z-10 w-full max-w-5xl mx-auto space-y-10 flex flex-col items-center px-4"
      >
        <div className="space-y-6 md:space-y-8 flex flex-col items-center opacity-0 animate-fade-in-up">
          <h1 className="text-[3.5rem] sm:text-6xl md:text-[5.5rem] lg:text-[6.5rem] font-display font-black tracking-tighter text-on-surface leading-[1.05]">
            우물 속 세계로 <br className="hidden md:block" />
            <span className="relative inline-block mt-2">
              <span className="relative z-10 text-transparent bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text drop-shadow-sm">
                빠져들다
              </span>
              <div className="absolute inset-x-0 bottom-2 md:bottom-4 h-4 md:h-8 bg-primary/20 -z-10 -rotate-2 skew-x-12 blur-[2px]" />
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-on-surface-variant/90 font-medium max-w-2xl mx-auto mt-8 leading-relaxed tracking-wide break-keep">
            수면 아래 감춰진 고요한 심연.<br />
            나만의 기록과 상상이 부유하는 세계.
          </p>
        </div>

        <div 
          className="flex flex-col sm:flex-row items-center gap-5 pt-8 md:pt-12 w-full sm:w-auto opacity-0 animate-fade-in-up [animation-delay:200ms]"
        >
          <Link 
            to="/plants" 
            className="group relative overflow-hidden w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-full font-bold text-lg transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(var(--color-primary),0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-[150%] group-hover:animate-[shimmer_1.5s_infinite]" />
            <span className="relative z-10 flex items-center gap-2">
              정원 가꾸기 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          
          <Link 
            to="/stories" 
            className="group relative w-full sm:w-auto px-8 py-4 bg-surface/50 backdrop-blur-md text-on-surface border border-outline/20 rounded-full font-bold text-lg hover:border-primary/40 hover:bg-surface-variant/50 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          >
            기록 펼치기
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
  <motion.div variants={itemVariants} className={`group relative flex flex-col h-full rounded-[2rem] overflow-hidden ${className}`}>
    <Link
      to={to}
      aria-label={label}
      className="absolute inset-0 z-20 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-[2rem]"
    />
    {children}
  </motion.div>
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
            label="크립토 월드로 이동" 
            className="md:col-span-5 bg-surface/40 backdrop-blur-xl border border-outline/10 hover:bg-surface/60 transition-colors shadow-sm hover:shadow-xl hover:shadow-primary/5"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="absolute right-[-10%] bottom-[-10%] opacity-[0.03] group-hover:opacity-[0.06] transition-all duration-700 group-hover:-translate-y-4 group-hover:rotate-[-5deg] pointer-events-none">
              <LineChart className="w-80 h-80 text-on-surface" />
            </div>

            <div className="flex flex-col h-full p-8 md:p-10 relative z-10 w-full justify-between">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-all duration-500 shadow-inner">
                <LineChart className="w-8 h-8" />
              </div>

              <div className="mt-12">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-on-surface mb-4">
                  크립토 월드
                </h2>
                <p className="text-lg text-on-surface-variant/90 leading-relaxed font-medium">
                  실시간 가상자산 모니터링 및 흐름 파악. 데이터를 통해 시장의 깊이를 탐색하세요.
                </p>
                
                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 w-fit px-4 py-2 rounded-full group-hover:bg-primary/20 transition-colors">
                  대시보드 열기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
