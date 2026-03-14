import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Marquee } from '../components/ui/marquee';
import { Globe } from '../components/ui/globe';
import { AuroraBackground } from '../components/ui/aurora-background';
import { Brain, Users, Shield, Flame } from 'lucide-react';

const V = 'Verdana, Geneva, sans-serif';
const B = '"Brush Script MT", "Brush Script Std", cursive';

// Decorative floating words (hero section only)
const DECO_WORDS = [
  { text: 'choose',   font: B, top: '11%', left: '6%',   fromX: '-130vw', fromY: '-20vh', toX:  '120vw', toY: '-50vh', scroll: [0,0.03,0.07,0.12], rotate:[-18,-4], size:'3.2rem', color:'#ff6b4a',   fly:true  },
  { text: 'TRUTH',    font: V, top: '79%', left: '83%',  fromX:  '130vw', fromY:  '80vh', toX: null,     toY: null,    scroll: [0.01,0.06,0.13,0.13], rotate:[12,3],  size:'1.4rem', color:'#ffffff',   fly:false },
  { text: 'or dare',  font: B, top: '54%', left: '87%',  fromX:  '140vw', fromY:  '20vh', toX:  '150vw', toY: '-40vh', scroll: [0.005,0.04,0.08,0.13], rotate:[8,-2], size:'2.6rem', color:'#6b4aff',   fly:true  },
  { text: 'DECIDE',   font: V, top: '21%', left: '74%',  fromX:  '120vw', fromY: '-70vh', toX: null,     toY: null,    scroll: [0.02,0.07,0.13,0.13],  rotate:[-6,0], size:'2rem',   color:'#2bf06d',   fly:false },
  { text: 'what if',  font: B, top: '86%', left: '14%',  fromX: '-130vw', fromY:  '90vh', toX: '-140vw', toY: '100vh', scroll: [0,0.04,0.09,0.13],     rotate:[20,6], size:'3.8rem', color:'#ff4a6b',   fly:true  },
  { text: 'MORAL',    font: V, top: '41%', left: '3%',   fromX: '-120vw', fromY:  '10vh', toX: null,     toY: null,    scroll: [0.015,0.055,0.13,0.13], rotate:[-3,2], size:'1.6rem', color:'#ffffff80', fly:false },
  { text: 'always',   font: B, top: '5%',  left: '54%',  fromX:  '20vw',  fromY: '-110vh',toX:  '80vw',  toY:'-120vh', scroll: [0,0.035,0.075,0.12],   rotate:[-12,5],size:'2.8rem', color:'#61DAFB',   fly:true  },
  { text: 'ETHICS',   font: V, top: '69%', left: '61%',  fromX:  '50vw',  fromY:  '120vh',toX: null,     toY: null,    scroll: [0.025,0.07,0.13,0.13],  rotate:[5,-1], size:'1.8rem', color:'#ffffff60', fly:false },
  { text: 'never',    font: B, top: '31%', left: '91%',  fromX:  '130vw', fromY: '-10vh', toX:  '140vw', toY:  '80vh', scroll: [0.01,0.05,0.085,0.125], rotate:[15,-8],size:'3rem',   color:'#ff6b4a99', fly:true  },
  { text: 'maybe',    font: B, top: '49%', left: '-2%',  fromX: '-130vw', fromY: '-50vh', toX: '-150vw', toY:  '30vh', scroll: [0.005,0.045,0.08,0.115],rotate:[-22,10],size:'4rem',  color:'#6b4aff80', fly:true  },
];

function FlyWord({ word, scrollYProgress }) {
  const { scroll, fromX, fromY, toX, toY, fly, rotate } = word;
  const x = useTransform(scrollYProgress, scroll, fly ? [fromX,'0vw','0vw',toX] : [fromX,'0vw','0vw','0vw']);
  const y = useTransform(scrollYProgress, scroll, fly ? [fromY,'0vh','0vh',toY] : [fromY,'0vh','0vh','0vh']);
  const opacity = useTransform(scrollYProgress, scroll, fly ? [0,1,0.85,0] : [0,1,1,0]);
  const rotateZ = useTransform(scrollYProgress, scroll, [rotate[0], rotate[1], rotate[1], fly ? rotate[0]*-0.5 : rotate[1]]);
  return (
    <motion.span style={{ position:'absolute', top:word.top, left:word.left, x, y, opacity, rotateZ,
      fontFamily:word.font, fontSize:word.size, color:word.color, whiteSpace:'nowrap',
      pointerEvents:'none', userSelect:'none', willChange:'transform,opacity',
      textShadow:'0 2px 20px rgba(0,0,0,0.6)' }}>
      {word.text}
    </motion.span>
  );
}

function FlyingWords({ scrollYProgress }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
      {DECO_WORDS.map((w,i) => <FlyWord key={i} word={w} scrollYProgress={scrollYProgress} />)}
    </div>
  );
}

// Helper: build a motion style object from scroll keyframes
function useFlightStyle(scrollYProgress, { scroll, fromX=0, fromY=0, toX=0, toY=0, fromR=0, toR=0, flyThrough=false, exitX=0, exitY=0, exitR=0 }) {
  const x = useTransform(scrollYProgress, scroll,
    flyThrough ? [fromX, 0, 0, exitX] : [fromX, 0, 0, 0]);
  const y = useTransform(scrollYProgress, scroll,
    flyThrough ? [fromY, 0, 0, exitY] : [fromY, 0, 0, 0]);
  const opacity = useTransform(scrollYProgress, scroll,
    flyThrough ? [0, 1, 0.9, 0] : [0, 1, 1, 0]);
  const rotateZ = useTransform(scrollYProgress, scroll,
    flyThrough ? [fromR, toR, toR, exitR] : [fromR, toR, toR, toR]);
  return { x, y, opacity, rotateZ };
}

export default function About() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start','end end'] });

  // ── SECTION 1: Hero ──────────────────────────────────────────────────────────
  // "PARALLEL" — drops from top-center, stays
  const heroTitleStyle = useFlightStyle(scrollYProgress, {
    scroll: [0, 0.04, 0.12, 0.15], fromX: 0, fromY: -800, fromR: -8, toR: 0,
  });
  // "Decide the Undecidable" — flies in from bottom-right, stays
  const heroSubStyle = useFlightStyle(scrollYProgress, {
    scroll: [0.01, 0.06, 0.12, 0.15], fromX: 600, fromY: 300, fromR: 12, toR: 0,
  });
  // "Scroll Down" label — drifts up from bottom-left
  const heroScrollLabelStyle = useFlightStyle(scrollYProgress, {
    scroll: [0.02, 0.07, 0.12, 0.15], fromX: -400, fromY: 200, fromR: -6, toR: 0,
  });
  // Whole section fade/scale out
  const section1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.15], [1, 1, 0]);
  const section1Scale   = useTransform(scrollYProgress, [0, 0.15], [1, 0.8]);
  const section1Y       = useTransform(scrollYProgress, [0, 0.15], [0, -100]);

  // ── SECTION 2: Marquee ───────────────────────────────────────────────────────
  // "Powering Next-Gen Discourse" — flies in from left, exits right
  const s2TitleStyle = useFlightStyle(scrollYProgress, {
    scroll: [0.12, 0.2, 0.3, 0.35], fromX: -900, fromY: 80, fromR: -14, toR: 2,
    flyThrough: true, exitX: 900, exitY: -60, exitR: 8,
  });
  // Marquee block — flies in from right, exits left
  const s2MarqueeStyle = useFlightStyle(scrollYProgress, {
    scroll: [0.15, 0.22, 0.28, 0.35], fromX: 900, fromY: 60, fromR: 8, toR: -1,
    flyThrough: true, exitX: -900, exitY: 100, exitR: -6,
  });

  // ── SECTION 3: Features ──────────────────────────────────────────────────────
  // "A New Paradigm of Choice" — flies in from top-right corner
  const s3TitleStyle = useFlightStyle(scrollYProgress, {
    scroll: [0.32, 0.42, 0.52, 0.6], fromX: 700, fromY: -400, fromR: 16, toR: -2,
    flyThrough: true, exitX: -700, exitY: -200, exitR: -10,
  });
  // Body paragraph — flies in from bottom-left
  const s3TextStyle = useFlightStyle(scrollYProgress, {
    scroll: [0.35, 0.44, 0.53, 0.6], fromX: -600, fromY: 350, fromR: -10, toR: 1,
    flyThrough: true, exitX: 500, exitY: 300, exitR: 7,
  });
  // Feature card 0 (Personal) — from left side
  const s3Card0Style = useFlightStyle(scrollYProgress, {
    scroll: [0.37, 0.46, 0.54, 0.6], fromX: -800, fromY: 100, fromR: -18, toR: 0,
    flyThrough: true, exitX: -600, exitY: -300, exitR: -12,
  });
  // Feature card 1 (Community) — from bottom-center
  const s3Card1Style = useFlightStyle(scrollYProgress, {
    scroll: [0.39, 0.47, 0.54, 0.6], fromX: 0, fromY: 700, fromR: 6, toR: 0,
    flyThrough: true, exitX: 200, exitY: 700, exitR: 4,
  });
  // Feature card 2 (Civic) — from right side
  const s3Card2Style = useFlightStyle(scrollYProgress, {
    scroll: [0.41, 0.49, 0.55, 0.6], fromX: 800, fromY: -100, fromR: 20, toR: 0,
    flyThrough: true, exitX: 700, exitY: -400, exitR: 14,
  });
  const cardStyles = [s3Card0Style, s3Card1Style, s3Card2Style];

  // ── SECTION 4: AI Judge ──────────────────────────────────────────────────────
  // "AI Judge" heading — from bottom-right corner
  const s4HeadStyle = useFlightStyle(scrollYProgress, {
    scroll: [0.55, 0.64, 0.74, 0.8], fromX: 800, fromY: 500, fromR: 22, toR: -3,
    flyThrough: true, exitX: -700, exitY: -300, exitR: -15,
  });
  // "*soon" badge — from top-left
  const s4SoonStyle = useFlightStyle(scrollYProgress, {
    scroll: [0.57, 0.65, 0.74, 0.8], fromX: -500, fromY: -400, fromR: -30, toR: 12,
    flyThrough: true, exitX: 400, exitY: -500, exitR: 25,
  });
  // Body paragraph — from left side
  const s4BodyStyle = useFlightStyle(scrollYProgress, {
    scroll: [0.59, 0.67, 0.75, 0.8], fromX: -700, fromY: 200, fromR: -8, toR: 1,
    flyThrough: true, exitX: 600, exitY: 200, exitR: 6,
  });

  // ── SECTION 5: Outro ─────────────────────────────────────────────────────────
  // "Step Into" — from top-left corner
  const s5HeadStyle = useFlightStyle(scrollYProgress, {
    scroll: [0.75, 0.86, 0.97, 1], fromX: -700, fromY: -500, fromR: -20, toR: 0,
  });
  // "The Parallel" — from bottom-right corner
  const s5Head2Style = useFlightStyle(scrollYProgress, {
    scroll: [0.77, 0.87, 0.97, 1], fromX: 700, fromY: 500, fromR: 18, toR: 0,
  });
  // CTA button — from right side
  const s5BtnStyle = useFlightStyle(scrollYProgress, {
    scroll: [0.8, 0.89, 0.97, 1], fromX: 600, fromY: 0, fromR: 10, toR: 0,
  });

  return (
    <div ref={containerRef} className="h-[600vh] bg-[#0A0A0A] relative text-white selection:bg-[#ff6b4a] selection:text-white">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden border-x border-[#ffffff05]">

        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] bg-[#ff6b4a] rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-pulse" />
          <div className="absolute bottom-[20%] right-[20%] w-[50vw] h-[50vw] bg-[#6b4aff] rounded-full mix-blend-screen filter blur-[120px] opacity-[0.07] animate-pulse" style={{ animationDelay:'2s' }} />
        </div>
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage:'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

        {/* Decorative flying words */}
        <FlyingWords scrollYProgress={scrollYProgress} />

        {/* ── Section 1: Hero ── */}
        <motion.div
          style={{ opacity: section1Opacity, scale: section1Scale, y: section1Y }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none"
        >
          <AuroraBackground className="absolute inset-0 z-0 h-screen w-full rounded-none px-4">
            <div className="absolute inset-x-0 bottom-[-20%] md:bottom-[-40%] z-0 flex items-center justify-center opacity-40 mix-blend-screen overflow-hidden pointer-events-none w-full max-w-[800px] mx-auto aspect-[1/1]">
              <div className="w-full h-full pointer-events-auto flex items-center justify-center">
                <Globe className="scale-125 md:scale-150 w-full h-full" />
              </div>
            </div>

            <div className="relative z-10 w-full">
              <motion.h1
                style={{ ...heroTitleStyle, fontFamily: V }}
                className="text-[5rem] md:text-[9rem] font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-neutral-500"
              >
                PARALLEL
              </motion.h1>
              <motion.p
                style={{ ...heroSubStyle, fontFamily: B }}
                className="mt-6 text-xl md:text-3xl text-neutral-400 tracking-wide max-w-2xl mx-auto"
              >
                Decide the Undecidable
              </motion.p>
            </div>

            <motion.div
              style={heroScrollLabelStyle}
              className="absolute bottom-12 flex flex-col items-center gap-4 z-10"
            >
              <span style={{ fontFamily: V }} className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-medium">Scroll Down</span>
              <div className="w-[1px] h-20 bg-gradient-to-b from-neutral-500 to-transparent" />
            </motion.div>
          </AuroraBackground>
        </motion.div>

        {/* ── Section 2: Marquee ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-12 lg:px-24 text-center pointer-events-none overflow-hidden">
          <motion.h2
            style={{ ...s2TitleStyle, fontFamily: V }}
            className="text-4xl md:text-6xl font-black mb-8 tracking-tight text-white drop-shadow-lg"
          >
            Powering Next-Gen Discourse
          </motion.h2>
          <motion.div
            style={s2MarqueeStyle}
            className="w-[120vw] mt-12 max-w-[120vw] -mx-[10vw] pointer-events-auto"
          >
            <Marquee className="max-w-5xl mx-auto" fade pauseOnHover>
              {[
                { label:'React 19',      color:'#61DAFB' },
                { label:'FastAPI',       color:'#3776AB' },
                { label:'Tailwind V4',   color:'#38B2AC' },
                { label:'Cloudflare R2', color:'#F38020' },
                { label:'PostgreSQL',    color:'#336791' },
                { label:'Zustand',       color:'#e10098' },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-4 mx-8 py-4">
                  <span style={{ fontFamily: V, color }} className="text-3xl font-bold">{label}</span>
                </div>
              ))}
            </Marquee>
            <Marquee className="max-w-5xl mx-auto mt-4" fade pauseOnHover direction="right">
              {[
                { label:'Ethics',   icon:<Brain className="w-8 h-8 text-[#ff6b4a]" /> },
                { label:'Society',  icon:<Users className="w-8 h-8 text-[#6b4aff]" /> },
                { label:'Truth',    icon:<Shield className="w-8 h-8 text-[#2bf06d]" /> },
                { label:'Debate',   icon:<Flame className="w-8 h-8 text-[#ff4a4a]" /> },
                { label:'Humanity', icon:<img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=100&h=100" className="w-12 h-12 rounded-full object-cover border border-white/20" alt="" /> },
              ].map(({ label, icon }) => (
                <div key={label} className="flex items-center gap-4 mx-8 py-4">
                  {icon}
                  <span style={{ fontFamily: B }} className="text-2xl text-white/90">{label}</span>
                </div>
              ))}
            </Marquee>
          </motion.div>
        </div>

        {/* ── Section 3: Features ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-12 lg:px-24 text-center pointer-events-none overflow-hidden">
          <motion.h2
            style={{ ...s3TitleStyle, fontFamily: V }}
            className="text-5xl md:text-7xl font-black mb-8 tracking-tight text-white drop-shadow-lg"
          >
            A New Paradigm of Choice
          </motion.h2>
          <motion.p
            style={{ ...s3TextStyle, fontFamily: B }}
            className="max-w-3xl text-lg md:text-xl text-neutral-400 leading-relaxed mx-auto"
          >
            Every day, humanity faces a myriad of moral choices.{' '}
            <span style={{ fontFamily: V }} className="text-white font-medium">Parallel</span>{' '}
            brings these dilemmas to light. Vote, debate, and see where you stand among thousands of thinkers.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-6xl mx-auto pointer-events-auto">
            {[
              { title:'Personal',  desc:'Intimate and introspective problems.',  icon:<Users className="size-8 text-[#ff6b4a]" />, border:'border-[#ff6b4a]/20' },
              { title:'Community', desc:'Issues affecting your local circle.',    icon:<Brain className="size-8 text-[#6b4aff]" />, border:'border-[#6b4aff]/20' },
              { title:'Civic',     desc:'Societal and grand-scale dilemmas.',     icon:<Shield className="size-8 text-[#2bf06d]" />, border:'border-[#2bf06d]/20' },
            ].map((f, i) => (
              <motion.div
                key={i}
                style={cardStyles[i]}
                className={`bg-neutral-900/50 border ${f.border} backdrop-blur-xl rounded-3xl p-8 transform-gpu shadow-2xl hover:-translate-y-2 transition-transform duration-300 cursor-pointer`}
              >
                <div className="text-4xl mb-6 bg-white/5 w-16 h-16 rounded-full flex items-center justify-center">{f.icon}</div>
                <h3 style={{ fontFamily: V }} className="text-2xl font-bold mb-3 text-white">{f.title}</h3>
                <p style={{ fontFamily: B }} className="text-neutral-400 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Section 4: AI Judge ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-20 text-center pointer-events-none overflow-hidden">
          <div className="relative w-full max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff4a6b]/20 via-[#6b4aff]/20 to-[#4aff6b]/20 blur-[120px] rounded-full scale-150 transform-gpu" />
            <motion.h2
              style={{ ...s4HeadStyle, fontFamily: V }}
              className="text-6xl md:text-[7rem] font-black mb-6 tracking-tighter leading-none relative drop-shadow-2xl text-white"
            >
              AI Judge{' '}
              <motion.span
                style={{ ...s4SoonStyle, fontFamily: B }}
                className="absolute -top-4 -right-2 md:-right-8 text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b4a] to-[#ff4a6b] drop-shadow-md"
              >
                *soon
              </motion.span>
            </motion.h2>
            <motion.p
              style={{ ...s4BodyStyle, fontFamily: B }}
              className="text-xl md:text-2xl text-neutral-400 max-w-3xl mx-auto leading-relaxed mt-10 relative"
            >
              When humans fail to agree, logic intervenes. Our advanced AI model will analyze, dissect, and weigh the most complex civic issues, acting as an impartial mediator for the hardest questions.
            </motion.p>
          </div>
        </div>

        {/* ── Section 5: Outro ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none overflow-hidden">
          <div className="w-[150px] h-[150px] rounded-full bg-gradient-to-tr from-[#ff6b4a] to-[#6b4aff] blur-[80px] absolute mix-blend-screen opacity-50" />
          <motion.span
            style={{ ...s5HeadStyle, fontFamily: V, display:'block' }}
            className="text-6xl md:text-[6rem] font-black tracking-tighter leading-tight relative z-10"
          >
            Step Into
          </motion.span>
          <motion.span
            style={{ ...s5Head2Style, fontFamily: B, display:'block' }}
            className="text-6xl md:text-[6rem] tracking-tighter leading-tight relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b4a] to-[#6b4aff]"
          >
            The Parallel
          </motion.span>
          <motion.a
            href="/feed"
            style={{ ...s5BtnStyle, fontFamily: V }}
            className="pointer-events-auto mt-12 px-10 py-5 bg-white text-black text-lg font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,107,74,0.4)] relative z-10"
          >
            Start Voting Now
          </motion.a>
        </div>

      </div>
    </div>
  );
}
