'use client';

import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Float, MeshDistortMaterial, Text, Decal, useTexture } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Settings, ShoppingCart, Zap, Layers, Image as ImageIcon, ArrowUpRight, Camera, ChevronDown } from 'lucide-react';
import FootScanner from './FootScanner';

// --- Constants ---
const BASES = [
  { id: 'cyan', color: '#00e5ff', name: 'NEON CYAN' },
  { id: 'purple', color: '#a855f7', name: 'PHANTOM PURPLE' },
  { id: 'black', color: '#111111', name: 'OBSIDIAN' },
  { id: 'red', color: '#ef4444', name: 'VULCAN RED' }
];

const BELTS = [
  { id: 'matte', color: '#333333', name: 'MATTE CARBON' },
  { id: 'gold', color: '#fbbf24', name: 'METALLIC GOLD' },
  { id: 'white', color: '#ffffff', name: 'PURE WHITE' }
];

const STICKERS = [
  { id: 'none', name: 'CLEAN', icon: null },
  { id: 'zap', name: 'BOLT', icon: '⚡' },
  { id: 'star', name: 'PRIME', icon: '★' },
  { id: 'beyond', name: 'BEYOND', icon: 'B' }
];

const SIZES = [
  { id: 'S', name: 'SMALL', eu: '38-40', scale: 0.85 },
  { id: 'M', name: 'MEDIUM', eu: '41-43', scale: 1.0 },
  { id: 'L', name: 'LARGE', eu: '44-46', scale: 1.15 }
];

// --- 3D Slipper Model Component ---
function Slipper({ base, belt, sticker, size }: { base: string; belt: string; sticker: string; size: string }) {
  const baseColor = BASES.find(b => b.id === base)?.color || '#333';
  const beltColor = BELTS.find(b => b.id === belt)?.color || '#555';
  const stickerObj = STICKERS.find(s => s.id === sticker);
  const sizeObj = SIZES.find(s => s.id === size) || SIZES[1];

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group rotation={[0.4, -0.5, 0]} scale={sizeObj.scale}>
        {/* Slipper Base (Sole) */}
        <mesh castShadow receiveShadow>
          <capsuleGeometry args={[1, 3, 4, 32]} />
          <meshStandardMaterial 
            color={baseColor} 
            roughness={0.3} 
            metalness={0.2} 
            emissive={baseColor}
            emissiveIntensity={0.1}
          />
          
          {stickerObj?.icon && (
            <mesh position={[0, 1.6, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.5, 0.5]} />
              <meshBasicMaterial transparent opacity={0} />
              <Text 
                position={[0, 0, 0.01]} 
                fontSize={0.4} 
                color="white"
              >
                {stickerObj.icon}
              </Text>
            </mesh>
          )}
        </mesh>

        {/* Belt / Straps */}
        <group position={[0, 0.5, 0.6]}>
          <mesh rotation={[Math.PI / 2, 0, 0.5]} position={[0.4, 0, 0]}>
            <boxGeometry args={[0.1, 1.2, 0.4]} />
            <meshStandardMaterial color={beltColor} roughness={0.1} metalness={0.5} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, -0.5]} position={[-0.4, 0, 0]}>
            <boxGeometry args={[0.1, 1.2, 0.4]} />
            <meshStandardMaterial color={beltColor} roughness={0.1} metalness={0.5} />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

// --- Brand sizing data ---
const BRANDS: { id: string; name: string; sizes: Record<string, string> }[] = [
  { id: 'nike', name: 'Nike', sizes: { '6': 'S', '7': 'S', '8': 'M', '9': 'M', '10': 'L', '11': 'L', '12': 'L' } },
  { id: 'adidas', name: 'Adidas', sizes: { '6': 'S', '7': 'S', '8': 'M', '9': 'M', '10': 'L', '11': 'L', '12': 'L' } },
  { id: 'puma', name: 'Puma', sizes: { '6': 'S', '7': 'S', '8': 'M', '9': 'M', '10': 'L', '11': 'L', '12': 'L' } },
  { id: 'newbalance', name: 'New Balance', sizes: { '6': 'S', '7': 'S', '8': 'M', '9': 'M', '10': 'L', '11': 'L', '12': 'L' } },
  { id: 'hm', name: 'H&M', sizes: { '38': 'S', '39': 'S', '40': 'S', '41': 'M', '42': 'M', '43': 'M', '44': 'L', '45': 'L', '46': 'L' } },
  { id: 'zara', name: 'Zara', sizes: { '38': 'S', '39': 'S', '40': 'S', '41': 'M', '42': 'M', '43': 'M', '44': 'L', '45': 'L', '46': 'L' } },
];

// --- Main Customizer UI ---
export default function SlipperCustomizer() {
  const [step, setStep] = useState(0); // 0: Base, 1: Belt, 2: Sticker, 3: Size
  const [isPreview, setIsPreview] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('nike');
  const [brandSizeInput, setBrandSizeInput] = useState('');
  const [brandConvertResult, setBrandConvertResult] = useState<string | null>(null);
  const [selections, setSelections] = useState({
    base: 'cyan',
    belt: 'matte',
    sticker: 'none',
    size: 'M'
  });

  const steps = [
    { name: 'BASE', icon: Zap },
    { name: 'BELT', icon: Layers },
    { name: 'DECAL', icon: ImageIcon },
    { name: 'SIZE', icon: Check }
  ];

  const handleSelection = (key: string, id: string) => {
    setSelections(prev => ({ ...prev, [key]: id }));
  };

  const handleBrandConvert = () => {
    const brand = BRANDS.find(b => b.id === selectedBrand);
    if (!brand || !brandSizeInput.trim()) return;
    const mapped = (brand.sizes as Record<string, string>)[brandSizeInput.trim()];
    setBrandConvertResult(mapped ?? null);
    if (mapped) handleSelection('size', mapped);
  };

  return (
    <section className="w-full min-h-screen bg-[#050505] relative overflow-hidden flex flex-col items-center py-20 px-6">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: 3D Viewport */}
        <div className={`transition-all duration-700 relative rounded-[3rem] bg-neutral-900/30 border border-white/5 backdrop-blur-3xl overflow-hidden group ${isPreview ? 'fixed inset-4 z-[100] lg:inset-20' : 'h-[500px] lg:h-[700px]'}`}>
          <div className="absolute top-8 left-8 z-20">
            <div className="text-xs font-mono text-cyan-500 tracking-[0.3em] mb-1 uppercase">Live_Preview_v1.0</div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
              BEYOND_O1 <span className="text-neutral-600 font-light">STRIDE</span>
            </h2>
            {isPreview && (
              <div className="mt-4 flex gap-4">
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-cyan-500 uppercase">Size: {selections.size}</div>
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-cyan-500 uppercase">Base: {selections.base}</div>
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsPreview(!isPreview)}
            className="absolute top-8 right-8 z-20 w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white text-neutral-400 hover:text-black transition-all"
          >
            {isPreview ? <Settings size={20} /> : <ImageIcon size={20} />}
          </button>

          <Canvas shadows camera={{ position: [0, 0, 10], fov: 40 }}>
            <Suspense fallback={null}>
              <Stage intensity={0.5} environment="city" adjustCamera={false}>
                <Slipper {...selections} />
              </Stage>
              <OrbitControls enableZoom={isPreview} autoRotate={!isPreview} autoRotateSpeed={0.5} />
            </Suspense>
          </Canvas>

          {/* Depth Controls */}
          {!isPreview && (
            <div className="absolute bottom-8 right-8 flex gap-2">
              <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-neutral-400">
                DYNAMIC_SCALING: {SIZES.find(s => s.id === selections.size)?.scale}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: UI Controls */}
        <div className="flex flex-col space-y-8">
          <div className="space-y-4">
            <h3 className="text-xs font-mono text-neutral-500 tracking-[0.4em] uppercase">Design Interface</h3>
            <p className="text-neutral-400 font-medium">Engineer your perfect fit. Select your dimensions and aesthetic profile below.</p>
          </div>

          {/* Step Progress */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.name}
                  onClick={() => setStep(i)}
                  className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border transition-all ${
                    step === i 
                      ? 'bg-white text-black border-white' 
                      : 'bg-white/5 border-white/10 text-neutral-500 hover:border-white/20'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-[10px] font-black tracking-widest uppercase">{s.name}</span>
                </button>
              );
            })}
          </div>

          {/* Options Panel */}
          <div className="p-8 rounded-[2.5rem] bg-neutral-900/40 border border-white/5 min-h-[420px] flex flex-col justify-between">
            <div className="space-y-8">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="sole"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    {BASES.map(b => (
                      <button
                        key={b.id}
                        onClick={() => handleSelection('base', b.id)}
                        className={`p-6 rounded-3xl border transition-all text-left space-y-3 ${
                          selections.base === b.id 
                            ? 'border-cyan-500/50 bg-cyan-500/5' 
                            : 'border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full shadow-lg" style={{ backgroundColor: b.color, boxShadow: `0 0 20px ${b.color}44` }} />
                        <span className="block text-[10px] font-black text-white tracking-widest">{b.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    key="belt"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="grid grid-cols-1 gap-3"
                  >
                    {BELTS.map(b => (
                      <button
                        key={b.id}
                        onClick={() => handleSelection('belt', b.id)}
                        className={`p-6 rounded-3xl border transition-all flex items-center justify-between group ${
                          selections.belt === b.id 
                            ? 'border-cyan-500/50 bg-cyan-500/5 text-white' 
                            : 'border-white/5 text-neutral-500 hover:border-white/10'
                        }`}
                      >
                        <span className="text-sm font-black tracking-widest uppercase">{b.name}</span>
                        <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center">
                          {selections.belt === b.id && <div className="w-2 h-2 bg-cyan-500 rounded-full" />}
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="sticker"
                    initial={{ opacity: 0, rotateY: 90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: 90 }}
                    className="grid grid-cols-4 gap-4"
                  >
                    {STICKERS.map(s => (
                      <button
                        key={s.id}
                        onClick={() => handleSelection('sticker', s.id)}
                        className={`h-24 rounded-3xl border transition-all flex items-center justify-center text-2xl ${
                          selections.sticker === s.id 
                            ? 'border-cyan-500/50 bg-cyan-500/5 text-white' 
                            : 'border-white/5 text-neutral-700 hover:border-white/10 hover:text-neutral-400'
                        }`}
                      >
                        {s.icon || <div className="text-[10px] font-mono">X</div>}
                      </button>
                    ))}
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="size"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="space-y-5"
                  >
                    {/* AI Camera Scan */}
                    <button
                      onClick={() => setShowScanner(true)}
                      className="w-full p-5 rounded-3xl border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 transition-all flex items-center gap-4 group"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/25 transition-all">
                        <Camera size={18} className="text-cyan-500" />
                      </div>
                      <div className="text-left">
                        <span className="block text-xs font-black text-white tracking-widest">AI FOOT SCAN</span>
                        <span className="text-[10px] font-mono text-neutral-500 mt-0.5 block">Measure via camera · auto-detect size</span>
                      </div>
                      <div className="ml-auto text-[9px] font-mono text-cyan-600 tracking-widest">SCAN →</div>
                    </button>

                    {/* Brand converter */}
                    <div className="p-5 rounded-3xl border border-white/5 bg-white/2 space-y-3">
                      <div className="text-[10px] font-mono text-neutral-500 tracking-widest">BRAND SIZE CONVERTER</div>
                      <p className="text-[11px] text-neutral-600 leading-relaxed">Different brands use different sizing. We customize fit based on your current comfortable footwear.</p>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <select
                            value={selectedBrand}
                            onChange={e => { setSelectedBrand(e.target.value); setBrandConvertResult(null); }}
                            className="w-full appearance-none bg-neutral-900 border border-white/10 rounded-xl px-3 py-2.5 text-[11px] font-mono text-white focus:outline-none focus:border-cyan-500/50 pr-7"
                          >
                            {BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                          </select>
                          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                        </div>
                        <input
                          type="text"
                          placeholder={selectedBrand === 'hm' || selectedBrand === 'zara' ? 'EU 42' : 'US 9'}
                          value={brandSizeInput}
                          onChange={e => { setBrandSizeInput(e.target.value); setBrandConvertResult(null); }}
                          onKeyDown={e => e.key === 'Enter' && handleBrandConvert()}
                          className="w-24 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2.5 text-[11px] font-mono text-white placeholder-neutral-700 focus:outline-none focus:border-cyan-500/50"
                        />
                        <button
                          onClick={handleBrandConvert}
                          className="px-4 py-2.5 bg-white text-black rounded-xl text-[10px] font-black tracking-widest hover:bg-cyan-500 transition-all"
                        >
                          FIT
                        </button>
                      </div>
                      {brandConvertResult !== null && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`px-4 py-2.5 rounded-xl text-[11px] font-mono ${brandConvertResult ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}
                        >
                          {brandConvertResult
                            ? `→ BEYOND_O1 size ${brandConvertResult} (${SIZES.find(s => s.id === brandConvertResult)?.eu} EU) · applied`
                            : 'Size not found — try a nearby size or use AI scan'}
                        </motion.div>
                      )}
                    </div>

                    {/* Manual size grid */}
                    <div className="grid grid-cols-1 gap-2.5">
                      {SIZES.map(s => (
                        <button
                          key={s.id}
                          onClick={() => handleSelection('size', s.id)}
                          className={`p-5 rounded-3xl border transition-all flex items-center justify-between ${
                            selections.size === s.id
                              ? 'border-cyan-500/50 bg-cyan-500/5 text-white'
                              : 'border-white/5 text-neutral-500 hover:border-white/10'
                          }`}
                        >
                          <div className="text-left">
                            <span className="block text-lg font-black tracking-widest">{s.name}</span>
                            <span className="text-[10px] font-mono text-neutral-600">EU {s.eu} / SCALING {s.scale}x</span>
                          </div>
                          {selections.size === s.id && <Check size={20} className="text-cyan-500" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="pt-8 border-t border-white/5 flex gap-4">
              <button className="flex-1 bg-white text-black py-4 rounded-2xl font-black text-xs tracking-[.2em] hover:bg-cyan-500 transition-all flex items-center justify-center gap-2 group">
                FINALIZE DESIGN <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <button 
                onClick={() => setIsPreview(!isPreview)}
                className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all text-white"
              >
                <ImageIcon size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Foot Scanner Modal */}
      <AnimatePresence>
        {showScanner && (
          <FootScanner
            onResult={size => handleSelection('size', size)}
            onClose={() => setShowScanner(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

