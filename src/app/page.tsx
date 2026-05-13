'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Palette, Scan, Truck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SlipperCustomizer from '@/components/SlipperCustomizer';
import FooterRelated from '@/components/FooterRelated';
import Footer3D from '@/components/Footer3D/Footer3D';

// ── Utility ────────────────────────────────────────────────────────────────────

function FadeUp({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

// ── Features section ───────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Palette,
    num: '01',
    title: 'Fully Customisable',
    desc: 'Choose from 6 base colours, 4 materials, 7 surface patterns and unlimited charm combinations.',
  },
  {
    icon: Scan,
    num: '02',
    title: 'AI Foot Scanner',
    desc: 'Point your camera at your foot to get a precise size recommendation — no measuring tape needed.',
  },
  {
    icon: Truck,
    num: '03',
    title: 'Fast Delivery',
    desc: 'Every pair is handcrafted to order and shipped to your door within 5–7 business days.',
  },
];

function FeaturesSection() {
  return (
    <section id="experience" className="w-full py-24" style={{ background: '#fff' }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="max-w-2xl mb-16">
          <FadeUp>
            <p className="text-xs font-mono tracking-[0.35em] mb-4" style={{ color: 'var(--accent)' }}>
              WHY VELURA
            </p>
          </FadeUp>
          <FadeUp delay={0.07}>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]" style={{ color: 'var(--text)' }}>
              Slippers that fit<br />
              <span style={{ color: 'var(--accent)' }}>your life exactly.</span>
            </h2>
          </FadeUp>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <FadeUp key={f.num} delay={i * 0.08}>
                <div className="h-full p-8 rounded-2xl border hover:-translate-y-1 transition-all duration-300"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
                  <p className="text-xs font-mono mb-6" style={{ color: 'var(--border)' }}>{f.num}</p>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: 'var(--accent-light)' }}>
                    <Icon size={18} style={{ color: 'var(--accent)' }} />
                  </div>
                  <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Divider ────────────────────────────────────────────────────────────────────

function Divider({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="max-w-7xl mx-auto px-6 py-6">
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ originX: 0 }}
        className="flex items-center gap-4"
      >
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        <span className="text-[9px] font-mono tracking-[0.4em] uppercase shrink-0" style={{ color: 'var(--border)' }}>
          {label}
        </span>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </motion.div>
    </div>
  );
}

// ── Brand / vision section ─────────────────────────────────────────────────────

function BrandSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="vision" ref={ref} className="w-full py-24" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Quote */}
          <div>
            <motion.p
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="text-xs font-mono tracking-[0.35em] mb-6"
              style={{ color: 'var(--accent)' }}
            >
              OUR PHILOSOPHY
            </motion.p>

            {['Every foot tells', 'a story — we help', 'you write it.'].map((line, i) => (
              <div key={i} className="overflow-hidden">
                <motion.p
                  initial={{ y: '100%' }}
                  animate={inView ? { y: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.1]"
                  style={{ color: 'var(--text)' }}
                >
                  {line}
                </motion.p>
              </div>
            ))}

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-base leading-relaxed mt-6 max-w-md"
              style={{ color: 'var(--text-muted)' }}
            >
              Velura was born from one belief: your slippers should feel like they were made just for you — because they are.
            </motion.p>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { n: '12k+', l: 'Pairs designed' },
              { n: '4.9★', l: 'Average rating' },
              { n: '100%', l: 'Handcrafted' },
              { n: '5–7d', l: 'Delivery time' },
            ].map((s) => (
              <div key={s.l} className="p-6 rounded-2xl bg-white border"
                style={{ borderColor: 'var(--border)' }}>
                <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>{s.n}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="flex flex-col items-center" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <Hero />

      <div className="w-full">
        <FeaturesSection />
        <BrandSection />

        <Divider label="Design Studio" />

        <div id="customizer" className="w-full" style={{ background: 'var(--bg)' }}>
          <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 text-center">
            <FadeUp>
              <p className="text-xs font-mono tracking-[0.35em] mb-3" style={{ color: 'var(--accent)' }}>
                LIVE CUSTOMISER
              </p>
            </FadeUp>
            <FadeUp delay={0.07}>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3" style={{ color: 'var(--text)' }}>
                Build your pair.
              </h2>
            </FadeUp>
            <FadeUp delay={0.12}>
              <p className="text-sm max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
                Drag charms, pick colours, scan your foot — see it live.
              </p>
            </FadeUp>
          </div>
          <SlipperCustomizer />
        </div>

        <Divider label="Collection" />
        <FooterRelated />
        <Footer3D />
      </div>
    </main>
  );
}
