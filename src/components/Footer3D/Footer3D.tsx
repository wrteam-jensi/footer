'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowUpRight, Mail, Globe, Shield } from 'lucide-react';
import SubscribeModal from '../SubscribeModal';

const NAV_COLS = [
  {
    title: 'Shop',
    links: ['All Slippers', 'Custom Design', 'Gift Cards', 'New Arrivals', 'Sale'],
  },
  {
    title: 'Help',
    links: ['Size Guide', 'Shipping Info', 'Returns', 'FAQ', 'Contact Us'],
  },
];

export default function Footer3D() {
  const footerRef = useRef<HTMLDivElement>(null);
  const isInView  = useInView(footerRef, { once: false, amount: 0.1 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { scrollYProgress } = useScroll({ target: footerRef, offset: ['start end', 'end end'] });
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const y       = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <footer ref={footerRef} className="relative w-full overflow-hidden py-20 px-6 lg:px-16"
      style={{ background: '#111111' }}>

      {/* Subtle warm glow */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[300px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(196,149,106,0.06) 0%, transparent 70%)' }} />

      <SubscribeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <motion.div
        style={{ opacity, y }}
        animate={isInView ? {} : {}}
        className="relative z-10 max-w-7xl mx-auto"
      >
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}>

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                style={{ background: 'rgba(196,149,106,0.15)' }}>
                🩴
              </div>
              <span className="text-lg font-bold text-white">Velura</span>
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-[220px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Handcrafted custom slippers — designed by you, built for your feet.
            </p>
            <div className="flex gap-2">
              {['IG', 'TW', 'PI', 'TK'].map((s) => (
                <button key={s}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#C4956A'; e.currentTarget.style.borderColor = 'rgba(196,149,106,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Nav cols */}
          {NAV_COLS.map((col) => (
            <div key={col.title}>
              <p className="text-[10px] font-mono tracking-[0.3em] mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {col.title.toUpperCase()}
              </p>
              <nav className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <a key={link} href="#"
                    className="text-sm transition-colors flex items-center gap-1 group"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                  >
                    {link}
                    <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </nav>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <p className="text-[10px] font-mono tracking-[0.3em] mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>
              GET 10% OFF
            </p>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Join 12k+ customers and get exclusive drops and your first discount.
            </p>
            <div className="relative mb-3">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
              <input type="email" placeholder="your@email.com"
                className="w-full text-sm py-3 pl-9 pr-3 rounded-xl outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'white' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(196,149,106,0.5)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: '#C4956A' }}
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            <span className="flex items-center gap-2 text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
              <Globe size={12} /> Worldwide Shipping
            </span>
            <span className="flex items-center gap-2 text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
              <Shield size={12} /> Secure Checkout
            </span>
          </div>

          <div className="flex items-center gap-6">
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
              © 2026 Velura. All rights reserved.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
            >
              <ArrowUpRight size={13} className="-rotate-45" />
            </button>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
