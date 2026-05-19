'use client';

import { motion } from 'motion/react';

export default function AdventureSection() {
  const specs = [
    {
      title: 'ENDURE THE ALTITUDE',
      body: 'Optimized molecular integrity built to thrive in extreme, thin-air high-impact atmospheric conditions.',
    },
    {
      title: 'THERMO-BALANCED REHYDRATION',
      body: 'Instantly loads your system with core electrolytes and bioactive minerals to mitigate thermal and metabolic stress.',
    },
    {
      title: 'ZERO-CRASH KINETIC ENERGY',
      body: 'A sustained-release formulation delivering continuous focus and physical output without sudden drops.',
    },
    {
      title: 'PROVEN IN EXTREME RUNS',
      body: 'Field-tested by elite alpine explorers, extreme dirt-bikers, and high-altitude athletes globally.',
    },
  ];

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex items-center justify-center bg-black">
      {/* Immersive Parallax Adventure Backdrop */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-65 select-none pointer-events-none scale-105"
        style={{ 
          backgroundImage: "url('/images/adventure_backdrop.png')",
          backgroundAttachment: 'fixed',
        }}
        aria-hidden="true"
      />
      
      {/* High-contrast dark vignette mask for extreme legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette opacity-80 pointer-events-none" />

      {/* Grid Layout Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left Column: Aggressive Aggressive Title */}
        <div className="flex flex-col space-y-6">
          <p className="text-[10px] font-black tracking-[0.3em] text-[var(--accent)] uppercase">
            Phase 01 // Mountain Wild
          </p>
          
          <h2 className="font-outfit text-[clamp(2.5rem,6vw,4.5rem)] font-black leading-[0.95] tracking-tighter text-white">
            BUILT FOR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600">THE EXTREME.</span>
          </h2>
          
          <div className="w-16 h-1 bg-[var(--accent)] rounded-full" />
          
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-md font-light">
            When gravity pulls down, Zolt pushes back. Engineered for high-altitude wind currents, extreme environments, and sustained raw endurance.
          </p>
        </div>

        {/* Right Column: Spec Bullet Grid */}
        <div className="space-y-8">
          {specs.map((spec, index) => (
            <motion.div
              key={spec.title}
              className="flex gap-6 p-6 rounded-xl border border-white/[0.03] bg-white/[0.01] backdrop-blur-md transition-all duration-300 hover:border-white/[0.08] hover:bg-white/[0.02]"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-[var(--accent)]/30 text-[10px] font-bold text-[var(--accent)] bg-[var(--accent)]/5 font-space-grotesk">
                0{index + 1}
              </div>
              <div className="space-y-2">
                <h3 className="font-space-grotesk text-xs md:text-sm font-black tracking-[0.15em] text-white uppercase">
                  {spec.title}
                </h3>
                <p className="text-zinc-500 text-xs md:text-sm font-light leading-relaxed">
                  {spec.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
