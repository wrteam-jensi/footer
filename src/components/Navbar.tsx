'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-40 p-6 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-white/5"
    >
      <div className="text-xl font-black tracking-tighter" data-cursor-hover>BEYOND</div>
      <div className="hidden md:flex gap-8 text-sm font-bold tracking-widest uppercase">
        <a href="#" className="hover:text-cyan-400 transition-colors" data-cursor-hover>Vision</a>
        <a href="#" className="hover:text-cyan-400 transition-colors" data-cursor-hover>Reality</a>
        <a href="#" className="hover:text-cyan-400 transition-colors" data-cursor-hover>Future</a>
      </div>
      <button 
        className="px-6 py-2 rounded-full border border-white/10 hover:bg-white text-black hover:text-black transition-all bg-white font-bold text-xs uppercase tracking-widest"
        data-cursor-hover
      >
        Connect
      </button>
    </motion.nav>
  );
}
