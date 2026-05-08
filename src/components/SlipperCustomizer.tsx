'use client';

import React, { useState, useRef } from 'react';
import { ShoppingCart, Bookmark, Minus, Plus, X, ChevronDown } from 'lucide-react';

// ── Constants ─────────────────────────────────────────────────────────────────

const REPO_ITEMS = [
  { id: 'heart',    emoji: '❤️',  name: 'Heart' },
  { id: 'star',     emoji: '⭐',  name: 'Star' },
  { id: 'moon',     emoji: '🌙',  name: 'Moon' },
  { id: 'paw',      emoji: '🐾',  name: 'Paw' },
  { id: 'flower',   emoji: '🌸',  name: 'Flower' },
  { id: 'blossom',  emoji: '🌺',  name: 'Blossom' },
  { id: 'crown',    emoji: '👑',  name: 'Crown' },
  { id: 'bow',      emoji: '🎀',  name: 'Bow' },
  { id: 'anchor',   emoji: '⚓',  name: 'Anchor' },
  { id: 'sparkle',  emoji: '✨',  name: 'Sparkle' },
  { id: 'palm',     emoji: '🌴',  name: 'Palm' },
  { id: 'note1',    emoji: '🎵',  name: 'Note' },
  { id: 'note2',    emoji: '🎶',  name: 'Notes' },
  { id: 'glowstar', emoji: '🌟',  name: 'Glow Star' },
];

const PATTERNS = [
  { id: 'polka',   label: 'Polka' },
  { id: 'stripe',  label: 'Stripe' },
  { id: 'camo',    label: 'Camo' },
  { id: 'geo',     label: 'Geo' },
  { id: 'leopard', label: 'Leopard' },
  { id: 'crown2',  label: 'Crown' },
  { id: 'spots',   label: 'Spots' },
];

const PATTERN_STYLE: Record<string, React.CSSProperties> = {
  polka:   { backgroundImage: 'radial-gradient(circle, #555 1.5px, #fff 1.5px)', backgroundSize: '8px 8px', backgroundColor: '#fff' },
  stripe:  { backgroundImage: 'repeating-linear-gradient(135deg,#3b5bdb 0,#3b5bdb 3px,#fff 0,#fff 10px)' },
  camo:    { backgroundImage: 'repeating-linear-gradient(45deg,#4a7c4f 0,#4a7c4f 6px,#2d5a27 6px,#2d5a27 12px,#6a8f50 12px,#6a8f50 18px)' },
  geo:     { backgroundImage: 'conic-gradient(#c9a0dc 0deg 90deg,#f4a7b9 90deg 180deg,#4a90d9 180deg 270deg,#ffd60a 270deg)', backgroundSize: '14px 14px' },
  leopard: { backgroundColor: '#c8a044', backgroundImage: 'radial-gradient(ellipse 5px 3px at 25% 35%,#6b3010 100%,transparent),radial-gradient(ellipse 4px 3px at 72% 68%,#8b4513 100%,transparent)', backgroundSize: '18px 18px' },
  crown2:  { backgroundImage: 'repeating-linear-gradient(0deg,#f5d76e 0,#f5d76e 3px,#fff 0,#fff 14px)' },
  spots:   { backgroundColor: '#d4a855', backgroundImage: 'radial-gradient(circle 3px,#7a3a08 100%,transparent)', backgroundSize: '14px 14px' },
};

const UNIQUE_CHARMS = [
  { id: 'cat',    emoji: '🐱', name: 'Cat' },
  { id: 'coffee', emoji: '☕', name: 'Coffee' },
  { id: 'book',   emoji: '📕', name: 'Book' },
];

const MATERIALS         = ['Plush', 'Cotton', 'Velvet', 'Wool'] as const;
const TOE_TYPES         = ['Open-toe', 'Closed-toe', 'Bootie'] as const;
const EMBELLISHMENT_OPTS = ['Heart', 'Pom Pom', 'Bow', 'Rhinestone'] as const;

const COLORS = [
  { id: 'pink',   hex: '#f4a7b9' },
  { id: 'blue',   hex: '#4a90d9' },
  { id: 'gray',   hex: '#9e9ea7' },
  { id: 'black',  hex: '#2c2c2e' },
  { id: 'red',    hex: '#ff3b30' },
  { id: 'yellow', hex: '#ffd60a' },
];

const SIZES = [
  "Women's size US 6", "Women's size US 7", "Women's size US 8",
  "Women's size US 9", "Women's size US 10",
];

type DroppedItem = { key: string; emoji: string; name: string; xPct: number; yPct: number };

// ── Slipper SVG ───────────────────────────────────────────────────────────────

function SlipperSVG({ color, flip = false, text = '' }: {
  color: string; flip?: boolean; text?: string;
}) {
  const uid = flip ? 'r' : 'l';
  const pompoms = [
    { cx: 96,  cy: 78, r: 15 },
    { cx: 120, cy: 71, r: 17 },
    { cx: 148, cy: 71, r: 17 },
    { cx: 173, cy: 78, r: 14 },
  ];

  return (
    <svg viewBox="0 0 280 172" xmlns="http://www.w3.org/2000/svg"
      style={{ transform: flip ? 'scaleX(-1)' : undefined, filter: 'drop-shadow(0 8px 22px rgba(0,0,0,0.26))', width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id={`sg-${uid}`} cx="38%" cy="28%" r="72%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.48"/>
          <stop offset="100%" stopColor="black" stopOpacity="0.18"/>
        </radialGradient>
        <radialGradient id={`pg-${uid}`} cx="50%" cy="40%" r="55%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#ddd"  stopOpacity="0.0"/>
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="134" cy="165" rx="112" ry="10" fill="rgba(0,0,0,0.17)"/>

      {/* Rubber outsole */}
      <path d="M28 113 Q22 136 134 141 Q246 136 242 113 L228 74 Q228 46 134 41 Q40 46 40 74Z" fill="#b09070"/>
      {/* Midsole */}
      <path d="M32 111 Q27 132 134 137 Q241 132 237 111 L223 76 Q223 50 134 45 Q45 50 45 76Z" fill="#ddc9a9"/>
      {/* Footbed */}
      <path d="M38 108 Q34 127 134 132 Q234 127 230 108 L216 79 Q216 55 134 50 Q52 55 52 79Z" fill="#ecdcbc"/>

      {/* Upper body (plush) */}
      <path d="M50 97 Q48 66 134 60 Q220 66 218 97 Q218 116 134 120 Q50 116 50 97Z" fill={color}/>
      {/* Sheen */}
      <path d="M50 97 Q48 66 134 60 Q220 66 218 97 Q218 116 134 120 Q50 116 50 97Z" fill={`url(#sg-${uid})`}/>

      {/* Open-toe cutout */}
      <ellipse cx="214" cy="91" rx="15" ry="22" fill="#ecdcbc"/>
      {/* Toe edge shadow */}
      <ellipse cx="214" cy="91" rx="15" ry="22" fill="none" stroke="#c8b898" strokeWidth="1.5"/>

      {/* Pom poms */}
      {pompoms.map((p, i) => (
        <g key={i}>
          <circle cx={p.cx} cy={p.cy} r={p.r}      fill="white"            opacity={0.97}/>
          <circle cx={p.cx} cy={p.cy} r={p.r * .55} fill={`url(#pg-${uid})`}/>
          {/* subtle texture ring */}
          <circle cx={p.cx} cy={p.cy} r={p.r}      fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1"/>
        </g>
      ))}

      {/* Embroidered text — counter-flip so it reads correctly on mirrored slipper */}
      {text && (
        <g transform={flip ? 'translate(280,0) scale(-1,1)' : undefined}>
          <text
            x="140" y="109"
            textAnchor="middle" fontSize="11" fontWeight="bold"
            fill="white" fontFamily="Georgia, 'Times New Roman', serif"
            letterSpacing="2.5" opacity="0.92"
          >{text.slice(0, 10)}</text>
        </g>
      )}
    </svg>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function SlipperCustomizer() {
  const [material,      setMaterial]      = useState('Plush');
  const [toeType,       setToeType]       = useState('Open-toe');
  const [colorId,       setColorId]       = useState('pink');
  const [customText,    setCustomText]    = useState('ARIANA');
  const [embellishment, setEmbellishment] = useState('Pom Pom');
  const [size,          setSize]          = useState(SIZES[2]);
  const [quantity,      setQuantity]      = useState(8);
  const [droppedItems,  setDroppedItems]  = useState<DroppedItem[]>([]);
  const [dragPayload,   setDragPayload]   = useState<{ emoji: string; name: string } | null>(null);
  const [isDragOver,    setIsDragOver]    = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const color = COLORS.find(c => c.id === colorId)?.hex ?? '#f4a7b9';

  function startDrag(emoji: string, name: string) {
    setDragPayload({ emoji, name });
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    if (!dragPayload || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width)  * 100;
    const yPct = ((e.clientY - rect.top)  / rect.height) * 100;
    setDroppedItems(prev => [
      ...prev,
      { key: `${Date.now()}-${Math.random()}`, ...dragPayload, xPct, yPct },
    ]);
    setDragPayload(null);
  }

  return (
    <section className="w-full bg-white">
      <div className="max-w-[1400px] mx-auto overflow-x-auto"
        style={{ background: 'linear-gradient(135deg,#ede4f5 0%,#d5e8f7 100%)', minHeight: 700 }}>
        <div className="flex" style={{ minHeight: 700, minWidth: 1000 }}>

          {/* ── Nav Sidebar ──────────────────────────────────────── */}
          <nav className="w-14 bg-[#1b1729] flex flex-col items-center py-5 gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#2e2848] flex items-center justify-center mb-3 select-none">
              <span className="text-xl">🩴</span>
            </div>
            {[
              { icon: '🩴', active: true  },
              { icon: '✏️', active: false },
              { icon: '✨', active: false },
              { icon: '👤', active: false },
            ].map((item, i) => (
              <button key={i}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-colors ${
                  item.active ? 'bg-[#4a3d7a] shadow-lg' : 'text-gray-500 hover:bg-[#2e2848]'
                }`}
              >{item.icon}</button>
            ))}
            <div className="mt-auto relative">
              <button className="w-10 h-10 rounded-xl flex items-center justify-center text-lg text-gray-500 hover:bg-[#2e2848]">🔔</button>
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-orange-500 rounded-full text-[8px] font-black text-white flex items-center justify-center">1</span>
            </div>
          </nav>

          {/* ── Toolbox Panel ────────────────────────────────────── */}
          <div className="w-[268px] shrink-0 bg-white/80 backdrop-blur-sm overflow-y-auto border-r border-white/50">
            <div className="p-4">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Toolbox</p>
              <h2 className="text-[15px] font-black text-gray-900 leading-tight mb-4">DESIGN YOUR PERFECT SLIPPERS</h2>

              <div className="rounded-2xl border-2 border-purple-200 bg-purple-50/50 p-3 space-y-4">

                {/* Embellishments */}
                <div>
                  <p className="text-[8px] font-black text-purple-700 uppercase tracking-widest mb-2">
                    Embellishment &amp; Pattern Repository
                  </p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {REPO_ITEMS.map(item => (
                      <button key={item.id} draggable
                        onDragStart={() => startDrag(item.emoji, item.name)}
                        title={item.name}
                        className="w-10 h-10 rounded-lg bg-white border border-purple-100 flex items-center justify-center text-xl cursor-grab active:cursor-grabbing hover:border-purple-400 hover:scale-110 transition-all shadow-sm"
                      >{item.emoji}</button>
                    ))}
                  </div>
                </div>

                {/* Patterns */}
                <div>
                  <p className="text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-2">Patterns</p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {PATTERNS.map(p => (
                      <div key={p.id} draggable
                        onDragStart={() => startDrag(p.label, p.label)}
                        title={p.label}
                        className="w-10 h-10 rounded-lg border border-purple-100 cursor-grab hover:border-purple-400 hover:scale-110 transition-all overflow-hidden shadow-sm"
                        style={PATTERN_STYLE[p.id]}
                      />
                    ))}
                  </div>
                </div>

                {/* Unique Charms */}
                <div>
                  <p className="text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-2">Unique Charms</p>
                  <div className="flex gap-2">
                    {UNIQUE_CHARMS.map(c => (
                      <button key={c.id} draggable
                        onDragStart={() => startDrag(c.emoji, c.name)}
                        title={c.name}
                        className="w-14 h-14 rounded-xl bg-white border border-purple-100 flex items-center justify-center text-3xl cursor-grab active:cursor-grabbing hover:border-purple-400 hover:scale-110 transition-all shadow-sm"
                      >{c.emoji}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Config Panel ─────────────────────────────────────── */}
          <div className="w-[232px] shrink-0 bg-white/70 backdrop-blur-sm overflow-y-auto border-r border-white/50 p-4 space-y-5">

            {/* 1. Slipper Base */}
            <div>
              <p className="text-sm font-black text-gray-900 mb-2">1. Slipper Base</p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {MATERIALS.map(m => (
                  <button key={m} onClick={() => setMaterial(m)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                      material === m
                        ? 'bg-[#1b1729] text-white border-[#1b1729]'
                        : 'border-gray-300 text-gray-600 hover:border-gray-500'
                    }`}>{m}</button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TOE_TYPES.map(t => (
                  <button key={t} onClick={() => setToeType(t)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border-2 transition-all ${
                      toeType === t
                        ? 'bg-[#1b1729] text-white border-[#1b1729]'
                        : 'border-gray-800 text-gray-800 hover:bg-gray-100'
                    }`}>{t}</button>
                ))}
              </div>
            </div>

            {/* 2. Base Color */}
            <div>
              <p className="text-sm font-black text-gray-900 mb-2">2. Base Color</p>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map(c => (
                  <button key={c.id} onClick={() => setColorId(c.id)}
                    className="w-8 h-8 rounded-full transition-all hover:scale-110"
                    style={{
                      backgroundColor: c.hex,
                      outline: colorId === c.id ? '3px solid #7c3aed' : 'none',
                      outlineOffset: '2px',
                    }}
                  />
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs cursor-pointer hover:border-gray-500">
                  +
                </div>
              </div>
            </div>

            {/* 3. Personalize */}
            <div>
              <p className="text-sm font-black text-gray-900 mb-1">3. Personalize</p>
              <p className="text-[10px] font-semibold text-gray-500 mb-1.5">(a) Add Text/Initial</p>
              <input
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                placeholder="Add Your Text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 focus:outline-none focus:border-purple-500 mb-1 bg-white"
              />
              <p className="text-[9px] text-gray-400">(accept PNG, JPG)</p>
            </div>

            {/* 4. Embellishments */}
            <div>
              <p className="text-sm font-black text-gray-900 mb-2">4. Embellishments</p>
              <div className="grid grid-cols-2 gap-1.5">
                {EMBELLISHMENT_OPTS.map(e => (
                  <button key={e} onClick={() => setEmbellishment(e)}
                    className={`py-2 rounded-xl border-2 text-[10px] font-bold transition-all ${
                      embellishment === e
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}>{e}</button>
                ))}
              </div>
            </div>

            {/* 5. Size & Fit */}
            <div>
              <p className="text-sm font-black text-gray-900 mb-2">5. Size &amp; Fit</p>
              <p className="text-[10px] font-semibold text-gray-500 mb-1">Size (EU/US/UK)</p>
              <div className="relative mb-3">
                <select value={size} onChange={e => setSize(e.target.value)}
                  className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 text-[11px] text-gray-700 bg-white focus:outline-none focus:border-purple-500 cursor-pointer pr-7">
                  {SIZES.map(s => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown size={12} className="text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"/>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold text-gray-500">Quantity</p>
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-2 py-1.5 bg-white">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="text-gray-500 hover:text-gray-900 transition-colors">
                    <Minus size={12}/>
                  </button>
                  <span className="text-sm font-bold text-gray-800 w-5 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)}
                    className="text-gray-500 hover:text-gray-900 transition-colors">
                    <Plus size={12}/>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Design Canvas ─────────────────────────────────────── */}
          <div className="flex-1 flex flex-col p-5 gap-3 min-w-0">

            {/* Canvas header */}
            <div>
              <h3 className="text-lg font-black text-gray-900">Drag-and-Drop Slipper Design Canvas</h3>
              <p className="text-[11px] text-gray-600 leading-relaxed max-w-lg">
                Drag icons, patterns, or upload your own image (b) and drop it anywhere on the slipper preview to customize. Drag items to rearrange or delete.
              </p>
            </div>

            {/* Drop zone */}
            <div
              ref={canvasRef}
              onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={onDrop}
              className={`flex-1 relative rounded-2xl border-2 border-dashed transition-all overflow-hidden ${
                isDragOver
                  ? 'border-purple-400 bg-purple-50/40'
                  : 'border-gray-300 bg-white/70'
              }`}
              style={{ minHeight: 360 }}
            >
              {/* Two slipper previews */}
              <div className="absolute inset-0 flex items-center justify-center gap-6 pointer-events-none select-none px-6">
                <div className="w-[44%] max-w-[270px]">
                  <SlipperSVG color={color} text={customText}/>
                </div>
                <div className="w-[44%] max-w-[270px]">
                  <SlipperSVG color={color} flip text={customText}/>
                </div>
              </div>

              {/* First-use hint */}
              {droppedItems.length === 0 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none">
                  <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-lg border border-gray-100">
                    <span className="text-[11px] font-bold text-gray-600">Drag from here!</span>
                    <span className="text-base">⭐</span>
                    <svg width="48" height="16" viewBox="0 0 48 16" className="text-gray-400">
                      <path d="M4 8 L38 8 M32 3 L44 8 L32 13" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-[11px] font-bold text-gray-600">Drop onto the slipper!</span>
                  </div>
                </div>
              )}

              {/* Drag-over ripple */}
              {isDragOver && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-24 h-24 rounded-full border-4 border-purple-400 border-dashed animate-ping opacity-30"/>
                </div>
              )}

              {/* Dropped items */}
              {droppedItems.map(item => (
                <div key={item.key}
                  className="absolute group cursor-pointer select-none z-10"
                  style={{ left: `${item.xPct}%`, top: `${item.yPct}%`, transform: 'translate(-50%,-50%)' }}
                  onClick={() => setDroppedItems(p => p.filter(i => i.key !== item.key))}
                  title={`Click to remove ${item.name}`}
                >
                  <span className="text-4xl" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.35))' }}>
                    {item.emoji}
                  </span>
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <X size={8}/>
                  </div>
                </div>
              ))}

              {/* Canvas label */}
              <span className="absolute bottom-3 right-4 text-[10px] text-gray-400 font-mono select-none">
                interactive canvas
              </span>
            </div>

            {/* CTA row */}
            <div className="flex gap-3">
              <button className="flex-1 py-3.5 rounded-2xl bg-[#1b1729] hover:bg-[#2e2848] text-white font-black text-sm tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg">
                <ShoppingCart size={16}/> ADD TO CART
                <span className="ml-1 font-black text-purple-300">₹1,499</span>
              </button>
              <button className="flex-1 py-3.5 rounded-2xl border-2 border-[#1b1729] text-[#1b1729] font-black text-sm tracking-wider hover:bg-white/60 transition-colors flex items-center justify-center gap-2">
                <Bookmark size={15}/> SAVE DESIGN
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
