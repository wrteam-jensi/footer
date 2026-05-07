'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const WORDS = ['DIGITAL', 'SPATIAL', 'IMMERSIVE'];

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div ref={ref} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505]">

      {/* Ambient blobs */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-15%] right-[-5%] w-[600px] h-[600px] rounded-full bg-cyan-500/8 blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-500/8 blur-[130px]" />
      </motion.div>

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      <motion.div style={{ opacity: fade }} className="relative z-10 text-center px-6 max-w-5xl">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <span className="h-px w-12 bg-cyan-500/50" />
          <span className="text-[10px] font-mono text-cyan-500 tracking-[0.4em]">BEYOND DIGITAL GENESIS · EST. 2024</span>
          <span className="h-px w-12 bg-cyan-500/50" />
        </motion.div>

        {/* Headline: staggered lines */}
        <div className="space-y-2 mb-4">
          {[
            { text: 'THE NEXT', color: 'text-white' },
            { text: 'DIMENSION', color: 'bg-gradient-to-r from-orange-400 via-red-400 to-cyan-400 bg-clip-text text-transparent' },
            { text: 'OF WEB.', color: 'text-white' },
          ].map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.h1
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.35 + i * 0.1, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className={`block text-[clamp(3rem,10vw,8rem)] font-black leading-[0.9] tracking-tighter ${line.color}`}
              >
                {line.text}
              </motion.h1>
            </div>
          ))}
        </div>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.7 }}
          className="text-neutral-500 text-lg md:text-xl leading-relaxed max-w-xl mx-auto mt-8 mb-10 font-medium"
        >
          We craft interfaces that blur the boundary between screen and reality — spatial, reactive, and alive.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex items-center justify-center flex-wrap gap-4"
        >
          <a href="#experience"
            className="group relative px-8 py-3.5 rounded-full bg-white text-black text-[11px] font-black tracking-[0.2em] overflow-hidden hover:scale-105 transition-transform">
            <span className="relative z-10">EXPLORE WORK</span>
            <div className="absolute inset-0 bg-cyan-400 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300" />
          </a>
          <a href="#customizer"
            className="px-8 py-3.5 rounded-full border border-white/10 text-white text-[11px] font-black tracking-[0.2em] hover:border-cyan-500/40 hover:bg-white/3 transition-all">
            3D SHOWCASE →
          </a>
        </motion.div>

        {/* Rotating words */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex items-center justify-center gap-3 mt-12"
        >
          {WORDS.map((w, i) => (
            <motion.span
              key={w}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 3, delay: i * 0.8 }}
              className="text-[9px] font-mono text-neutral-700 tracking-[0.3em]"
            >
              {w}{i < WORDS.length - 1 && <span className="ml-3 text-white/10">·</span>}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ArrowDown size={16} className="text-neutral-700" />
        </motion.div>
      </motion.div>
    </div>
  );
}
