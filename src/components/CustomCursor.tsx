'use client';

import { useEffect, useState } from 'react';

import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [visible, setVisible] = useState(false);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);

  const spring = { damping: 28, stiffness: 220, mass: 0.5 };
  const x = useSpring(mx, spring);
  const y = useSpring(my, spring);

  // Ring lags a little more for nice effect
  const ringSpring = { damping: 22, stiffness: 140, mass: 0.8 };
  const rx = useSpring(mx, ringSpring);
  const ry = useSpring(my, ringSpring);

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

    const onDown = () => setClicked(true);
    const onUp   = () => setClicked(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener('mousemove',  onMove);
    window.addEventListener('mouseover',  onOver);
    window.addEventListener('mousedown',  onDown);
    window.addEventListener('mouseup',    onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseover',  onOver);
      window.removeEventListener('mousedown',  onDown);
      window.removeEventListener('mouseup',    onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [mx, my, visible]);

  return (
    <>
      {/* Dot — fast, follows exactly */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-9999"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          animate={{
            width:  hovered ? 6 : clicked ? 4 : 6,
            height: hovered ? 6 : clicked ? 4 : 6,
            opacity: visible ? 1 : 0,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="rounded-full"
          style={{ background: '#C4956A' }}
        />
      </motion.div>

      {/* Ring — slower, lags behind */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-9998"
        style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          animate={{
            width:   hovered ? 40 : clicked ? 20 : 28,
            height:  hovered ? 40 : clicked ? 20 : 28,
            opacity: visible ? (hovered ? 0.5 : 0.25) : 0,
            borderColor: hovered ? '#C4956A' : '#C4956A',
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 24 }}
          className="rounded-full border"
          style={{ borderColor: '#C4956A' }}
        />
      </motion.div>
    </>
  );
}
