'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star, Heart, Sparkles } from 'lucide-react';
import Image from 'next/image';

function BandhaniBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.05]">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <pattern id="bandhani" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.5" fill="currentColor" />
          <circle cx="6" cy="6" r="0.5" fill="currentColor" />
          <circle cx="4" cy="4" r="0.3" fill="currentColor" />
        </pattern>
        <rect width="100" height="100" fill="url(#bandhani)" />
      </svg>
    </div>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.95]);

  return (
    <section ref={containerRef} className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#FFFDF5] pt-24 pb-12">
      <BandhaniBg />
      
      {/* Vibrant Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#FFD700] blur-[150px] opacity-30" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#FF4500] blur-[130px] opacity-20" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-[#008080] blur-[100px] opacity-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Content */}
        <motion.div style={{ opacity, scale }} className="flex flex-col items-start text-left order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#008080]/10 border border-[#008080]/20 text-[11px] font-black tracking-[0.25em] text-[#006666] uppercase mb-10"
          >
            <Sparkles size={14} className="animate-pulse" />
            Vibrant Kutch Artisanship
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.82] text-[#111111] mb-10"
          >
            Celebrate <br />
            <span className="text-[#FF4500]">vibrant</span> <br />
            heritage.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-[#4B4B4B] max-w-md mb-12 leading-relaxed font-medium"
          >
            Handcrafted Mojdi from the heart of Gujarat. Mirror work, Bandhani silk, and comfort that dances with every step.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-5"
          >
            <a href="#customizer" className="px-10 py-5 bg-[#008080] text-white rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-[#006666] transition-all group shadow-2xl shadow-[#008080]/20 active:scale-95">
              Design My Mojdi
              <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
            </a>
            <a href="#experience" className="px-10 py-5 bg-white text-[#111111] border-2 border-[#E5E0D8] rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-[#FAFAF8] transition-all shadow-xl shadow-black/5 active:scale-95">
              View Collection
            </a>
          </motion.div>

          {/* Cultural Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 flex items-center gap-12 border-t-2 border-black/5 pt-10 w-full"
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#FFD700" color="#FFD700" />)}
              </div>
              <p className="text-[11px] font-black text-black/40 uppercase tracking-widest">Loved by 12,000+</p>
            </div>
            <div className="w-0.5 h-12 bg-black/5" />
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#FF4500]/10 rounded-2xl flex items-center justify-center text-[#FF4500]">
                <span className="text-2xl font-bold">100%</span>
              </div>
              <div>
                <p className="text-sm font-black text-[#111111]">Hand-Embroidered</p>
                <p className="text-[10px] font-bold text-black/40 uppercase tracking-tighter">Artisanal Pride</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Product Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: 3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-square lg:h-[750px] w-full order-1 lg:order-2"
        >
          <motion.div style={{ y: y1 }} className="relative h-full w-full">
            {/* Main Image Container with Decorative Border */}
            <div className="relative h-full w-full p-4 rounded-[4rem] overflow-hidden">
               <div className="absolute inset-0 border-[12px] border-[#FFD700]/20 rounded-[4rem]" />
               <div className="relative h-full w-full rounded-[3.2rem] overflow-hidden shadow-[0_32px_80px_-16px_rgba(0,0,0,0.3)] group">
                <Image
                  src="/premium_gujarati_mojdi_hero_1778817260598.png"
                  alt="Premium Gujarati Handcrafted Mojdi"
                  fill
                  className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                  priority
                />
                
                {/* Floating Heritage Tag */}
                <div className="absolute top-8 left-8">
                  <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl shadow-xl flex items-center gap-2 border border-white">
                    <span className="text-xl">🇮🇳</span>
                    <span className="text-[10px] font-black tracking-widest text-[#111111] uppercase">Kutch Heritage</span>
                  </div>
                </div>

                {/* Glass Info Card */}
                <div className="absolute bottom-10 left-10 right-10 p-8 bg-[#111111]/80 backdrop-blur-xl rounded-[2.5rem] border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-[#FFD700] uppercase tracking-[0.3em] mb-2">Artisan Pick</p>
                    <h3 className="text-2xl font-black text-white tracking-tight">Kutch Mirror Velvet</h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-16 h-16 rounded-full bg-[#FF4500] flex items-center justify-center text-white shadow-2xl shadow-[#FF4500]/40"
                  >
                    <Heart size={28} fill="currentColor" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Decorative Floating Elements */}
            <motion.div
              animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute -top-12 -left-12 w-32 h-32 bg-[#008080]/20 blur-3xl rounded-full"
            />
            <motion.div
              animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#FFD700]/20 blur-3xl rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Discover Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[11px] font-black text-[#111111]/30 uppercase tracking-[0.4em]">Explore Gujarat</span>
        <div className="w-[2px] h-16 bg-gradient-to-b from-[#FF4500] via-[#FFD700] to-transparent rounded-full" />
      </motion.div>
    </section>
  );
}
