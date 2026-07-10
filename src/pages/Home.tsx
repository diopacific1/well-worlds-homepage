
import { useEffect, useMemo, memo, useState } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Leaf,
  ArrowRight,
  MessageSquareHeart,
  BookOpen,
  ChevronDown,
  ExternalLink,
  Code2,
} from "lucide-react";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase";
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

const HeroSection = memo(() => {
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
    let animationFrameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      // requestAnimationFrame을 활용한 마우스 이벤트 최적화
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        mouseX.set((e.clientX / window.innerWidth - 0.5) * 30);
        mouseY.set((e.clientY / window.innerHeight - 0.5) * 30);
      });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mouseX, mouseY]);

  // Generate stable particle arrays using useMemo
  const particles = useMemo(() => 
    Array.from({ length: 20 }).map(() => ({
      width: Math.random() * 6 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 10,
    })), 
  []);

  return (
    <header className="relative pt-[140px] md:pt-[180px] pb-32 md:pb-40 flex flex-col items-center justify-center text-center min-h-[92vh] overflow-hidden">
      
      {/* Abstract Background Deep World Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background/70 via-background to-surface" />
        
        {/* Floating Particles simulating deep well / underwater space in subtle sine motion */}
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute bg-primary/25 rounded-full blur-[0.5px] will-change-transform"
            style={{
              width: p.width,
              height: p.width,
              left: `${p.left}%`,
              top: `${p.top}%`,
            }}
            animate={{
              y: [0, -180],
              x: [0, Math.sin(i) * 15, 0],
              opacity: [0, 0.7, 0],
              scale: [0.7, 1.3, 0.7]
            }}
            transition={{
              duration: p.duration + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}

        {/* Deep well ambient lights with Mouse Parallax - Expanded with higher saturation & premium blur dynamics */}
        <motion.div 
          style={{ x: glow1X, y: glow1CombinedY }}
          className="absolute top-[8%] left-[12%] w-[450px] md:w-[700px] h-[450px] md:h-[700px] bg-primary/25 rounded-full blur-[130px] md:blur-[180px] mix-blend-screen animate-glow-pulse will-change-transform" 
        />
        <motion.div 
          style={{ x: glow2X, y: glow2CombinedY }}
          className="absolute bottom-[15%] right-[8%] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-secondary/20 rounded-full blur-[130px] md:blur-[170px] mix-blend-screen animate-glow-pulse [animation-delay:3.5s] will-change-transform" 
        />
        <motion.div 
          style={{ x: glow3X, y: glow3Y }}
          className="absolute top-[35%] left-[50%] -translate-x-1/2 w-[550px] h-[450px] bg-sky-400/15 rounded-full blur-[130px] md:blur-[180px] mix-blend-screen animate-glow-pulse [animation-delay:1.8s] will-change-transform" 
        />
        
        {/* Subtle top glow simulating surface light reflecting down the well */}
        <div className="absolute top-0 inset-x-0 h-[350px] bg-gradient-to-b from-primary/10 to-transparent blur-[90px]" />
      </div>

      <div
        className="relative z-10 w-full max-w-5xl mx-auto space-y-12 flex flex-col items-center px-6"
      >
        <div className="space-y-12 flex flex-col items-center justify-center relative">
          
          {/* Enhanced Abstract Core Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[225px] h-[225px] sm:w-[340px] sm:h-[340px] md:w-[450px] md:h-[450px] lg:w-[600px] lg:h-[600px] mx-auto flex items-center justify-center perspective-[1200px]"
          >
            {/* Deep Intense Aura */}
            <motion.div
              animate={{
                scale: [0.8, 1.4, 0.8],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-primary/30 rounded-full blur-[100px] mix-blend-screen pointer-events-none"
            />

            {/* 3D Solar System Planetary Orbits */}
            <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: "preserve-3d" }}>
              
              {/* Orbit 1: 수성 (Mercury) */}
              <div className="absolute inset-[38%] rounded-full border border-white/10" style={{ transformStyle: "preserve-3d", transform: "rotateX(75deg) rotateY(5deg)" }}>
                <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [0, 360] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }}>
                  <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 pointer-events-auto group cursor-pointer" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [360, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }}>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-300 to-gray-600 shadow-[0_0_10px_rgba(156,163,175,0.5)] border border-white/30" style={{ transform: "rotateY(-5deg) rotateX(-75deg)" }}>
                      <div className="absolute top-[130%] left-1/2 -translate-x-1/2 px-4 py-3 bg-surface/90 backdrop-blur-xl border border-outline/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-max max-w-[220px] shadow-2xl scale-95 group-hover:scale-100 z-50">
                         <p className="text-sm font-bold text-gray-300 mb-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" /> 수성 (Mercury)</p>
                         <p className="text-xs text-on-surface-variant leading-relaxed break-keep">태양에 가장 가까운 작고 뜨거운 암석 행성입니다.</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Orbit 2: 금성 (Venus) */}
              <div className="absolute inset-[28%] rounded-full border border-white/10" style={{ transformStyle: "preserve-3d", transform: "rotateX(72deg) rotateY(-5deg)" }}>
                <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [0, 360] }} transition={{ duration: 9, repeat: Infinity, ease: "linear" }}>
                  <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 pointer-events-auto group cursor-pointer" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [360, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "linear" }}>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-200 to-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)] border border-white/30" style={{ transform: "rotateY(5deg) rotateX(-72deg)" }}>
                      <div className="absolute top-[130%] left-1/2 -translate-x-1/2 px-4 py-3 bg-surface/90 backdrop-blur-xl border border-outline/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-max max-w-[220px] shadow-2xl scale-95 group-hover:scale-100 z-50">
                         <p className="text-sm font-bold text-orange-400 mb-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" /> 금성 (Venus)</p>
                         <p className="text-xs text-on-surface-variant leading-relaxed break-keep">두꺼운 온실가스로 덮여 태양계에서 가장 뜨거운 행성입니다.</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Orbit 3: 지구 (Earth) */}
              <div className="absolute inset-[17%] rounded-full border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]" style={{ transformStyle: "preserve-3d", transform: "rotateX(75deg) rotateY(10deg)" }}>
                <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [0, 360] }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }}>
                  <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 sm:w-7 sm:h-7 md:w-10 md:h-10 pointer-events-auto group cursor-pointer" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [360, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }}>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#22c55e] via-[#3b82f6] to-[#1d4ed8] shadow-[0_0_20px_rgba(59,130,246,0.6)] border border-white/50" style={{ transform: "rotateY(-10deg) rotateX(-75deg)" }}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.9),_transparent_60%)] rounded-full mix-blend-overlay" />
                      <div className="absolute top-[130%] left-1/2 -translate-x-1/2 px-4 py-3 bg-surface/90 backdrop-blur-xl border border-outline/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-max max-w-[240px] shadow-2xl scale-95 group-hover:scale-100 z-50">
                         <p className="text-sm font-bold text-blue-400 mb-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /> 지구 (Earth)</p>
                         <p className="text-xs text-on-surface-variant leading-relaxed break-keep">액체 상태의 물과 생명체가 존재하는 유일한 푸른 행성입니다.</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Orbit 4: 화성 (Mars) */}
              <div className="absolute inset-[8%] rounded-full border border-red-500/15" style={{ transformStyle: "preserve-3d", transform: "rotateX(70deg) rotateY(-10deg)" }}>
                <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [0, 360] }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }}>
                  <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 pointer-events-auto group cursor-pointer" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [360, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }}>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400 to-red-700 shadow-[0_0_15px_rgba(220,38,38,0.5)] border border-white/30" style={{ transform: "rotateY(10deg) rotateX(-70deg)" }}>
                      <div className="absolute top-[130%] left-1/2 -translate-x-1/2 px-4 py-3 bg-surface/90 backdrop-blur-xl border border-outline/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-max max-w-[220px] shadow-2xl scale-95 group-hover:scale-100 z-50">
                         <p className="text-sm font-bold text-red-400 mb-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" /> 화성 (Mars)</p>
                         <p className="text-xs text-on-surface-variant leading-relaxed break-keep">산화철로 인해 붉게 보이는 과거 물이 흘렀던 행성입니다.</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Orbit 5: 목성 (Jupiter) */}
              <div className="absolute inset-[-6%] rounded-full border border-orange-400/20" style={{ transformStyle: "preserve-3d", transform: "rotateX(74deg) rotateY(15deg)" }}>
                <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [0, 360] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
                  <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 pointer-events-auto group cursor-pointer" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [360, 0] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-200 via-amber-600 to-amber-900 shadow-[0_0_25px_rgba(217,119,6,0.5)] border border-white/30 overflow-hidden" style={{ transform: "rotateY(-15deg) rotateX(-74deg)" }}>
                      {/* Jupiter Stripes */}
                      <div className="absolute top-[20%] left-0 w-full h-[15%] bg-amber-800/40 rounded-[50%]" />
                      <div className="absolute top-[50%] left-0 w-full h-[25%] bg-orange-900/30 rounded-[50%]" />
                      <div className="absolute top-[60%] left-[60%] w-[25%] h-[20%] bg-red-700/60 rounded-full blur-[2px]" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.7),_transparent_60%)] rounded-full mix-blend-overlay" />
                      
                      <div className="absolute top-[120%] left-1/2 -translate-x-1/2 px-4 py-3 bg-surface/90 backdrop-blur-xl border border-outline/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-max max-w-[240px] shadow-2xl scale-95 group-hover:scale-100 z-50">
                         <p className="text-sm font-bold text-amber-500 mb-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> 목성 (Jupiter)</p>
                         <p className="text-xs text-on-surface-variant leading-relaxed break-keep">태양계에서 가장 거대한 가스 행성으로 웅장한 대적점이 있습니다.</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Orbit 6: 토성 (Saturn) */}
              <div className="absolute inset-[-20%] rounded-full border border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.1)]" style={{ transformStyle: "preserve-3d", transform: "rotateX(68deg) rotateY(-20deg)" }}>
                <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [0, 360] }} transition={{ duration: 65, repeat: Infinity, ease: "linear" }}>
                  <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-10 sm:h-10 md:w-14 md:h-14 pointer-events-auto group cursor-pointer" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [360, 0] }} transition={{ duration: 65, repeat: Infinity, ease: "linear" }}>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#fcd34d] via-[#d97706] to-[#78350f] shadow-[0_0_30px_rgba(217,119,6,0.6)] border border-white/40 flex items-center justify-center" style={{ transform: "rotateY(20deg) rotateX(-68deg)", transformStyle: "preserve-3d" }}>
                      {/* Planetary Ring */}
                      <div className="absolute w-[220%] h-[220%] border-[4px] md:border-[6px] border-[#fde68a]/60 rounded-full shadow-[0_0_15px_rgba(253,230,138,0.5)] pointer-events-none" style={{ transform: "rotateX(75deg) rotateY(15deg)" }} />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.8),_transparent_60%)] rounded-full mix-blend-overlay" />
                      
                      <div className="absolute top-[140%] left-1/2 -translate-x-1/2 px-4 py-3 bg-surface/90 backdrop-blur-xl border border-outline/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-max max-w-[240px] shadow-2xl scale-95 group-hover:scale-100 z-50">
                         <p className="text-sm font-bold text-yellow-400 mb-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" /> 토성 (Saturn)</p>
                         <p className="text-xs text-on-surface-variant leading-relaxed break-keep">아름다운 얼음 고리를 가진 물에 뜰 정도로 가벼운 행성입니다.</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Orbit 7: 천왕성 (Uranus) */}
              <div className="absolute inset-[-32%] rounded-full border border-cyan-400/15" style={{ transformStyle: "preserve-3d", transform: "rotateX(73deg) rotateY(8deg)" }}>
                <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [0, 360] }} transition={{ duration: 90, repeat: Infinity, ease: "linear" }}>
                  <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 pointer-events-auto group cursor-pointer" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [360, 0] }} transition={{ duration: 90, repeat: Infinity, ease: "linear" }}>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-200 to-cyan-600 shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-white/40 flex items-center justify-center" style={{ transform: "rotateY(-8deg) rotateX(-73deg)", transformStyle: "preserve-3d" }}>
                      <div className="absolute w-[150%] h-[150%] border-[1px] md:border-[2px] border-cyan-200/40 rounded-full pointer-events-none" style={{ transform: "rotateY(80deg) rotateX(20deg)" }} />
                      <div className="absolute top-[130%] left-1/2 -translate-x-1/2 px-4 py-3 bg-surface/90 backdrop-blur-xl border border-outline/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-max max-w-[220px] shadow-2xl scale-95 group-hover:scale-100 z-50">
                         <p className="text-sm font-bold text-cyan-400 mb-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> 천왕성 (Uranus)</p>
                         <p className="text-xs text-on-surface-variant leading-relaxed break-keep">자전축이 극단적으로 기울어져 누워서 자전하는 얼음 행성입니다.</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Orbit 8: 해왕성 (Neptune) */}
              <div className="absolute inset-[-42%] rounded-full border border-blue-600/20 border-dashed" style={{ transformStyle: "preserve-3d", transform: "rotateX(71deg) rotateY(25deg)" }}>
                <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [0, 360] }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }}>
                  <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 sm:w-7 sm:h-7 md:w-9 md:h-9 pointer-events-auto group cursor-pointer" style={{ transformStyle: "preserve-3d" }} animate={{ rotateZ: [360, 0] }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }}>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-300 via-blue-600 to-indigo-900 shadow-[0_0_20px_rgba(37,99,235,0.6)] border border-white/50" style={{ transform: "rotateY(-25deg) rotateX(-71deg)" }}>
                       <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.9),_transparent_60%)] rounded-full mix-blend-overlay" />
                       <div className="absolute top-[130%] left-1/2 -translate-x-1/2 px-4 py-3 bg-surface/90 backdrop-blur-xl border border-outline/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-max max-w-[240px] shadow-2xl scale-95 group-hover:scale-100 z-50">
                         <p className="text-sm font-bold text-blue-500 mb-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> 해왕성 (Neptune)</p>
                         <p className="text-xs text-on-surface-variant leading-relaxed break-keep">태양계 가장 바깥쪽의 강력한 폭풍이 부는 거대한 푸른 행성입니다.</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

            </div>

            {/* Inner Particle Cloud */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-white/70 rounded-full blur-[1px] shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                  style={{ top: "50%", left: "50%" }}
                  animate={{
                    x: [Math.cos(i) * 120, Math.sin(i) * 280, Math.cos(i) * 120],
                    y: [Math.sin(i) * 120, Math.cos(i) * 280, Math.sin(i) * 120],
                    scale: [0.3, 1.5, 0.3],
                    opacity: [0, 0.8, 0]
                  }}
                  transition={{
                    duration: 5 + (i % 5),
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
            
            {/* The Core Orb (Sun) */}
            <motion.div 
              animate={{ 
                scale: [0.95, 1.02, 0.95],
                boxShadow: [
                  "0 0 60px rgba(251, 146, 60, 0.5), inset 0 0 30px rgba(253, 224, 71, 0.5)",
                  "0 0 120px rgba(250, 204, 21, 0.7), inset 0 0 60px rgba(255, 255, 255, 0.7)",
                  "0 0 60px rgba(251, 146, 60, 0.5), inset 0 0 30px rgba(253, 224, 71, 0.5)"
                ]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-yellow-300 via-orange-500 to-red-600 rounded-full border border-yellow-200/50 flex items-center justify-center overflow-hidden shadow-2xl pointer-events-auto cursor-pointer group"
              style={{ transformStyle: "preserve-3d", transform: "translateZ(30px)" }}
            >
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
                transition={{ 
                  rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                  scale: { duration: 7, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent,rgba(253,224,71,0.6),rgba(239,68,68,0.5),transparent)] blur-lg mix-blend-screen pointer-events-none" 
              />
              <motion.div 
                animate={{ rotate: -360, scale: [1, 1.1, 1] }} 
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 9, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute inset-[-50%] bg-[conic-gradient(from_90deg,transparent,rgba(251,146,60,0.8),transparent)] blur-md mix-blend-screen pointer-events-none" 
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.8),_transparent_70%)] mix-blend-overlay rounded-full pointer-events-none" />
              <div className="absolute top-2 left-4 w-8 h-4 md:w-10 md:h-5 bg-white/60 rounded-full blur-[3px] rotate-[-45deg] pointer-events-none" />
              
              <div className="absolute top-[110%] left-1/2 -translate-x-1/2 px-4 py-3 bg-surface/90 backdrop-blur-xl border border-outline/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 w-max max-w-[240px] shadow-2xl scale-95 group-hover:scale-100 z-50 pointer-events-none">
                 <p className="text-sm font-bold text-yellow-400 mb-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.8)]" /> 태양 (The Sun)</p>
                 <p className="text-xs text-on-surface-variant leading-relaxed break-keep">지구 생명체의 근원이 되는 막대한 에너지를 뿜어내는 G형 주계열성입니다.</p>
              </div>
            </motion.div>
          </motion.div>
          
          <div className="flex flex-col items-center gap-8 relative z-20 mt-8">

            {/* Typography */}
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
               className="text-center"
            >

               

               

               

            </motion.div>
          </div>
        </div>


      </div>


    </header>
  );
});

HeroSection.displayName = "HeroSection";

const BentoCard = memo(({ to, label, className = "", children }: { to: string; label: string; className?: string; children: React.ReactNode }) => (
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
));

BentoCard.displayName = "BentoCard";

export default function Home() {
  const [portfolios, setPortfolios] = useState<{id: string, title?: string, link?: string, description?: string, techStack?: string}[]>([]);
  const [isLoadingPortfolios, setIsLoadingPortfolios] = useState(true);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        if (!db) return;
        const q = query(collection(db, "portfolio"), orderBy("createdAt", "desc"), limit(6));
        const snapshot = await getDocs(q);
        setPortfolios(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Failed to fetch portfolios:", err);
      } finally {
        setIsLoadingPortfolios(false);
      }
    };
    fetchPortfolios();
  }, []);

  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "우물 그리고 세계들",
    "url": window.location.href,
    "description": "다양한 데이터를 탐색하고 기록을 남기는 웹 공간. 가상자산 터미널, 반려식물 저널, 개인 기록실을 제공합니다."
  }), []);

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
            className="md:col-span-7 bg-surface/40 backdrop-blur-xl border border-outline/10 hover:bg-surface/65 transition-colors shadow-sm hover:shadow-2xl hover:shadow-[#5D7964]/8 group"
          >
            {/* Organic Premium Gradients & Glows */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#5D7964]/12 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -top-36 -left-36 w-[450px] h-[450px] bg-[#5D7964]/12 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
            
            {/* Visual Glassmorphic Botanical Garden Status Widget */}
            <div className="absolute right-[5%] top-[12%] w-[250px] sm:w-[280px] h-[190px] sm:h-[210px] border border-outline/15 bg-surface/35 backdrop-blur-2xl rounded-2xl p-5 opacity-40 group-hover:opacity-100 transition-all duration-700 group-hover:-translate-y-2.5 group-hover:rotate-[-2deg] shadow-[0_15px_40px_rgba(93,121,100,0.08)] flex flex-col justify-between pointer-events-none overflow-hidden rotate-[3deg] scale-95 sm:scale-100 origin-top-right">
              <div className="absolute top-[-50%] right-[-50%] w-48 h-48 bg-[#5D7964]/15 rounded-full blur-2xl opacity-60" />
              <div className="flex justify-between items-center border-b border-outline/10 pb-2.5">
                <span className="text-[10px] font-mono text-[#5D7964] font-extrabold tracking-widest uppercase">BOTANICAL CORE</span>
                <span className="text-[9px] font-mono text-on-surface-variant/80 flex items-center gap-1.5 bg-[#5D7964]/10 px-2.5 py-0.5 rounded-full text-[#5D7964]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> SYNC ACTIVE
                </span>
              </div>
              <div className="space-y-3 my-auto">
                <div className="flex justify-between text-[11px] font-medium text-on-surface-variant">
                  <span>정원 수분도 (Hydration)</span>
                  <span className="font-mono font-bold text-on-surface">94%</span>
                </div>
                {/* Custom Organic Progress Bar */}
                <div className="w-full h-1.5 bg-outline/10 rounded-full overflow-hidden">
                  <div className="w-[94%] h-full bg-gradient-to-r from-[#5D7964] to-emerald-400 rounded-full group-hover:animate-pulse" />
                </div>
                <div className="flex items-center gap-2.5 text-[10px] font-medium text-on-surface-variant/85">
                  <div className="flex items-center gap-1 bg-[#5D7964]/8 px-2 py-0.5 rounded-md border border-[#5D7964]/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>3 그루</span>
                  </div>
                  <div className="flex items-center gap-1 bg-[#5D7964]/8 px-2 py-0.5 rounded-md border border-[#5D7964]/10">
                    <span>습도 62%</span>
                  </div>
                </div>
              </div>
              <div className="text-[9px] font-mono text-on-surface-variant/50 flex justify-between items-center border-t border-outline/10 pt-2.5">
                <span>SECTOR: 02-A</span>
                <span>TEMP: 22.4°C</span>
              </div>
            </div>

            {/* Decorative Ambient Floating Leaves / Particles for Card */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-[#5D7964]/15 rounded-full blur-[0.5px]"
                  style={{
                    width: `${(i + 1) * 4 + 4}px`,
                    height: `${(i + 1) * 4 + 4}px`,
                    right: `${15 + i * 18}%`,
                    bottom: `${10 + i * 15}%`,
                  }}
                  animate={{
                    y: [0, -40, 0],
                    x: [0, (i % 2 === 0 ? 10 : -10), 0],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 5 + i * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Large background decorative leaf icon */}
            <div className="absolute right-[-12%] bottom-[-10%] opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-1000 group-hover:-translate-y-6 group-hover:-translate-x-6 rotate-[-15deg] group-hover:rotate-[-5deg] pointer-events-none">
              <Leaf className="w-96 h-96 text-on-surface" />
            </div>
 
             <div className="flex flex-col h-full p-8 md:p-10 relative z-10 w-full justify-between">
               <div className="w-16 h-16 bg-[#5D7964]/10 text-[#5D7964] rounded-2xl flex items-center justify-center border border-[#5D7964]/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                 <Leaf className="w-8 h-8" />
               </div>
 
               <div className="mt-12 max-w-sm sm:max-w-md">
                 <h2 className="text-3xl md:text-4xl font-display font-bold text-on-surface mb-4 tracking-tight group-hover:text-[#5D7964] transition-colors duration-300">
                   디지털 정원
                 </h2>
                 <p className="text-base sm:text-lg text-on-surface-variant/90 leading-relaxed font-medium break-keep">
                   고요히 고개 들며 자라나는 반려 식물의 생명력. <br />
                   나의 감정과 사색의 습도로 흙 위에 자라나는 온전한 기억의 정원을 가꾸어보세요.
                 </p>
                 
                 <div className="mt-8 flex items-center gap-2 text-sm font-bold text-[#5D7964] bg-[#5D7964]/10 w-fit px-4.5 py-2.5 rounded-full group-hover:bg-[#5D7964] group-hover:text-white transition-all duration-300 shadow-[0_0_0_rgba(93,121,100,0)] group-hover:shadow-[0_8px_20px_rgba(93,121,100,0.25)]">
                   정원 산책하기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </div>
               </div>
             </div>
           </BentoCard>

          {/* Stories & Journals */}
          <BentoCard 
            to="/stories" 
            label="나의 세계로 이동" 
            className="md:col-span-5 bg-surface/40 backdrop-blur-xl border border-outline/10 hover:bg-surface/65 transition-colors shadow-sm hover:shadow-2xl hover:shadow-secondary/8 group overflow-hidden"
          >
            {/* Elegant Ambient Cosmic Pink/Purple Glows */}
            <div className="absolute inset-0 bg-gradient-to-bl from-secondary/12 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -top-36 -right-36 w-[400px] h-[400px] bg-secondary/12 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
            
            {/* Elegant Glassmorphic Journal/Thoughts Widget */}
            <div className="absolute right-[5%] top-[12%] w-[230px] sm:w-[250px] h-[190px] sm:h-[210px] border border-outline/15 bg-surface/35 backdrop-blur-2xl rounded-2xl p-5 opacity-40 group-hover:opacity-100 transition-all duration-700 group-hover:-translate-y-2.5 group-hover:rotate-[3deg] shadow-[0_15px_40px_rgba(var(--color-secondary),0.08)] flex flex-col justify-between pointer-events-none overflow-hidden rotate-[-4deg] scale-95 sm:scale-100 origin-top-right">
              <div className="absolute bottom-[-30%] left-[-30%] w-40 h-40 bg-secondary/10 rounded-full blur-2xl opacity-60" />
              <div className="flex justify-between items-center border-b border-outline/10 pb-2.5">
                <span className="text-[9px] font-mono text-secondary font-extrabold tracking-widest uppercase">ARCHIVE MEMORIES</span>
                <span className="text-[8px] font-mono text-on-surface-variant/70 bg-secondary/10 px-2 py-0.5 rounded-full text-secondary">
                  SECURE PASS
                </span>
              </div>
              
              <div className="space-y-2.5 my-auto pl-1 border-l-2 border-secondary/30">
                <div className="text-[10px] text-on-surface/50 font-mono">2026.06.13.00:49</div>
                <h4 className="text-[11px] font-semibold text-on-surface leading-tight tracking-tight">우물 속 고요히 고개 드는 날...</h4>
                <p className="text-[9px] text-on-surface-variant/80 line-clamp-2 leading-relaxed">
                  오늘도 심연 아래 조용히 사유의 우물을 기댄다. 수면 위에는 내가 적은 무수한 조각들이...
                </p>
              </div>

              <div className="text-[9px] font-mono text-on-surface-variant/50 flex justify-between items-center border-t border-outline/10 pt-2.5">
                <span>INDEX #124</span>
                <span className="text-secondary opacity-80 flex items-center gap-1">✦ ACTIVE</span>
              </div>
            </div>

            {/* Micro Floating Thought Sparks / Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-secondary/20 rounded-full"
                  style={{
                    width: `${(i + 1) * 3 + 3}px`,
                    height: `${(i + 1) * 3 + 3}px`,
                    right: `${30 + i * 15}%`,
                    top: `${15 + i * 20}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.2, 0.7, 0.2],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 4.5 + i * 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            <div className="absolute right-[-10%] bottom-[-10%] opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-1000 group-hover:-translate-y-4 group-hover:rotate-12 pointer-events-none">
              <MessageSquareHeart className="w-80 h-80 text-on-surface" />
            </div>

            <div className="flex flex-col h-full p-8 md:p-10 relative z-10 w-full justify-between">
              <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center border border-secondary/20 group-hover:scale-110 group-hover:rotate-[-6deg] transition-all duration-500 shadow-inner">
                <MessageSquareHeart className="w-8 h-8" />
              </div>

              <div className="mt-12 max-w-sm sm:max-w-md">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-on-surface mb-4 tracking-tight group-hover:text-secondary transition-colors duration-300">
                  나의 세계
                </h2>
                <p className="text-base sm:text-lg text-on-surface-variant/90 leading-relaxed font-medium break-keep">
                  온전히 나 자신에게만 몰입하는 침묵의 시간.<br />
                  내면의 잔잔한 고백과 소중한 가치들을 세상과 단절된 비밀 아카이브에 영원히 새겨보세요.
                </p>
                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-secondary bg-secondary/10 w-fit px-4.5 py-2.5 rounded-full group-hover:bg-secondary group-hover:text-white transition-all duration-300 shadow-[0_0_0_rgba(var(--color-secondary),0)] group-hover:shadow-[0_8px_20px_rgba(200,80,180,0.2)]">
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
            className="md:col-span-7 bg-surface/40 backdrop-blur-xl border border-outline/10 hover:bg-surface/65 transition-colors shadow-sm hover:shadow-2xl hover:shadow-[#7D91B4]/10 group overflow-hidden"
          >
            {/* Immersive Deep Water Ripple and Dynamic Light Gradients */}
            <div className="absolute inset-0 bg-gradient-to-tl from-[#7D91B4]/15 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -bottom-36 -right-36 w-[450px] h-[450px] bg-[#7D91B4]/15 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />

            {/* Immersive Echoes / Footprints glassmorphic feed widget - Hidden on mobile for cleaner UX */}
            <div className="hidden md:flex absolute right-[4%] top-[12%] w-[260px] h-[210px] border border-outline/15 bg-surface/40 backdrop-blur-2xl rounded-2xl p-5 opacity-40 group-hover:opacity-100 transition-all duration-700 group-hover:-translate-y-3 group-hover:rotate-1 shadow-[0_15px_40px_rgba(125,145,180,0.12)] flex-col justify-between pointer-events-none overflow-hidden rotate-[-2deg] origin-top-right z-0">
              <div className="absolute top-[-40%] left-[-20%] w-44 h-44 bg-[#7D91B4]/20 rounded-full blur-2xl opacity-60" />
              <div className="flex justify-between items-center border-b border-outline/10 pb-2.5 relative z-10">
                <span className="text-[10px] font-mono text-[#7D91B4] font-extrabold tracking-widest uppercase">ECHOES FEED</span>
                <span className="text-[8px] font-mono text-on-surface-variant/90 bg-[#7D91B4]/15 px-2 py-0.5 rounded-full text-[#7D91B4] flex items-center gap-1.5 border border-[#7D91B4]/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_5px_rgba(96,165,250,0.8)]" />
                  REALTIME
                </span>
              </div>

              <div className="space-y-2.5 max-h-[120px] overflow-hidden pr-1 my-2 relative z-10">
                <div className="p-2.5 rounded-lg bg-surface-variant/30 border border-outline/5 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-on-surface/90">Explorer_Luna</span>
                    <span className="text-[8px] text-on-surface-variant/60 font-mono">10m ago</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant/90 leading-relaxed line-clamp-1">
                    고요한 정적이 주는 깊은 내면의 위로를 받았습니다.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-variant/30 border border-outline/5 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-on-surface/90">Aura_09</span>
                    <span className="text-[8px] text-on-surface-variant/60 font-mono">1h ago</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant/90 leading-relaxed line-clamp-1">
                    우물 속 세계라는 철학이 너무 아름답네요.
                  </p>
                </div>
              </div>

              <div className="text-[8px] font-mono text-[#7D91B4]/80 flex justify-between items-center border-t border-outline/10 pt-2.5 font-bold relative z-10">
                <span>TOTAL REVERBS: 1,342</span>
                <span>SECURE SYNC: OK</span>
              </div>
            </div>

            {/* Micro floating bubbles simulating underwater whispers */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-[#7D91B4]/20 rounded-full blur-[0.5px]"
                  style={{
                    width: `${(i + 1) * 4 + 4}px`,
                    height: `${(i + 1) * 4 + 4}px`,
                    right: `${10 + i * 20}%`,
                    bottom: `${5 + i * 18}%`,
                  }}
                  animate={{
                    y: [0, -60, 0],
                    x: [0, Math.sin(i) * 15, 0],
                    opacity: [0.1, 0.6, 0.1],
                  }}
                  transition={{
                    duration: 6 + i * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Ambient Background Water/Book icon */}
            <div className="absolute right-[-10%] bottom-[-15%] opacity-[0.02] group-hover:opacity-[0.04] transition-all duration-1000 group-hover:-translate-y-5 group-hover:rotate-6 pointer-events-none z-0">
              <BookOpen className="w-96 h-96 text-on-surface" />
            </div>

            <div className="flex flex-col h-full p-8 md:p-10 relative z-10 w-full justify-between">
              <div className="w-16 h-16 bg-[#7D91B4]/10 text-[#7D91B4] rounded-2xl flex items-center justify-center border border-[#7D91B4]/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner backdrop-blur-sm">
                <BookOpen className="w-8 h-8" />
              </div>

              <div className="mt-12 max-w-sm sm:max-w-md">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-on-surface mb-4 tracking-tight group-hover:text-[#7D91B4] transition-colors duration-300 drop-shadow-sm">
                  방명록
                </h2>
                <p className="text-base sm:text-lg text-on-surface-variant/90 leading-relaxed font-medium break-keep text-shadow-sm">
                  수막을 넘어 흘러드는 또 다른 세계의 신호들.<br />
                  이곳을 스쳐 간 탐험가들의 사유를 마주하고, 당신만의 파동을 남겨보세요.
                </p>
                <div className="mt-8 flex items-center gap-3 text-sm font-bold text-surface bg-[#7D91B4] w-fit px-6 py-3 rounded-full hover:bg-[#687C9E] hover:scale-105 transition-all duration-300 shadow-[0_4px_15px_rgba(125,145,180,0.3)] hover:shadow-[0_8px_25px_rgba(125,145,180,0.4)]">
                  나의 파동 남기기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>
          </BentoCard>
        </motion.section>
      </div>

      {/* Portfolio Section */}
      {(isLoadingPortfolios || portfolios.length > 0) && (
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center space-y-4 mb-16"
          >
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20 mb-2">
              <Code2 className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-on-surface tracking-tight">
              나의 포트폴리오
            </h2>
            <p className="text-on-surface-variant font-medium text-lg max-w-2xl mx-auto break-keep">
              세상에 선보인 작은 세계들. 그동안 제가 만들고 가꿔온 프로젝트들을 소개합니다.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingPortfolios
              ? [...Array(3)].map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="p-6 md:p-8 rounded-[2rem] bg-surface-variant/30 animate-pulse border border-outline/5 relative flex flex-col justify-between min-h-[250px]"
                  >
                    <div className="space-y-4">
                      <div className="h-8 bg-on-surface-variant/10 rounded-md w-1/2 mb-6"></div>
                      <div className="h-4 bg-on-surface-variant/10 rounded-md w-full"></div>
                      <div className="h-4 bg-on-surface-variant/10 rounded-md w-4/5"></div>
                      <div className="h-4 bg-on-surface-variant/10 rounded-md w-full"></div>
                    </div>
                    <div className="mt-8 flex flex-wrap gap-2">
                      <div className="h-6 w-16 bg-on-surface-variant/10 rounded-lg"></div>
                      <div className="h-6 w-20 bg-on-surface-variant/10 rounded-lg"></div>
                      <div className="h-6 w-14 bg-on-surface-variant/10 rounded-lg"></div>
                    </div>
                  </div>
                ))
              : portfolios.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group p-6 md:p-8 rounded-[2rem] bg-surface/40 backdrop-blur-xl border border-outline/10 hover:bg-surface hover:shadow-xl transition-all duration-500 relative flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-display font-bold text-2xl text-on-surface group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        {item.link && (
                          <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-colors shrink-0"
                            title="프로젝트 바로가기"
                            aria-label={`${item.title} 프로젝트 외부 링크로 이동`}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-on-surface-variant text-base leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                    
                    {item.techStack && (
                      <div className="mt-8 flex flex-wrap gap-2">
                        {item.techStack.split(",").map((tech: string, i: number) => (
                          <span 
                            key={i} 
                            className="text-xs font-mono bg-surface-variant/50 text-on-surface-variant px-3 py-1.5 rounded-lg border border-outline/5"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
          </div>
        </div>
      )}
    </div>
    
  );
}
