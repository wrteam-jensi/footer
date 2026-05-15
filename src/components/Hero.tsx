'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

function ProductOrb() {
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setRot({
      x: -((e.clientY - r.top)  / r.height - 0.5) * 22,
      y:  ((e.clientX - r.left) / r.width  - 0.5) * 22,
    });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setRot({ x: 0, y: 0 })}
      animate={{ rotateX: rot.x, rotateY: rot.y }}
      transition={{ type: 'spring', stiffness: 160, damping: 18 }}
      className="relative w-full max-w-[420px] aspect-square"
      style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}
    >
      {/* Glow behind card */}
      <div className="absolute inset-0 rounded-[2.5rem] scale-105 blur-3xl opacity-50"
        style={{ background: 'radial-gradient(circle, #F5EDE3 0%, #EDE3D9 60%, transparent 100%)' }} />

      {/* Main card */}
      <div className="relative h-full rounded-[2.5rem] flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #FEFCFA 0%, #F5EDE3 45%, #EDE3D9 100%)',
          border: '1px solid rgba(255,255,255,0.9)',
          boxShadow: '0 48px 96px rgba(196,149,106,0.22), 0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
          transform: 'translateZ(30px)',
        }}>

        {/* Decorative orbs */}
        <div className="absolute top-6 right-6 w-28 h-28 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(196,149,106,0.25) 0%, transparent 70%)' }} />
        <div className="absolute bottom-10 left-8 w-16 h-16 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(196,149,106,0.18) 0%, transparent 70%)' }} />

        {/* Shimmer bar */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)' }} />

        {/* Slipper */}
        <motion.div
          animate={{ y: [0, -14, 0], rotate: [0, 2, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="text-[9rem] md:text-[11rem] select-none relative z-10"
          style={{ filter: 'drop-shadow(0 32px 56px rgba(196,149,106,0.45))' }}
        >
          🩴
        </motion.div>

        {/* Inner glass shine */}
        <div className="absolute inset-0 rounded-[2.5rem]"
          style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.45) 0%, transparent 55%)' }} />

        {/* Bottom pill */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap"
            style={{
              background: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
            }}>
            ✦ Tap to customise
          </div>
        </div>
      </div>

      {/* Floating badges */}
      {[
        { label: '4.9★ Rating', x: '-18%', y: '12%', delay: 0.9 },
        { label: '12k+ Made', x: '92%',  y: '40%', delay: 1.1 },
        { label: '5–7d Ship',  x: '-12%', y: '75%', delay: 1.3 },
      ].map((b) => (
        <motion.div key={b.label}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: b.delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute px-3 py-1.5 rounded-full text-[10px] font-semibold whitespace-nowrap"
          style={{
            left: b.x, top: b.y,
            background: 'rgba(255,255,255,0.95)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            transform: 'translateZ(60px)',
          }}
        >
          {b.label}
        </motion.div>
      ))}

      {/* Floor shadow */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-6"
        style={{ background: 'radial-gradient(ellipse, rgba(196,149,106,0.25) 0%, transparent 70%)', filter: 'blur(10px)' }} />
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const fade = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const blobY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);

  return (
    <div ref={ref} className="relative min-h-screen w-full flex items-center overflow-hidden"
      style={{ background: 'var(--bg)' }}>

      {/* Animated background blobs */}
      <motion.div style={{ y: blobY }} className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
          className="absolute top-[-15%] right-[-8%] w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,237,227,0.8) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut', delay: 3 }}
          className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(237,227,217,0.6) 0%, transparent 70%)' }}
        />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
      </motion.div>

      <motion.div style={{ opacity: fade }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-24 pb-20 flex flex-col lg:flex-row items-center gap-14 lg:gap-20">

        {/* ── Left: copy ── */}
        <div className="flex-1 text-center lg:text-left">

          {/* Animated badge */}
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-9 text-xs font-semibold"
            style={{ background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid rgba(196,149,106,0.2)' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                style={{ background: 'var(--accent)' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'var(--accent)' }} />
            </span>
            Handcrafted · Made to Order
          </motion.div>

          {/* Headline */}
          {[
            { text: 'Comfort',  italic: false, accent: false },
            { text: 'designed', italic: true,  accent: true  },
            { text: 'by you.',  italic: false, accent: false },
          ].map((l, i) => (
            <div key={i} className="overflow-hidden">
              <motion.h1
                initial={{ y: '108%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.09, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className={`block text-[clamp(3.5rem,9vw,7.5rem)] font-bold leading-[0.88] tracking-tighter ${l.italic ? 'italic' : ''}`}
                style={{ color: l.accent ? 'var(--accent)' : 'var(--text)' }}
              >
                {l.text}
              </motion.h1>
            </div>
          ))}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58, duration: 0.6 }}
            className="text-base md:text-lg leading-relaxed max-w-md mt-7 mb-9"
            style={{ color: 'var(--text-muted)' }}
          >
            Pick colour, material, embellishments — then scan your foot for a perfect fit. Delivered in 5–7 days.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72, duration: 0.5 }}
            className="flex flex-wrap gap-3 justify-center lg:justify-start mb-11"
          >
            <a href="#customizer"
              className="group relative flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white overflow-hidden"
              style={{ background: 'var(--text)', boxShadow: '0 8px 28px rgba(17,17,17,0.22)' }}>
              <span className="relative z-10 flex items-center gap-2">
                Start designing
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'var(--accent-dark)' }} />
            </a>
            <a href="#experience"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ color: 'var(--text)', background: 'white', border: '1px solid var(--border)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              View collection
            </a>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.92 }}
            className="flex items-center gap-5 justify-center lg:justify-start flex-wrap"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-2">
                {['#F5EDE3','#EDE3D9','#E5D8CB','#DDD0C4'].map((bg, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold"
                    style={{ background: bg, color: 'var(--accent)' }}>
                    {['A','K','R','M'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="#C4956A" color="#C4956A" />)}
                </div>
                <p className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  12,000+ happy customers
                </p>
              </div>
            </div>

            <div className="w-px h-8" style={{ background: 'var(--border)' }} />

            {[{ n: '100%', l: 'Handmade' }, { n: '5–7d', l: 'Delivery' }].map((s) => (
              <div key={s.l}>
                <div className="text-sm font-bold" style={{ color: 'var(--text)' }}>{s.n}</div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right: 3D product orb ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.82, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 flex items-center justify-center w-full"
          style={{ perspective: '1200px' }}
        >
          <a href="#customizer" className="block w-full max-w-sm lg:max-w-none">
            <ProductOrb />
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll mouse indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.9, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="w-1 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
        </motion.div>
      </motion.div>
    </div>
  );
}
