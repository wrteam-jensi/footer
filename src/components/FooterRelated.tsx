'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, Star } from 'lucide-react';

const items = [
  { id: 1, name: 'Cloud Slide',    category: 'Open-toe · Memory Foam', price: '₹1,299', rating: 4.9, reviews: 348, badge: 'Best Seller' },
  { id: 2, name: 'Winter Bootie',  category: 'Closed · Wool Lined',    price: '₹1,799', rating: 4.8, reviews: 214, badge: 'New' },
  { id: 3, name: 'Velvet Mule',    category: 'Open-heel · Velvet',     price: '₹1,499', rating: 4.9, reviews: 527, badge: 'Popular' },
  { id: 4, name: 'Kids Puffy',     category: 'Kids · Cotton',          price: '₹999',   rating: 5.0, reviews: 189, badge: 'Gift Idea' },
];

export default function FooterRelated() {
  return (
    <section className="w-full py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-xs font-mono tracking-[0.35em] mb-2" style={{ color: 'var(--accent)' }}>COLLECTION</p>
            <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>Ready to ship</h2>
          </div>
          <button className="flex items-center gap-1.5 text-sm font-medium transition-colors group"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            View all <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="rounded-2xl border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white"
                style={{ borderColor: 'var(--border)' }}>

                {/* Visual */}
                <div className="h-44 flex items-center justify-center relative"
                  style={{ background: 'var(--accent-light)' }}>
                  <span className="text-6xl" style={{ filter: 'drop-shadow(0 8px 16px rgba(196,149,106,0.3))' }}>🩴</span>
                  <span className="absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: 'white', color: 'var(--accent)', border: '1px solid var(--border)' }}>
                    {item.badge}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-[10px] font-mono mb-1" style={{ color: 'var(--text-muted)' }}>{item.category}</p>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>{item.name}</h3>

                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} fill={i < Math.floor(item.rating) ? '#C4956A' : '#E5E0D8'} color="transparent" />
                      ))}
                    </div>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{item.rating} ({item.reviews})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold" style={{ color: 'var(--text)' }}>{item.price}</span>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-80"
                      style={{ background: 'var(--text)' }}>
                      <ShoppingBag size={11} /> Add
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
