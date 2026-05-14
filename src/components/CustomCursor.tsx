'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [visible, setVisible] = useState(false);

  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);

  // Outer ring — lags behind
  const outerSpring = { damping: 20, stiffness: 120, mass: 0.9 };
  const ox = useSpring(mx, outerSpring);
  const oy = useSpring(my, outerSpring);

  // Inner dot — snappy
  const innerSpring = { damping: 30, stiffness: 300, mass: 0.4 };
  const ix = useSpring(mx, innerSpring);
  const iy = useSpring(my, innerSpring);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      if (!visible) setVisible(true);
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovered(
        t.tagName === 'A' || t.tagName === 'BUTTON' ||
        !!t.closest('a') || !!t.closest('button') ||
        !!t.getAttribute('data-cursor-hover')
      );
    };
    const onDown  = () => setClicked(true);
    const onUp    = () => setClicked(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener('mousemove',     onMove);
    window.addEventListener('mouseover',     onOver);
    window.addEventListener('mousedown',     onDown);
    window.addEventListener('mouseup',       onUp);
    document.addEventListener('mouseleave',  onLeave);
    document.addEventListener('mouseenter',  onEnter);

    return () => {
      window.removeEventListener('mousemove',    onMove);
      window.removeEventListener('mouseover',    onOver);
      window.removeEventListener('mousedown',    onDown);
      window.removeEventListener('mouseup',      onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [mx, my, visible]);

  return (
    <>
      {/* Outer ring — follows with lag */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-9998"
        style={{ x: ox, y: oy, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          className="rounded-full"
          animate={{
            width:           hovered ? 48 : clicked ? 24 : 32,
            height:          hovered ? 48 : clicked ? 24 : 32,
            backgroundColor: hovered ? 'rgba(196,149,106,0.12)' : 'transparent',
            borderColor:     hovered ? 'rgba(196,149,106,0.8)' : 'rgba(196,149,106,0.35)',
            borderWidth:     hovered ? 1.5 : 1,
            opacity:         visible ? 1 : 0,
            scale:           clicked ? 0.85 : 1,
          }}
          transition={{ type: 'spring', stiffness: 180, damping: 20 }}
          style={{ border: '1px solid rgba(196,149,106,0.35)' }}
        />
      </motion.div>

      {/* Inner dot — sharp & fast */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-9999"
        style={{ x: ix, y: iy, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          className="rounded-full"
          animate={{
            width:           hovered ? 5 : clicked ? 3 : 5,
            height:          hovered ? 5 : clicked ? 3 : 5,
            backgroundColor: '#C4956A',
            opacity:         visible ? (hovered ? 0.6 : 1) : 0,
            scale:           clicked ? 0.6 : 1,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      </motion.div>
    </>
  );
}
