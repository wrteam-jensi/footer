'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUp, Mail, Globe, Shield, Share2, MessageCircle, Play } from 'lucide-react';
import SubscribeModal from '../SubscribeModal';

const SHOP_LINKS   = ['All Slippers', 'Custom Design', 'Gift Cards', 'New Arrivals', 'Sale'];
const HELP_LINKS   = ['Size Guide', 'Shipping Info', 'Returns & Refunds', 'FAQ', 'Contact Us'];
const POLICY_LINKS = ['Privacy Policy', 'Terms of Use', 'Cookie Policy'];

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <p className="text-[10px] font-mono tracking-[0.35em] mb-5 uppercase"
        style={{ color: 'rgba(255,255,255,0.28)' }}>
        {title}
      </p>
      <nav className="flex flex-col gap-2.5">
        {links.map((l) => (
          <a key={l} href="#"
            className="text-sm group flex items-center gap-1 transition-colors w-fit"
            style={{ color: 'rgba(255,255,255,0.42)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.42)')}
          >
            <span className="h-px w-0 group-hover:w-3 transition-all duration-200 mr-0 group-hover:mr-1"
              style={{ background: '#C4956A', display: 'inline-block' }} />
            {l}
          </a>
        ))}
      </nav>
    </div>
  );
}

export default function Footer3D() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <footer ref={ref} className="relative w-full overflow-hidden"
      style={{ background: 'var(--bg-dark)' }}>

      {/* Ambient top glow */}
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(196,149,106,0.3), transparent)' }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(196,149,106,0.06) 0%, transparent 70%)' }} />
      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }} />

      <SubscribeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {/* ── Top CTA strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 border-b px-6 lg:px-16 py-14"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-mono tracking-[0.35em] mb-3" style={{ color: 'var(--accent)' }}>
              NEVER MISS A DROP
            </p>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
              Join 12,000+ Velura<br />
              <span style={{ color: 'var(--accent)' }}>customers.</span>
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto lg:min-w-[380px]">
            <div className="flex-1 relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'rgba(255,255,255,0.3)' }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full py-3.5 pl-10 pr-4 rounded-xl text-sm text-white outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(196,149,106,0.5)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="px-6 py-3.5 rounded-xl text-sm font-semibold text-white whitespace-nowrap transition-opacity hover:opacity-85"
              style={{ background: '#C4956A' }}
            >
              Get 10% off →
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Main footer grid ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}>

          {/* Brand col */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: 'rgba(196,149,106,0.15)', border: '1px solid rgba(196,149,106,0.2)' }}>
                🩴
              </div>
              <div>
                <span className="text-lg font-bold text-white block leading-none">Velura</span>
                <span className="text-[9px] font-mono tracking-[0.3em]" style={{ color: 'rgba(196,149,106,0.7)' }}>
                  CUSTOM SLIPPERS
                </span>
              </div>
            </div>

            <p className="text-sm leading-relaxed mb-7 max-w-[240px]"
              style={{ color: 'rgba(255,255,255,0.38)' }}>
              Handcrafted, made-to-order slippers designed entirely by you — from colour to comfort.
            </p>

            {/* Socials */}
            <div className="flex gap-2">
              {[
                { icon: Share2,         label: 'IG' },
                { icon: MessageCircle, label: 'TW' },
                { icon: Play,          label: 'YT' },
              ].map(({ icon: Icon, label }) => (
                <button key={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-0.5"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.38)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#C4956A'; e.currentTarget.style.borderColor = 'rgba(196,149,106,0.25)'; e.currentTarget.style.background = 'rgba(196,149,106,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.38)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {/* Link cols */}
          <FooterCol title="Shop"   links={SHOP_LINKS} />
          <FooterCol title="Help"   links={HELP_LINKS} />

          {/* Trust badges col */}
          <div>
            <p className="text-[10px] font-mono tracking-[0.35em] mb-5 uppercase"
              style={{ color: 'rgba(255,255,255,0.28)' }}>
              Our Promise
            </p>
            <div className="flex flex-col gap-3">
              {[
                { icon: '🔒', label: 'Secure Payments' },
                { icon: '🚚', label: 'Free Shipping ₹999+' },
                { icon: '↩️', label: '30-day Returns' },
                { icon: '🤝', label: '100% Handmade' },
                { icon: '⭐', label: '4.9★ Rated' },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-2.5">
                  <span className="text-sm">{t.icon}</span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.42)' }}>{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-5">
          <div className="flex flex-wrap items-center gap-5 justify-center md:justify-start">
            <span className="flex items-center gap-1.5 text-[11px]" style={{ color: 'rgba(255,255,255,0.22)' }}>
              <Globe size={11} /> Worldwide Shipping
            </span>
            <span className="flex items-center gap-1.5 text-[11px]" style={{ color: 'rgba(255,255,255,0.22)' }}>
              <Shield size={11} /> SSL Secured
            </span>
            <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.22)' }}>
              🇮🇳 Made in India
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* Policy links */}
            <div className="hidden md:flex items-center gap-4">
              {POLICY_LINKS.map((l) => (
                <a key={l} href="#" className="text-[10px] transition-colors"
                  style={{ color: 'rgba(255,255,255,0.2)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
                >
                  {l}
                </a>
              ))}
            </div>

            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.18)' }}>
              © 2026 Velura
            </p>

            {/* Scroll to top */}
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={{ background: 'rgba(196,149,106,0.12)', border: '1px solid rgba(196,149,106,0.2)', color: '#C4956A' }}
            >
              <ArrowUp size={14} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
