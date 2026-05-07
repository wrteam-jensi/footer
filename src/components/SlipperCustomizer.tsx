'use client';

import { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Check, ChevronLeft, ShoppingCart, Maximize2, Minimize2 } from 'lucide-react';

// ── Data ────────────────────────────────────────────────────────
const BASE_TYPES = [
  { id: 'flat',     name: 'FLAT',     desc: 'Classic slim sole',      soleY: 0.13, midY: 0.31, midPos: 0.24 },
  { id: 'platform', name: 'PLATFORM', desc: 'Chunky stacked sole',    soleY: 0.38, midY: 0.28, midPos: 0.56 },
  { id: 'wedge',    name: 'WEDGE',    desc: 'Tapered heel lift',      soleY: 0.22, midY: 0.30, midPos: 0.38 },
  { id: 'sport',    name: 'SPORT',    desc: 'Ergonomic contour',      soleY: 0.17, midY: 0.34, midPos: 0.30 },
];

const BASE_COLORS = [
  { id: 'cyan',   color: '#00e5ff', name: 'NEON CYAN',      price: 129 },
  { id: 'purple', color: '#a855f7', name: 'PHANTOM PURPLE', price: 139 },
  { id: 'black',  color: '#1c1c1c', name: 'OBSIDIAN',       price: 119 },
  { id: 'red',    color: '#ef4444', name: 'VULCAN RED',     price: 129 },
  { id: 'sand',   color: '#d4b896', name: 'DESERT SAND',    price: 119 },
  { id: 'green',  color: '#22c55e', name: 'NEON GREEN',     price: 134 },
];

const STRAP_TYPES = [
  { id: 'arch',  name: 'ARCH',  desc: 'Classic V-arch' },
  { id: 'band',  name: 'BAND',  desc: 'Wide single wrap' },
  { id: 'cross', name: 'CROSS', desc: 'X-cross open' },
  { id: 'open',  name: 'OPEN',  desc: 'Mule, no strap' },
];

const STRAP_COLORS = [
  { id: 'carbon', color: '#1e1e1e', name: 'CARBON',  finish: 'Matte rubber' },
  { id: 'gold',   color: '#f59e0b', name: 'GOLD',    finish: 'Brushed metal' },
  { id: 'white',  color: '#e8e8e8', name: 'WHITE',   finish: 'Gloss coat' },
  { id: 'smoke',  color: '#6b7280', name: 'SMOKE',   finish: 'Soft-touch' },
  { id: 'navy',   color: '#1e3a5f', name: 'NAVY',    finish: 'Matte fabric' },
  { id: 'rose',   color: '#f43f5e', name: 'ROSE',    finish: 'Chrome mirror' },
];

const CHARMS = [
  { id: 'none',     icon: '—',  name: 'NONE' },
  { id: 'bolt',     icon: '⚡',  name: 'BOLT' },
  { id: 'star',     icon: '✦',  name: 'PRIME' },
  { id: 'crystal',  icon: '◈',  name: 'CRYSTAL' },
  { id: 'brand',    icon: 'B',  name: 'BRAND' },
  { id: 'infinity', icon: '∞',  name: 'INFINITY' },
];

const STEPS = ['BASE TYPE', 'BASE COLOR', 'STRAP TYPE', 'STRAP COLOR', 'CHARM'];

// ── Animated group — lerps scale 0→1 on mount/show ─────────────
function AnimPart({ show, children }: { show: boolean; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    const target = show ? 1 : 0;
    const cur = ref.current.scale.x;
    const next = cur + (target - cur) * Math.min(dt * 7, 1);
    ref.current.scale.setScalar(Math.max(0.0001, next));
  });
  return <group ref={ref} scale={0.0001}>{children}</group>;
}

// ── Color-lerp material ─────────────────────────────────────────
function LiveMat({ color, roughness = 0.35, metalness = 0.07, emissive = true }:
  { color: string; roughness?: number; metalness?: number; emissive?: boolean }) {
  const ref = useRef<THREE.MeshStandardMaterial>(null);
  const target = useRef(new THREE.Color(color));

  useFrame(() => {
    if (!ref.current) return;
    target.current.set(color);
    ref.current.color.lerp(target.current, 0.12);
    if (emissive) ref.current.emissive.lerp(target.current, 0.06);
  });

  return (
    <meshStandardMaterial ref={ref} color={color} roughness={roughness}
      metalness={metalness} emissiveIntensity={emissive ? 0.08 : 0} />
  );
}

// ── 3D Slipper ──────────────────────────────────────────────────
function SlipperScene({
  showSole, showStrap, showCharm,
  baseType, baseColor, strapType, strapColor,
}: {
  showSole: boolean; showStrap: boolean; showCharm: boolean;
  baseType: string; baseColor: string; strapType: string; strapColor: string;
}) {
  const bt = BASE_TYPES.find(b => b.id === baseType) ?? BASE_TYPES[0];
  const bc = baseColor || '#888888';
  const sc = STRAP_COLORS.find(s => s.id === strapColor)?.color ?? '#1e1e1e';

  return (
    <Float speed={1.2} rotationIntensity={0.14} floatIntensity={0.22}>
      <group rotation={[0.3, -0.5, 0.05]}>

        {/* ── SOLE (appears after base type + color selected) */}
        <AnimPart show={showSole}>
          {/* Outer rubber sole */}
          <mesh scale={[1.85, bt.soleY, 0.72]} castShadow receiveShadow>
            <sphereGeometry args={[1, 48, 32]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.92} />
          </mesh>
          {/* EVA midsole — live color */}
          <mesh scale={[1.68, bt.midY, 0.63]} position={[0, bt.midPos, 0]} castShadow>
            <sphereGeometry args={[1, 48, 32]} />
            <LiveMat color={bc} />
          </mesh>
          {/* Footbed surface */}
          <mesh scale={[1.55, 0.09, 0.57]} position={[0, bt.midPos + bt.midY + 0.05, 0]}>
            <sphereGeometry args={[1, 48, 32]} />
            <LiveMat color={bc} roughness={0.6} metalness={0} emissive={false} />
          </mesh>
        </AnimPart>

        {/* ── STRAP (appears after strap type + color selected) */}
        <AnimPart show={showStrap}>
          {strapType === 'arch' && (
            <group>
              <mesh position={[0.28, bt.midPos + bt.midY + 0.22, -0.53]} rotation={[0.7, 0, 0.08]} castShadow>
                <capsuleGeometry args={[0.1, 0.78, 6, 20]} />
                <LiveMat color={sc} roughness={0.2} metalness={0.5} emissive={false} />
              </mesh>
              <mesh position={[0.28, bt.midPos + bt.midY + 0.22, 0.53]} rotation={[-0.7, 0, 0.08]} castShadow>
                <capsuleGeometry args={[0.1, 0.78, 6, 20]} />
                <LiveMat color={sc} roughness={0.2} metalness={0.5} emissive={false} />
              </mesh>
              <mesh position={[0.28, bt.midPos + bt.midY + 0.56, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <capsuleGeometry args={[0.1, 0.95, 6, 20]} />
                <LiveMat color={sc} roughness={0.2} metalness={0.5} emissive={false} />
              </mesh>
            </group>
          )}
          {strapType === 'band' && (
            <mesh position={[0.25, bt.midPos + bt.midY + 0.22, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <capsuleGeometry args={[0.24, 1.1, 10, 28]} />
              <LiveMat color={sc} roughness={0.2} metalness={0.5} emissive={false} />
            </mesh>
          )}
          {strapType === 'cross' && (
            <group>
              <mesh position={[0.2, bt.midPos + bt.midY + 0.18, 0]} rotation={[0, 0.58, 0.08]} castShadow>
                <capsuleGeometry args={[0.1, 1.45, 6, 20]} />
                <LiveMat color={sc} roughness={0.2} metalness={0.5} emissive={false} />
              </mesh>
              <mesh position={[0.2, bt.midPos + bt.midY + 0.18, 0]} rotation={[0, -0.58, 0.08]} castShadow>
                <capsuleGeometry args={[0.1, 1.45, 6, 20]} />
                <LiveMat color={sc} roughness={0.2} metalness={0.5} emissive={false} />
              </mesh>
            </group>
          )}
        </AnimPart>

        {/* ── CHARM (appears after charm selected) */}
        <AnimPart show={showCharm}>
          <mesh position={[0.28, bt.midPos + bt.midY + 0.58, 0]}>
            <sphereGeometry args={[0.16, 24, 24]} />
            <meshStandardMaterial color="#ffffff" roughness={0.05} metalness={0.95} emissive="#ffffff" emissiveIntensity={0.25} />
          </mesh>
        </AnimPart>

      </group>
    </Float>
  );
}

// ── Option card ──────────────────────────────────────────────────
function Card({ selected, onClick, children }: {
  selected: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button onClick={onClick}
      className={`relative w-full rounded-2xl border transition-all duration-200 overflow-hidden ${
        selected
          ? 'border-white/30 bg-white/7 shadow-[0_0_20px_rgba(255,255,255,0.04)]'
          : 'border-white/6 bg-white/2 hover:border-white/12 hover:bg-white/4'
      }`}
    >
      {selected && (
        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center z-10">
          <Check size={10} strokeWidth={3.5} className="text-black" />
        </div>
      )}
      {children}
    </button>
  );
}

// ── Main ────────────────────────────────────────────────────────
export default function SlipperCustomizer() {
  const [step, setStep] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [sel, setSel] = useState({
    baseType: '', baseColor: '', strapType: '', strapColor: '', charm: '',
  });

  const set = (k: keyof typeof sel, v: string) => setSel(p => ({ ...p, [k]: v }));

  const keys: (keyof typeof sel)[] = ['baseType', 'baseColor', 'strapType', 'strapColor', 'charm'];
  const current = keys[step];
  const canContinue = !!sel[current];
  const done = step >= 5;

  const showSole  = step >= 2 || (step >= 1 && !!sel.baseColor);
  const showStrap = step >= 4 || (step >= 3 && !!sel.strapColor);
  const showCharm = !!sel.charm && sel.charm !== 'none';

  const currentBase  = BASE_COLORS.find(b => b.id === sel.baseColor);
  const price = (currentBase?.price ?? 129) + (sel.charm && sel.charm !== 'none' ? 10 : 0);

  const next = () => {
    if (!canContinue) return;
    setStep(s => Math.min(s + 1, 5));
  };

  const back = () => setStep(s => Math.max(s - 1, 0));

  return (
    <section className="w-full bg-[#060606] py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-8 items-start">

        {/* ── 3D canvas ────────────────────────────────────────── */}
        <div className={`relative rounded-3xl bg-[#0a0a0a] border border-white/5 overflow-hidden transition-all duration-500 ${
          expanded ? 'fixed inset-4 z-100 rounded-2xl' : 'h-[460px] lg:h-[640px]'
        }`}>
          <div className="absolute top-5 left-5 z-10 pointer-events-none">
            <div className="text-[8px] font-mono text-neutral-800 tracking-[0.4em] mb-0.5">LIVE PREVIEW</div>
            <div className="text-base font-black text-white/80">STRIDE ONE</div>
          </div>
          <button onClick={() => setExpanded(!expanded)}
            className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-neutral-600 hover:text-white transition-colors"
          >
            {expanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>

          <Canvas shadows camera={{ position: [1.5, 2.5, 8], fov: 36 }}>
            <color attach="background" args={['#0a0a0a']} />
            <ambientLight intensity={0.35} />
            <directionalLight position={[4, 7, 6]} intensity={1.4} castShadow />
            <directionalLight position={[-5, 2, -3]} intensity={0.3} color="#00e5ff" />
            <Suspense fallback={null}>
              <SlipperScene
                showSole={showSole}
                showStrap={showStrap}
                showCharm={showCharm}
                baseType={sel.baseType || 'flat'}
                baseColor={sel.baseColor || '#888888'}
                strapType={sel.strapType || 'arch'}
                strapColor={sel.strapColor || 'carbon'}
              />
              <ContactShadows position={[0, -1.5, 0]} opacity={showSole ? 0.3 : 0} scale={8} blur={2.5} />
              <Environment preset="studio" />
            </Suspense>
            <OrbitControls enableZoom={expanded} enablePan={false}
              autoRotate={!expanded} autoRotateSpeed={0.5}
              minPolarAngle={Math.PI / 5} maxPolarAngle={Math.PI / 1.9} />
          </Canvas>

          {/* Hint when empty */}
          {!sel.baseType && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center space-y-2">
                <div className="text-3xl opacity-10">◻</div>
                <p className="text-[10px] font-mono text-neutral-700 tracking-[0.3em]">SELECT BASE TO BEGIN</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Right panel ──────────────────────────────────────── */}
        <div className="flex flex-col gap-5">

          {/* Header */}
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[8px] font-mono text-neutral-700 tracking-[0.4em] mb-1">BEYOND_O1 · SS'26</div>
              <h2 className="text-3xl font-black text-white">STRIDE ONE</h2>
            </div>
            {currentBase && (
              <div className="text-right">
                <div className="text-[8px] font-mono text-neutral-700">FROM</div>
                <div className="text-2xl font-black text-white">${price}</div>
              </div>
            )}
          </div>

          {/* Step indicator */}
          {!done && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-neutral-700 tracking-[0.3em]">
                  STEP {step + 1} OF {STEPS.length}
                </span>
                <span className="text-[9px] font-mono text-white tracking-[0.2em]">{STEPS[step]}</span>
              </div>
              <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-cyan-500 rounded-full"
                  animate={{ width: `${((step + (canContinue ? 1 : 0)) / STEPS.length) * 100}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            </div>
          )}

          {/* Step options */}
          <AnimatePresence mode="wait">

            {/* STEP 0: BASE TYPE */}
            {step === 0 && (
              <motion.div key="baseType"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 gap-3"
              >
                {BASE_TYPES.map(b => (
                  <Card key={b.id} selected={sel.baseType === b.id} onClick={() => set('baseType', b.id)}>
                    <div className="p-4 space-y-3">
                      {/* SVG profile */}
                      <div className="w-full h-14 flex items-end justify-center">
                        <svg width="100" height="44" viewBox="0 0 100 44">
                          {b.id === 'flat' && (
                            <ellipse cx="50" cy="38" rx="44" ry={6} fill={sel.baseType === b.id ? '#00e5ff' : '#2a2a2a'} />
                          )}
                          {b.id === 'platform' && (
                            <>
                              <rect x="6" y="22" width="88" height="18" rx="5" fill={sel.baseType === b.id ? '#00e5ff33' : '#1e1e1e'} />
                              <ellipse cx="50" cy="40" rx="44" ry={5} fill={sel.baseType === b.id ? '#00e5ff' : '#2a2a2a'} />
                            </>
                          )}
                          {b.id === 'wedge' && (
                            <path d="M6 42 L94 42 L94 28 L6 42Z" rx="4"
                              fill={sel.baseType === b.id ? '#00e5ff' : '#2a2a2a'} />
                          )}
                          {b.id === 'sport' && (
                            <path d="M6 42 Q14 36 50 34 Q86 36 94 42 Z"
                              fill={sel.baseType === b.id ? '#00e5ff' : '#2a2a2a'} />
                          )}
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className={`text-[11px] font-black tracking-wider ${sel.baseType === b.id ? 'text-white' : 'text-neutral-500'}`}>{b.name}</div>
                        <div className="text-[9px] font-mono text-neutral-700 mt-0.5">{b.desc}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </motion.div>
            )}

            {/* STEP 1: BASE COLOR */}
            {step === 1 && (
              <motion.div key="baseColor"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-3 gap-3"
              >
                {BASE_COLORS.map(c => (
                  <Card key={c.id} selected={sel.baseColor === c.id} onClick={() => set('baseColor', c.id)}>
                    <div className="p-4 flex flex-col items-center gap-2.5">
                      <div className="w-12 h-12 rounded-xl transition-all duration-200"
                        style={{
                          backgroundColor: c.color,
                          boxShadow: sel.baseColor === c.id ? `0 0 22px ${c.color}60, 0 0 0 2px #0a0a0a, 0 0 0 4px ${c.color}` : 'none',
                          transform: sel.baseColor === c.id ? 'scale(1.1)' : 'scale(1)',
                        }}
                      />
                      <span className={`text-[8px] font-black tracking-wider text-center leading-tight ${sel.baseColor === c.id ? 'text-white' : 'text-neutral-600'}`}>
                        {c.name}
                      </span>
                    </div>
                  </Card>
                ))}
              </motion.div>
            )}

            {/* STEP 2: STRAP TYPE */}
            {step === 2 && (
              <motion.div key="strapType"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 gap-3"
              >
                {STRAP_TYPES.map(t => (
                  <Card key={t.id} selected={sel.strapType === t.id} onClick={() => set('strapType', t.id)}>
                    <div className="p-4 space-y-3">
                      <div className="w-full h-14 flex items-center justify-center">
                        <svg width="80" height="40" viewBox="0 0 80 40">
                          {t.id === 'arch' && (
                            <path d="M4 36 L24 8 L40 4 L56 8 L76 36"
                              stroke={sel.strapType === t.id ? '#00e5ff' : '#3a3a3a'}
                              strokeWidth="4" fill="none" strokeLinecap="round" />
                          )}
                          {t.id === 'band' && (
                            <rect x="4" y="14" width="72" height="14" rx="7"
                              fill={sel.strapType === t.id ? '#00e5ff' : '#3a3a3a'} />
                          )}
                          {t.id === 'cross' && (
                            <>
                              <line x1="8" y1="36" x2="72" y2="4" stroke={sel.strapType === t.id ? '#00e5ff' : '#3a3a3a'} strokeWidth="4" strokeLinecap="round" />
                              <line x1="8" y1="4" x2="72" y2="36" stroke={sel.strapType === t.id ? '#00e5ff' : '#3a3a3a'} strokeWidth="4" strokeLinecap="round" />
                            </>
                          )}
                          {t.id === 'open' && (
                            <ellipse cx="40" cy="24" rx="36" ry="12"
                              stroke={sel.strapType === t.id ? '#00e5ff' : '#3a3a3a'}
                              strokeWidth="3" fill="none" strokeDasharray="6 3" />
                          )}
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className={`text-[11px] font-black tracking-wider ${sel.strapType === t.id ? 'text-white' : 'text-neutral-500'}`}>{t.name}</div>
                        <div className="text-[9px] font-mono text-neutral-700 mt-0.5">{t.desc}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </motion.div>
            )}

            {/* STEP 3: STRAP COLOR */}
            {step === 3 && (
              <motion.div key="strapColor"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                {STRAP_COLORS.map(s => (
                  <Card key={s.id} selected={sel.strapColor === s.id} onClick={() => set('strapColor', s.id)}>
                    <div className="flex items-center gap-4 px-4 py-3">
                      <div className="w-9 h-9 rounded-xl shrink-0 border border-white/8"
                        style={{
                          backgroundColor: s.color,
                          boxShadow: sel.strapColor === s.id ? `0 0 14px ${s.color}55` : 'none',
                        }}
                      />
                      <div className="text-left flex-1">
                        <div className={`text-[11px] font-black tracking-wider ${sel.strapColor === s.id ? 'text-white' : 'text-neutral-500'}`}>{s.name}</div>
                        <div className="text-[9px] font-mono text-neutral-700">{s.finish}</div>
                      </div>
                      {sel.strapColor === s.id && <Check size={14} className="text-cyan-400 shrink-0" strokeWidth={2.5} />}
                    </div>
                  </Card>
                ))}
              </motion.div>
            )}

            {/* STEP 4: CHARM */}
            {step === 4 && (
              <motion.div key="charm"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-3 gap-3"
              >
                {CHARMS.map(c => (
                  <Card key={c.id} selected={sel.charm === c.id} onClick={() => set('charm', c.id)}>
                    <div className="py-5 flex flex-col items-center gap-2">
                      <span className={`text-2xl leading-none ${sel.charm === c.id ? '' : 'opacity-40'}`}>{c.icon}</span>
                      <span className={`text-[8px] font-black tracking-[0.2em] ${sel.charm === c.id ? 'text-white' : 'text-neutral-600'}`}>{c.name}</span>
                    </div>
                  </Card>
                ))}
              </motion.div>
            )}

            {/* DONE */}
            {done && (
              <motion.div key="done"
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-white/8 bg-white/3 divide-y divide-white/5 overflow-hidden"
              >
                {[
                  { label: 'BASE TYPE',  value: BASE_TYPES.find(b=>b.id===sel.baseType)?.name ?? '—',  dot: null },
                  { label: 'BASE COLOR', value: currentBase?.name ?? '—', dot: currentBase?.color },
                  { label: 'STRAP TYPE', value: STRAP_TYPES.find(t=>t.id===sel.strapType)?.name ?? '—', dot: null },
                  { label: 'STRAP COLOR',value: STRAP_COLORS.find(s=>s.id===sel.strapColor)?.name ?? '—', dot: STRAP_COLORS.find(s=>s.id===sel.strapColor)?.color },
                  { label: 'CHARM',      value: CHARMS.find(c=>c.id===sel.charm)?.name ?? '—', dot: null },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between px-5 py-3">
                    <span className="text-[9px] font-mono text-neutral-600 tracking-widest">{r.label}</span>
                    <div className="flex items-center gap-2">
                      {r.dot && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: r.dot }} />}
                      <span className="text-[11px] font-black text-white">{r.value}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3 pt-1">
            {step > 0 && !done && (
              <button onClick={back}
                className="w-12 h-12 shrink-0 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center text-neutral-600 hover:text-white hover:border-white/15 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
            )}
            {done && (
              <button onClick={() => { setSel({ baseType:'', baseColor:'', strapType:'', strapColor:'', charm:'' }); setStep(0); }}
                className="w-12 h-12 shrink-0 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center text-neutral-600 hover:text-white hover:border-white/15 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
            )}
            <motion.button
              whileTap={canContinue || done ? { scale: 0.97 } : {}}
              onClick={done ? undefined : next}
              className={`flex-1 h-12 rounded-2xl font-black text-[11px] tracking-[0.2em] flex items-center justify-center gap-2 transition-all duration-200 ${
                done
                  ? 'bg-white text-black hover:bg-cyan-400 cursor-pointer'
                  : canContinue
                  ? 'bg-white text-black hover:bg-cyan-400 cursor-pointer'
                  : 'bg-white/5 border border-white/6 text-neutral-700 cursor-not-allowed'
              }`}
            >
              {done ? (
                <><ShoppingCart size={15} /> ADD TO CART · ${price}</>
              ) : step === 4 ? (
                canContinue ? `FINISH · ${CHARMS.find(c=>c.id===sel.charm)?.name}` : 'SELECT CHARM'
              ) : (
                canContinue ? 'CONTINUE →' : `SELECT ${STEPS[step]}`
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
