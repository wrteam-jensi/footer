'use client';

import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, ShoppingCart, Maximize2, Minimize2 } from 'lucide-react';

// ── Data ────────────────────────────────────────────────────────
const BASES = [
  { id: 'cyan',   color: '#00e5ff', name: 'NEON CYAN',      price: 129 },
  { id: 'purple', color: '#a855f7', name: 'PHANTOM PURPLE', price: 139 },
  { id: 'black',  color: '#1c1c1c', name: 'OBSIDIAN',       price: 119 },
  { id: 'red',    color: '#ef4444', name: 'VULCAN RED',      price: 129 },
  { id: 'sand',   color: '#d4b896', name: 'DESERT SAND',    price: 119 },
  { id: 'green',  color: '#22c55e', name: 'NEON GREEN',     price: 134 },
];

const STRAP_TYPES = [
  { id: 'arch',  name: 'ARCH STRAP', desc: 'Classic V-arch slides' },
  { id: 'band',  name: 'WIDE BAND',  desc: 'Wrapped single-piece band' },
  { id: 'cross', name: 'CROSS',      desc: 'X-cross open design' },
  { id: 'open',  name: 'OPEN MULE',  desc: 'Backless, no strap' },
];

const STRAPS = [
  { id: 'carbon', color: '#1e1e1e', name: 'CARBON MATTE',  finish: 'Matte rubber' },
  { id: 'gold',   color: '#f59e0b', name: 'METALLIC GOLD', finish: 'Brushed metal' },
  { id: 'white',  color: '#e8e8e8', name: 'PURE WHITE',    finish: 'Gloss coated' },
  { id: 'smoke',  color: '#6b7280', name: 'SMOKE GREY',    finish: 'Soft-touch' },
  { id: 'navy',   color: '#1e3a5f', name: 'DEEP NAVY',     finish: 'Matte fabric' },
  { id: 'rose',   color: '#f43f5e', name: 'ROSE CHROME',   finish: 'Chrome mirror' },
];

const CHARMS = [
  { id: 'none',      icon: null,  name: 'CLEAN' },
  { id: 'bolt',      icon: '⚡',   name: 'BOLT' },
  { id: 'star',      icon: '✦',   name: 'PRIME' },
  { id: 'crystal',   icon: '◈',   name: 'CRYSTAL' },
  { id: 'b',         icon: 'B',   name: 'BRAND' },
  { id: 'infinity',  icon: '∞',   name: 'INFINITY' },
];

const STEPS = [
  { n: 1, label: 'BASE'  },
  { n: 2, label: 'TYPE'  },
  { n: 3, label: 'STRAP' },
  { n: 4, label: 'CHARM' },
];

// ── 3D Model ────────────────────────────────────────────────────
function SlipperMesh({ base, strapType, strap }: {
  base: string; strapType: string; strap: string;
}) {
  const baseColor = BASES.find(b => b.id === base)?.color   ?? '#00e5ff';
  const beltColor = STRAPS.find(s => s.id === strap)?.color ?? '#1e1e1e';

  const strapMat = (
    <meshStandardMaterial color={beltColor} roughness={0.2} metalness={0.5} />
  );

  return (
    <Float speed={1.3} rotationIntensity={0.15} floatIntensity={0.25}>
      <group rotation={[0.32, -0.52, 0.06]}>

        {/* Rubber outer sole — flat dark ellipsoid */}
        <mesh scale={[1.85, 0.13, 0.72]} castShadow receiveShadow>
          <sphereGeometry args={[1, 48, 32]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.92} metalness={0} />
        </mesh>

        {/* EVA midsole — main color, domed */}
        <mesh scale={[1.68, 0.31, 0.63]} position={[0, 0.24, 0]} castShadow>
          <sphereGeometry args={[1, 48, 32]} />
          <meshStandardMaterial
            color={baseColor}
            roughness={0.33}
            metalness={0.07}
            emissive={baseColor}
            emissiveIntensity={0.09}
          />
        </mesh>

        {/* Footbed top surface */}
        <mesh scale={[1.55, 0.09, 0.57]} position={[0, 0.52, 0]}>
          <sphereGeometry args={[1, 48, 32]} />
          <meshStandardMaterial color={baseColor} roughness={0.6} metalness={0} />
        </mesh>

        {/* ── Strap geometry by type ── */}

        {strapType === 'arch' && (
          <group>
            {/* Left arm: at -Z, tilts inward (+X rotation) */}
            <mesh position={[0.28, 0.68, -0.53]} rotation={[0.7, 0, 0.08]} castShadow>
              <capsuleGeometry args={[0.1, 0.78, 6, 20]} />
              {strapMat}
            </mesh>
            {/* Right arm: at +Z, tilts inward (-X rotation) */}
            <mesh position={[0.28, 0.68, 0.53]} rotation={[-0.7, 0, 0.08]} castShadow>
              <capsuleGeometry args={[0.1, 0.78, 6, 20]} />
              {strapMat}
            </mesh>
            {/* Bridge */}
            <mesh position={[0.28, 1.04, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <capsuleGeometry args={[0.1, 0.95, 6, 20]} />
              {strapMat}
            </mesh>
          </group>
        )}

        {strapType === 'band' && (
          <group>
            {/* Wide rounded band lying horizontally */}
            <mesh position={[0.25, 0.72, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <capsuleGeometry args={[0.24, 1.1, 10, 28]} />
              {strapMat}
            </mesh>
          </group>
        )}

        {strapType === 'cross' && (
          <group>
            {/* Strap going front-left → back-right */}
            <mesh position={[0.2, 0.68, 0]} rotation={[0, 0.58, 0.08]} castShadow>
              <capsuleGeometry args={[0.1, 1.45, 6, 20]} />
              {strapMat}
            </mesh>
            {/* Strap going front-right → back-left */}
            <mesh position={[0.2, 0.68, 0]} rotation={[0, -0.58, 0.08]} castShadow>
              <capsuleGeometry args={[0.1, 1.45, 6, 20]} />
              {strapMat}
            </mesh>
          </group>
        )}

        {/* OPEN: no strap element rendered */}

      </group>
    </Float>
  );
}

// ── Step indicator ───────────────────────────────────────────────
function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((s, i) => (
        <div key={s.n} className="flex items-center flex-1">
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300 ${
              i < current  ? 'bg-cyan-500 text-black' :
              i === current ? 'bg-white text-black scale-110' :
              'bg-white/6 border border-white/10 text-neutral-700'
            }`}>
              {i < current ? <Check size={12} strokeWidth={3} /> : s.n}
            </div>
            <span className={`text-[8px] font-black tracking-[0.2em] transition-colors ${
              i === current ? 'text-white' : i < current ? 'text-cyan-500' : 'text-neutral-700'
            }`}>{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-px mx-2 mb-4 transition-colors duration-500 ${i < current ? 'bg-cyan-500' : 'bg-white/8'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────
export default function SlipperCustomizer() {
  const [step,      setStep]      = useState(0);
  const [expanded,  setExpanded]  = useState(false);
  const [sel, setSel] = useState({
    base: '',  strapType: '',  strap: '',  charm: '',
  });

  const set = (k: keyof typeof sel, v: string) => setSel(p => ({ ...p, [k]: v }));

  const stepKey   = (['base', 'strapType', 'strap', 'charm'] as const)[step];
  const hasChoice = !!sel[stepKey];
  const isDone    = step === 4;

  const currentBase  = BASES.find(b => b.id === sel.base);
  const currentStrap = STRAPS.find(s => s.id === sel.strap);
  const price        = (currentBase?.price ?? 129) + (sel.charm !== 'none' && sel.charm ? 10 : 0);

  return (
    <section className="w-full bg-[#060606] py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-6 items-start">

        {/* ── 3D Viewport ──────────────────────────────────────── */}
        <div className={`relative rounded-3xl bg-[#0d0d0d] border border-white/5 overflow-hidden transition-all duration-500 ${
          expanded ? 'fixed inset-4 z-100 rounded-2xl' : 'h-[460px] lg:h-[620px]'
        }`}>
          {/* Header */}
          <div className="absolute top-0 inset-x-0 z-10 flex items-start justify-between px-6 pt-5 pb-8 bg-linear-to-b from-black/70 to-transparent pointer-events-none">
            <div>
              <div className="text-[8px] font-mono text-neutral-700 tracking-[0.4em] mb-0.5">LIVE CONFIG · BEYOND_O1</div>
              <div className="text-lg font-black text-white tracking-tight">STRIDE ONE</div>
            </div>
          </div>

          <button onClick={() => setExpanded(!expanded)}
            className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-white/6 border border-white/8 flex items-center justify-center text-neutral-600 hover:text-white transition-colors">
            {expanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>

          <Canvas shadows camera={{ position: [1.5, 2.5, 8], fov: 36 }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[4, 7, 6]} intensity={1.4} castShadow shadow-mapSize={1024} />
            <directionalLight position={[-5, 2, -3]} intensity={0.35} color="#00e5ff" />
            <Suspense fallback={null}>
              <SlipperMesh
                base={sel.base || 'cyan'}
                strapType={sel.strapType || 'arch'}
                strap={sel.strap || 'carbon'}
              />
              <ContactShadows position={[0, -1.5, 0]} opacity={0.35} scale={8} blur={2.5} />
              <Environment preset="studio" />
            </Suspense>
            <OrbitControls enableZoom={expanded} enablePan={false}
              autoRotate={!expanded} autoRotateSpeed={0.5}
              minPolarAngle={Math.PI / 5} maxPolarAngle={Math.PI / 1.9} />
          </Canvas>

          {/* Bottom config strip */}
          {(sel.base || sel.strapType || sel.strap) && (
            <div className="absolute bottom-0 inset-x-0 px-5 pb-5 pt-10 bg-linear-to-t from-black/80 to-transparent flex items-center gap-2 flex-wrap">
              {sel.base && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/60 border border-white/8 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentBase?.color }} />
                  <span className="text-[8px] font-mono text-neutral-400 tracking-widest">{currentBase?.name}</span>
                </div>
              )}
              {sel.strapType && (
                <div className="px-2.5 py-1.5 rounded-full bg-black/60 border border-white/8 backdrop-blur-sm">
                  <span className="text-[8px] font-mono text-neutral-400 tracking-widest">
                    {STRAP_TYPES.find(t => t.id === sel.strapType)?.name}
                  </span>
                </div>
              )}
              {sel.strap && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/60 border border-white/8 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentStrap?.color }} />
                  <span className="text-[8px] font-mono text-neutral-400 tracking-widest">{currentStrap?.name}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right panel ──────────────────────────────────────── */}
        <div className="flex flex-col gap-5">

          {/* Product header */}
          <div className="flex items-end justify-between px-1">
            <div>
              <div className="text-[8px] font-mono text-neutral-700 tracking-[0.4em] mb-1">SS'26 · BEYOND_O1</div>
              <h2 className="text-3xl font-black text-white tracking-tight">STRIDE ONE</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="flex gap-0.5">{[...Array(5)].map((_,i)=><span key={i} className="text-yellow-400 text-[10px]">★</span>)}</div>
                <span className="text-[9px] font-mono text-neutral-700">4.9 · 2.1k</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[9px] font-mono text-neutral-700">FROM</div>
              <div className="text-2xl font-black text-white">${price}</div>
            </div>
          </div>

          {/* Step progress */}
          {!isDone && <StepBar current={step} />}

          {/* Step content */}
          <div className="rounded-3xl bg-[#0d0d0d] border border-white/5 overflow-hidden">
            <AnimatePresence mode="wait">

              {/* STEP 1: BASE */}
              {step === 0 && (
                <motion.div key="base"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="p-6 space-y-5"
                >
                  <div>
                    <div className="text-[9px] font-mono text-neutral-600 tracking-[0.35em]">STEP 1 OF 4</div>
                    <h3 className="text-xl font-black text-white mt-1">Choose Base Color</h3>
                    <p className="text-[11px] text-neutral-600 mt-0.5">EVA foam sole · UV-stable pigment</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {BASES.map(b => (
                      <button key={b.id} onClick={() => set('base', b.id)}
                        className={`group relative flex flex-col items-center gap-2.5 py-4 px-2 rounded-2xl border transition-all duration-200 ${
                          sel.base === b.id
                            ? 'border-white/20 bg-white/5'
                            : 'border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl transition-all duration-200"
                          style={{
                            backgroundColor: b.color,
                            boxShadow: sel.base === b.id ? `0 0 18px ${b.color}55, 0 0 0 2px #0d0d0d, 0 0 0 3.5px ${b.color}` : 'none',
                            transform: sel.base === b.id ? 'scale(1.12)' : 'scale(1)',
                          }}
                        />
                        <span className={`text-[8px] font-black tracking-wider text-center leading-tight ${
                          sel.base === b.id ? 'text-white' : 'text-neutral-600 group-hover:text-neutral-400'
                        }`}>{b.name}</span>
                        {sel.base === b.id && (
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-cyan-500 flex items-center justify-center">
                            <Check size={9} strokeWidth={3} className="text-black" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: STRAP TYPE */}
              {step === 1 && (
                <motion.div key="type"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="p-6 space-y-5"
                >
                  <div>
                    <div className="text-[9px] font-mono text-neutral-600 tracking-[0.35em]">STEP 2 OF 4</div>
                    <h3 className="text-xl font-black text-white mt-1">Choose Strap Style</h3>
                    <p className="text-[11px] text-neutral-600 mt-0.5">Select a strap design — updates live in viewport</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {STRAP_TYPES.map(t => (
                      <button key={t.id} onClick={() => set('strapType', t.id)}
                        className={`flex flex-col items-start gap-2 p-4 rounded-2xl border transition-all duration-200 ${
                          sel.strapType === t.id
                            ? 'border-white/25 bg-white/6'
                            : 'border-white/5 hover:border-white/12'
                        }`}
                      >
                        {/* Strap type SVG icon */}
                        <div className="w-full h-12 flex items-center justify-center">
                          {t.id === 'arch' && (
                            <svg width="56" height="32" viewBox="0 0 56 32">
                              <path d="M6 28 L20 8 L28 6 L36 8 L50 28" stroke={sel.strapType === t.id ? '#00e5ff' : '#444'} strokeWidth="3.5" fill="none" strokeLinecap="round" />
                            </svg>
                          )}
                          {t.id === 'band' && (
                            <svg width="56" height="32" viewBox="0 0 56 32">
                              <rect x="4" y="10" width="48" height="12" rx="6" fill={sel.strapType === t.id ? '#00e5ff' : '#444'} opacity="0.9" />
                            </svg>
                          )}
                          {t.id === 'cross' && (
                            <svg width="56" height="32" viewBox="0 0 56 32">
                              <line x1="8" y1="28" x2="48" y2="4" stroke={sel.strapType === t.id ? '#00e5ff' : '#444'} strokeWidth="3.5" strokeLinecap="round" />
                              <line x1="8" y1="4" x2="48" y2="28" stroke={sel.strapType === t.id ? '#00e5ff' : '#444'} strokeWidth="3.5" strokeLinecap="round" />
                            </svg>
                          )}
                          {t.id === 'open' && (
                            <svg width="56" height="32" viewBox="0 0 56 32">
                              <ellipse cx="28" cy="20" rx="22" ry="8" fill={sel.strapType === t.id ? '#00e5ff' : '#333'} opacity="0.7" />
                              <text x="28" y="14" textAnchor="middle" fontSize="9" fill={sel.strapType === t.id ? '#00e5ff' : '#555'} fontFamily="monospace">OPEN</text>
                            </svg>
                          )}
                        </div>
                        <div>
                          <div className={`text-[10px] font-black tracking-widest ${sel.strapType === t.id ? 'text-white' : 'text-neutral-500'}`}>{t.name}</div>
                          <div className="text-[9px] font-mono text-neutral-700 mt-0.5">{t.desc}</div>
                        </div>
                        {sel.strapType === t.id && (
                          <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-cyan-500 flex items-center justify-center">
                            <Check size={9} strokeWidth={3} className="text-black" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: STRAP COLOR */}
              {step === 2 && (
                <motion.div key="strap"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="p-6 space-y-5"
                >
                  <div>
                    <div className="text-[9px] font-mono text-neutral-600 tracking-[0.35em]">STEP 3 OF 4</div>
                    <h3 className="text-xl font-black text-white mt-1">Choose Strap Color</h3>
                    <p className="text-[11px] text-neutral-600 mt-0.5">
                      {STRAP_TYPES.find(t => t.id === sel.strapType)?.name} · pick material finish
                    </p>
                  </div>

                  <div className="space-y-2">
                    {STRAPS.map(s => (
                      <button key={s.id} onClick={() => set('strap', s.id)}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl border transition-all duration-200 ${
                          sel.strap === s.id
                            ? 'border-white/20 bg-white/5'
                            : 'border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-xl shrink-0 border border-white/10 transition-all"
                          style={{
                            backgroundColor: s.color,
                            boxShadow: sel.strap === s.id ? `0 0 12px ${s.color}50` : 'none',
                          }}
                        />
                        <div className="text-left flex-1">
                          <div className={`text-[11px] font-black tracking-wider ${sel.strap === s.id ? 'text-white' : 'text-neutral-500'}`}>{s.name}</div>
                          <div className="text-[9px] font-mono text-neutral-700">{s.finish}</div>
                        </div>
                        {sel.strap === s.id && <Check size={14} className="text-cyan-400 shrink-0" strokeWidth={2.5} />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 4: CHARM */}
              {step === 3 && (
                <motion.div key="charm"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="p-6 space-y-5"
                >
                  <div>
                    <div className="text-[9px] font-mono text-neutral-600 tracking-[0.35em]">STEP 4 OF 4</div>
                    <h3 className="text-xl font-black text-white mt-1">Choose Charm</h3>
                    <p className="text-[11px] text-neutral-600 mt-0.5">Decorative accent on the strap · +$10</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {CHARMS.map(c => (
                      <button key={c.id} onClick={() => set('charm', c.id)}
                        className={`flex flex-col items-center justify-center gap-2 py-5 rounded-2xl border transition-all duration-200 ${
                          sel.charm === c.id
                            ? 'border-white/25 bg-white/7 text-white'
                            : 'border-white/5 text-neutral-700 hover:border-white/12 hover:text-neutral-400'
                        }`}
                      >
                        <span className="text-2xl leading-none">{c.icon ?? <span className="text-sm">—</span>}</span>
                        <span className={`text-[8px] font-black tracking-[0.2em] ${sel.charm === c.id ? 'text-white' : ''}`}>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* DONE: Summary */}
              {isDone && (
                <motion.div key="done"
                  initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 space-y-4"
                >
                  <div className="text-[9px] font-mono text-cyan-500 tracking-[0.4em]">YOUR CONFIGURATION</div>
                  <div className="space-y-2">
                    {[
                      { label: 'BASE',  value: currentBase?.name ?? '—',  dot: currentBase?.color },
                      { label: 'STYLE', value: STRAP_TYPES.find(t=>t.id===sel.strapType)?.name ?? '—', dot: null },
                      { label: 'STRAP', value: currentStrap?.name ?? '—', dot: currentStrap?.color },
                      { label: 'CHARM', value: CHARMS.find(c=>c.id===sel.charm)?.name ?? '—', dot: null },
                    ].map(row => (
                      <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                        <span className="text-[9px] font-mono text-neutral-600 tracking-widest">{row.label}</span>
                        <div className="flex items-center gap-2">
                          {row.dot && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: row.dot }} />}
                          <span className="text-[11px] font-black text-white">{row.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { setSel({ base:'', strapType:'', strap:'', charm:'' }); setStep(0); }}
                    className="w-full py-2.5 rounded-xl border border-white/8 text-neutral-600 text-[10px] font-black tracking-widest hover:border-white/15 hover:text-neutral-400 transition-all"
                  >
                    ← REDESIGN
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          {!isDone && (
            <div className="flex gap-3">
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)}
                  className="w-12 h-12 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center text-neutral-500 hover:text-white hover:border-white/15 transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
              )}
              <motion.button
                whileTap={hasChoice ? { scale: 0.97 } : {}}
                onClick={() => hasChoice && setStep(s => Math.min(s + 1, 4))}
                className={`flex-1 py-4 rounded-2xl font-black text-[11px] tracking-[0.2em] transition-all duration-200 flex items-center justify-center gap-2 ${
                  hasChoice
                    ? 'bg-white text-black hover:bg-cyan-400 cursor-pointer'
                    : 'bg-white/5 text-neutral-700 cursor-not-allowed'
                }`}
              >
                {step === 3 ? (
                  <><ShoppingCart size={15} /> ADD TO CART · ${price}</>
                ) : (
                  `CONTINUE →`
                )}
              </motion.button>
            </div>
          )}

          {isDone && (
            <button className="w-full py-4 rounded-2xl bg-white text-black font-black text-[11px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-cyan-400 transition-colors">
              <ShoppingCart size={15} /> ADD TO CART · ${price}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
