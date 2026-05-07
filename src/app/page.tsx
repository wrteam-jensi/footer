'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Box, Globe2, Cpu, ArrowUpRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SlipperCustomizer from '@/components/SlipperCustomizer';
import FooterRelated from '@/components/FooterRelated';
import Footer3D from '@/components/Footer3D/Footer3D';

// ── utility ────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

// ── Experience section ─────────────────────────────────────────
const SERVICES = [
  {
    icon: Box,
    title: '3D INTERFACES',
    desc: 'We build real-time 3D scenes that run at 60fps in any browser — no plugins, no compromise.',
    tag: 'WebGL · R3F · Three.js',
  },
  {
    icon: Globe2,
    title: 'SPATIAL COMMERCE',
    desc: 'Configurable product experiences that let customers feel ownership before purchase.',
    tag: 'AR · WebXR · Custom',
  },
  {
    icon: Cpu,
    title: 'REACTIVE MOTION',
    desc: 'Physics-driven, scroll-linked, cursor-aware animations baked into every layer of the UI.',
    tag: 'Framer · GSAP · Spring',
  },
];

function ExperienceSection() {
  return (
    <section id="experience" className="w-full py-32">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-20">
          <div>
            <FadeUp>
              <span className="text-[10px] font-mono text-cyan-500 tracking-[0.4em]">WHAT WE DO</span>
            </FadeUp>
            <FadeUp delay={0.07}>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white mt-3 leading-[0.95]">
                EXPERIENCE<br />
                <span className="text-neutral-600">REDEFINED.</span>
              </h2>
            </FadeUp>
          </div>
          <FadeUp delay={0.12}>
            <p className="text-neutral-500 text-lg leading-relaxed">
              Every project we ship pushes the browser further. We design experiences that are spatial, reactive, and impossible to ignore.
            </p>
          </FadeUp>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <FadeUp key={s.title} delay={i * 0.09}>
                <div className="group relative h-full p-8 rounded-4xl bg-neutral-900/40 border border-white/5 hover:border-cyan-500/20 hover:bg-neutral-900/70 transition-all duration-500 overflow-hidden cursor-pointer">
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/3 group-hover:to-transparent transition-all duration-700" />

                  <div className="relative z-10 space-y-5">
                    <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center group-hover:border-cyan-500/30 group-hover:bg-cyan-500/8 transition-all duration-300">
                      <Icon size={20} className="text-neutral-400 group-hover:text-cyan-400 transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black tracking-[0.15em] text-white mb-3">{s.title}</h3>
                      <p className="text-neutral-500 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[9px] font-mono text-neutral-700 tracking-widest">{s.tag}</span>
                      <ArrowUpRight size={14} className="text-neutral-700 group-hover:text-cyan-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Divider line ───────────────────────────────────────────────
function Divider({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="w-full max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ originX: 0 }}
        className="flex items-center gap-5"
      >
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-[9px] font-mono text-neutral-700 tracking-[0.5em] uppercase shrink-0">{label}</span>
        <div className="flex-1 h-px bg-white/5" />
      </motion.div>
    </div>
  );
}

// ── Vision statement ───────────────────────────────────────────
function VisionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="vision" ref={ref} className="w-full py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.span
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[10px] font-mono text-cyan-500 tracking-[0.4em]"
          >
            OUR VISION
          </motion.span>

          {['We believe the web is not a', 'document. It is a place.'].map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.p
                initial={{ y: '100%' }}
                animate={inView ? { y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] text-white"
              >
                {line}
              </motion.p>
            </div>
          ))}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="text-neutral-500 text-lg leading-relaxed max-w-xl mx-auto"
          >
            Every pixel should respond. Every scroll should feel. Every visit should be an experience you remember.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="grid grid-cols-3 gap-px bg-white/5 rounded-3xl overflow-hidden mt-8"
          >
            {[
              { n: '140+', l: 'Projects shipped' },
              { n: '60fps', l: 'Render target' },
              { n: '15k+', l: 'Community members' },
            ].map((s) => (
              <div key={s.l} className="bg-[#050505] py-8 px-6 text-center">
                <div className="text-3xl font-black text-white tracking-tight">{s.n}</div>
                <div className="text-[10px] font-mono text-neutral-600 tracking-widest mt-1">{s.l.toUpperCase()}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Page ───────────────────────────────────────────────────────
export default function Home() {
  return (
    <main className="bg-[#050505] flex flex-col items-center">
      <Navbar />
      <Hero />

      <div className="w-full">
        <ExperienceSection />
        <VisionSection />
        <Divider label="Showcase_01 · 3D Product Configurator" />
        <div id="customizer" className="w-full">
          <div className="max-w-7xl mx-auto px-6 pt-20 pb-8 text-center space-y-2">
            <FadeUp>
              <span className="text-[10px] font-mono text-cyan-500 tracking-[0.4em]">SPATIAL COMMERCE DEMO</span>
            </FadeUp>
            <FadeUp delay={0.07}>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white">LIVE CONFIGURATOR.</h2>
            </FadeUp>
            <FadeUp delay={0.12}>
              <p className="text-neutral-600 text-base max-w-md mx-auto">
                A real-time 3D product customiser running entirely in the browser. This is what we build.
              </p>
            </FadeUp>
          </div>
          <SlipperCustomizer />
        </div>
        <Divider label="Section_02 · Curated Products" />
        <FooterRelated />
        <Footer3D />
      </div>
    </main>
  );
}
