import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Marquee } from '../components/ui/marquee';
import { Globe } from '../components/ui/globe';
import { AuroraBackground } from '../components/ui/aurora-background';
import { Brain, Users, Shield, Flame } from 'lucide-react';

export default function About() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Section 1: 0 to 15% scroll range (Hero: "PARALLEL" + Globe)
  const section1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.15], [1, 1, 0]);
  const section1Scale = useTransform(scrollYProgress, [0, 0.15], [1, 0.8]);
  const section1Y = useTransform(scrollYProgress, [0, 0.15], [0, -100]);

  // Section 2: Marquee & Specs
  const s2TitleX = useTransform(scrollYProgress, [0.12, 0.2, 0.3, 0.35], [-200, 0, 0, 200]);
  const s2TitleY = useTransform(scrollYProgress, [0.12, 0.2, 0.3, 0.35], [100, 0, 0, -100]);
  const s2TitleRotate = useTransform(scrollYProgress, [0.12, 0.2, 0.3, 0.35], [-10, 0, 0, 10]);
  const s2TitleOpacity = useTransform(scrollYProgress, [0.12, 0.2, 0.3, 0.35], [0, 1, 1, 0]);

  const s2MarqueeX = useTransform(scrollYProgress, [0.15, 0.22, 0.28, 0.35], [200, 0, 0, -200]);
  const s2MarqueeY = useTransform(scrollYProgress, [0.15, 0.22, 0.28, 0.35], [50, 0, 0, 150]);
  const s2MarqueeRotate = useTransform(scrollYProgress, [0.15, 0.22, 0.28, 0.35], [5, 0, 0, -5]);
  const s2MarqueeOpacity = useTransform(scrollYProgress, [0.15, 0.22, 0.28, 0.35], [0, 1, 1, 0]);

  // Section 3: Features
  const s3TitleX = useTransform(scrollYProgress, [0.32, 0.42, 0.52, 0.6], [200, 0, 0, -200]);
  const s3TitleY = useTransform(scrollYProgress, [0.32, 0.42, 0.52, 0.6], [80, 0, 0, -80]);
  const s3TitleRotate = useTransform(scrollYProgress, [0.32, 0.42, 0.52, 0.6], [10, 0, 0, -10]);
  const s3TitleOpacity = useTransform(scrollYProgress, [0.32, 0.42, 0.52, 0.6], [0, 1, 1, 0]);

  const s3TextX = useTransform(scrollYProgress, [0.35, 0.45, 0.55, 0.6], [-100, 0, 0, 100]);
  const s3TextY = useTransform(scrollYProgress, [0.35, 0.45, 0.55, 0.6], [100, 0, 0, 100]);
  const s3TextOpacity = useTransform(scrollYProgress, [0.35, 0.45, 0.55, 0.6], [0, 1, 1, 0]);

  const s3GridScale = useTransform(scrollYProgress, [0.38, 0.48, 0.55, 0.6], [0.5, 1, 1, 0.5]);
  const s3GridY = useTransform(scrollYProgress, [0.38, 0.48, 0.55, 0.6], [150, 0, 0, 150]);
  const s3GridOpacity = useTransform(scrollYProgress, [0.38, 0.48, 0.55, 0.6], [0, 1, 1, 0]);

  // Section 4: 55% to 80% scroll range (AI)
  const section3Opacity = useTransform(scrollYProgress, [0.55, 0.65, 0.75, 0.8], [0, 1, 1, 0]);
  const section3Y = useTransform(scrollYProgress, [0.55, 0.65, 0.75, 0.8], [100, 0, 0, -100]);
  const section3Scale = useTransform(scrollYProgress, [0.55, 0.65, 0.75, 0.8], [0.9, 1, 1, 0.9]);

  // Section 5: 75% to 100% scroll range (Outro)
  const section4Opacity = useTransform(scrollYProgress, [0.75, 0.9, 1], [0, 1, 1]);
  const section4Scale = useTransform(scrollYProgress, [0.75, 0.9, 1], [0.8, 1, 1]);

  return (
    <div ref={containerRef} className="h-[600vh] bg-[#0A0A0A] relative text-white selection:bg-[#ff6b4a] selection:text-white font-sans">
      {/* Sticky Container for Scroll Jacking */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden border-x border-[#ffffff05]">
        
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] bg-[#ff6b4a] rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-pulse" />
          <div className="absolute bottom-[20%] right-[20%] w-[50vw] h-[50vw] bg-[#6b4aff] rounded-full mix-blend-screen filter blur-[120px] opacity-[0.07] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Base dark noise overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

        {/* Section 1: Hero */}
        <motion.div 
          style={{ opacity: section1Opacity, scale: section1Scale, y: section1Y }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none"
        >
          <AuroraBackground className="absolute inset-0 z-0 h-screen w-full rounded-none px-4">
            {/* Globe Background */}
            <div className="absolute inset-x-0 bottom-[-20%] md:bottom-[-40%] z-0 flex items-center justify-center opacity-40 mix-blend-screen overflow-hidden pointer-events-none w-full max-w-[800px] mx-auto aspect-[1/1]">
              <div className="w-full h-full pointer-events-auto flex items-center justify-center">
                <Globe className="scale-125 md:scale-150 w-full h-full" />
              </div>
            </div>

            <motion.div
               className="relative z-10 w-full"
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
            <h1 className="text-[5rem] md:text-[9rem] font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-neutral-500">
              PARALLEL
            </h1>
            <p className="mt-6 text-xl md:text-3xl text-neutral-400 font-light tracking-wide max-w-2xl mx-auto">
              Decide the Undecidable
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 2 }}
            className="absolute bottom-12 flex flex-col items-center gap-4 z-10"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-medium tracking-widest">Scroll Down</span>
            <div className="w-[1px] h-20 bg-gradient-to-b from-neutral-500 to-transparent" />
          </motion.div>
          </AuroraBackground>
        </motion.div>

        {/* Section 1.5: Marquee & Specs */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-12 lg:px-24 text-center pointer-events-none overflow-hidden">
          <motion.h2 
            style={{ opacity: s2TitleOpacity, y: s2TitleY, x: s2TitleX, rotateZ: s2TitleRotate }}
            className="text-4xl md:text-6xl font-black mb-8 tracking-tight text-white drop-shadow-lg"
          >
            Powering Next-Gen Discourse
          </motion.h2>
          <motion.div 
            style={{ opacity: s2MarqueeOpacity, y: s2MarqueeY, x: s2MarqueeX, rotateZ: s2MarqueeRotate }}
            className="w-[120vw] mt-12 max-w-[120vw] -mx-[10vw] pointer-events-auto"
          >
              <Marquee className="max-w-5xl mx-auto" fade={true} pauseOnHover={true}>
                <div className="flex items-center gap-4 mx-8 py-4">
                  <span className="text-3xl font-bold text-[#61DAFB]">React 19</span>
                </div>
                <div className="flex items-center gap-4 mx-8 py-4">
                  <span className="text-3xl font-bold text-white">Next.js</span>
                </div>
                <div className="flex items-center gap-4 mx-8 py-4">
                  <span className="text-3xl font-bold text-[#38B2AC]">Tailwind V4</span>
                </div>
                <div className="flex items-center gap-4 mx-8 py-4">
                  <span className="text-3xl font-bold text-[#F38020]">Cloudflare R2</span>
                </div>
                <div className="flex items-center gap-4 mx-8 py-4">
                  <span className="text-3xl font-bold text-[#3776AB]">Python FastAPI</span>
                </div>
                <div className="flex items-center gap-4 mx-8 py-4">
                  <span className="text-3xl font-bold text-[#336791]">PostgreSQL</span>
                </div>
                <div className="flex items-center gap-4 mx-8 py-4">
                  <span className="text-3xl font-bold text-[#e10098]">Zustand</span>
                </div>
              </Marquee>
              <Marquee className="max-w-5xl mx-auto mt-4" fade={true} pauseOnHover={true} direction="right">
                <div className="flex items-center gap-4 mx-8 py-4">
                  <Brain className="w-8 h-8 text-[#ff6b4a]" />
                  <span className="text-2xl font-medium text-white/90">Ethics</span>
                </div>
                <div className="flex items-center gap-4 mx-8 py-4">
                  <Users className="w-8 h-8 text-[#6b4aff]" />
                  <span className="text-2xl font-medium text-white/90">Society</span>
                </div>
                <div className="flex items-center gap-4 mx-8 py-4">
                  <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=100&h=100" className="w-12 h-12 rounded-full object-cover border border-white/20" alt="Culture" />
                  <span className="text-2xl font-medium text-white/90">Culture</span>
                </div>
                <div className="flex items-center gap-4 mx-8 py-4">
                  <Shield className="w-8 h-8 text-[#2bf06d]" />
                  <span className="text-2xl font-medium text-white/90">Truth</span>
                </div>
                <div className="flex items-center gap-4 mx-8 py-4">
                  <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=100&h=100" className="w-12 h-12 rounded-full object-cover border border-white/20" alt="Globe Humanity" />
                  <span className="text-2xl font-medium text-white/90">Humanity</span>
                </div>
                <div className="flex items-center gap-4 mx-8 py-4">
                  <Flame className="w-8 h-8 text-[#ff4a4a]" />
                  <span className="text-2xl font-medium text-white/90">Debate</span>
                </div>
              </Marquee>
            </motion.div>
        </div>

        {/* Section 2: Features */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-12 lg:px-24 text-center pointer-events-none overflow-hidden">
          <motion.h2 
            style={{ opacity: s3TitleOpacity, y: s3TitleY, x: s3TitleX, rotateZ: s3TitleRotate }}
            className="text-5xl md:text-7xl font-black mb-8 tracking-tight text-white drop-shadow-lg"
          >
            A New Paradigm of Choice
          </motion.h2>
          <motion.p 
            style={{ opacity: s3TextOpacity, y: s3TextY, x: s3TextX }}
            className="max-w-3xl text-lg md:text-xl text-neutral-400 leading-relaxed font-light mx-auto"
          >
            Every day, humanity faces a myriad of moral choices. 
            <span className="text-white font-medium"> Parallel </span> 
            brings these dilemmas to light. Vote, debate, and see where you stand among thousands of thinkers.
          </motion.p>
          <motion.div 
            style={{ opacity: s3GridOpacity, y: s3GridY, scale: s3GridScale }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-6xl mx-auto pointer-events-auto"
          >
            {[
              { title: "Personal", desc: "Intimate and introspective problems.", icon: <Users className="size-8 text-[#ff6b4a]" />, color: "border-[#ff6b4a]/20" },
              { title: "Community", desc: "Issues affecting your local circle.", icon: <Brain className="size-8 text-[#6b4aff]" />, color: "border-[#6b4aff]/20" },
              { title: "Civic", desc: "Societal and grand-scale dilemmas.", icon: <Shield className="size-8 text-[#2bf06d]" />, color: "border-[#2bf06d]/20" }
            ].map((feature, i) => (
              <div key={i} className={`bg-neutral-900/50 border ${feature.color} backdrop-blur-xl rounded-3xl p-8 transform-gpu shadow-2xl hover:-translate-y-2 transition-transform duration-300 cursor-pointer`}>
                <div className="text-4xl mb-6 bg-white/5 w-16 h-16 rounded-full flex items-center justify-center">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-neutral-400 font-light text-sm">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Section 3: AI Judge */}
        <motion.div 
          style={{ opacity: section3Opacity, y: section3Y, scale: section3Scale }}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-20 text-center pointer-events-none"
        >
          <div className="relative w-full max-w-4xl mx-auto group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff4a6b]/20 via-[#6b4aff]/20 to-[#4aff6b]/20 blur-[120px] rounded-full scale-150 transform-gpu" />
            <h2 className="text-6xl md:text-[7rem] font-black mb-6 tracking-tighter leading-none relative drop-shadow-2xl text-white">
              AI Judge <span className="absolute -top-4 -right-2 md:-right-8 text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b4a] to-[#ff4a6b] rotate-12 drop-shadow-md">*soon</span>
            </h2>
            <p className="text-xl md:text-2xl text-neutral-400 font-light max-w-3xl mx-auto leading-relaxed mt-10 relative">
              When humans fail to agree, logic intervenes.
              Our advanced AI model will analyze, dissect, and weigh the most complex civic issues, acting as an impartial mediator for the hardest questions.
            </p>
          </div>
        </motion.div>

        {/* Section 4: Outro */}
        <motion.div 
          style={{ opacity: section4Opacity, scale: section4Scale }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
        >
          <div className="w-[150px] h-[150px] rounded-full bg-gradient-to-tr from-[#ff6b4a] to-[#6b4aff] blur-[80px] absolute mix-blend-screen opacity-50" />
          <h2 className="text-6xl md:text-[6rem] font-black mb-12 tracking-tighter relative z-10 leading-tight">
            Step Into <br/> The Parallel
          </h2>
          <a href="/feed" className="pointer-events-auto px-10 py-5 bg-white text-black text-lg font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,107,74,0.4)] relative z-10">
            Start Voting Now
          </a>
        </motion.div>

      </div>
    </div>
  );
}
