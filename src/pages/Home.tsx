import { Link } from "react-router-dom";
import {
  LineChart,
  Leaf,
  ArrowRight,
  MessageSquareHeart,
  BookOpen,
  Sparkles,
  ChevronDown
} from "lucide-react";
import { motion, Variants, useScroll, useTransform } from "motion/react";

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
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <header className="relative pt-16 md:pt-32 pb-16 md:pb-24 flex flex-col items-center text-center">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] overflow-hidden -z-10 pointer-events-none fade-out-bottom">
        <motion.div style={{ y: y1 }} className="absolute top-[-10%] left-[20%] w-72 h-72 bg-primary/20 rounded-full blur-[100px] opacity-60 mix-blend-multiply" />
        <motion.div style={{ y: y2 }} className="absolute top-[20%] right-[10%] w-96 h-96 bg-secondary/20 rounded-full blur-[100px] opacity-60 mix-blend-multiply" />
      </div>

      <motion.h1 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="text-5xl sm:text-6xl md:text-8xl font-display font-extrabold text-on-surface mb-8 tracking-tighter leading-[1.1]"
    >
      나만의 우물 속 세계를 <br className="hidden md:block" />
      <span className="relative inline-block mt-2 md:mt-4">
        <span className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-secondary/20 blur-2xl rounded-full opacity-50" />
        <span className="relative text-transparent bg-clip-text bg-gradient-to-br from-primary via-secondary to-primary drop-shadow-sm">
          기록하다
        </span>
      </span>
    </motion.h1>
    
    <motion.p 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="text-lg md:text-2xl text-on-surface-variant/80 max-w-2xl leading-relaxed font-medium tracking-tight mb-12"
    >
      수면 아래 감춰진 나만의 아카이브에 <br className="block md:hidden" />
      오신 것을 환영합니다
    </motion.p>
    
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
    >
      <Link to="/plants" className="relative group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-on-surface rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 ease-out hover:bg-blue-50 hover:text-blue-600 hover:scale-105 active:scale-95 shadow-sm border border-outline/20 hover:border-blue-200 hover:shadow-md">
        디지털 정원 가꾸기 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
      </Link>
      <Link to="/stories" className="relative group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-on-surface rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 ease-out hover:bg-blue-50 hover:text-blue-600 hover:scale-105 active:scale-95 shadow-sm border border-outline/20 hover:border-blue-200 hover:shadow-md">
        나의 세계 기록하기 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
      </Link>
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1 }}
      className="mt-20 text-on-surface-variant/40 animate-bounce"
    >
      <ChevronDown className="w-6 h-6" />
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
  return (
    <div className="space-y-12 md:space-y-24 pb-24 overflow-hidden relative">
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
                  나의 이야기
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
