'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Palette, Scan, Truck, ArrowUpRight, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SlipperCustomizer from '@/components/SlipperCustomizer';
import FooterRelated from '@/components/FooterRelated';
import Footer3D from '@/components/Footer3D/Footer3D';

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

const FEATURES = [
  {
    icon: Palette,
    title: 'Fully Customisable',
    desc: 'Choose from 6 base colours, 4 materials, 7 surface patterns, and unlimited charm combinations.',
    tag: 'Colors · Materials · Charms',
    accent: 'bg-violet-50 border-violet-100 text-violet-600',
    iconBg: 'bg-violet-100',
  },
  {
    icon: Scan,
    title: 'AI Foot Scanner',
    desc: 'Point your camera at your foot and get a precise size recommendation — no guesswork needed.',
    tag: 'Camera · AI · Precision',
    accent: 'bg-amber-50 border-amber-100 text-amber-600',
    iconBg: 'bg-amber-100',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Every pair is handcrafted to order and delivered to your door within 5–7 business days.',
    tag: 'Handmade · 5–7 Days',
    accent: 'bg-rose-50 border-rose-100 text-rose-600',
    iconBg: 'bg-rose-100',
  },
];

function FeaturesSection() {
  return (
    <section id="experience" className="w-full py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-16">
          <div>
            <FadeUp>
              <span className="text-[10px] font-mono text-violet-500 tracking-[0.4em]">WHY VELURA</span>
            </FadeUp>
            <FadeUp delay={0.07}>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-zinc-900 mt-3 leading-[0.95]">
                COMFORT<br />
                <span className="text-stone-300">REDEFINED.</span>
              </h2>
            </FadeUp>
          </div>
          <FadeUp delay={0.12}>
            <p className="text-stone-500 text-lg leading-relaxed">
              Every pair of VELURA slippers is designed by you, crafted by hand, and fitted to your exact foot — because no two feet are the same.
            </p>
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <FadeUp key={f.title} delay={i * 0.09}>
                <div className={`group relative h-full p-8 rounded-3xl border-2 ${f.accent} hover:shadow-xl hover:shadow-stone-100 hover:-translate-y-1 transition-all duration-500 cursor-pointer bg-white`}>
                  <div className="space-y-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${f.iconBg}`}>
                      <Icon size={22} className="text-current" />
                    </div>
                    <div>
                      <h3 className="text-base font-black tracking-tight text-zinc-900 mb-2">{f.title}</h3>
                      <p className="text-stone-500 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[9px] font-mono text-stone-400 tracking-widest">{f.tag}</span>
                      <ArrowUpRight size={14} className="text-stone-300 group-hover:text-current group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300" />
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
        <div className="flex-1 h-px bg-stone-200" />
        <span className="text-[9px] font-mono text-stone-400 tracking-[0.5em] uppercase shrink-0">{label}</span>
        <div className="flex-1 h-px bg-stone-200" />
      </motion.div>
    </div>
  );
}

function BrandSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="vision" ref={ref} className="w-full py-28 bg-[#fdf8f4]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.span
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[10px] font-mono text-violet-500 tracking-[0.4em]"
          >
            OUR PHILOSOPHY
          </motion.span>

          {['Every foot tells a story.', 'We help you write it.'].map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.p
                initial={{ y: '100%' }}
                animate={inView ? { y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] text-zinc-900"
              >
                {line}
              </motion.p>
            </div>
          ))}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="text-stone-500 text-lg leading-relaxed max-w-xl mx-auto"
          >
            VELURA was born from a simple idea: your slippers should feel like they were made just for you — because they are.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="grid grid-cols-3 gap-px bg-stone-100 rounded-3xl overflow-hidden mt-8 shadow-sm"
          >
            {[
              { n: '12k+', l: 'Pairs designed' },
              { n: '4.9★', l: 'Average rating' },
              { n: '100%', l: 'Handcrafted' },
            ].map((s) => (
              <div key={s.l} className="bg-white py-10 px-6 text-center">
                <div className="text-3xl font-black text-zinc-900 tracking-tight">{s.n}</div>
                <div className="text-[10px] font-mono text-stone-400 tracking-widest mt-1">{s.l.toUpperCase()}</div>
              </div>
            ))}
          </motion.div>

          <motion.a
            href="#customizer"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.7 }}
            className="inline-flex items-center gap-2 mt-4 text-sm font-black text-violet-600 hover:text-violet-700 transition-colors group"
          >
            Start designing yours
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="bg-[#fdf8f4] flex flex-col items-center">
      <Navbar />
      <Hero />

      <div className="w-full">
        <FeaturesSection />
        <BrandSection />
        <Divider label="Showcase · Live Slipper Customiser" />
        <div id="customizer" className="w-full bg-[#fdf8f4]">
          <div className="max-w-7xl mx-auto px-6 pt-20 pb-8 text-center space-y-3">
            <FadeUp>
              <span className="text-[10px] font-mono text-violet-500 tracking-[0.4em]">DESIGN STUDIO</span>
            </FadeUp>
            <FadeUp delay={0.07}>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-zinc-900">BUILD YOUR PAIR.</h2>
            </FadeUp>
            <FadeUp delay={0.12}>
              <p className="text-stone-400 text-base max-w-md mx-auto">
                Drag charms, pick colours, scan your foot — see your custom slipper live.
              </p>
            </FadeUp>
          </div>
          <SlipperCustomizer />
        </div>
        <Divider label="Collection · More Styles" />
        <FooterRelated />
        <Footer3D />
      </div>
    </main>
  );
}
