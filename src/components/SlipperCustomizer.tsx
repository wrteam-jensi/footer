'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ShoppingCart, Bookmark, Minus, Plus, X, ChevronDown, Palette, Settings2, ScanLine } from 'lucide-react';
import FootScanner from '@/components/FootScanner';

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
  polka:   { backgroundImage: 'radial-gradient(circle,#555 1.5px,#fff 1.5px)', backgroundSize: '8px 8px', backgroundColor: '#fff' },
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

const ALL_DRAGGABLES = [
  ...REPO_ITEMS,
  ...PATTERNS.map(p => ({ id: p.id, emoji: p.label, name: p.label })),
  ...UNIQUE_CHARMS,
];

const MATERIALS          = ['Plush', 'Cotton', 'Velvet', 'Wool'] as const;
const TOE_TYPES          = ['Open-toe', 'Closed-toe', 'Bootie'] as const;
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

type DroppedItem = { key: string; id: string; emoji: string; name: string; xPct: number; yPct: number };

// ── Slipper SVG ───────────────────────────────────────────────────────────────

function SlipperSVG({ color, flip = false, text = '', embellishment = 'Pom Pom' }: {
  color: string; flip?: boolean; text?: string; embellishment?: string;
}) {
  const uid = flip ? 'r' : 'l';

  // Top-down view — left foot, toe RIGHT
  // Real footprint: wide at ball, NARROWS at arch, medium heel
  const sole = 'M 52 73 C 34 68 20 82 20 100 C 20 118 34 128 52 127 C 75 130 108 122 140 118 C 165 114 186 128 212 142 C 234 148 256 136 266 118 C 274 104 272 86 263 78 C 253 68 234 64 210 65 C 188 66 165 68 148 70 C 132 72 118 76 100 78 C 84 78 66 74 52 73 Z';

  return (
    <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg"
      style={{ transform: flip ? 'scaleX(-1)' : undefined, width: '100%', height: '100%',
               filter: 'drop-shadow(0 20px 36px rgba(0,0,0,0.24))' }}>
      <defs>
        {/* Dome radial — bright top-left, dark bottom-right edges */}
        <radialGradient id={`rg-${uid}`} cx="36%" cy="30%" r="74%" fx="30%" fy="24%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.52" />
          <stop offset="38%"  stopColor="white" stopOpacity="0.04" />
          <stop offset="100%" stopColor="black" stopOpacity="0.30" />
        </radialGradient>
        {/* Bottom-edge darkening */}
        <linearGradient id={`be-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="50%"  stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.28)" />
        </linearGradient>
        {/* Specular glow */}
        <radialGradient id={`sg-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.88" />
          <stop offset="100%" stopColor="white" stopOpacity="0"    />
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="152" cy="170" rx="122" ry="9" fill="rgba(0,0,0,0.11)" />

      {/* Sole edge — slightly enlarged offset to show thickness from top-down */}
      <path
        d="M 54 94 C 36 87 22 100 24 116 C 26 134 42 142 64 143 C 96 147 150 148 206 144 C 238 140 264 128 276 112 C 287 97 280 80 263 72 C 247 63 222 62 194 63 C 164 63 134 69 108 76 C 80 83 64 89 54 94 Z"
        fill="rgba(0,0,0,0.22)"
      />

      {/* === MAIN SOLE SURFACE === */}
      <path d={sole} fill={color} />

      {/* Dome shading pass */}
      <path d={sole} fill={`url(#rg-${uid})`} />

      {/* Bottom-edge darkening */}
      <path d={sole} fill={`url(#be-${uid})`} />

      {/* Primary specular — large soft gloss spot */}
      <ellipse cx="130" cy="92" rx="60" ry="24"
        fill={`url(#sg-${uid})`} opacity="0.48"
        transform="rotate(-10 130 92)" />

      {/* Secondary specular — tight bright peak */}
      <ellipse cx="116" cy="85" rx="28" ry="11"
        fill="white" opacity="0.38"
        transform="rotate(-10 116 85)" />

      {/* Right-side shadow (shadow opposite light source) */}
      <path
        d="M 255 72 C 270 82 278 96 276 112 C 272 124 264 132 256 136 C 266 128 274 112 272 98 C 270 84 260 74 248 68 Z"
        fill="rgba(0,0,0,0.16)"
      />

      {/* === Y-STRAP — both arms start from SAME toe-post point === */}
      {/* Upper arm: toe-post → upper side of foot */}
      <path d="M 258 100 C 232 96 204 90 172 84 C 158 82 143 80 130 78"
        stroke="rgba(0,0,0,0.22)" strokeWidth="16" fill="none" strokeLinecap="round"/>
      <path d="M 258 100 C 232 96 204 90 172 84 C 158 82 143 80 130 78"
        stroke="#ede9e4" strokeWidth="12" fill="none" strokeLinecap="round"/>
      <path d="M 256 97 C 230 93 203 87 172 81 C 158 79 143 77 131 75"
        stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.82"/>
      <path d="M 256 103 C 230 99 204 93 172 87 C 158 85 143 83 131 81"
        stroke="rgba(0,0,0,0.10)" strokeWidth="3" fill="none" strokeLinecap="round"/>

      {/* Lower arm: toe-post → lower side of foot */}
      <path d="M 258 100 C 232 104 204 110 172 116 C 158 118 143 120 130 122"
        stroke="rgba(0,0,0,0.22)" strokeWidth="16" fill="none" strokeLinecap="round"/>
      <path d="M 258 100 C 232 104 204 110 172 116 C 158 118 143 120 130 122"
        stroke="#ede9e4" strokeWidth="12" fill="none" strokeLinecap="round"/>
      <path d="M 256 97 C 230 101 204 107 172 113 C 158 115 143 117 131 119"
        stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.70"/>
      <path d="M 256 103 C 230 107 204 113 172 119 C 158 121 143 123 131 125"
        stroke="rgba(0,0,0,0.10)" strokeWidth="3" fill="none" strokeLinecap="round"/>

      {/* Thong post (oval peg between toes) */}
      <ellipse cx="261" cy="100" rx="10" ry="13" fill="#cac5be"/>
      <ellipse cx="259" cy="96"  rx="6"  ry="8"  fill="white" opacity="0.92"/>

      {/* === EMBELLISHMENTS === */}
      {/* Embellishments sit on the strap Y-junction area */}
      {embellishment === 'Pom Pom' && (
        <g>
          {[{ cx: 190, cy: 100, r: 24 }].map((p, i) => (
            <g key={i}>
              <ellipse cx={p.cx + 1} cy={p.cy + p.r - 1} rx={p.r * 0.85} ry={p.r * 0.20} fill="rgba(0,0,0,0.18)"/>
              <circle cx={p.cx} cy={p.cy} r={p.r} fill="white"/>
              <circle cx={p.cx} cy={p.cy} r={p.r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1.5"/>
              <ellipse cx={p.cx-7} cy={p.cy-8} rx={p.r*0.44} ry={p.r*0.30} fill="white" opacity="0.85" transform={`rotate(-30 ${p.cx-7} ${p.cy-8})`}/>
              <circle cx={p.cx+7} cy={p.cy+7} r={p.r*0.20} fill="rgba(0,0,0,0.05)"/>
            </g>
          ))}
        </g>
      )}

      {embellishment === 'Bow' && (
        <g transform="translate(190, 100) scale(1.2)">
          <path d="M 0 0 C -5 -16 -28 -15 -28 -4 C -28 7 -8 7 0 0 Z" fill="white" opacity="0.95"/>
          <path d="M 0 0 C 5 -16 28 -15 28 -4 C 28 7 8 7 0 0 Z"  fill="white" opacity="0.95"/>
          <path d="M 0 0 C -5 16 -28 15 -28 4 C -28 -7 -8 -6 0 0 Z" fill="rgba(255,255,255,0.82)"/>
          <path d="M 0 0 C 5 16 28 15 28 4 C 28 -7 8 -6 0 0 Z"  fill="rgba(255,255,255,0.82)"/>
          <circle cx="0" cy="0" r="7" fill="white"/>
          <circle cx="-2" cy="-2" r="3" fill="white" opacity="0.9"/>
        </g>
      )}

      {embellishment === 'Heart' && (
        <g transform="translate(190, 100) scale(2.8)">
          <path d="M 0 4.5 C -2 9 -14 6 -14 -2 C -14 -9 -7 -12 0 -5.5 C 7 -12 14 -9 14 -2 C 14 6 2 9 0 4.5 Z" fill="white" opacity="0.95"/>
          <path d="M -4 -4 C -2 -9 2 -9 4 -6" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6"/>
        </g>
      )}

      {embellishment === 'Rhinestone' && (
        <g>
          {[
            {x:150,y:88},{x:175,y:80},{x:200,y:82},{x:222,y:91},
            {x:160,y:106},{x:185,y:100},{x:210,y:108},{x:135,y:100},
          ].map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={5.5} fill="white" opacity="0.88"/>
              <ellipse cx={p.x-1.5} cy={p.y-1.5} rx={2.2} ry={1.5} fill="white" opacity="0.95"/>
              <circle cx={p.x} cy={p.y} r={5.5} fill="none" stroke="rgba(200,215,255,0.5)" strokeWidth="0.5"/>
              <line x1={p.x} y1={p.y-8} x2={p.x} y2={p.y+8} stroke="white" strokeWidth="0.6" opacity="0.45"/>
              <line x1={p.x-8} y1={p.y} x2={p.x+8} y2={p.y} stroke="white" strokeWidth="0.6" opacity="0.45"/>
            </g>
          ))}
        </g>
      )}

      {/* Text */}
      {text && (
        <g transform={flip ? 'translate(300,0) scale(-1,1)' : undefined}>
          <text x="148" y="136" textAnchor="middle" fontSize="11" fontWeight="700"
            fill="white" opacity="0.80"
            style={{ fontFamily: 'system-ui, sans-serif', letterSpacing: '2px' }}
          >{text.toUpperCase()}</text>
        </g>
      )}
    </svg>
  );
}


// ── Draggable item shared renderer ────────────────────────────────────────────

function DragItem({ emoji, name, isPattern, patternStyle, onDragStart, onTouchStart }: {
  emoji: string; name: string; isPattern?: boolean;
  patternStyle?: React.CSSProperties;
  onDragStart: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
}) {
  if (isPattern) {
    return (
      <div draggable onDragStart={onDragStart} onTouchStart={onTouchStart}
        title={name}
        className="w-10 h-10 rounded-lg border border-purple-100 cursor-grab hover:border-purple-400 hover:scale-110 active:scale-95 transition-all overflow-hidden shadow-sm touch-none"
        style={patternStyle}
      />
    );
  }
  return (
    <button draggable onDragStart={onDragStart} onTouchStart={onTouchStart}
      title={name}
      className="w-10 h-10 rounded-lg bg-white border border-purple-100 flex items-center justify-center text-xl cursor-grab active:cursor-grabbing hover:border-purple-400 hover:scale-110 active:scale-95 transition-all shadow-sm touch-none"
    >{emoji}</button>
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

  // Desktop drag state
  const [dragPayload,  setDragPayload]  = useState<{ emoji: string; name: string; movingKey?: string } | null>(null);
  const [isDragOver,   setIsDragOver]   = useState(false);

  // Touch drag state
  const touchPayloadRef = useRef<{ emoji: string; name: string; movingKey?: string } | null>(null);
  const [touchGhost,   setTouchGhost]   = useState<{ emoji: string; x: number; y: number } | null>(null);

  // Mobile tab: 0 = Design (canvas), 1 = Configure
  const [mobileTab, setMobileTab] = useState(0);

  // Foot scanner
  const [scannerOpen, setScannerOpen] = useState(false);
  function handleScanResult(s: 'S' | 'M' | 'L') {
    const map = { S: SIZES[0], M: SIZES[2], L: SIZES[4] };
    setSize(map[s]);
  }

  const canvasRef = useRef<HTMLDivElement>(null);
  const color = COLORS.find(c => c.id === colorId)?.hex ?? '#f4a7b9';

  // ── Touch event listeners ──
  useEffect(() => {
    function onMove(e: TouchEvent) {
      if (!touchPayloadRef.current) return;
      e.preventDefault();
      const t = e.touches[0];
      setTouchGhost(g => g ? { ...g, x: t.clientX, y: t.clientY } : null);
    }
    function onEnd(e: TouchEvent) {
      const payload = touchPayloadRef.current;
      touchPayloadRef.current = null;
      setTouchGhost(null);
      if (!payload || !canvasRef.current) return;
      const t = e.changedTouches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      const x = t.clientX - rect.left;
      const y = t.clientY - rect.top;
      
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        const xPct = (x / rect.width) * 100;
        const yPct = (y / rect.height) * 100;

        if (payload.movingKey) {
          setDroppedItems(prev => prev.map(i => i.key === payload.movingKey ? { ...i, xPct, yPct } : i));
        } else {
          setDroppedItems(prev => [...prev, {
            key: `${Date.now()}-${Math.random()}`,
            id: payload.name.toLowerCase(),
            emoji: payload.emoji, name: payload.name,
            xPct, yPct
          }]);
        }
      }
    }
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend',  onEnd);
    return () => {
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend',  onEnd);
    };
  }, []);

  // ── Handlers ──
  function startDrag(emoji: string, name: string, movingKey?: string) {
    setDragPayload({ emoji, name, movingKey });
  }
  function startTouchDrag(emoji: string, name: string, e: React.TouchEvent, movingKey?: string) {
    touchPayloadRef.current = { emoji, name, movingKey };
    const t = e.touches[0];
    setTouchGhost({ emoji, x: t.clientX, y: t.clientY });
  }
  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    if (!dragPayload || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width)  * 100;
    const yPct = ((e.clientY - rect.top)  / rect.height) * 100;

    if (dragPayload.movingKey) {
      setDroppedItems(prev => prev.map(i => i.key === dragPayload.movingKey ? { ...i, xPct, yPct } : i));
    } else {
      setDroppedItems(prev => [...prev, {
        key: `${Date.now()}-${Math.random()}`,
        id: dragPayload.name.toLowerCase(),
        ...dragPayload,
        xPct, yPct
      }]);
    }
    setDragPayload(null);
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setDroppedItems(prev => [...prev, {
        key: `${Date.now()}-${Math.random()}`,
        id: 'custom-upload',
        emoji: result, // We'll render this as an <img> if it's a data URL
        name: 'Custom Upload',
        xPct: 50, yPct: 50
      }]);
    };
    reader.readAsDataURL(file);
  }

  function tapToAdd(emoji: string, name: string) {
    setDroppedItems(prev => [...prev, {
      key: `${Date.now()}-${Math.random()}`, 
      id: name.toLowerCase(),
      emoji, name,
      xPct: 30 + Math.random() * 40,
      yPct: 25 + Math.random() * 50,
    }]);
  }

  // ── Toolbox content (shared desktop + mobile) ──
  const toolboxContent = (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1.5 h-6 bg-slate-900 rounded-full" />
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Assets</p>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Design Elements</h2>
        </div>
      </div>
      
      <div className="space-y-8">
        <section>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
            Charms & Icons <span className="w-12 h-[1px] bg-slate-100" />
          </p>
          <div className="grid grid-cols-4 gap-2">
            {REPO_ITEMS.map(item => (
              <DragItem key={item.id} emoji={item.emoji} name={item.name}
                onDragStart={() => startDrag(item.emoji, item.name)}
                onTouchStart={e => startTouchDrag(item.emoji, item.name, e)}
              />
            ))}
          </div>
        </section>

        <section>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
            Surface Patterns <span className="w-12 h-[1px] bg-slate-100" />
          </p>
          <div className="grid grid-cols-4 gap-2">
            {PATTERNS.map(p => (
              <DragItem key={p.id} emoji={p.label} name={p.label} isPattern
                patternStyle={PATTERN_STYLE[p.id]}
                onDragStart={() => startDrag(p.label, p.label)}
                onTouchStart={e => startTouchDrag(p.label, p.label, e)}
              />
            ))}
          </div>
        </section>

        <section>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
            Special Editions <span className="w-12 h-[1px] bg-slate-100" />
          </p>
          <div className="flex gap-3">
            {UNIQUE_CHARMS.map(c => (
              <button key={c.id} draggable
                onDragStart={() => startDrag(c.emoji, c.name)}
                onTouchStart={e => startTouchDrag(c.emoji, c.name, e)}
                title={c.name}
                className="w-14 h-14 rounded-2xl bg-slate-50 border-2 border-transparent hover:border-slate-900 hover:bg-white flex items-center justify-center text-3xl transition-all shadow-sm active:scale-95 group"
              >
                <span className="group-hover:scale-110 transition-transform">{c.emoji}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  // ── Config content (shared desktop + mobile) ──
  const configContent = (
    <div className="p-4 space-y-5">
      <div>
        <p className="text-sm font-black text-gray-900 mb-2">1. Slipper Base</p>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {MATERIALS.map(m => (
            <button key={m} onClick={() => setMaterial(m)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                material === m ? 'bg-[#1b1729] text-white border-[#1b1729]' : 'border-gray-300 text-gray-600 hover:border-gray-500'
              }`}>{m}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TOE_TYPES.map(t => (
            <button key={t} onClick={() => setToeType(t)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold border-2 transition-all ${
                toeType === t ? 'bg-[#1b1729] text-white border-[#1b1729]' : 'border-gray-800 text-gray-800 hover:bg-gray-100'
              }`}>{t}</button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-black text-gray-900 mb-2">2. Base Color</p>
        <div className="flex gap-2 flex-wrap">
          {COLORS.map(c => (
            <button key={c.id} onClick={() => setColorId(c.id)}
              className="w-8 h-8 rounded-full transition-all hover:scale-110 active:scale-95"
              style={{ backgroundColor: c.hex, outline: colorId === c.id ? '3px solid #7c3aed' : 'none', outlineOffset: '2px' }}
            />
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs cursor-pointer hover:border-gray-500">+</div>
        </div>
      </div>

      <div>
        <p className="text-sm font-black text-gray-900 mb-1">3. Personalize</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">(a) Add Text/Initial</p>
        <input value={customText} onChange={e => setCustomText(e.target.value)}
          placeholder="Enter text..."
          className="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-900 mb-4 bg-white shadow-sm transition-all"
        />
        
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">(b) Upload Graphic</p>
        <div className="relative group">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload}
            className="absolute inset-0 opacity-0 cursor-pointer z-10" 
          />
          <div className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 group-hover:border-slate-900 group-hover:bg-slate-50 transition-all">
            <Plus className="text-slate-400 group-hover:text-slate-900 transition-colors" size={24}/>
            <p className="text-[10px] font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-widest">Add PNG/JPG</p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-black text-gray-900 mb-2">4. Embellishments</p>
        <div className="grid grid-cols-2 gap-1.5">
          {EMBELLISHMENT_OPTS.map(e => (
            <button key={e} onClick={() => setEmbellishment(e)}
              className={`py-2 rounded-xl border-2 text-[10px] font-bold transition-all ${
                embellishment === e ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}>{e}</button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-black text-gray-900 mb-2">5. Size &amp; Fit</p>
        <button
          onClick={() => setScannerOpen(true)}
          className="w-full mb-3 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-50 border-2 border-violet-200 text-violet-700 text-[11px] font-black hover:bg-violet-100 hover:border-violet-400 transition-all"
        >
          <ScanLine size={14} />
          SCAN MY FOOT FOR SIZE
        </button>
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
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-gray-500 hover:text-gray-900 transition-colors"><Minus size={12}/></button>
            <span className="text-sm font-bold text-gray-800 w-5 text-center">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="text-gray-500 hover:text-gray-900 transition-colors"><Plus size={12}/></button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Canvas content ──
  // ── Canvas content ──
  const canvasContent = (
    <div className="flex-1 flex flex-col p-6 lg:p-8 gap-6 min-w-0 bg-[#f8fafc]/50 relative">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Studio Design Canvas</h3>
          <p className="text-sm text-slate-500 font-medium">Drag charms and patterns onto the 3D preview to customize your pair.</p>
        </div>
        <div className="hidden lg:flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white shadow-sm">
          <div className="flex -space-x-2">
            {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />)}
          </div>
          <span className="text-[11px] font-bold text-slate-400">12.4k designs created</span>
        </div>
      </div>

      {/* Mobile quick-add strip */}
      <div className="flex gap-3 overflow-x-auto pb-2 lg:hidden scrollbar-hide">
        {[...REPO_ITEMS, ...UNIQUE_CHARMS].map(item => (
          <button key={item.id}
            onClick={() => tapToAdd(item.emoji, item.name)}
            onTouchStart={e => startTouchDrag(item.emoji, item.name, e)}
            className="shrink-0 w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-3xl shadow-sm active:scale-90 transition-all touch-none"
          >{item.emoji}</button>
        ))}
      </div>

      {/* Drop zone / Studio Floor */}
      <div
        ref={canvasRef}
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
        className={`flex-1 relative rounded-[32px] border-2 transition-all duration-500 overflow-hidden group/canvas ${
          isDragOver ? 'border-purple-400 bg-purple-50/50 shadow-2xl scale-[1.01]' : 'border-slate-200 bg-white shadow-inner'
        }`}
        style={{ 
          minHeight: 450,
          backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(255,255,255,0.8) 100%), linear-gradient(rgba(241, 245, 249, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(241, 245, 249, 0.5) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 40px 40px, 40px 40px'
        }}
      >
        {/* Professional Studio Lighting Effects */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent opacity-40 pointer-events-none" />

        {/* Main Product Showcase */}
        <div className="absolute inset-0 flex items-center justify-center gap-8 lg:gap-16 pointer-events-none select-none px-8">
          <div className="w-[45%] max-w-[320px] transition-transform duration-700 hover:scale-105">
            <SlipperSVG color={color} text={customText} embellishment={embellishment}/>
          </div>
          <div className="w-[45%] max-w-[320px] transition-transform duration-700 hover:scale-105 delay-75">
            <SlipperSVG color={color} flip text={customText} embellishment={embellishment}/>
          </div>
        </div>

        {/* Empty State Guide */}
        {droppedItems.length === 0 && !isDragOver && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none">
            <div className="flex flex-col items-center gap-3">
              <div className="bg-slate-900/90 backdrop-blur-xl text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20">
                <Palette size={16} className="text-purple-400" />
                <span className="text-sm font-bold tracking-tight">Drop your first charm here</span>
              </div>
              <div className="w-0.5 h-12 bg-gradient-to-b from-slate-900/50 to-transparent" />
            </div>
          </div>
        )}

        {/* Active Drop Interaction */}
        {isDragOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 rounded-full border-8 border-purple-500/20 border-dashed animate-spin" />
            <div className="absolute w-32 h-32 rounded-full border-4 border-purple-500 animate-ping opacity-20" />
          </div>
        )}

        {/* Dropped items with advanced controls */}
        {droppedItems.map(item => (
          <div key={item.key}
            draggable
            onDragStart={() => startDrag(item.emoji, item.name, item.key)}
            onTouchStart={e => startTouchDrag(item.emoji, item.name, e, item.key)}
            className="absolute group/item cursor-grab active:cursor-grabbing select-none z-20 hover:scale-125 transition-transform duration-200"
            style={{ left: `${item.xPct}%`, top: `${item.yPct}%`, transform: 'translate(-50%,-50%)' }}
          >
            <div className="relative">
              {item.id === 'custom-upload' ? (
                <img src={item.emoji} alt="custom" className="w-16 h-16 lg:w-20 lg:h-20 object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]" />
              ) : (
                <span className="text-5xl lg:text-6xl filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] block">
                  {item.emoji}
                </span>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); setDroppedItems(p => p.filter(i => i.key !== item.key)); }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full opacity-0 group-hover/item:opacity-100 transition-all duration-200 flex items-center justify-center shadow-lg transform scale-0 group-hover/item:scale-100 hover:bg-rose-600"
              >
                <X size={12} strokeWidth={3}/>
              </button>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/10 blur-md rounded-full -z-10" />
            </div>
          </div>
        ))}

        {/* Canvas Metadata Tags */}
        <div className="absolute bottom-6 left-8 flex gap-4">
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/40 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Preview 1.0
          </div>
          {droppedItems.length > 0 && (
            <button 
              onClick={() => setDroppedItems([])}
              className="flex items-center gap-2 bg-rose-50/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-rose-100 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-sm"
            >
              Reset Canvas
            </button>
          )}
        </div>
      </div>

      {/* Global Actions */}
      <div className="flex gap-4">
        <button className="flex-[2] py-5 rounded-[24px] bg-[#0f172a] hover:bg-[#1e293b] active:scale-[0.98] text-white font-black text-sm tracking-[0.1em] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-200 group">
          <ShoppingCart size={18} className="group-hover:rotate-12 transition-transform" /> 
          ADD TO COLLECTION
          <span className="h-4 w-[1px] bg-white/20 mx-2" />
          <span className="text-purple-400">₹1,499</span>
        </button>
        <button className="flex-1 py-5 rounded-[24px] border-2 border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-900 font-black text-sm tracking-[0.1em] transition-all flex items-center justify-center gap-3 shadow-lg group">
          <Bookmark size={18} className="group-hover:fill-current" /> 
          WISHLIST
        </button>
      </div>
    </div>
  );


  return (
    <section className="w-full bg-white">
      {/* Touch ghost — floating emoji following finger */}
      {touchGhost && (
        <div className="fixed pointer-events-none z-[9999] text-5xl"
          style={{ left: touchGhost.x - 24, top: touchGhost.y - 24, transform: 'scale(1.15)', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}>
          {touchGhost.emoji}
        </div>
      )}

      <div className="max-w-[1400px] mx-auto"
        style={{ background: 'linear-gradient(135deg,#ede4f5 0%,#d5e8f7 100%)', minHeight: 700 }}>

        {/* ── Mobile layout ──────────────────────────────────────────── */}
        <div className="lg:hidden flex flex-col" style={{ minHeight: 700 }}>
          {/* Mobile tabs */}
          <div className="flex bg-[#1b1729]">
            <button onClick={() => setMobileTab(0)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-black uppercase tracking-wider transition-colors ${
                mobileTab === 0 ? 'text-white border-b-2 border-purple-400' : 'text-gray-500'
              }`}>
              <Palette size={13}/> Design
            </button>
            <button onClick={() => setMobileTab(1)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-black uppercase tracking-wider transition-colors ${
                mobileTab === 1 ? 'text-white border-b-2 border-purple-400' : 'text-gray-500'
              }`}>
              <Settings2 size={13}/> Configure
            </button>
          </div>

          {/* Mobile tab: Design (canvas + mini embellishment strip) */}
          {mobileTab === 0 && (
            <div className="flex flex-col flex-1">
              {canvasContent}
            </div>
          )}

          {/* Mobile tab: Configure */}
          {mobileTab === 1 && (
            <div className="overflow-y-auto flex-1 bg-white/70">
              {configContent}
            </div>
          )}
        </div>

        {/* ── Desktop layout ─────────────────────────────────────────── */}
        <div className="hidden lg:flex" style={{ minHeight: 700 }}>

          {/* Nav Sidebar */}
          <nav className="w-20 bg-slate-900 flex flex-col items-center py-8 gap-6 shrink-0 shadow-[20px_0_40px_rgba(0,0,0,0.1)] z-30">
            <div className="w-12 h-12 rounded-[18px] bg-white flex items-center justify-center mb-6 shadow-xl shadow-white/10 active:scale-95 transition-transform cursor-pointer">
              <span className="text-2xl">🩴</span>
            </div>
            {[
              { icon: '🩴', active: true,  label: 'Build' },
              { icon: '✏️', active: false, label: 'Edit' },
              { icon: '✨', active: false, label: 'Special' },
              { icon: '👤', active: false, label: 'Profile' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 group cursor-pointer">
                <button
                  className={`w-12 h-12 rounded-[18px] flex items-center justify-center text-xl transition-all duration-300 ${
                    item.active ? 'bg-slate-800 text-white shadow-inner scale-110' : 'text-slate-500 hover:text-white hover:bg-slate-800'
                  }`}
                >{item.icon}</button>
                <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${item.active ? 'text-white' : 'text-slate-600 group-hover:text-slate-400'}`}>
                  {item.label}
                </span>
              </div>
            ))}
            <div className="mt-auto relative">
              <button className="w-12 h-12 rounded-[18px] flex items-center justify-center text-xl text-slate-500 hover:bg-slate-800 hover:text-white transition-all">🔔</button>
              <span className="absolute top-1 right-1 w-5 h-5 bg-rose-500 rounded-full border-4 border-slate-900 text-[8px] font-black text-white flex items-center justify-center shadow-lg">1</span>
            </div>
          </nav>

          {/* Toolbox */}
          <div className="w-[320px] shrink-0 bg-white/90 backdrop-blur-xl overflow-y-auto border-r border-slate-100">
            {toolboxContent}
          </div>

          {/* Config */}
          <div className="w-[280px] shrink-0 bg-slate-50/50 backdrop-blur-sm overflow-y-auto border-r border-slate-100">
            {configContent}
          </div>

          {/* Canvas */}
          {canvasContent}
        </div>

      </div>

      <AnimatePresence>
        {scannerOpen && (
          <FootScanner
            onResult={handleScanResult}
            onClose={() => setScannerOpen(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
