'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, Star } from 'lucide-react';

const relatedItems = [
  {
    id: 1,
    title: 'Cloud Slide',
    category: 'Open-Toe · Memory Foam',
    price: '₹1,299',
    emoji: '☁️',
    rating: 4.9,
    reviews: 348,
    bg: 'from-violet-100 to-violet-50',
    accent: 'text-violet-600',
    badge: 'Best Seller',
    badgeColor: 'bg-violet-100 text-violet-600',
  },
  {
    id: 2,
    title: 'Winter Bootie',
    category: 'Closed · Wool Lined',
    price: '₹1,799',
    emoji: '🧣',
    rating: 4.8,
    reviews: 214,
    bg: 'from-amber-100 to-amber-50',
    accent: 'text-amber-600',
    badge: 'New',
    badgeColor: 'bg-amber-100 text-amber-600',
  },
  {
    id: 3,
    title: 'Velvet Mule',
    category: 'Open-Heel · Velvet',
    price: '₹1,499',
    emoji: '✨',
    rating: 4.9,
    reviews: 527,
    bg: 'from-rose-100 to-rose-50',
    accent: 'text-rose-600',
    badge: 'Popular',
    badgeColor: 'bg-rose-100 text-rose-600',
  },
  {
    id: 4,
    title: 'Kids Puffy',
    category: 'Closed · Cotton · Kids',
    price: '₹999',
    emoji: '🌈',
    rating: 5.0,
    reviews: 189,
    bg: 'from-sky-100 to-sky-50',
    accent: 'text-sky-600',
    badge: 'Gift Idea',
    badgeColor: 'bg-sky-100 text-sky-600',
  },
];

export default function FooterRelated() {
  return (
    <section className="w-full bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <p className="text-[10px] font-mono text-violet-500 tracking-[0.4em] uppercase">Ready to Ship</p>
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">OUR COLLECTION</h2>
          </div>
          <button className="flex items-center gap-2 text-stone-400 hover:text-zinc-900 transition-colors group text-sm font-bold">
            VIEW ALL
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {relatedItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="group relative"
            >
              <div className="relative rounded-3xl overflow-hidden border border-stone-100 bg-white hover:shadow-2xl hover:shadow-stone-200 hover:-translate-y-2 transition-all duration-500 cursor-pointer">
                {/* Product visual */}
                <div className={`h-52 flex items-center justify-center bg-linear-to-br ${item.bg} relative`}>
                  <motion.span
                    className="text-7xl"
                    whileHover={{ scale: 1.15, rotate: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    🩴
                  </motion.span>
                  {/* Badge */}
                  <div className={`absolute top-4 left-4 px-2.5 py-1 rounded-full text-[10px] font-black ${item.badgeColor}`}>
                    {item.badge}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <p className="text-[10px] font-mono text-stone-400 tracking-widest uppercase mb-1">{item.category}</p>
                  <h3 className="text-lg font-black text-zinc-900 mb-2">{item.title}</h3>

                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} className={i < Math.floor(item.rating) ? 'text-amber-400 fill-amber-400' : 'text-stone-200 fill-stone-200'} />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-stone-400">{item.rating} ({item.reviews})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-zinc-900">{item.price}</span>
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.94 }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 text-white text-xs font-black hover:bg-violet-600 transition-colors"
                    >
                      <ShoppingBag size={12} />
                      Add
                    </motion.button>
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
