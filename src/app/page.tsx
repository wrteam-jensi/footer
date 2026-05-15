'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Palette, Scan, Truck, ArrowRight, ArrowUpRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SlipperCustomizer from '@/components/SlipperCustomizer';
import FooterRelated from '@/components/FooterRelated';
import Footer3D from '@/components/Footer3D/Footer3D';

// ── Utilities ──────────────────────────────────────────────────────────────────

function FadeUp({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

// ── Marquee strip ──────────────────────────────────────────────────────────────

const MARQUEE_ITEMS = [
  '🩴 Custom Fit', '✦ Handcrafted', '⭐ 4.9 Rating', '🚚 5–7 Day Delivery',
  '🎨 6 Colours', '🔍 AI Foot Scan', '💝 Made to Order', '🌸 Unique Designs',
];

function MarqueeStrip() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="w-full overflow-hidden py-4 border-y" style={{ borderColor: 'var(--border-dark)', background: 'var(--bg-dark)' }}>
      <div className="flex gap-8 marquee-track whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="text-xs font-mono tracking-[0.2em] uppercase shrink-0"
            style={{ color: 'rgba(255,255,255,0.35)' }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── 3D tilt card ───────────────────────────────────────────────────────────────

function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setRot({
      x: -((e.clientY - r.top)  / r.height - 0.5) * 12,
      y:  ((e.clientX - r.left) / r.width  - 0.5) * 12,
    });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setRot({ x: 0, y: 0 })}
      animate={{ rotateX: rot.x, rotateY: rot.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      style={{ transformStyle: 'preserve-3d', perspective: '800px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Features (dark section) ────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Palette,
    num: '01',
    title: 'Fully Customisable',
    desc: '6 colours, 4 materials, 7 patterns and unlimited charm combos — every detail is yours.',
    highlight: 'Colors & Materials',
  },
  {
    icon: Scan,
    num: '02',
    title: 'AI Foot Scanner',
    desc: 'Point your camera at your foot and get a precision size recommendation instantly.',
    highlight: 'Camera · AI · Precision',
  },
  {
    icon: Truck,
    num: '03',
    title: 'Fast Delivery',
    desc: 'Every pair handcrafted to order and shipped to your door in 5–7 business days.',
    highlight: 'Handmade · Fast',
  },
];

function FeaturesSection() {
  return (
    <section id="experience" className="w-full py-28 relative overflow-hidden"
      style={{ background: 'var(--bg-dark)' }}>

      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(196,149,106,0.08) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(196,149,106,0.05) 0%, transparent 70%)' }} />
      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-20 gap-8">
          <div>
            <FadeUp>
              <p className="text-xs font-mono tracking-[0.4em] mb-4" style={{ color: 'var(--accent)' }}>
                WHY VELURA
              </p>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.0]"
                style={{ color: 'var(--text-inv)' }}>
                Slippers that fit<br />
                <em className="not-italic" style={{ color: 'var(--accent)' }}>your life exactly.</em>
              </h2>
            </FadeUp>
          </div>
          <FadeUp delay={0.14} className="max-w-xs">
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
              We build the pair your feet have been waiting for — personalised, perfect-fit, handcrafted.
            </p>
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <FadeUp key={f.num} delay={i * 0.1}>
                <TiltCard className="h-full">
                  <div className="h-full p-8 rounded-2xl group cursor-default relative overflow-hidden"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                    }}>

                    {/* Hover glow */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: 'radial-gradient(circle at 50% 0%, rgba(196,149,106,0.08) 0%, transparent 70%)' }} />

                    {/* Top highlight line */}
                    <div className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(196,149,106,0.5), transparent)' }} />

                    <div className="relative z-10 flex flex-col h-full">
                      <p className="text-xs font-mono mb-6" style={{ color: 'rgba(255,255,255,0.18)' }}>{f.num}</p>

                      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                        style={{ background: 'rgba(196,149,106,0.12)', border: '1px solid rgba(196,149,106,0.2)' }}>
                        <Icon size={19} style={{ color: 'var(--accent)' }} />
                      </div>

                      <h3 className="text-base font-semibold mb-2.5" style={{ color: 'rgba(255,255,255,0.9)' }}>
                        {f.title}
                      </h3>
                      <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.42)' }}>
                        {f.desc}
                      </p>

                      <div className="mt-6 flex items-center justify-between">
                        <span className="text-[9px] font-mono tracking-widest" style={{ color: 'rgba(196,149,106,0.5)' }}>
                          {f.highlight}
                        </span>
                        <ArrowUpRight size={13} style={{ color: 'rgba(255,255,255,0.2)' }}
                          className="group-hover:text-[var(--accent)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Brand / Philosophy ─────────────────────────────────────────────────────────

function BrandSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="vision" ref={ref} className="w-full py-28 relative overflow-hidden"
      style={{ background: 'var(--bg-alt)' }}>

      {/* Watermark text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="text-[18vw] font-black tracking-tighter select-none"
          style={{ color: 'rgba(196,149,106,0.05)', whiteSpace: 'nowrap' }}>
          VELURA
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: quote */}
          <div>
            <motion.p
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              className="text-xs font-mono tracking-[0.4em] mb-8" style={{ color: 'var(--accent)' }}
            >
              OUR PHILOSOPHY
            </motion.p>

            {['Every foot tells', 'a story —', 'we help you write it.'].map((line, i) => (
              <div key={i} className="overflow-hidden">
                <motion.p
                  initial={{ y: '100%' }}
                  animate={inView ? { y: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.09, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]"
                  style={{ color: 'var(--text)' }}
                >
                  {line}
                </motion.p>
              </div>
            ))}

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="text-base leading-relaxed mt-7 max-w-md" style={{ color: 'var(--text-muted)' }}
            >
              Velura was born from one belief: your slippers should feel like they were made just for you — because they are.
            </motion.p>

            <motion.a
              href="#customizer"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              className="inline-flex items-center gap-2 mt-8 text-sm font-semibold group"
              style={{ color: 'var(--accent)' }}
            >
              Start designing yours
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>

          {/* Right: stats grid */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.28, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { n: '12k+', l: 'Pairs designed', icon: '🩴' },
              { n: '4.9★', l: 'Average rating',  icon: '⭐' },
              { n: '100%', l: 'Handcrafted',      icon: '🤝' },
              { n: '5–7d', l: 'Delivery time',    icon: '🚚' },
            ].map((s) => (
              <TiltCard key={s.l}>
                <div className="p-6 rounded-2xl bg-white border hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                  style={{ borderColor: 'var(--border)' }}>
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>{s.n}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.l}</div>
                </div>
              </TiltCard>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Customiser intro ───────────────────────────────────────────────────────────

function CustomiserIntro() {
  return (
    <div className="w-full pt-20 pb-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-6 text-center">
        <FadeUp>
          <p className="text-xs font-mono tracking-[0.4em] mb-4" style={{ color: 'var(--accent)' }}>
            LIVE DESIGN STUDIO
          </p>
        </FadeUp>
        <FadeUp delay={0.08}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
            style={{ color: 'var(--text)' }}>
            Build your pair.
          </h2>
        </FadeUp>
        <FadeUp delay={0.15}>
          <p className="text-sm max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
            Drag charms, pick colours, scan your foot — see it live in real time.
          </p>
        </FadeUp>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="flex flex-col items-center" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <Hero />
      <MarqueeStrip />

      <div className="w-full">
        <FeaturesSection />
        <BrandSection />
        <CustomiserIntro />

        <div id="customizer" className="w-full" style={{ background: 'var(--bg)' }}>
          <SlipperCustomizer />
        </div>

        <FooterRelated />
        <Footer3D />
      </div>
    </main>
  );
}
