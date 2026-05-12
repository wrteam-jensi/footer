'use client';

import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, ShoppingBag } from 'lucide-react';

const links = [
  { label: 'Shop', href: '#experience' },
  { label: 'Customize', href: '#customizer' },
  { label: 'About', href: '#vision' },
  { label: 'Contact', href: '#connect' },
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
          scrolled
            ? 'py-3 bg-white/90 backdrop-blur-xl border-b border-stone-100 shadow-sm shadow-stone-100'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-200">
              <span className="text-xl leading-none">🩴</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[22px] font-black tracking-tight text-zinc-900">VELURA</span>
              <span className="text-[9px] font-mono text-violet-500 tracking-[0.35em] -mt-0.5">CUSTOM SLIPPERS</span>
            </div>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-semibold text-stone-500 hover:text-zinc-900 transition-colors relative group"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-violet-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border border-stone-200 text-stone-500 hover:border-stone-300 hover:text-zinc-900 transition-all">
              <ShoppingBag size={15} />
              <span className="text-xs font-bold">0</span>
            </button>
            <motion.a
              href="#customizer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="hidden sm:block px-5 py-2.5 rounded-full bg-zinc-900 text-white text-xs font-black tracking-wider hover:bg-violet-600 transition-colors shadow-lg shadow-stone-200"
            >
              Design Now
            </motion.a>
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <motion.div
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="fixed top-[64px] inset-x-0 z-40 overflow-hidden bg-white border-b border-stone-100 shadow-xl shadow-stone-100"
      >
        <div className="px-6 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-base font-bold text-stone-600 hover:text-zinc-900 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#customizer"
            onClick={() => setOpen(false)}
            className="mt-2 py-3 rounded-2xl bg-zinc-900 text-white font-black text-sm tracking-wider text-center hover:bg-violet-600 transition-colors"
          >
            Design Now
          </a>
        </div>
      </motion.div>
    </>
  );
}
