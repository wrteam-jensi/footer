'use client';

import { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Plus, Check, ChevronDown, Star, Anchor, Move, ZoomIn, ShoppingCart, Bookmark } from 'lucide-react';

// ── Data ────────────────────────────────────────────────────────
const SLIPPER_STYLES = [
  { id: 'slide',    name: 'Classic Slide', svgPath: 'M4 18 Q4 10 28 8 Q52 10 52 18 L52 22 Q52 26 28 24 Q4 26 4 22Z' },
  { id: 'thong',   name: 'Thong',         svgPath: 'M4 22 Q16 10 28 8 Q40 10 52 22 M28 8 L28 24' },
  { id: 'mule',    name: 'Mules',         svgPath: 'M4 22 Q4 12 28 10 Q52 12 52 22 L52 26 Q28 28 4 26Z M4 22 L52 22' },
  { id: 'platform',name: 'Platform',      svgPath: 'M4 22 Q4 10 28 8 Q52 10 52 22 L52 28 Q52 30 28 30 Q4 30 4 28Z M4 24 L52 24' },
  { id: 'flipflop',name: 'Flip-Flop',    svgPath: 'M4 24 Q16 22 28 22 Q40 22 52 24 M28 22 L28 10 M28 10 Q20 14 16 20 M28 10 Q36 14 40 20' },
  { id: 'wedge',   name: 'Wedge',        svgPath: 'M4 26 Q4 14 28 10 Q52 12 52 18 L52 22 Q52 26 28 24 L4 30Z' },
  { id: 'cloud',   name: 'Cloud',        svgPath: 'M8 22 Q6 14 14 13 Q16 8 22 10 Q26 6 32 9 Q40 6 44 12 Q52 12 52 20 Q52 26 28 26 Q4 26 8 22Z' },
];
const SOLE_MATERIALS = ['Recycled Rubber', 'EVA Foam'];
const BASE_COLORS = [
  { id: 'navy',   color: '#1e3a5f' }, { id: 'darkblue', color: '#1e2d6e' },
  { id: 'blue',   color: '#3b5bdb' }, { id: 'yellow',   color: '#f59f00' },
  { id: 'red',    color: '#e03131' }, { id: 'cream',    color: '#f0e6d3' },
];
const STRAP_MATERIALS = ['Textile', 'Leather', 'Neoprene'];
const STRAP_COLORS = [
  { id: 'white',   color: '#f0f0f0' }, { id: 'black',  color: '#1a1a1a' },
  { id: 'navy',    color: '#1e3a5f' }, { id: 'beige',  color: '#d4b896' },
  { id: 'red',     color: '#ef4444' }, { id: 'green',  color: '#22c55e' },
];
const FONTS = ['Montserrat', 'Playfair', 'Roboto', 'Pacifico'] as const;
const CHARMS = [
  { id: 'none',   name: 'None',   icon: null },
  { id: 'star',   name: 'Star',   icon: Star },
  { id: 'anchor', name: 'Anchor', icon: Anchor },
];
const STEPS = ['Slipper Type', 'Base & Strap', 'Graphics & Colors', 'Add-ons', 'Review'];

// ── AnimPart ────────────────────────────────────────────────────
function AnimPart({ show, children }: { show: boolean; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    const t = show ? 1 : 0;
    const s = ref.current.scale.x + (t - ref.current.scale.x) * Math.min(dt * 8, 1);
    ref.current.scale.setScalar(Math.max(0.0001, s));
  });
  return <group ref={ref} scale={0.0001}>{children}</group>;
}

// ── LiveMat ─────────────────────────────────────────────────────
function LiveMat({ color, roughness = 0.45, metalness = 0.05, clearcoat = 0.5 }:
  { color: string; roughness?: number; metalness?: number; clearcoat?: number }) {
  const mat = useRef<THREE.MeshPhysicalMaterial>(null);
  const tgt = useRef(new THREE.Color(color));
  useFrame(() => {
    if (!mat.current) return;
    tgt.current.set(color);
    mat.current.color.lerp(tgt.current, 0.1);
  });
  return <meshPhysicalMaterial ref={mat} color={color} roughness={roughness}
    metalness={metalness} clearcoat={clearcoat} clearcoatRoughness={0.3} />;
}

// ── 3D Slipper ──────────────────────────────────────────────────
function SlipperModel({ style, baseColor, strapColor, showStrap }:
  { style: string; baseColor: string; strapColor: string; showStrap: boolean }) {
  const bc = BASE_COLORS.find(c => c.id === baseColor)?.color ?? '#1e3a5f';
  const sc = STRAP_COLORS.find(c => c.id === strapColor)?.color ?? '#f0f0f0';

  const sm = <meshPhysicalMaterial color={sc} roughness={0.35} metalness={0.05} clearcoat={0.7} clearcoatRoughness={0.2} />;

  // Per-style sole height so straps always sit correctly
  const soleH: Record<string, number> = {
    slide: 0.20, thong: 0.20, mule: 0.20,
    platform: 0.55, flipflop: 0.10, wedge: 0.20, cloud: 0.28,
  };
  const midsoleY: Record<string, number> = {
    slide: 0.18, thong: 0.18, mule: 0.18,
    platform: 0.40, flipflop: 0.09, wedge: 0.18, cloud: 0.22,
  };
  const strapY: Record<string, number> = {
    slide: 0.44, thong: 0.38, mule: 0.44,
    platform: 0.80, flipflop: 0.22, wedge: 0.44, cloud: 0.52,
  };
  const mh  = soleH[style]  ?? 0.20;
  const my  = midsoleY[style] ?? 0.18;
  const sy  = strapY[style] ?? 0.44;

  return (
    <group rotation={[0.08, -0.35, -0.18]} scale={1.15}>

      {/* ── Rubber outer sole ── */}
      {style === 'wedge' ? (
        // Wedge: tapered box — thick heel, thin toe
        <group>
          <mesh position={[0, 0, 0]} castShadow receiveShadow
            rotation={[0, 0, 0]}>
            <boxGeometry args={[3.7, 0.14, 1.52]} />
            <meshPhysicalMaterial color="#c8bfb0" roughness={0.85} metalness={0} />
          </mesh>
          {/* heel block */}
          <mesh position={[-1.0, 0.25, 0]} castShadow>
            <boxGeometry args={[1.6, 0.50, 1.48]} />
            <LiveMat color={bc} roughness={0.5} metalness={0.02} clearcoat={0.35} />
          </mesh>
          {/* toe ramp */}
          <mesh position={[0.85, 0.10, 0]} castShadow>
            <boxGeometry args={[2.0, 0.18, 1.44]} />
            <LiveMat color={bc} roughness={0.5} metalness={0.02} clearcoat={0.35} />
          </mesh>
        </group>
      ) : style === 'platform' ? (
        // Platform: tall flat cylinder stack
        <group>
          <mesh scale={[1.9, 0.14, 0.78]} position={[0, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1, 1, 1, 56]} />
            <meshPhysicalMaterial color="#a09588" roughness={0.9} metalness={0} />
          </mesh>
          {/* chunky mid-platform — two colored layers */}
          <mesh scale={[1.82, 0.30, 0.74]} position={[0, 0.22, 0]} castShadow>
            <cylinderGeometry args={[1, 1, 1, 56]} />
            <LiveMat color={bc} roughness={0.45} metalness={0.03} clearcoat={0.5} />
          </mesh>
          <mesh scale={[1.78, 0.24, 0.71]} position={[0, 0.50, 0]} castShadow>
            <cylinderGeometry args={[1, 1, 1, 56]} />
            <meshPhysicalMaterial color="#e8dfd0" roughness={0.6} metalness={0} />
          </mesh>
        </group>
      ) : style === 'cloud' ? (
        // Cloud: puffy bumpy base — multiple overlapping spheres
        <group>
          {[
            [0, 0, 0, 1.0],
            [0.55, 0.03, 0, 0.85],
            [-0.55, 0.03, 0, 0.85],
            [0.28, 0.08, 0.22, 0.72],
            [-0.28, 0.08, 0.22, 0.72],
            [0.28, 0.08, -0.22, 0.72],
            [-0.28, 0.08, -0.22, 0.72],
          ].map(([x, y, z, r], i) => (
            <mesh key={i} position={[x as number * 1.5, (y as number) * 0.6 + 0.14, (z as number) * 1.8]} scale={[(r as number)*1.05, r as number * 0.55, (r as number) * 0.95]} castShadow>
              <sphereGeometry args={[1, 24, 16]} />
              <LiveMat color={bc} roughness={0.25} metalness={0} clearcoat={0.8} />
            </mesh>
          ))}
          {/* flat footbed on top */}
          <mesh scale={[1.65, 0.05, 0.64]} position={[0, 0.38, 0]}>
            <cylinderGeometry args={[1, 1, 1, 48]} />
            <meshPhysicalMaterial color="#e8dfd0" roughness={0.6} metalness={0} />
          </mesh>
        </group>
      ) : style === 'flipflop' ? (
        // Flip-flop: super thin flat sole
        <group>
          <mesh scale={[1.9, 0.08, 0.78]} position={[0, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1, 1, 1, 56]} />
            <meshPhysicalMaterial color="#c8bfb0" roughness={0.85} metalness={0} />
          </mesh>
          <mesh scale={[1.78, 0.06, 0.72]} position={[0, 0.07, 0]} castShadow>
            <cylinderGeometry args={[1, 1, 1, 56]} />
            <LiveMat color={bc} roughness={0.5} metalness={0.02} clearcoat={0.35} />
          </mesh>
        </group>
      ) : (
        // Default (slide / thong / mule)
        <group>
          <mesh scale={[1.9, 0.16, 0.78]} position={[0, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1, 1, 1, 56]} />
            <meshPhysicalMaterial color="#c8bfb0" roughness={0.85} metalness={0} />
          </mesh>
          <mesh scale={[1.85, 0.04, 0.74]} position={[0, -0.06, 0]}>
            <cylinderGeometry args={[1, 1.08, 1, 56]} />
            <meshPhysicalMaterial color="#a09588" roughness={0.9} metalness={0} />
          </mesh>
          <mesh scale={[1.78, mh, 0.72]} position={[0, my, 0]} castShadow>
            <cylinderGeometry args={[1, 1, 1, 56]} />
            <LiveMat color={bc} roughness={0.5} metalness={0.02} clearcoat={0.35} />
          </mesh>
          <mesh scale={[1.68, 0.04, 0.66]} position={[0, 0.30, 0]}>
            <cylinderGeometry args={[1, 1, 1, 56]} />
            <meshPhysicalMaterial color="#e8dfd0" roughness={0.65} metalness={0} />
          </mesh>
        </group>
      )}

      {/* ── Strap — shared across all styles ── */}
      <AnimPart show={showStrap}>
        {(style === 'slide' || style === 'platform') && (
          <mesh position={[0.15, sy, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <capsuleGeometry args={[0.22, 1.30, 10, 28]} />{sm}
          </mesh>
        )}
        {(style === 'thong' || style === 'flipflop') && <>
          {/* toe post */}
          <mesh position={[0.88, sy - 0.06, 0]} castShadow>
            <capsuleGeometry args={[0.07, 0.18, 4, 14]} />{sm}
          </mesh>
          {/* left strap */}
          <mesh position={[0.28, sy - 0.08, -0.30]} rotation={[Math.PI / 2, -2.03, 0]} castShadow>
            <capsuleGeometry args={[0.07, 1.35, 4, 16]} />{sm}
          </mesh>
          {/* right strap */}
          <mesh position={[0.28, sy - 0.08, 0.30]} rotation={[Math.PI / 2, -1.11, 0]} castShadow>
            <capsuleGeometry args={[0.07, 1.35, 4, 16]} />{sm}
          </mesh>
        </>}
        {(style === 'mule' || style === 'wedge') && <>
          <mesh position={[0.48, sy, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <capsuleGeometry args={[0.14, 1.30, 8, 22]} />{sm}
          </mesh>
          <mesh position={[-0.22, sy, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <capsuleGeometry args={[0.14, 1.30, 8, 22]} />{sm}
          </mesh>
        </>}
        {style === 'cloud' && (
          // Soft single wide band for cloud slide
          <mesh position={[0.1, sy, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <capsuleGeometry args={[0.26, 1.20, 12, 32]} />{sm}
          </mesh>
        )}
      </AnimPart>
    </group>
  );
}

// ── Pill toggle button ───────────────────────────────────────────
function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
        active ? 'bg-cyan-400 border-cyan-400 text-black' : 'border-gray-300 text-gray-600 hover:border-gray-400'
      }`}
    >{label}</button>
  );
}

// ── Color dot ────────────────────────────────────────────────────
function ColorDot({ color, selected, onClick }: { color: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="relative w-7 h-7 rounded-full border-2 transition-all hover:scale-110"
      style={{ backgroundColor: color, borderColor: selected ? '#06b6d4' : 'transparent',
               boxShadow: selected ? `0 0 0 2px #fff, 0 0 0 3.5px #06b6d4` : 'none' }}
    />
  );
}

// ── Style icon button ────────────────────────────────────────────
function StyleBtn({ item, active, onClick }: { item: typeof SLIPPER_STYLES[0]; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`flex flex-col items-center gap-1.5 px-2.5 py-2 rounded-xl border-2 transition-all shrink-0 ${
        active ? 'border-cyan-400 bg-cyan-50' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <svg width="48" height="28" viewBox="0 0 56 32">
        <ellipse cx="28" cy="26" rx="24" ry="7" fill={active ? '#e0f9ff' : '#f0f0f0'} />
        <path d={item.svgPath} stroke={active ? '#06b6d4' : '#999'} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
      <span className={`text-[9px] font-semibold whitespace-nowrap ${active ? 'text-cyan-600' : 'text-gray-500'}`}>{item.name}</span>
    </button>
  );
}

// ── Main ─────────────────────────────────────────────────────────
export default function SlipperCustomizer() {
  const [currentStep, setCurrentStep] = useState(1);
  const [sel, setSel] = useState({
    style: 'slide', soleMat: 'Recycled Rubber', baseColor: 'navy',
    strapMat: 'Textile', strapColor: 'white', strapColorHex: '#f0f0f0',
    customText: 'OCEAN VIBES', font: 'Montserrat', textSize: '14', textColor: '#06b6d4',
    monogram: true, charm: 'star',
    graphicUploaded: false,
  });
  const set = (k: keyof typeof sel, v: string | boolean) => setSel(p => ({ ...p, [k]: v }));

  const basePrice = 65;
  const graphicsPrice = sel.graphicUploaded ? 15 : 0;
  const embroideryPrice = sel.customText ? 10 : 0;
  const charmsPrice = sel.charm !== 'none' ? 8 : 0;
  const total = basePrice + graphicsPrice + embroideryPrice + charmsPrice;

  return (
    <section className="w-full bg-white">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:grid lg:grid-cols-[45%_55%] lg:min-h-[680px]">

        {/* ── LEFT: 3D canvas ──────────────────────────────────── */}
        <div className="relative bg-linear-to-br from-[#ddeeff] to-[#eef6ff] flex items-center justify-center overflow-hidden"
          style={{ minHeight: 320 }}>
          <Canvas shadows camera={{ position: [0, 1.8, 7], fov: 36 }} className="w-full"
            style={{ height: '100%', minHeight: 320, maxHeight: 560 }}>
            <color attach="background" args={['#e8f2fa']} />
            <ambientLight intensity={0.9} />
            <directionalLight position={[4, 8, 6]} intensity={1.4} castShadow shadow-mapSize={1024} />
            <directionalLight position={[-4, 4, -2]} intensity={0.4} color="#c8e8ff" />
            <Suspense fallback={null}>
              <SlipperModel
                style={sel.style}
                baseColor={sel.baseColor}
                strapColor={sel.strapColor}
                showStrap={true}
              />
              <ContactShadows position={[0, -0.9, 0]} opacity={0.3} scale={8} blur={2} color="#88aacc" />
              <Environment preset="apartment" />
            </Suspense>
            <OrbitControls enableZoom autoRotate={false}
              minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.8} />
          </Canvas>

          {/* Floating color toolbar */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/80 backdrop-blur-sm shadow-xl">
            {['#e03131', '#f59f00', '#22c55e', '#3b5bdb', '#f0f0f0'].map(c => (
              <button key={c} onClick={() => setSel(p => ({ ...p, strapColor: Object.values(STRAP_COLORS).find(s => s.color === c)?.id ?? p.strapColor, strapColorHex: c }))}
                className="w-6 h-6 rounded-full border-2 hover:scale-110 transition-transform"
                style={{ backgroundColor: c, borderColor: sel.strapColorHex === c ? '#fff' : 'transparent' }}
              />
            ))}
            <div className="w-px h-5 bg-white/20 mx-1" />
            <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors">
              <span className="text-sm font-black">Ag</span>
            </button>
            <button className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-black">
              <span className="text-xs font-black">T</span>
            </button>
          </div>

          {/* Zoom controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-1">
            <button className="w-8 h-8 rounded-lg bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:bg-white transition-colors shadow-sm">
              <ZoomIn size={14} />
            </button>
            <button className="w-8 h-8 rounded-lg bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:bg-white transition-colors shadow-sm">
              <Move size={14} />
            </button>
          </div>
        </div>

        {/* ── RIGHT: Config panel ───────────────────────────────── */}
        <div className="bg-white flex flex-col border-t lg:border-t-0 lg:border-l border-gray-100">
          {/* Header + steps */}
          <div className="px-4 md:px-6 pt-4 md:pt-5 pb-3 md:pb-4 border-b border-gray-100">
            <h2 className="text-lg md:text-2xl font-black text-gray-900 tracking-tight mb-2 md:mb-3">DESIGN YOUR SLIPPERS</h2>
            <div className="flex items-center gap-1 flex-wrap">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-0.5">
                  <button onClick={() => setCurrentStep(i)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-[9px] md:text-[10px] font-bold transition-all ${
                      i === currentStep ? 'bg-cyan-400 text-black' :
                      i < currentStep  ? 'bg-gray-100 text-gray-500' : 'text-gray-400'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center text-[8px] font-black ${
                      i === currentStep ? 'bg-black/15 text-black' : 'bg-gray-200 text-gray-500'
                    }`}>{i < currentStep ? '✓' : i + 1}</span>
                    <span className="hidden sm:inline">{s}</span>
                  </button>
                  {i < STEPS.length - 1 && <span className="text-gray-200 text-[10px]">›</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Responsive grid: 1-col mobile → 2-col md → 3-col lg */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:divide-x divide-gray-100 overflow-y-auto lg:overflow-hidden">

            {/* ── COL 1: Base & Strap ──────────────────────────── */}
            <div className="p-4 md:p-4 space-y-5 overflow-y-auto border-b md:border-b-0 border-gray-100">
              <div>
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">1. Base & Type</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-semibold text-gray-500 mb-1.5">Slipper Style</p>
                    {/* Horizontally scrollable row to fit all 7 styles */}
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
                      {SLIPPER_STYLES.map(s => (
                        <StyleBtn key={s.id} item={s} active={sel.style === s.id} onClick={() => set('style', s.id)} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-gray-500 mb-1.5">Sole Material</p>
                    <div className="flex gap-2 flex-wrap">
                      {SOLE_MATERIALS.map(m => (
                        <Pill key={m} label={m} active={sel.soleMat === m} onClick={() => set('soleMat', m)} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-gray-500 mb-1.5">Color</p>
                    <div className="flex gap-2 flex-wrap">
                      {BASE_COLORS.map(c => (
                        <ColorDot key={c.id} color={c.color} selected={sel.baseColor === c.id} onClick={() => set('baseColor', c.id)} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">2. Strap Customization</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-semibold text-gray-500 mb-1.5">Strap Material</p>
                    <div className="flex gap-2 flex-wrap">
                      {STRAP_MATERIALS.map(m => (
                        <Pill key={m} label={m} active={sel.strapMat === m} onClick={() => set('strapMat', m)} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-500 mb-1.5">Strap Color</p>
                    <div className="flex gap-2 flex-wrap">
                      {STRAP_COLORS.map(c => (
                        <ColorDot key={c.id} color={c.color} selected={sel.strapColor === c.id} onClick={() => { set('strapColor', c.id); set('strapColorHex', c.color); }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── COL 2: Graphics & Text ───────────────────────── */}
            <div className="p-4 space-y-4 overflow-y-auto border-b md:border-b-0 border-gray-100">
              <div>
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">3. Graphics & Embroidery</h3>
                <p className="text-[10px] font-semibold text-gray-500 mb-2">Upload Your Design</p>
                <button
                  onClick={() => set('graphicUploaded', !sel.graphicUploaded)}
                  className="w-full py-4 rounded-xl bg-cyan-400 hover:bg-cyan-500 transition-colors flex flex-col items-center gap-1.5"
                >
                  <Plus size={20} className="text-black" />
                  <span className="text-[11px] font-black text-black">Upload (AI, EPS, SVG)</span>
                </button>
                <button className="w-full text-center text-[10px] text-cyan-600 font-semibold mt-2 hover:underline">
                  or Browse Library
                </button>
              </div>

              {sel.graphicUploaded && (
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-gray-500">Edit Graphic</p>
                  {(['Scale', 'Rotate', 'Position'] as const).map((label) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 w-14">{label}</span>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full w-1/2 bg-cyan-400 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-gray-500">Add Text</p>
                <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">CUSTOM TEXT</p>
                <input
                  value={sel.customText}
                  onChange={e => set('customText', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 focus:outline-none focus:border-cyan-400"
                />
                <div className="grid grid-cols-3 gap-1.5">
                  <div>
                    <p className="text-[9px] text-gray-400 mb-1">Font</p>
                    <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-2 py-1.5">
                      <span className="text-[10px] text-gray-700 truncate">{sel.font}</span>
                      <ChevronDown size={10} className="text-gray-400 shrink-0 ml-auto" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 mb-1">Size</p>
                    <input value={sel.textSize} onChange={e => set('textSize', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-[11px] text-center focus:outline-none focus:border-cyan-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 mb-1">Color</p>
                    <div className="h-[30px] rounded-lg border border-gray-200 overflow-hidden">
                      <div className="w-full h-full" style={{ backgroundColor: sel.textColor }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-gray-500">Add-ons</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div onClick={() => set('monogram', !sel.monogram)}
                    className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${sel.monogram ? 'bg-cyan-400 border-cyan-400' : 'border-gray-300'}`}>
                    {sel.monogram && <Check size={10} className="text-black" strokeWidth={3} />}
                  </div>
                  <span className="text-[11px] text-gray-700 font-medium">Initial/Monogram</span>
                  <span className="text-[9px] font-bold text-gray-400 ml-auto">J.M.</span>
                </label>
                <div>
                  <p className="text-[10px] text-gray-500 mb-1.5">Charms/Pin</p>
                  <div className="flex gap-2">
                    {CHARMS.slice(1).map(c => {
                      const Icon = c.icon;
                      return (
                        <button key={c.id} onClick={() => set('charm', sel.charm === c.id ? 'none' : c.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-semibold transition-all ${
                            sel.charm === c.id ? 'border-cyan-400 bg-cyan-50 text-cyan-700' : 'border-gray-200 text-gray-600'
                          }`}>
                          {Icon && <Icon size={11} />}{c.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ── COL 3: Preview + Price ───────────────────────── */}
            {/* On md: spans 2 cols so price/CTA stays accessible. On lg: normal 1 col */}
            <div className="p-4 flex flex-col gap-4 md:col-span-2 lg:col-span-1 overflow-y-auto lg:overflow-y-auto bg-gray-50 lg:bg-white">
              {/* Mini preview thumbnails */}
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">Preview</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2">
                  {['Left', 'Right'].map(side => (
                    <div key={side} className="aspect-square rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden relative">
                      <svg width="70" height="45" viewBox="0 0 70 45">
                        <ellipse cx="35" cy="36" rx="30" ry="9" fill={BASE_COLORS.find(c=>c.id===sel.baseColor)?.color ?? '#1e3a5f'} opacity="0.9" />
                        <rect x="10" y="20" width="50" height="14" rx="7"
                          fill={STRAP_COLORS.find(c=>c.id===sel.strapColor)?.color ?? '#f0f0f0'} />
                        {sel.customText && (
                          <text x="35" y="30" textAnchor="middle" fontSize="6" fill="#00000066" fontWeight="bold"
                            fontFamily="sans-serif">{sel.customText.slice(0, 8)}</text>
                        )}
                      </svg>
                      <span className="absolute bottom-1 right-1.5 text-[8px] text-gray-400 font-mono">{side}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size + color */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Size</p>
                  <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-2">
                    <span className="text-sm font-bold text-gray-700">14</span>
                    <ChevronDown size={12} className="text-gray-400 ml-auto" />
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Color</p>
                  <button className="w-full py-2 rounded-lg bg-cyan-400 text-black text-[11px] font-black">
                    Aqua
                  </button>
                </div>
              </div>

              {/* Price breakdown */}
              <div className="flex-1">
                <p className="text-xs font-black text-gray-900 mb-2">Price Breakdown</p>
                <div className="space-y-1.5 text-[11px]">
                  {[
                    { label: 'Base Price',       amount: basePrice,       always: true },
                    { label: 'Custom Graphics',  amount: graphicsPrice,   always: false },
                    { label: 'Embroidery',       amount: embroideryPrice, always: false },
                    { label: 'Charms',           amount: charmsPrice,     always: false },
                  ].filter(r => r.always || r.amount > 0).map(r => (
                    <div key={r.label} className="flex items-center justify-between text-gray-600">
                      <span>{r.label}</span>
                      <span className={r.amount > basePrice ? 'text-gray-500' : 'font-semibold text-gray-800'}>
                        {r.amount === basePrice ? `$${r.amount}.00` : `+$${r.amount}.00`}
                      </span>
                    </div>
                  ))}
                  <div className="pt-1.5 border-t border-gray-200 flex items-center justify-between font-black text-gray-900">
                    <span>TOTAL:</span>
                    <span className="text-base">${total}.00</span>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-2">
                <button className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-black font-black text-[12px] tracking-wider transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart size={14} /> ADD TO CART
                </button>
                <button className="w-full py-2.5 rounded-xl border-2 border-gray-900 text-gray-900 font-black text-[12px] tracking-wider hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Bookmark size={13} /> SAVE DESIGN
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
