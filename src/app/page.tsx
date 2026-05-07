import Hero from '@/components/Hero';
import Footer3D from '@/components/Footer3D/Footer3D';
import FooterRelated from '@/components/FooterRelated';
import SlipperCustomizer from '@/components/SlipperCustomizer';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />
      
      {/* Content Section */}
      <section className="w-full max-w-7xl px-4 py-32 space-y-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight uppercase tracking-tighter">THE DEPTH OF INNOVATION</h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              We leverage Three.js and React Three Fiber to craft interfaces that aren't just seen, but experienced. Every interaction is an invitation to explore a larger world.
            </p>
            <div className="pt-4">
              <div className="h-px w-32 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
            </div>
          </div>
          <div className="h-[450px] rounded-[2.5rem] glass flex items-center justify-center p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-neutral-900 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-cyan-500/10 mix-blend-overlay group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border border-white/5 rounded-full animate-pulse" />
                <div className="absolute w-48 h-48 border border-white/5 rounded-full animate-pulse delay-75" />
                <span className="text-neutral-500 font-mono tracking-widest uppercase text-xs">Visual Artifact 001</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "PERFORMANCE", desc: "Optimized for 60fps across all modern browsers and devices with lean code structures." },
            { title: "REDESIGNED", desc: "A ground-up approach to how we navigate the digital space using spatial logic." },
            { title: "IMMERSIVE", desc: "Spatial awareness integrated into every pixel of the UI for a literal depth of experience." }
          ].map((item, i) => (
            <div key={i} className="p-12 rounded-[2.5rem] bg-neutral-900/40 border border-white/5 backdrop-blur-xl hover:border-cyan-500/20 transition-all group">
              <div className="text-xs font-black mb-6 text-cyan-500 tracking-[0.3em] font-mono">{item.title}</div>
              <p className="text-neutral-400 font-medium leading-relaxed group-hover:text-neutral-200 transition-colors">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3D Slipper Customizer Section */}
      <div id="customizer" className="w-full">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-white/5" />
            <h2 className="text-sm font-mono text-neutral-600 tracking-[0.5em] uppercase">Studio_Config_01</h2>
            <div className="h-px flex-1 bg-white/5" />
          </div>
        </div>
        <SlipperCustomizer />
      </div>

      {/* Footer Related Items */}
      <FooterRelated />

      {/* 3D Footer */}
      <div className="w-full">
        <Footer3D />
      </div>
    </main>
  );
}


