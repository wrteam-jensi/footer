'use client';

import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Zap, Menu, X } from 'lucide-react';

const links = [
  { label: 'EXPERIENCE', href: '#experience' },
  { label: 'SHOWCASE', href: '#customizer' },
  { label: 'VISION', href: '#vision' },
  { label: 'CONNECT', href: '#connect' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 50));

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-3 bg-black/75 backdrop-blur-xl border-b border-white/5' : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="w-7 h-7 rounded-lg bg-cyan-500 flex items-center justify-center"
            >
              <Zap size={14} className="text-black fill-black" />
            </motion.div>
            <span className="text-lg font-black tracking-tighter text-white">BEYOND</span>
          </a>

          <div className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="relative text-[11px] font-black tracking-[0.18em] text-neutral-500 hover:text-white transition-colors group"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-cyan-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <motion.a
              href="#connect"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="hidden sm:block px-5 py-2 rounded-full bg-white text-black text-[10px] font-black tracking-widest hover:bg-cyan-400 transition-colors"
            >
              GET STARTED
            </motion.a>
            <button className="md:hidden text-neutral-400" onClick={() => setOpen(!open)}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <motion.div
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="fixed top-[56px] inset-x-0 z-40 overflow-hidden bg-black/95 backdrop-blur-xl border-b border-white/5"
      >
        <div className="px-6 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
              className="text-base font-black tracking-widest text-neutral-400 hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
        </div>
      </motion.div>
    </>
  );
}
