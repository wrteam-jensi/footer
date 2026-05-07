'use client';

import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2, ShoppingCart, Camera, ChevronDown, Check, ArrowRight } from 'lucide-react';
import FootScanner from './FootScanner';

// ── Data ────────────────────────────────────────────────────────
const BASES = [
  { id: 'cyan',   color: '#00e5ff', name: 'NEON CYAN',       price: 129 },
  { id: 'purple', color: '#a855f7', name: 'PHANTOM PURPLE',  price: 139 },
  { id: 'black',  color: '#1a1a1a', name: 'OBSIDIAN',        price: 119 },
  { id: 'red',    color: '#ef4444', name: 'VULCAN RED',      price: 129 },
];

const BELTS = [
  { id: 'carbon', color: '#2a2a2a', label: '#1c1c1c', name: 'CARBON MATTE',   finish: 'Matte rubberised' },
  { id: 'gold',   color: '#fbbf24', label: '#fbbf24', name: 'METALLIC GOLD',  finish: 'Brushed metallic' },
  { id: 'white',  color: '#e8e8e8', label: '#ffffff', name: 'PURE WHITE',     finish: 'Gloss coated' },
  { id: 'smoke',  color: '#6b7280', label: '#6b7280', name: 'SMOKE GREY',     finish: 'Soft touch' },
];

const BADGES = [
  { id: 'none',   icon: null,  name: 'CLEAN' },
  { id: 'zap',    icon: '⚡',   name: 'BOLT' },
  { id: 'star',   icon: '✦',   name: 'PRIME' },
  { id: 'b',      icon: 'B',   name: 'BRAND' },
];

const SIZES = [
  { id: 'S', label: 'S', eu: '38–40', uk: '5–7',   scale: 0.87 },
  { id: 'M', label: 'M', eu: '41–43', uk: '7–9',   scale: 1.0  },
  { id: 'L', label: 'L', eu: '44–46', uk: '9–11',  scale: 1.13 },
];

const BRANDS: { id: string; name: string; sizes: Record<string, string> }[] = [
  { id: 'nike',       name: 'Nike',        sizes: { '6':'S','7':'S','8':'M','9':'M','10':'L','11':'L','12':'L' } },
  { id: 'adidas',     name: 'Adidas',      sizes: { '6':'S','7':'S','8':'M','9':'M','10':'L','11':'L','12':'L' } },
  { id: 'puma',       name: 'Puma',        sizes: { '6':'S','7':'S','8':'M','9':'M','10':'L','11':'L','12':'L' } },
  { id: 'newbalance', name: 'New Balance', sizes: { '6':'S','7':'S','8':'M','9':'M','10':'L','11':'L','12':'L' } },
  { id: 'hm',         name: 'H&M',         sizes: { '38':'S','39':'S','40':'S','41':'M','42':'M','43':'M','44':'L','45':'L','46':'L' } },
  { id: 'zara',       name: 'Zara',        sizes: { '38':'S','39':'S','40':'S','41':'M','42':'M','43':'M','44':'L','45':'L','46':'L' } },
];

const TABS = ['COLOR', 'STRAP', 'BADGE', 'SIZE'];

// ── 3D Model ────────────────────────────────────────────────────
function SlipperMesh({ base, belt, badge, size }: { base: string; belt: string; badge: string; size: string }) {
  const baseObj  = BASES.find(b => b.id === base)  ?? BASES[0];
  const beltObj  = BELTS.find(b => b.id === belt)  ?? BELTS[0];
  const sizeObj  = SIZES.find(s => s.id === size)  ?? SIZES[1];

  const baseColor = baseObj.color;
  const soleColor = '#111111';
  const beltColor = beltObj.color;

  return (
    <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.35}>
      <group rotation={[0.28, -0.45, 0]} scale={sizeObj.scale}>

        {/* ── Outer sole (rubber bottom) */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow position={[0, -0.05, 0]}>
          <capsuleGeometry args={[0.58, 2.9, 8, 32]} />
          <meshStandardMaterial color={soleColor} roughness={0.85} metalness={0.0} />
        </mesh>

        {/* ── Midsole (foam layer) */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow position={[0, 0.36, 0]}>
          <capsuleGeometry args={[0.44, 2.65, 8, 32]} />
          <meshStandardMaterial
            color={baseColor}
            roughness={0.35}
            metalness={0.08}
            emissive={baseColor}
            emissiveIntensity={0.06}
          />
        </mesh>

        {/* ── Footbed top (slightly lighter) */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.66, 0]}>
          <capsuleGeometry args={[0.24, 2.5, 8, 32]} />
          <meshStandardMaterial color={baseColor} roughness={0.5} metalness={0.0} emissive={baseColor} emissiveIntensity={0.03} />
        </mesh>

        {/* ── Left strap arm */}
        <mesh position={[0.42, 0.98, 0.18]} rotation={[-0.18, 0.08, -0.62]} castShadow>
          <capsuleGeometry args={[0.115, 0.88, 4, 16]} />
          <meshStandardMaterial color={beltColor} roughness={0.22} metalness={0.45} />
        </mesh>

        {/* ── Right strap arm */}
        <mesh position={[-0.42, 0.98, 0.18]} rotation={[-0.18, -0.08, 0.62]} castShadow>
          <capsuleGeometry args={[0.115, 0.88, 4, 16]} />
          <meshStandardMaterial color={beltColor} roughness={0.22} metalness={0.45} />
        </mesh>

        {/* ── Strap bridge (top connector) */}
        <mesh position={[0, 1.22, 0.28]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <capsuleGeometry args={[0.115, 0.52, 4, 16]} />
          <meshStandardMaterial color={beltColor} roughness={0.22} metalness={0.45} />
        </mesh>

        {/* ── Badge dot */}
        {badge !== 'none' && (
          <mesh position={[0.6, 0.78, 0.46]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.8} emissive="#ffffff" emissiveIntensity={0.3} />
          </mesh>
        )}
      </group>
    </Float>
  );
}

// ── Main Component ──────────────────────────────────────────────
export default function SlipperCustomizer() {
  const [tab, setTab]       = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [brandId, setBrandId]         = useState('nike');
  const [brandInput, setBrandInput]   = useState('');
  const [convertResult, setConvertResult] = useState<string | null>(null);

  const [sel, setSel] = useState({ base: 'cyan', belt: 'carbon', badge: 'none', size: 'M' });
  const set = (k: string, v: string) => setSel(p => ({ ...p, [k]: v }));

  const currentBase  = BASES.find(b => b.id === sel.base)!;
  const currentBelt  = BELTS.find(b => b.id === sel.belt)!;
  const currentSize  = SIZES.find(s => s.id === sel.size)!;

  const handleConvert = () => {
    const brand = BRANDS.find(b => b.id === brandId);
    if (!brand) return;
    const mapped = brand.sizes[brandInput.trim()];
    setConvertResult(mapped ?? null);
    if (mapped) set('size', mapped);
  };

  return (
    <section className="w-full bg-[#050505] py-16 px-4 md:px-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px]"
          style={{ backgroundColor: `${currentBase.color}0a` }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-start">

        {/* ─── 3D Viewport ─────────────────────────────────────── */}
        <div className={`relative rounded-3xl bg-neutral-950 border border-white/6 overflow-hidden transition-all duration-700 ${
          expanded ? 'fixed inset-4 z-[100] rounded-2xl' : 'h-[480px] lg:h-[640px]'
        }`}>
          {/* Top bar */}
          <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-6 pt-6 pb-3 bg-gradient-to-b from-black/60 to-transparent">
            <div>
              <div className="text-[9px] font-mono text-neutral-600 tracking-[0.35em] mb-0.5">LIVE PREVIEW · BEYOND_O1</div>
              <div className="text-xl font-black text-white tracking-tight">STRIDE ONE</div>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-9 h-9 rounded-full bg-white/6 border border-white/10 flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/12 transition-all"
            >
              {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>

          {/* Canvas */}
          <Canvas shadows camera={{ position: [0, 1, 8.5], fov: 38 }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
            <directionalLight position={[-4, 3, -4]} intensity={0.4} color="#00e5ff" />
            <Suspense fallback={null}>
              <SlipperMesh base={sel.base} belt={sel.belt} badge={sel.badge} size={sel.size} />
              <ContactShadows position={[0, -2.4, 0]} opacity={0.4} scale={8} blur={2} />
              <Environment preset="studio" />
            </Suspense>
            <OrbitControls
              enableZoom={expanded}
              enablePan={false}
              autoRotate={!expanded}
              autoRotateSpeed={0.6}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.8}
            />
          </Canvas>

          {/* Bottom config chips */}
          <div className="absolute bottom-0 inset-x-0 flex items-center gap-2 px-6 pb-6 pt-8 bg-gradient-to-t from-black/70 to-transparent">
            {[
              { dot: currentBase.color, label: currentBase.name },
              { dot: currentBelt.label, label: currentBelt.name },
              { dot: null,              label: `SIZE ${sel.size} · EU ${currentSize.eu}` },
            ].map(c => (
              <div key={c.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 border border-white/8 backdrop-blur-sm">
                {c.dot && <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.dot }} />}
                <span className="text-[9px] font-mono text-neutral-400 tracking-widest whitespace-nowrap">{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Right panel ─────────────────────────────────────── */}
        <div className="flex flex-col gap-4">

          {/* Product info */}
          <div className="px-1">
            <div className="text-[9px] font-mono text-neutral-600 tracking-[0.4em] mb-1">BEYOND_O1 · SS'26</div>
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-black text-white tracking-tight">STRIDE ONE</h2>
              <div className="text-right">
                <div className="text-xs text-neutral-600 font-mono">FROM</div>
                <div className="text-2xl font-black text-white">${currentBase.price}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex gap-0.5">{[...Array(5)].map((_,i) => <span key={i} className="text-yellow-400 text-xs">★</span>)}</div>
              <span className="text-[10px] font-mono text-neutral-600">4.9 · 2.1k reviews</span>
            </div>
          </div>

          {/* Tab strip */}
          <div className="flex bg-neutral-900/60 border border-white/6 rounded-2xl p-1 gap-1">
            {TABS.map((t, i) => (
              <button
                key={t}
                onClick={() => setTab(i)}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all duration-200 ${
                  tab === i
                    ? 'bg-white text-black shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Content panel */}
          <div className="rounded-3xl bg-neutral-950/80 border border-white/6 overflow-hidden">
            <AnimatePresence mode="wait">

              {/* ── COLOR tab */}
              {tab === 0 && (
                <motion.div key="color"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="p-6 space-y-4"
                >
                  <div className="text-[9px] font-mono text-neutral-600 tracking-[0.3em]">SELECT BASE COLOR</div>
                  <div className="grid grid-cols-4 gap-3">
                    {BASES.map(b => (
                      <button key={b.id} onClick={() => set('base', b.id)}
                        className="flex flex-col items-center gap-2.5 group"
                      >
                        <div className={`w-12 h-12 rounded-2xl transition-all duration-200 ${
                          sel.base === b.id
                            ? 'scale-110'
                            : 'scale-100 opacity-70 group-hover:opacity-100 group-hover:scale-105'
                        }`}
                          style={{
                            backgroundColor: b.color,
                            boxShadow: sel.base === b.id
                              ? `0 0 20px ${b.color}60, 0 0 0 2px #0a0a0a, 0 0 0 4px ${b.color}`
                              : 'none',
                          }}
                        >
                          {sel.base === b.id && (
                            <div className="w-full h-full rounded-2xl flex items-center justify-center">
                              <Check size={16} className={b.id === 'black' ? 'text-white' : 'text-black/70'} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        <span className={`text-[8px] font-black tracking-wider text-center leading-tight transition-colors ${
                          sel.base === b.id ? 'text-white' : 'text-neutral-600 group-hover:text-neutral-400'
                        }`}>{b.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 px-4 py-3 rounded-2xl bg-white/3 border border-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-black text-white">{currentBase.name}</div>
                        <div className="text-[10px] font-mono text-neutral-600 mt-0.5">Aerospace-grade EVA foam · UV stable</div>
                      </div>
                      <div className="text-xl font-black text-white">${currentBase.price}</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── STRAP tab */}
              {tab === 1 && (
                <motion.div key="strap"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="p-6 space-y-4"
                >
                  <div className="text-[9px] font-mono text-neutral-600 tracking-[0.3em]">SELECT STRAP MATERIAL</div>
                  <div className="space-y-2">
                    {BELTS.map(b => (
                      <button key={b.id} onClick={() => set('belt', b.id)}
                        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all duration-200 ${
                          sel.belt === b.id
                            ? 'border-white/20 bg-white/5'
                            : 'border-white/5 hover:border-white/10 bg-transparent'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-xl shrink-0 border border-white/10"
                          style={{ backgroundColor: b.color, boxShadow: sel.belt === b.id ? `0 0 12px ${b.color}40` : 'none' }} />
                        <div className="text-left flex-1">
                          <div className={`text-xs font-black tracking-wider ${sel.belt === b.id ? 'text-white' : 'text-neutral-400'}`}>{b.name}</div>
                          <div className="text-[10px] font-mono text-neutral-700 mt-0.5">{b.finish}</div>
                        </div>
                        {sel.belt === b.id && <Check size={14} className="text-cyan-400 shrink-0" strokeWidth={2.5} />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── BADGE tab */}
              {tab === 2 && (
                <motion.div key="badge"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="p-6 space-y-4"
                >
                  <div className="text-[9px] font-mono text-neutral-600 tracking-[0.3em]">SELECT BADGE</div>
                  <div className="grid grid-cols-4 gap-3">
                    {BADGES.map(bg => (
                      <button key={bg.id} onClick={() => set('badge', bg.id)}
                        className={`aspect-square rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-200 ${
                          sel.badge === bg.id
                            ? 'border-white/25 bg-white/8 text-white'
                            : 'border-white/6 bg-white/2 text-neutral-700 hover:border-white/12 hover:text-neutral-400'
                        }`}
                      >
                        <span className="text-xl">{bg.icon ?? '–'}</span>
                        <span className="text-[8px] font-black tracking-widest">{bg.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── SIZE tab */}
              {tab === 3 && (
                <motion.div key="size"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="p-6 space-y-4"
                >
                  {/* Size grid */}
                  <div className="text-[9px] font-mono text-neutral-600 tracking-[0.3em]">SELECT SIZE</div>
                  <div className="grid grid-cols-3 gap-2">
                    {SIZES.map(s => (
                      <button key={s.id} onClick={() => set('size', s.id)}
                        className={`py-4 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                          sel.size === s.id
                            ? 'border-white/25 bg-white/8 text-white'
                            : 'border-white/6 text-neutral-600 hover:border-white/12 hover:text-neutral-300'
                        }`}
                      >
                        <span className="text-2xl font-black">{s.label}</span>
                        <span className="text-[9px] font-mono text-neutral-600">EU {s.eu}</span>
                      </button>
                    ))}
                  </div>

                  {/* AI Scan */}
                  <button onClick={() => setShowScanner(true)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-cyan-500/15 bg-cyan-500/4 hover:bg-cyan-500/8 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/12 border border-cyan-500/20 flex items-center justify-center shrink-0">
                      <Camera size={15} className="text-cyan-500" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="text-[11px] font-black text-white tracking-wider">AI FOOT SCAN</div>
                      <div className="text-[9px] font-mono text-neutral-600">Camera measurement · instant size</div>
                    </div>
                    <ArrowRight size={14} className="text-neutral-700 group-hover:text-cyan-500 group-hover:translate-x-0.5 transition-all" />
                  </button>

                  {/* Brand converter */}
                  <div className="space-y-3 px-4 py-4 rounded-2xl border border-white/5 bg-white/2">
                    <div className="text-[9px] font-mono text-neutral-600 tracking-[0.3em]">CONVERT FROM ANOTHER BRAND</div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <select value={brandId} onChange={e => { setBrandId(e.target.value); setConvertResult(null); }}
                          className="w-full appearance-none bg-neutral-900 border border-white/8 rounded-xl px-3 py-2 text-[11px] font-mono text-white focus:outline-none focus:border-white/20 pr-6"
                        >
                          {BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                        <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-600 pointer-events-none" />
                      </div>
                      <input value={brandInput} onChange={e => { setBrandInput(e.target.value); setConvertResult(null); }}
                        onKeyDown={e => e.key === 'Enter' && handleConvert()}
                        placeholder="US 9"
                        className="w-20 bg-neutral-900 border border-white/8 rounded-xl px-3 py-2 text-[11px] font-mono text-white placeholder-neutral-700 focus:outline-none focus:border-white/20"
                      />
                      <button onClick={handleConvert}
                        className="px-3 py-2 bg-white text-black rounded-xl text-[10px] font-black hover:bg-cyan-400 transition-colors"
                      >FIT</button>
                    </div>
                    <AnimatePresence>
                      {convertResult !== null && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                          className={`text-[10px] font-mono px-3 py-2 rounded-xl ${convertResult ? 'text-cyan-400 bg-cyan-500/8 border border-cyan-500/15' : 'text-red-400 bg-red-500/8 border border-red-500/15'}`}
                        >
                          {convertResult
                            ? `→ SIZE ${convertResult} (EU ${SIZES.find(s => s.id === convertResult)?.eu}) · applied`
                            : 'Size not found — try adjacent size'}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CTA row */}
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-white text-black text-[11px] font-black tracking-[0.18em] hover:bg-cyan-400 transition-colors group">
              <ShoppingCart size={15} className="group-hover:scale-110 transition-transform" />
              ADD TO CART · ${currentBase.price}
            </button>
            <button onClick={() => setExpanded(!expanded)}
              className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/8 flex items-center justify-center text-neutral-500 hover:text-white hover:border-white/20 transition-all"
            >
              <Maximize2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Scanner modal */}
      <AnimatePresence>
        {showScanner && (
          <FootScanner
            onResult={s => { set('size', s); setTab(3); }}
            onClose={() => setShowScanner(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
