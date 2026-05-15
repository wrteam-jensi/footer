'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

export default function CustomCursor() {
  const [hovered,  setHovered]  = useState(false);
  const [clicked,  setClicked]  = useState(false);
  const [visible,  setVisible]  = useState(false);
  const [darkBg,   setDarkBg]   = useState(false);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);

  // Outer ring — lazy follow
  const ringSpring = { damping: 24, stiffness: 150, mass: 0.8 };
  const rx = useSpring(mx, ringSpring);
  const ry = useSpring(my, ringSpring);

  // Inner point — faster
  const pointSpring = { damping: 30, stiffness: 350, mass: 0.4 };
  const px = useSpring(mx, pointSpring);
  const py = useSpring(my, pointSpring);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      if (!visible) setVisible(true);

      // Detect background brightness
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (el) {
        const bg = window.getComputedStyle(el).backgroundColor;
        // Check for dark backgrounds (var(--bg-dark) or similar)
        // rgb(12, 10, 9) is --bg-dark
        const isDark = bg.includes('rgb(12') || bg.includes('rgb(0') || bg.includes('rgb(17') || bg.includes('rgb(11') || bg === 'rgb(24, 24, 27)';
        setDarkBg(isDark);
        
        // Hide custom cursor and show default cursor in light sections
        // We use 'none' for dark sections where the custom cursor is active
        document.body.style.cursor = isDark ? 'none' : 'auto';
        
        // Also ensure links/buttons show default pointer in light sections
        const interactive = el.tagName === 'A' || el.tagName === 'BUTTON' || !!el.closest('a') || !!el.closest('button');
        if (!isDark && interactive) {
          document.body.style.cursor = 'pointer';
        }
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovered(
        t.tagName === 'A' || t.tagName === 'BUTTON' || t.tagName === 'INPUT' ||
        !!t.closest('a') || !!t.closest('button') || !!t.getAttribute('data-cursor-hover')
      );
    };

    const onDown  = () => setClicked(true);
    const onUp    = () => setClicked(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener('mousemove',    onMove);
    window.addEventListener('mouseover',    onOver);
    window.addEventListener('mousedown',    onDown);
    window.addEventListener('mouseup',      onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove',    onMove);
      window.removeEventListener('mouseover',    onOver);
      window.removeEventListener('mousedown',    onDown);
      window.removeEventListener('mouseup',      onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.body.style.cursor = 'auto';
    };
  }, [mx, my, visible]);

  // Design tokens
  const accent = darkBg ? 'rgba(245,237,227,1)' : '#C4956A';
  const ringColor = darkBg ? 'rgba(245,237,227,0.3)' : 'rgba(196,149,106,0.3)';

  return (
    <AnimatePresence>
      {/* Only show custom cursor in dark sections as requested */}
      {visible && darkBg && (
        <>
          {/* Outer Ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed top-0 left-0 pointer-events-none z-[9999]"
            style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%' }}
          >
            <motion.div
              className="rounded-full border flex items-center justify-center"
              animate={{
                width:  hovered ? 64 : clicked ? 24 : 40,
                height: hovered ? 64 : clicked ? 24 : 40,
                borderColor: hovered ? accent : ringColor,
                borderWidth: hovered ? 1.5 : 1,
                backgroundColor: hovered ? 'rgba(245,237,227,0.05)' : 'transparent',
              }}
              transition={{ type: 'spring', stiffness: 250, damping: 25 }}
            >
              {hovered && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-[8px] font-black tracking-[0.2em] uppercase select-none"
                  style={{ color: accent }}
                >
                  VIEW
                </motion.span>
              )}
            </motion.div>
          </motion.div>

          {/* Inner Point */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 pointer-events-none z-[9999]"
            style={{ x: px, y: py, translateX: '-50%', translateY: '-50%' }}
          >
            <motion.div
              className="rounded-full"
              animate={{
                width:  hovered ? 4 : clicked ? 2 : 5,
                height: hovered ? 4 : clicked ? 2 : 5,
                backgroundColor: accent,
                scale:  clicked ? 0.6 : 1,
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
