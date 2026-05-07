'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#ff3e00_0%,transparent_50%)] blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,#00e5ff_0%,transparent_50%)] blur-[120px]" />
      </div>

      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-gradient leading-tight">
            FUTURE <br /> OF WEB
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-xl mx-auto mb-10 font-medium">
            Immersive 3D experiences that blur the line between reality and the digital realm.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="flex gap-4 justify-center"
        >
          <button className="px-8 py-4 rounded-full accent-gradient text-white font-bold hover:scale-105 transition-transform">
            EXPLORE NOW
          </button>
          <button className="px-8 py-4 rounded-full glass text-white font-bold hover:bg-white/10 transition-colors">
            OUR STORY
          </button>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-neutral-500"
      >
        <ArrowDown size={32} />
      </motion.div>
    </div>
  );
}
