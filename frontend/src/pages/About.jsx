import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Marquee } from '../components/ui/marquee';
import { Brain, Users, Shield, Flame } from 'lucide-react';

export default function About() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Section 1: 0 to 25% scroll range (Hero)
  const section1Opacity = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 1, 0]);
  const section1Scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
  const section1Y = useTransform(scrollYProgress, [0, 0.3], [0, -100]);

  // Section 2: 20% to 55% scroll range (Features)
  const section2Opacity = useTransform(scrollYProgress, [0.2, 0.35, 0.5, 0.6], [0, 1, 1, 0]);
  const section2Y = useTransform(scrollYProgress, [0.2, 0.35, 0.5, 0.6], [100, 0, 0, -100]);
  const section2Scale = useTransform(scrollYProgress, [0.2, 0.35, 0.5, 0.6], [0.9, 1, 1, 0.9]);

  // Section 3: 50% to 80% scroll range (AI)
  const section3Opacity = useTransform(scrollYProgress, [0.45, 0.6, 0.75, 0.85], [0, 1, 1, 0]);
  const section3Y = useTransform(scrollYProgress, [0.45, 0.6, 0.75, 0.85], [100, 0, 0, -100]);
  const section3Scale = useTransform(scrollYProgress, [0.45, 0.6, 0.75, 0.85], [0.9, 1, 1, 0.9]);

  // Section 4: 75% to 100% scroll range (Outro)
  const section4Opacity = useTransform(scrollYProgress, [0.75, 0.9, 1], [0, 1, 1]);
  const section4Scale = useTransform(scrollYProgress, [0.75, 0.9, 1], [0.8, 1, 1]);

  return (
    <div ref={containerRef} className="h-[400vh] bg-[#0A0A0A] relative text-white selection:bg-[#ff6b4a] selection:text-white font-sans">
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
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
        >
          <motion.div
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
            <div className="w-full mt-16 max-w-[100vw] overflow-hidden -mx-4 pointer-events-auto">
              <Marquee className="max-w-5xl mx-auto" fade={true} pauseOnHover={true}>
                <div className="flex items-center gap-4 mx-8 py-4">
                  <Brain className="w-8 h-8 text-[#ff6b4a]" />
                  <span className="text-2xl font-medium text-white/90">Ethics</span>
                </div>
                <div className="flex items-center gap-4 mx-8 py-4">
                  <Users className="w-8 h-8 text-[#6b4aff]" />
                  <span className="text-2xl font-medium text-white/90">Society</span>
                </div>
                <div className="flex items-center gap-4 mx-8 py-4">
                  <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=100&h=100" className="w-12 h-12 rounded-full object-cover border border-white/20" alt="Tech" />
                  <span className="text-2xl font-medium text-white/90">Culture</span>
                </div>
                <div className="flex items-center gap-4 mx-8 py-4">
                  <Shield className="w-8 h-8 text-[#2bf06d]" />
                  <span className="text-2xl font-medium text-white/90">Truth</span>
                </div>
                <div className="flex items-center gap-4 mx-8 py-4">
                  <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=100&h=100" className="w-12 h-12 rounded-full object-cover border border-white/20" alt="Globe" />
                  <span className="text-2xl font-medium text-white/90">Humanity</span>
                </div>
                <div className="flex items-center gap-4 mx-8 py-4">
                  <Flame className="w-8 h-8 text-[#ff4a4a]" />
                  <span className="text-2xl font-medium text-white/90">Debate</span>
                </div>
              </Marquee>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 2 }}
            className="absolute bottom-12 flex flex-col items-center gap-4"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-medium tracking-widest">Scroll to Journey</span>
            <div className="w-[1px] h-20 bg-gradient-to-b from-neutral-500 to-transparent" />
          </motion.div>
        </motion.div>

        {/* Section 2: Features */}
        <motion.div 
          style={{ opacity: section2Opacity, y: section2Y, scale: section2Scale }}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-12 lg:px-24 text-center pointer-events-none"
        >
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight text-white drop-shadow-lg">
            A New Paradigm of Choice
          </h2>
          <p className="max-w-3xl text-lg md:text-xl text-neutral-400 leading-relaxed font-light mx-auto">
            Every day, humanity faces a myriad of moral choices. 
            <span className="text-white font-medium"> Parallel </span> 
            brings these dilemmas to light. Vote, debate, and see where you stand among thousands of thinkers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-6xl mx-auto">
            {[
              { title: "Personal", desc: "Intimate and introspective problems.", icon: "💭" },
              { title: "Community", desc: "Issues affecting your local circle.", icon: "🤝" },
              { title: "Civic", desc: "Societal and grand-scale dilemmas.", icon: "🏛️" }
            ].map((feature, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-8 transform-gpu shadow-2xl">
                <div className="text-4xl mb-6 bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-neutral-400 font-light text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

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
          <a href="/" className="pointer-events-auto px-10 py-5 bg-white text-black text-lg font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,107,74,0.4)] relative z-10">
            Start Voting Now
          </a>
        </motion.div>

      </div>
    </div>
  );
}
