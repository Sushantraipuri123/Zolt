'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';

export default function CheckoutSection() {
  const [selectedPack, setSelectedPack] = useState<'single' | 'sub'>('sub');

  return (
    <div className="relative w-full min-h-screen bg-black flex flex-col justify-between overflow-hidden select-none">
      
      {/* Dynamic glow backdrops */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#00e5ff]/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Content Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-16 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center flex-grow">
        
        {/* Left Side: Can macro landing space (Cols 1-5) */}
        <div className="lg:col-span-5 h-[35vh] lg:h-[55vh] flex items-center justify-center pointer-events-none" aria-hidden="true">
          {/* Leaves empty space for the close-up macro shot can */}
        </div>

        {/* Right Side: E-Commerce closer & CTA (Cols 6-12) */}
        <div className="lg:col-span-7 flex flex-col space-y-8">
          <div className="space-y-3">
            <p className="text-[10px] font-black tracking-[0.3em] text-[var(--accent)] uppercase font-space-grotesk">
              Outro // Ready to Flow
            </p>
            <h2 className="font-outfit text-3xl md:text-5xl lg:text-6xl font-black leading-none text-white tracking-tight">
              JOIN THE FLOW. <br />
              SECURE YOUR SUPPLY.
            </h2>
            <p className="text-zinc-500 text-sm font-light max-w-lg leading-relaxed">
              Experience the anti-gravity difference. Pure cognitive drive, active hydration, and zero sugar crash delivered straight to your door.
            </p>
          </div>

          {/* Interactive Pack Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
            {/* Single Pack Option */}
            <div
              onClick={() => setSelectedPack('single')}
              className={`cursor-pointer p-6 rounded-xl border backdrop-blur-xl transition-all duration-300 flex flex-col justify-between h-40 ${
                selectedPack === 'single'
                  ? 'border-[var(--accent)] bg-[var(--accent)]/[0.03] shadow-[0_0_25px_rgba(255,113,32,0.15)]'
                  : 'border-white/[0.04] bg-white/[0.01] hover:border-white/[0.1]'
              }`}
            >
              <div>
                <h3 className="font-space-grotesk text-xs font-bold tracking-[0.1em] text-white uppercase">
                  Single Trial Pack
                </h3>
                <p className="text-[10px] text-zinc-500 uppercase font-medium mt-1">6 Cans // Zolt Splash</p>
              </div>
              <div className="flex items-baseline justify-between mt-4">
                <span className="text-zinc-400 text-xs">One-time purchase</span>
                <span className="font-outfit text-2xl font-black text-white">$19.99</span>
              </div>
            </div>

            {/* Subscription Option */}
            <div
              onClick={() => setSelectedPack('sub')}
              className={`cursor-pointer p-6 rounded-xl border backdrop-blur-xl transition-all duration-300 flex flex-col justify-between h-40 relative ${
                selectedPack === 'sub'
                  ? 'border-[var(--accent)] bg-[var(--accent)]/[0.03] shadow-[0_0_25px_rgba(255,113,32,0.15)]'
                  : 'border-white/[0.04] bg-white/[0.01] hover:border-white/[0.1]'
              }`}
            >
              <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[8px] font-black tracking-widest bg-[var(--accent)] text-black uppercase font-space-grotesk">
                Best Value // 15% OFF
              </div>
              <div>
                <h3 className="font-space-grotesk text-xs font-bold tracking-[0.1em] text-white uppercase">
                  Kinetic Flow Plan
                </h3>
                <p className="text-[10px] text-[#00e5ff] uppercase font-bold mt-1">12 Cans // Free Shipping</p>
              </div>
              <div className="flex items-baseline justify-between mt-4">
                <span className="text-zinc-400 text-xs">Monthly delivery</span>
                <div className="text-right">
                  <span className="font-outfit text-2xl font-black text-white">$32.99</span>
                  <span className="text-[9px] text-zinc-500 font-bold block">/ MONTH</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="w-full max-w-xl">
            <motion.button
              className="w-full py-5 rounded-xl text-center font-space-grotesk text-xs font-black uppercase tracking-[0.25em] text-black bg-[var(--accent)] shadow-[0_4px_30px_rgba(255,113,32,0.25)] transition-all relative overflow-hidden group"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
              <span className="relative z-10">ORDER NOW // ENTER THE FLOW</span>
            </motion.button>
            <p className="text-center text-zinc-600 text-[10px] font-medium tracking-wide mt-3">
              Secure checkout encrypted. 30-day performance satisfaction guarantee.
            </p>
          </div>
        </div>

      </div>

      {/* Stylized Cyber-Footer */}
      <footer className="relative z-10 w-full border-t border-white/[0.04] bg-black/60 backdrop-blur-md py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start space-y-1">
            <span className="font-outfit text-lg font-black tracking-widest text-white">
              ZOLT<span className="text-[var(--accent)]">.</span>
            </span>
            <p className="text-[10px] text-zinc-500 font-semibold tracking-wider font-space-grotesk">
              ZOLT ENERGY © 2026. ALL RIGHTS RESERVED.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase font-space-grotesk">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>

          {/* Social Icons (styled text links) */}
          <div className="flex gap-4 text-[10px] font-bold tracking-widest text-zinc-500 uppercase font-space-grotesk">
            <a href="#" className="hover:text-[var(--accent)] transition-colors">Instagram</a>
            <span className="text-zinc-800">/</span>
            <a href="#" className="hover:text-[#00e5ff] transition-colors">Twitter (X)</a>
          </div>
        </div>

        {/* Large Decorative Footer Title */}
        <div className="max-w-7xl mx-auto mt-10 text-center pointer-events-none opacity-80 border-t border-white/5 pt-6 hidden md:block">
          <h1 className="font-outfit text-[8vw] font-black leading-none tracking-widest uppercase select-none shining-footer-text">
            ZOLT ENERGY
          </h1>
        </div>
      </footer>

    </div>
  );
}
