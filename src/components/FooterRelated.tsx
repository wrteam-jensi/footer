'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, Star } from 'lucide-react';

const items = [
  { id: 1, name: 'Cloud Slide',   category: 'Open-toe · Memory Foam', price: '₹1,299', rating: 4.9, reviews: 348, badge: 'Best Seller', emoji: '☁️' },
  { id: 2, name: 'Winter Bootie', category: 'Closed · Wool Lined',    price: '₹1,799', rating: 4.8, reviews: 214, badge: 'New',         emoji: '🧣' },
  { id: 3, name: 'Velvet Mule',   category: 'Open-heel · Velvet',     price: '₹1,499', rating: 4.9, reviews: 527, badge: 'Popular',     emoji: '✨' },
  { id: 4, name: 'Kids Puffy',    category: 'Kids · Cotton',          price: '₹999',   rating: 5.0, reviews: 189, badge: 'Gift Idea',   emoji: '🌈' },
];

function ProductCard({ item, index }: { item: typeof items[0]; index: number }) {
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setRot({
      x: -((e.clientY - r.top)  / r.height - 0.5) * 10,
      y:  ((e.clientX - r.left) / r.width  - 0.5) * 10,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => setRot({ x: 0, y: 0 })}
        animate={{ rotateX: rot.x, rotateY: rot.y }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        style={{ transformStyle: 'preserve-3d', perspective: '800px' }}
        className="h-full"
      >
        <div className="h-full rounded-2xl border overflow-hidden bg-white transition-all duration-300 group"
          style={{
            borderColor: 'var(--border)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 16px 48px rgba(196,149,106,0.18), 0 4px 16px rgba(0,0,0,0.08)')}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)')}
        >
          {/* Image area */}
          <div className="relative h-52 flex items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(145deg, var(--accent-light) 0%, #EDE3D9 100%)' }}>

            {/* Subtle background circle */}
            <div className="absolute w-40 h-40 rounded-full opacity-30"
              style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }} />

            <motion.span
              whileHover={{ scale: 1.15, rotate: -6 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="text-[5.5rem] select-none relative z-10"
              style={{ filter: 'drop-shadow(0 12px 24px rgba(196,149,106,0.4))' }}
            >
              🩴
            </motion.span>

            {/* Badge */}
            <span className="absolute top-3.5 left-3.5 text-[10px] font-semibold px-3 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.92)', color: 'var(--accent)', border: '1px solid var(--border)', backdropFilter: 'blur(8px)' }}>
              {item.badge}
            </span>

            {/* Emoji */}
            <span className="absolute bottom-3.5 right-3.5 text-xl">{item.emoji}</span>
          </div>

          {/* Info */}
          <div className="p-5">
            <p className="text-[10px] font-mono mb-1.5" style={{ color: 'var(--text-muted)' }}>{item.category}</p>
            <h3 className="text-sm font-semibold mb-2.5" style={{ color: 'var(--text)' }}>{item.name}</h3>

            <div className="flex items-center gap-1.5 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} fill={i < Math.floor(item.rating) ? '#C4956A' : '#E5E0D8'} color="transparent" />
                ))}
              </div>
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                {item.rating} ({item.reviews})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>{item.price}</span>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all"
                style={{ background: 'var(--text)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-dark)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--text)')}
              >
                <ShoppingBag size={12} /> Add
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FooterRelated() {
  return (
    <section className="w-full py-24" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-xs font-mono tracking-[0.4em] mb-2.5" style={{ color: 'var(--accent)' }}>COLLECTION</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
              Ready to ship
            </h2>
          </div>
          <button
            className="flex items-center gap-1.5 text-sm font-medium group"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            View all
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item, i) => (
            <ProductCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
