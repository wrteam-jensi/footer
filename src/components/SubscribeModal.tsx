'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface Props { isOpen: boolean; onClose: () => void; }

export default function SubscribeModal({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border"
            style={{ borderColor: 'var(--border)' }}
          >
            <button onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: 'var(--text-muted)', background: 'var(--bg)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-alt)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg)')}
            >
              <X size={15} />
            </button>

            <div className="mb-6">
              <div className="text-2xl mb-1">🩴</div>
              <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>
                Get 10% off your first pair
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Join 12,000+ customers and get exclusive drops delivered to your inbox.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Email address
                </label>
                <input type="email" placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ border: '1.5px solid var(--border)', color: 'var(--text)' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
              </div>
              <button className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--text)' }}>
                Subscribe — get 10% off
              </button>
            </div>

            <p className="text-[10px] text-center mt-4" style={{ color: 'var(--border)' }}>
              No spam. Unsubscribe anytime. By subscribing you agree to our Privacy Policy.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
