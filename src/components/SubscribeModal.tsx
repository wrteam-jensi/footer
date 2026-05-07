'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscribeModal({ isOpen, onClose }: SubscribeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container with Perspective */}
          <div className="relative w-full max-w-lg" style={{ perspective: '2000px' }}>
            <motion.div
              initial={{ 
                opacity: 0, 
                rotateX: -20, 
                rotateY: 30, 
                z: -500,
                scale: 0.8
              }}
              animate={{ 
                opacity: 1, 
                rotateX: 0, 
                rotateY: 0, 
                z: 0,
                scale: 1
              }}
              exit={{ 
                opacity: 0, 
                rotateX: 20, 
                rotateY: -30, 
                z: -500,
                scale: 0.8
              }}
              transition={{ 
                type: 'spring', 
                damping: 25, 
                stiffness: 150,
                duration: 0.5 
              }}
              className="bg-[#111] border border-white/10 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[60px] rounded-full -mr-10 -mt-10" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 blur-[60px] rounded-full -ml-10 -mb-10" />

              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors"
                data-cursor-hover
              >
                <X size={24} />
              </button>

              <div className="relative space-y-6">
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                    Join the Inner Circle
                  </h3>
                  <p className="text-neutral-400 mt-2">
                    Get early access to drops and exclusive content delivered to your inbox.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-neutral-500">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                  </div>
                  
                  <button 
                    className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-cyan-400 transition-all duration-300 transform active:scale-95"
                    data-cursor-hover
                  >
                    SUBSCRIBE NOW
                  </button>
                </div>

                <p className="text-[10px] text-neutral-600 font-mono uppercase text-center">
                  By subscribing, you agree to our Terms and Privacy Policy.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
