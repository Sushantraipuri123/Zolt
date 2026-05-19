'use client';

import { motion } from 'motion/react';

export default function GymSection() {
  const cards = [
    {
      title: 'LACTIC ACID SUPPRESSION',
      tagline: 'Outlast Muscle Fatigue',
      desc: 'Formulated with specialized beta-alanine and mineral buffers that actively suppress lactic acid accumulation during high-rep, explosive sets.',
      accent: 'border-[#00e5ff]/20 hover:border-[#00e5ff]/50 bg-[#00e5ff]/[0.01]',
      textAccent: 'text-[#00e5ff]',
    },
    {
      title: 'EXPLOSIVE ATP BOOSTER',
      tagline: 'Immediate Cellular Recharge',
      desc: 'Ignites instantaneous ATP restoration at the mitochondrial level, facilitating raw muscular output and explosive recovery between heavy lifts.',
      accent: 'border-[#ff7120]/20 hover:border-[#ff7120]/50 bg-[#ff7120]/[0.01]',
      textAccent: 'text-[var(--accent)]',
    },
    {
      title: 'TUNNEL-VISION FOCUS',
      tagline: 'Melt Away Distraction',
      desc: 'Active adaptogens lock your brain into an uncompromising flow state, matching your raw muscular strength with absolute cognitive precision.',
      accent: 'border-[#b5ff14]/20 hover:border-[#b5ff14]/50 bg-[#b5ff14]/[0.01]',
      textAccent: 'text-[#b5ff14]',
    },
  ];

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-black overflow-hidden select-none">
      
      {/* Industrial Gym Backdrop */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-45 pointer-events-none scale-105"
        style={{ 
          backgroundImage: "url('/images/gym_backdrop.png')",
          backgroundAttachment: 'fixed',
        }}
        aria-hidden="true"
      />

      {/* Cyber Grid Lines Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4vw_4vw] pointer-events-none" />

      {/* Extreme Vignette & Color Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00e5ff]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Local Lightning Flash Overlay (triggered via GSAP inside scrollChoreography3d) */}
      <div className="lightning-flash-overlay absolute inset-0 bg-white opacity-0 pointer-events-none z-50 transition-opacity duration-75" />

      {/* Overlapping Aggressive Outline Header */}
      <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-full text-center pointer-events-none z-0 overflow-hidden whitespace-nowrap">
        <h1 
          className="font-outfit text-[clamp(4rem,14vw,14rem)] font-black leading-none uppercase tracking-[0.02em] select-none"
          style={{
            WebkitTextStroke: '2px rgba(255, 255, 255, 0.05)',
            color: 'transparent',
          }}
        >
          KINETIC POWER
        </h1>
      </div>

      {/* Main Layout Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-28 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Space: Can Lands and Slams Here (Occupies Columns 1-5) */}
        <div className="lg:col-span-5 h-[40vh] lg:h-[60vh] flex items-center justify-center" aria-hidden="true">
          {/* Leaving empty space for the 3D can to dynamically align and slam */}
        </div>

        {/* Right Space: Specs Cards (Occupies Columns 6-12) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <div className="space-y-3">
            <p className="text-[10px] font-black tracking-[0.3em] text-[#00e5ff] uppercase">
              Phase 02 // Pure Kinetic Energy
            </p>
            <h2 className="font-outfit text-3xl md:text-5xl lg:text-6xl font-black leading-none text-white tracking-tight">
              MAXIMUM POWER OUTPUT.
            </h2>
            <p className="text-zinc-500 text-sm font-light max-w-lg leading-relaxed">
              Engineered with physical acceleration in mind. Designed to push the boundary of speed, pressure, and cellular explosive power.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:gap-6 mt-4">
            {cards.map((card, index) => (
              <motion.div
                key={card.title}
                className={`flex flex-col p-6 rounded-xl border backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.4)] ${card.accent}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-space-grotesk text-xs md:text-sm font-black tracking-[0.15em] text-white uppercase">
                    {card.title}
                  </h3>
                  <span className={`text-[10px] font-bold tracking-[0.1em] ${card.textAccent} font-space-grotesk uppercase`}>
                    {card.tagline}
                  </span>
                </div>
                <p className="mt-3 text-zinc-400 text-xs md:text-sm font-light leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
