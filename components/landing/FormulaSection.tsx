'use client';

import { motion } from 'motion/react';

export default function FormulaSection() {
  const leftFormula = [
    {
      label: 'NATURAL CAFFEINE',
      amount: '150mg',
      desc: 'Extracted from organic coffeeberry, delivering a clean, steady surge without the synthetic crash.',
    },
    {
      label: 'ALPHA COGNITIVE BLEND',
      amount: '75mg',
      desc: 'Infused with L-Theanine to promote razor-sharp alpha brainwave focus and eliminate jitters.',
    },
  ];

  const rightFormula = [
    {
      label: 'BCAA RECOVERY COMPLEX',
      amount: '250mg',
      desc: 'An optimized blend of essential branch-chain amino acids protecting muscle integrity under stress.',
    },
    {
      label: 'HYPER-DRIVE ELECTROLYTES',
      amount: '100%',
      desc: 'Balanced magnesium, potassium, and sodium citrate to lock in cellular hydration instantly.',
    },
  ];

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-black overflow-hidden select-none">
      
      {/* Dynamic Ambient Orbit Glows in CSS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[var(--accent)]/10 to-[#00e5ff]/5 rounded-full blur-[180px] pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-white/[0.01] border border-white/[0.04] rounded-full pointer-events-none scale-100 animate-ping duration-[8000ms]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.005] border border-dashed border-white/[0.08] rounded-full pointer-events-none" />

      {/* Symmetrical Layout Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center h-full">
        
        {/* Left Elements (Cols 1-4) - Fly in from Left */}
        <div className="lg:col-span-4 flex flex-col space-y-8 lg:space-y-16 lg:text-right items-start lg:items-end">
          {leftFormula.map((item, index) => (
            <motion.div
              key={item.label}
              className="group space-y-3 max-w-md lg:pr-8 border-l-2 lg:border-l-0 lg:border-r-2 border-[var(--accent)]/30 pl-6 lg:pl-0 pr-0 lg:pr-6"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="flex items-baseline lg:justify-end gap-3">
                <span className="font-outfit text-3xl md:text-4xl lg:text-5xl font-black text-[var(--accent)] tracking-tight">
                  {item.amount}
                </span>
                <span className="font-space-grotesk text-[10px] font-bold tracking-[0.2em] text-white uppercase">
                  {item.label}
                </span>
              </div>
              <p className="text-zinc-500 text-xs md:text-sm font-light leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Central Space: Rotating 3D Can (Cols 5-8) */}
        <div className="lg:col-span-4 h-[40vh] lg:h-[60vh] flex flex-col items-center justify-center relative pointer-events-none">
          <div className="text-center space-y-2 z-10 absolute bottom-0 lg:bottom-12">
            <span className="text-[9px] font-black tracking-[0.4em] text-zinc-500 uppercase font-space-grotesk">
              Scroll to Inspect Texture
            </span>
            <p className="text-white/60 text-xs font-light tracking-wide">
              100% Recyclable Aluminum Canister
            </p>
          </div>
        </div>

        {/* Right Elements (Cols 9-12) - Fly in from Right */}
        <div className="lg:col-span-4 flex flex-col space-y-8 lg:space-y-16 items-start">
          {rightFormula.map((item, index) => (
            <motion.div
              key={item.label}
              className="group space-y-3 max-w-md lg:pl-8 border-l-2 border-[#00e5ff]/30 pl-6"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="flex items-baseline gap-3">
                <span className="font-outfit text-3xl md:text-4xl lg:text-5xl font-black text-[#00e5ff] tracking-tight">
                  {item.amount}
                </span>
                <span className="font-space-grotesk text-[10px] font-bold tracking-[0.2em] text-white uppercase">
                  {item.label}
                </span>
              </div>
              <p className="text-zinc-500 text-xs md:text-sm font-light leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
