'use client';

import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, ShoppingBag, Zap } from 'lucide-react';

const links = [
  { label: 'Shop',      href: '#experience' },
  { label: 'Customize', href: '#customizer' },
  { label: 'About',     href: '#vision' },
  { label: 'Contact',   href: '#connect' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 40));

  return (
    <>
      <motion.nav
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
        style={scrolled ? {
          background: 'rgba(250,250,248,0.88)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
        } : {
          background: 'transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ scale: 1.08, rotate: -5 }}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-sm"
              style={{ background: 'var(--accent-light)', border: '1px solid rgba(196,149,106,0.2)' }}
            >
              🩴
            </motion.div>
            <div>
              <span className="text-lg font-bold tracking-tight block leading-none" style={{ color: 'var(--text)' }}>
                Mojdi
              </span>
              <span className="text-[8px] font-mono tracking-[0.3em] leading-none" style={{ color: 'var(--accent)' }}>
                GUJARATI ARTISANAL LUXURY
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {links.map((l) => (
              <a key={l.label} href={l.href}
                className="relative text-sm font-medium transition-colors group"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                  style={{ background: 'var(--accent)' }} />
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5"
              style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.6)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text-muted)'; e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <ShoppingBag size={14} />
              <span className="text-xs font-semibold">0</span>
            </button>

            <motion.a
              href="#customizer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: 'var(--text)', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-dark)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--text)')}
            >
              <Zap size={13} className="fill-current" />
              Design now
            </motion.a>

            <button
              onClick={() => setOpen(!open)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
              style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.6)' }}
            >
              {open ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <motion.div
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
        className="fixed top-16 inset-x-0 z-40 overflow-hidden border-b"
        style={{ background: 'rgba(250,250,248,0.97)', backdropFilter: 'blur(16px)', borderColor: 'var(--border)' }}
      >
        <div className="px-6 py-5 flex flex-col gap-4">
          {links.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
              className="text-base font-medium py-1 transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              {l.label}
            </a>
          ))}
          <a href="#customizer" onClick={() => setOpen(false)}
            className="mt-1 py-3 rounded-xl text-white text-sm font-semibold text-center"
            style={{ background: 'var(--text)' }}>
            Design yours
          </a>
        </div>
      </motion.div>
    </>
  );
}
