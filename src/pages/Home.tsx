import { Link } from "react-router-dom";
import {
  LineChart,
  Leaf,
  ArrowRight,
  MessageSquareHeart,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";

const HeroSection = () => (
  <header className="pt-12 md:pt-20 pb-8">
    <motion.h1 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-on-surface mb-6 tracking-tight leading-[1.25] md:leading-[1.15]"
    >
      나만의 우물 속 세계를 <br className="hidden md:block" />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-sm">
        기록하다
      </span>
    </motion.h1>
    <motion.p 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="text-xl md:text-2xl text-on-surface-variant/90 max-w-3xl leading-relaxed font-medium tracking-tight mb-10"
    >
      깊은 우물 아래, <br className="block md:hidden" />
      아직 이름 붙지 않은 세계가 펼쳐진다
    </motion.p>
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex flex-wrap items-center gap-4"
    >
      <Link to="/plants" className="btn-primary">
        디지털 정원 가꾸기 <ArrowRight className="w-4 h-4" />
      </Link>
      <Link to="/stories" className="btn-ghost">
        나의 세계 기록하기
      </Link>
    </motion.div>
  </header>
);

const BentoCard = ({ to, label, className = "", children }: { to: string; label: string; className?: string; children: React.ReactNode }) => (
  <motion.div
    whileHover={{ y: -5 }}
    transition={{ type: "spring", stiffness: 300 }}
    className={className}
  >
      <Link
        to={to}
        aria-label={label}
        className="group relative flex flex-col h-full card overflow-hidden"
      >
      {children}
    </Link>
  </motion.div>
);

export default function Home() {
  return (
    <div className="space-y-16 pb-16">
      <HeroSection />

      {/* Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 auto-rows-[minmax(340px,auto)]" aria-label="주요 서비스 목록">
        
        {/* Digital Garden */}
        <BentoCard 
          to="/plants" 
          label="디지털 정원으로 이동" 
          className="md:col-span-7 border border-[#5D7964]/20 hover:border-[#5D7964]/40 rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#5D7964]/5 to-transparent -z-10" />
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#5D7964]/5 rounded-full blur-3xl group-hover:bg-[#5D7964]/10 transition-colors duration-700 pointer-events-none" />

          <div className="flex flex-col h-full p-6 md:p-8 relative z-10 w-full">
            <div className="w-14 h-14 bg-surface shadow-sm text-[#5D7964] rounded-2xl flex items-center justify-center mb-auto border border-[#5D7964]/10 group-hover:rotate-6 transition-transform duration-500" aria-hidden="true">
              <Leaf className="w-7 h-7" />
            </div>

            <div className="mt-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-on-surface mb-3 tracking-tight">
                디지털 정원
              </h2>
              <p className="text-base text-on-surface-variant leading-relaxed max-w-md">
                조용한 반려 식물 성장 기록. 유기적인 성장 지표와 사진 타임라인을 기록하며 나만의 정원을 가꾸세요.
              </p>
              
              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-[#5D7964]">
                정원 산책하기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Stories & Journals */}
        <BentoCard 
          to="/stories" 
          label="나의 세계로 이동" 
          className="md:col-span-5 border border-secondary/20 hover:border-secondary/40 rounded-3xl group"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent -z-10" />

          <div className="flex flex-col h-full p-6 md:p-8 relative z-10 w-full">
            <div className="w-14 h-14 bg-surface shadow-sm text-secondary rounded-2xl border border-secondary/10 flex items-center justify-center mb-auto group-hover:scale-105 transition-transform duration-500" aria-hidden="true">
              <MessageSquareHeart className="w-7 h-7" />
            </div>

            <div className="mt-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-on-surface mb-3">
                나의 이야기
              </h2>
              <p className="text-base text-on-surface-variant leading-relaxed">
                당신의 세계를 온전히 기록하는 아카이브입니다.
              </p>
              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-secondary">
                기록 시작하기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Crypto Dashboard */}
        <BentoCard 
          to="/crypto" 
          label="크립토 월드로 이동" 
          className="md:col-span-7 border border-primary/20 hover:border-primary/40 rounded-3xl group"
        >
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="flex flex-col h-full p-6 md:p-8 relative z-10 w-full">
            <div className="w-14 h-14 bg-surface shadow-sm text-primary rounded-2xl border border-primary/10 flex items-center justify-center mb-auto group-hover:scale-105 transition-transform duration-500" aria-hidden="true">
              <LineChart className="w-7 h-7" />
            </div>

            <div className="mt-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-on-surface mb-3">
                크립토 월드
              </h2>
              <p className="text-base text-on-surface-variant leading-relaxed max-w-md">
                고급 가상자산 모니터링 대시보드. 기관 수준의 차트와 실시간 포트폴리오 성과를 분석하고 관리하세요.
              </p>
              
              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-primary">
                대시보드 열기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Board */}
        <BentoCard 
          to="/board" 
          label="게시판으로 이동" 
          className="md:col-span-5 border border-outline/20 hover:border-outline/40 rounded-3xl group"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-surface-variant/10 to-transparent -z-10" />

          <div className="flex flex-col h-full p-6 md:p-8 relative z-10 w-full">
            <div className="w-14 h-14 bg-surface shadow-sm text-on-surface-variant rounded-2xl border border-outline/10 flex items-center justify-center mb-auto group-hover:-translate-y-1 transition-transform duration-500" aria-hidden="true">
              <BookOpen className="w-7 h-7" />
            </div>

            <div className="mt-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-on-surface mb-3">
                게시판
              </h2>
              <p className="text-base text-on-surface-variant leading-relaxed">
                자유롭게 소통하고 정보를 나누는 오픈 커뮤니티 공간입니다.
              </p>
              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-on-surface-variant">
                게시판 둘러보기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </BentoCard>
      </section>
    </div>
  );
}
