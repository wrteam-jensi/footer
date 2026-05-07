'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, Variants } from 'framer-motion';
import { 

  ArrowUpRight, 
  Mail,
  Zap,
  Globe,
  Shield
} from 'lucide-react';
import SubscribeModal from '../SubscribeModal';

// --- Types ---
interface TiltStyle {
  rotateX: number;
  rotateY: number;
}

// --- Helper Components ---

const TiltCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<TiltStyle>({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ 
        rotateX: tilt.rotateX, 
        rotateY: tilt.rotateY,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      }}
      style={{ 
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      className={`relative rounded-3xl p-8 bg-neutral-900/40 border border-white/5 backdrop-blur-xl shadow-2xl transition-shadow hover:shadow-cyan-500/10 will-change-transform ${className}`}
    >
      <div style={{ transform: 'translateZ(60px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </motion.div>
  );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-500 mb-8 flex items-center gap-2">
    <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
    {children}
  </h3>
);

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <motion.a
    href={href}
    whileHover={{ x: 5, color: '#fff' }}
    className="block text-neutral-400 font-medium text-lg transition-colors duration-300 group flex items-center gap-2"
  >
    {children}
    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
  </motion.a>
);

// --- Main Footer Component ---

export default function Footer3D() {
  const footerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(footerRef, { once: false, amount: 0.1 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"]
  });

  // More dramatic scroll transformations
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [45, 0]);
  const z = useTransform(scrollYProgress, [0, 1], [-200, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      rotateX: -90, // Flip from bottom
      y: 150,
      z: -300
    },
    visible: { 
      opacity: 1, 
      rotateX: 0, 
      y: 0, 
      z: 0,
      transition: { 
        type: 'spring', 
        damping: 18, 
        stiffness: 80 
      }
    },
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      ref={footerRef}
      className="relative w-full overflow-hidden bg-black py-24 px-6 lg:px-20 mt-32"
      style={{ perspective: '2000px' }}
    >
      {/* Background Parallax & Glow */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none will-change-transform"
      >
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-cyan-500/10 blur-[180px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-purple-500/10 blur-[180px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '60px 60px' }} />
      </motion.div>

      <SubscribeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        style={{ rotateX, z, opacity }}
        className="relative z-10 max-w-7xl mx-auto"
      >
        {/* Scroll Progress Indicator for Footer */}
        <div className="flex justify-center mb-16">
          <motion.div 
            className="h-1 bg-white/10 w-24 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
          >
            <motion.div 
              className="h-full bg-cyan-500"
              style={{ scaleX: scrollYProgress, originX: 0 }}
            />
          </motion.div>
        </div>

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          
          {/* Brand Section */}
          <motion.div variants={itemVariants}>
            <TiltCard className="h-full group">
              <div className="space-y-6">
                <div className="text-3xl font-black tracking-tighter text-white flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="fill-cyan-500 text-cyan-500" />
                  </motion.div>
                  BEYOND
                </div>
                <p className="text-neutral-400 leading-relaxed font-medium">
                  Pushing the boundaries of digital spatial interaction. Experience the next generation of web interfaces.
                </p>
                <div className="flex gap-4 pt-4">
                  {['TW', 'IG', 'LI', 'BE'].map(social => (
                    <motion.div
                      key={social}
                      whileHover={{ y: -5, scale: 1.1 }}
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-neutral-500 hover:text-cyan-500 hover:border-cyan-500/50 cursor-pointer transition-colors"
                    >
                      {social}
                    </motion.div>
                  ))}
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Navigation Links */}
          <motion.div variants={itemVariants}>
            <TiltCard className="h-full">
              <SectionTitle>Experience</SectionTitle>
              <nav className="space-y-4">
                <FooterLink href="#">3D Showroom</FooterLink>
                <FooterLink href="#">Virtual Reality</FooterLink>
                <FooterLink href="#">Augmented Assets</FooterLink>
                <FooterLink href="#">Metaverse Kit</FooterLink>
                <FooterLink href="#">Spatial Lab</FooterLink>
              </nav>
            </TiltCard>
          </motion.div>

          {/* Support Section */}
          <motion.div variants={itemVariants}>
            <TiltCard className="h-full">
              <SectionTitle>Company</SectionTitle>
              <nav className="space-y-4">
                <FooterLink href="#">Our Vision</FooterLink>
                <FooterLink href="#">Open Source</FooterLink>
                <FooterLink href="#">Brand Kit</FooterLink>
                <FooterLink href="#">Contact Hub</FooterLink>
                <FooterLink href="#">Legal Nodes</FooterLink>
              </nav>
            </TiltCard>
          </motion.div>

          {/* Newsletter Section */}
          <motion.div variants={itemVariants}>
            <TiltCard className="h-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-white/20">
              <SectionTitle>Neural Network</SectionTitle>
              <div className="space-y-6">
                <p className="text-neutral-300 font-medium">
                  Sync with our latest drops. Join the elite network of 15k+ pioneers.
                </p>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-cyan-500 transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Enter frequency..." 
                    className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
                  />
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-cyan-500 transition-all active:scale-95 flex items-center justify-center gap-2 group overflow-hidden relative"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    CONNECT <ArrowUpRight size={18} className="translate-y-1 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                  <motion.div 
                    className="absolute inset-0 bg-cyan-400"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '0%' }}
                    transition={{ duration: 0.3 }}
                  />
                </button>
              </div>
            </TiltCard>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          variants={itemVariants}
          className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12"
        >
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-10">
            <div className="flex items-center gap-3 text-neutral-500 text-[10px] font-mono tracking-widest uppercase">
              <Globe size={14} className="text-cyan-500" />
              NEURAL_NODE / TOKYO
            </div>
            <div className="flex items-center gap-3 text-neutral-500 text-[10px] font-mono tracking-widest uppercase">
              <Shield size={14} className="text-cyan-500" />
              AES_256 SECURED
            </div>
            <motion.div 
              whileHover={{ rotate: 180 }}
              onClick={scrollToTop}
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group cursor-pointer hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-colors"
            >
              <ArrowUpRight size={20} className="-rotate-45 group-hover:text-cyan-500 transition-colors" />
            </motion.div>
          </div>

          <div className="text-neutral-500 text-[10px] font-mono uppercase tracking-[0.2em] text-center md:text-right leading-loose">
            © 2026 BEYOND DIGITAL GENESIS. <br />
            <span className="text-neutral-700 mt-2 block hover:text-cyan-500 transition-colors cursor-crosshair">
              LATENCY: 12ms / STATUS: NOMINAL
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Extreme Depth Decor */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[1000px] h-[1000px] border border-white/5 rounded-full pointer-events-none opacity-20" />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] border border-white/5 rounded-full pointer-events-none opacity-20" />
    </footer>
  );
}

