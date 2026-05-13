'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Star } from 'lucide-react';

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const y    = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  return (
    <div ref={ref} className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-16"
      style={{ background: 'var(--bg)' }}>

      {/* Soft warm blob */}
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full opacity-40"
          style={{ background: 'radial-gradient(circle, #F5EDE3 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #F5EDE3 0%, transparent 70%)' }} />
      </motion.div>

      <motion.div style={{ opacity: fade }}
        className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 py-20">

        {/* Left: text */}
        <div className="flex-1 text-center lg:text-left">
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8"
            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
            Handcrafted · Made to Order
          </motion.div>

          {/* Headline */}
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3rem,8vw,6.5rem)] font-bold leading-[0.9] tracking-tighter"
              style={{ color: 'var(--text)' }}
            >
              Comfort
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.32, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3rem,8vw,6.5rem)] font-bold leading-[0.9] tracking-tighter italic"
              style={{ color: 'var(--accent)' }}
            >
              designed
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-8">
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.39, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3rem,8vw,6.5rem)] font-bold leading-[0.9] tracking-tighter"
              style={{ color: 'var(--text)' }}
            >
              by you.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="text-base md:text-lg leading-relaxed max-w-md mb-10"
            style={{ color: 'var(--text-muted)' }}
          >
            Choose colour, material, and embellishments. Scan your foot for a perfect fit. Delivered in 5–7 days.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-wrap gap-3 justify-center lg:justify-start mb-12"
          >
            <a href="#customizer"
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--text)' }}>
              Start designing →
            </a>
            <a href="#experience"
              className="px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
              style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--text-muted)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              View collection
            </a>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
            className="flex items-center gap-4 justify-center lg:justify-start"
          >
            <div className="flex -space-x-2">
              {['#F5EDE3', '#EDE3D9', '#E5D8CB'].map((bg, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold"
                  style={{ background: bg, color: 'var(--accent)' }}>
                  {['S','M','L'][i]}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5 mb-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="#C4956A" color="#C4956A" />)}
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>12,000+ happy customers</p>
            </div>
          </motion.div>
        </div>

        {/* Right: product visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 flex items-center justify-center"
        >
          <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden flex items-center justify-center"
            style={{ background: 'var(--accent-light)' }}>
            {/* Decorative circles */}
            <div className="absolute w-[200%] h-[200%] rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 60%)' }} />
            <div className="absolute top-6 right-6 w-20 h-20 rounded-full opacity-30"
              style={{ background: 'var(--accent)' }} />
            <div className="absolute bottom-8 left-8 w-12 h-12 rounded-full opacity-20"
              style={{ background: 'var(--accent)' }} />
            {/* Big slipper */}
            <div className="relative z-10 text-[10rem] select-none"
              style={{ filter: 'drop-shadow(0 24px 48px rgba(196,149,106,0.35))' }}>
              🩴
            </div>
            {/* Label badge */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm text-xs font-semibold shadow-sm"
              style={{ color: 'var(--text)', border: '1px solid var(--border)' }}>
              Tap to customise ✦
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
          <ArrowDown size={16} style={{ color: 'var(--border)' }} />
        </motion.div>
      </motion.div>
    </div>
  );
}
