'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [hovered,  setHovered]  = useState(false);
  const [clicked,  setClicked]  = useState(false);
  const [visible,  setVisible]  = useState(false);
  const [darkBg,   setDarkBg]   = useState(false);

  const mx = useMotionValue(-300);
  const my = useMotionValue(-300);

  // Outer blob — lazy follow
  const blobSpring = { damping: 22, stiffness: 130, mass: 1 };
  const bx = useSpring(mx, blobSpring);
  const by = useSpring(my, blobSpring);

  // Inner dot — instant
  const dotSpring = { damping: 35, stiffness: 400, mass: 0.3 };
  const dx = useSpring(mx, dotSpring);
  const dy = useSpring(my, dotSpring);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      if (!visible) setVisible(true);

      // Detect if over a dark section
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (el) {
        const bg = window.getComputedStyle(el).backgroundColor;
        const isDark = bg.includes('rgb(12') || bg.includes('rgb(0') || bg.includes('rgb(17') || bg.includes('rgb(11');
        setDarkBg(isDark);
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
    };
  }, [mx, my, visible]);

  const accent = darkBg ? 'rgba(245,237,227,0.9)' : '#C4956A';
  const accentFill = darkBg ? 'rgba(245,237,227,0.10)' : 'rgba(196,149,106,0.10)';
  const ringBorder = darkBg ? 'rgba(245,237,227,0.50)' : 'rgba(196,149,106,0.50)';

  return (
    <>
      {/* Outer blob — morphs on hover */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-9998"
        style={{ x: bx, y: by, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          className="rounded-full flex items-center justify-center overflow-hidden"
          animate={{
            width:           hovered ? 56 : clicked ? 20 : 36,
            height:          hovered ? 56 : clicked ? 20 : 36,
            backgroundColor: hovered ? accentFill : 'transparent',
            borderColor:     hovered ? accent : ringBorder,
            borderWidth:     hovered ? 1.5 : 1,
            opacity:         visible ? 1 : 0,
            scale:           clicked ? 0.75 : 1,
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          style={{ border: `1px solid ${ringBorder}` }}
        >
          {/* Label inside ring on hover */}
          <motion.span
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.6 }}
            transition={{ duration: 0.18 }}
            className="text-[8px] font-black tracking-wider uppercase select-none"
            style={{ color: accent }}
          >
            VIEW
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Inner dot — exact position */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-9999"
        style={{ x: dx, y: dy, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          className="rounded-full"
          animate={{
            width:           hovered ? 4 : clicked ? 2 : 4,
            height:          hovered ? 4 : clicked ? 2 : 4,
            backgroundColor: accent,
            opacity:         visible ? (hovered ? 0.5 : 1) : 0,
            scale:           clicked ? 0.5 : 1,
          }}
          transition={{ type: 'spring', stiffness: 600, damping: 35 }}
        />
      </motion.div>
    </>
  );
}
