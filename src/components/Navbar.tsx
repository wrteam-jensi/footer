'use client';

import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, ShoppingBag } from 'lucide-react';

const links = [
  { label: 'Shop',      href: '#experience' },
  { label: 'Customize', href: '#customizer' },
  { label: 'About',     href: '#vision' },
  { label: 'Contact',   href: '#connect' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const { scrollY }             = useScroll();

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 40));

  return (
    <>
      <motion.nav
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-400 ${
          scrolled ? 'bg-white/95 backdrop-blur-md border-b shadow-sm' : 'bg-transparent'
        }`}
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
              style={{ background: 'var(--accent-light)' }}>
              🩴
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
              Velura
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a key={l.label} href={l.href}
                className="text-sm font-medium transition-colors hover:opacity-100"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--text-muted)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <ShoppingBag size={15} /> <span>0</span>
            </button>

            <a href="#customizer"
              className="hidden sm:block px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--text)' }}>
              Design yours
            </a>

            <button
              onClick={() => setOpen(!open)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            >
              {open ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <motion.div
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="fixed top-16 inset-x-0 z-40 overflow-hidden bg-white border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="px-6 py-5 flex flex-col gap-4">
          {links.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
              className="text-base font-medium py-1" style={{ color: 'var(--text-muted)' }}>
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
