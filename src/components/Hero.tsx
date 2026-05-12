'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Sparkles, Star } from 'lucide-react';

const REVIEWS = [
  { initials: 'AM', color: 'bg-violet-100 text-violet-600' },
  { initials: 'JK', color: 'bg-amber-100 text-amber-600' },
  { initials: 'RB', color: 'bg-rose-100 text-rose-600' },
];

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const fade = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <div ref={ref} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#fdf8f4]">

      {/* Ambient blobs */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[650px] h-[650px] rounded-full bg-violet-100/70 blur-[130px]" />
        <div className="absolute bottom-[-5%] left-[-8%] w-[550px] h-[550px] rounded-full bg-amber-100/80 blur-[110px]" />
        <div className="absolute top-[35%] left-[25%] w-[320px] h-[320px] rounded-full bg-rose-100/50 blur-[90px]" />
      </motion.div>

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle, #78350f 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <motion.div style={{ opacity: fade }} className="relative z-10 text-center px-6 max-w-5xl w-full">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-violet-100 shadow-sm mb-10"
        >
          <Sparkles size={12} className="text-violet-500" />
          <span className="text-[11px] font-black text-violet-600 tracking-[0.2em]">HANDCRAFTED · MADE TO ORDER</span>
        </motion.div>

        {/* Headline */}
        <div className="space-y-1 mb-6">
          {[
            { text: 'YOUR PERFECT', color: 'text-zinc-900' },
            { text: 'SLIPPER,', color: 'bg-gradient-to-r from-violet-600 via-purple-500 to-amber-500 bg-clip-text text-transparent' },
            { text: 'DESIGNED BY YOU.', color: 'text-zinc-900' },
          ].map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.h1
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.35 + i * 0.1, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className={`block text-[clamp(2.5rem,8vw,7rem)] font-black leading-[0.92] tracking-tighter ${line.color}`}
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
          className="text-stone-500 text-lg md:text-xl leading-relaxed max-w-xl mx-auto mt-6 mb-10 font-medium"
        >
          Pick your colour, material, embellishments — then scan your foot for an exact fit. Delivered in 5–7 days.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex items-center justify-center flex-wrap gap-4"
        >
          <a
            href="#customizer"
            className="group relative px-8 py-4 rounded-full bg-zinc-900 text-white text-[11px] font-black tracking-[0.2em] overflow-hidden hover:scale-105 transition-transform shadow-xl shadow-zinc-200"
          >
            <span className="relative z-10">START DESIGNING</span>
            <div className="absolute inset-0 bg-violet-600 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300" />
          </a>
          <a
            href="#experience"
            className="px-8 py-4 rounded-full border-2 border-stone-200 text-stone-600 text-[11px] font-black tracking-[0.2em] hover:border-stone-400 hover:text-zinc-900 transition-all"
          >
            SEE COLLECTION →
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex items-center justify-center gap-6 mt-14"
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {REVIEWS.map((r, i) => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black ${r.color}`}>
                  {r.initials}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={10} className="text-amber-400 fill-amber-400" />)}
              </div>
              <div className="text-[10px] text-stone-400 font-mono">12k+ happy customers</div>
            </div>
          </div>

          <div className="w-px h-8 bg-stone-200" />

          {[
            { n: '100%', l: 'Custom made' },
            { n: '5–7d', l: 'Delivery' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-lg font-black text-zinc-900">{s.n}</div>
              <div className="text-[10px] font-mono text-stone-400">{s.l}</div>
            </div>
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
          <ArrowDown size={16} className="text-stone-400" />
        </motion.div>
      </motion.div>
    </div>
  );
}
