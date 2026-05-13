'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, Variants } from 'framer-motion';
import { ArrowUpRight, Mail, Globe, Shield } from 'lucide-react';
import SubscribeModal from '../SubscribeModal';

interface TiltStyle { rotateX: number; rotateY: number; }

const TiltCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<TiltStyle>({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const rotateX = ((e.clientY - rect.top) - rect.height / 2) / 12;
    const rotateY = (rect.width / 2 - (e.clientX - rect.left)) / 12;
    setTilt({ rotateX, rotateY });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ rotateX: 0, rotateY: 0 })}
      animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
      className={`relative rounded-3xl p-7 bg-white/5 border border-white/8 backdrop-blur-xl shadow-xl will-change-transform ${className}`}
    >
      <div style={{ transform: 'translateZ(50px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </motion.div>
  );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-[10px] font-mono uppercase tracking-[0.35em] text-stone-500 mb-6 flex items-center gap-2">
    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
    {children}
  </h3>
);

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <motion.a
    href={href}
    whileHover={{ x: 4, color: '#fff' }}
    className="flex items-center gap-1.5 text-stone-400 font-medium text-base transition-colors duration-200 group"
  >
    {children}
    <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
  </motion.a>
);

export default function Footer3D() {
  const footerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(footerRef, { once: false, amount: 0.1 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { scrollYProgress } = useScroll({ target: footerRef, offset: ['start end', 'end end'] });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const rotateX    = useTransform(scrollYProgress, [0, 1], [30, 0]);
  const z          = useTransform(scrollYProgress, [0, 1], [-150, 0]);
  const opacity    = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, rotateX: -60, y: 100, z: -200 },
    visible: { opacity: 1, rotateX: 0, y: 0, z: 0, transition: { type: 'spring', damping: 20, stiffness: 90 } },
  };

  return (
    <footer
      ref={footerRef}
      className="relative w-full overflow-hidden bg-[#1c1917] py-24 px-6 lg:px-20 mt-20"
      style={{ perspective: '2000px' }}
    >
      {/* Ambient glows */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 pointer-events-none will-change-transform">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-500/8 blur-[160px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-amber-500/6 blur-[140px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '56px 56px' }} />
      </motion.div>

      <SubscribeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        style={{ rotateX, z, opacity }}
        className="relative z-10 max-w-7xl mx-auto"
      >
        {/* Progress line */}
        <div className="flex justify-center mb-14">
          <motion.div className="h-px bg-white/8 w-24 rounded-full overflow-hidden" initial={{ width: 0 }} whileInView={{ width: 96 }}>
            <motion.div className="h-full bg-violet-400" style={{ scaleX: scrollYProgress, originX: 0 }} />
          </motion.div>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">

          {/* Brand */}
          <motion.div variants={itemVariants}>
            <TiltCard className="h-full">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-900/50">
                    <span className="text-xl leading-none">🩴</span>
                  </div>
                  <div>
                    <span className="text-xl font-black tracking-tight text-white block">VELURA</span>
                    <span className="text-[9px] font-mono text-violet-400 tracking-[0.3em]">CUSTOM SLIPPERS</span>
                  </div>
                </div>
                <p className="text-stone-400 leading-relaxed text-sm">
                  Handcrafted custom slippers — designed by you, built for your feet, delivered to your door.
                </p>
                <div className="flex gap-3 pt-2">
                  {['IG', 'TW', 'PI', 'TK'].map((s, i) => (
                    <motion.div key={i} whileHover={{ y: -4, scale: 1.1 }}
                      className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-[10px] font-bold text-stone-500 hover:text-violet-400 hover:border-violet-500/40 cursor-pointer transition-colors">
                      {s}
                    </motion.div>
                  ))}
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Shop */}
          <motion.div variants={itemVariants}>
            <TiltCard className="h-full">
              <SectionTitle>Shop</SectionTitle>
              <nav className="space-y-3.5">
                <FooterLink href="#">All Slippers</FooterLink>
                <FooterLink href="#">Custom Design</FooterLink>
                <FooterLink href="#">Gift Cards</FooterLink>
                <FooterLink href="#">New Arrivals</FooterLink>
                <FooterLink href="#">Sale</FooterLink>
              </nav>
            </TiltCard>
          </motion.div>

          {/* Help */}
          <motion.div variants={itemVariants}>
            <TiltCard className="h-full">
              <SectionTitle>Help</SectionTitle>
              <nav className="space-y-3.5">
                <FooterLink href="#">Size Guide</FooterLink>
                <FooterLink href="#">Shipping Info</FooterLink>
                <FooterLink href="#">Returns</FooterLink>
                <FooterLink href="#">FAQ</FooterLink>
                <FooterLink href="#">Contact Us</FooterLink>
              </nav>
            </TiltCard>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants}>
            <TiltCard className="h-full bg-linear-to-br from-violet-500/10 to-amber-500/8 border-violet-500/20">
              <SectionTitle>Get 10% Off</SectionTitle>
              <div className="space-y-5">
                <p className="text-stone-300 text-sm font-medium leading-relaxed">
                  Join 12k+ customers — get exclusive drops, design tips, and 10% off your first order.
                </p>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600 group-focus-within:text-violet-400 transition-colors" size={15} />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-3 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                  />
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-violet-600 text-white font-black py-3 rounded-xl hover:bg-violet-500 transition-all active:scale-95 flex items-center justify-center gap-2 text-xs tracking-wider shadow-lg shadow-violet-900/40"
                >
                  SUBSCRIBE <ArrowUpRight size={14} />
                </button>
              </div>
            </TiltCard>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          variants={itemVariants}
          className="pt-10 border-t border-white/6 flex flex-col md:flex-row justify-between items-center gap-8"
        >
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-8">
            <div className="flex items-center gap-2 text-stone-500 text-[10px] font-mono tracking-widest uppercase">
              <Globe size={12} className="text-violet-400" />
              Worldwide Shipping
            </div>
            <div className="flex items-center gap-2 text-stone-500 text-[10px] font-mono tracking-widest uppercase">
              <Shield size={12} className="text-violet-400" />
              Secure Checkout
            </div>
            <motion.div
              whileHover={{ rotate: 180 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group cursor-pointer hover:border-violet-500/40 hover:bg-violet-500/8 transition-colors"
            >
              <ArrowUpRight size={16} className="-rotate-45 text-stone-500 group-hover:text-violet-400 transition-colors" />
            </motion.div>
          </div>

          <div className="text-stone-600 text-[10px] font-mono uppercase tracking-[0.2em] text-center md:text-right leading-loose">
            © 2026 VELURA. All rights reserved.<br />
            <span className="text-stone-700">Handcrafted with love 🩴</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Depth decor rings */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[900px] h-[900px] border border-white/4 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[700px] h-[700px] border border-white/3 rounded-full pointer-events-none" />
    </footer>
  );
}
