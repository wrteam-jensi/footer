'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const relatedItems = [
  {
    id: 1,
    title: "Quantum Watch",
    category: "Accessories",
    price: "$299",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
    gradient: "from-blue-500/20 to-purple-500/20"
  },
  {
    id: 2,
    title: "Neural Buds",
    category: "Audio",
    price: "$199",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    gradient: "from-cyan-500/20 to-emerald-500/20"
  },
  {
    id: 3,
    title: "Void Speaker",
    category: "Home",
    price: "$450",
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=800&auto=format&fit=crop",
    gradient: "from-purple-500/20 to-pink-500/20"
  },
  {
    id: 4,
    title: "Aura Ring",
    category: "Wearables",
    price: "$320",
    image: "https://images.unsplash.com/photo-1584917469223-960fdec43bdf?q=80&w=800&auto=format&fit=crop",
    gradient: "from-orange-500/20 to-red-500/20"
  }
];

export default function FooterRelated() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
      <div className="flex justify-between items-end mb-12">
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-[0.4em] text-cyan-500">Curated For You</h4>
          <h2 className="text-3xl md:text-4xl font-black text-white">READY TO GO BEYOND?</h2>
        </div>
        <button className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group">
          VIEW ALL PRODUCTS <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 50, rotateX: 20 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.8 }}
            className="group relative"
            style={{ perspective: '1000px' }}
          >
            <div className={`relative h-96 rounded-3xl overflow-hidden border border-white/5 bg-neutral-900/40 backdrop-blur-xl transition-all duration-500 group-hover:border-cyan-500/30 group-hover:translate-y-[-10px] group-hover:shadow-[0_20px_50px_rgba(6,182,212,0.15)]`}>
              {/* Image Container */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10`} />
                <div className="relative z-20 space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">{item.category}</span>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <span className="text-neutral-400 font-medium">{item.price}</span>
                    <button className="p-2 bg-white text-black rounded-full hover:bg-cyan-400 transition-colors">
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Placeholder (since I can't guarantee images load fast, I'll use a gradient + visual artifact) */}
              <div className={`absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity bg-gradient-to-br ${item.gradient}`} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                <span className="text-neutral-500 font-mono text-[8px] rotate-90">{item.title.toUpperCase()} CODE_0{item.id}_V2</span>
              </div>
            </div>
            
            {/* 3D Reflection Effect */}
            <div className="absolute -bottom-4 inset-x-8 h-8 bg-cyan-500/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
