import React from 'react';

/**
 * HeroSection
 * Expansive Cinema-Grade Hero Section for EUREKA:
 * - Ultra-wide container (max-w-[1640px])
 * - Hardware-accelerated halftone video background (butter smooth, zero stutter/flicker)
 * - Optimized GPU alpha composite (no expensive mix-blend-mode that causes dropped frames)
 * - Expansive typography: "EUREKA, the research environment for R&D"
 * - Try EUREKA for free (white pill) & Academic sign up (translucent border pill)
 */
export default function HeroSection({ onLaunchLab, onAcademicSignup }) {
  return (
    <section className="relative -mt-[76px] h-[94vh] min-h-[680px] w-full overflow-hidden bg-[#171615]">
      
      {/* Background Halftone Video - Hardware accelerated on GPU */}
      <div className="absolute inset-0 overflow-hidden transform-gpu will-change-transform">
        <video
          className="absolute inset-0 h-full w-full translate-x-[10%] sm:translate-x-[15%] scale-105 object-cover opacity-85 pointer-events-none"
          src="/videos/use-cases/hero-halftone.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
      </div>

      {/* High-performance pure-alpha gradients (smooth 60fps compositing) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, rgba(23, 22, 21, 1) 0%, rgba(23, 22, 21, 1) 32%, rgba(23, 22, 21, 0.88) 48%, rgba(23, 22, 21, 0.55) 68%, rgba(23, 22, 21, 0.15) 88%, rgba(23, 22, 21, 0) 100%), linear-gradient(180deg, rgba(23, 22, 21, 0.4) 0%, transparent 25%, rgba(23, 22, 21, 1) 100%)'
        }}
      />

      {/* Foreground Content (Ultra Wide Container) */}
      <div className="relative flex h-full items-center pt-[76px]">
        <div className="mx-auto w-full max-w-[1640px] px-6 sm:px-12 lg:px-16">
          <div className="max-w-[780px] lg:max-w-[880px] space-y-8">
            
            {/* Main Headline */}
            <h1 className="font-sans text-4xl sm:text-6xl lg:text-[68px] leading-[1.04] tracking-[-0.035em] font-normal text-white">
              <span className="block font-medium">EUREKA: The Computational Biophysics &amp; Generative Biology Workbench</span>
            </h1>

            {/* Subtitle */}
            <p className="font-sans text-base sm:text-xl leading-relaxed tracking-[-0.01em] text-neutral-300 font-light max-w-[720px]">
              A unified high-performance computational environment for de novo drug discovery — integrating thermodynamic docking force-fields, autoregressive sequence modeling, single-cell transcriptomic graphs, and precision locus engineering.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onLaunchLab}
                className="inline-flex items-center justify-center rounded bg-white text-black hover:bg-[#e8e5e0] h-11 px-6 text-[15px] font-semibold transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer gap-2 font-sans"
              >
                <span>Launch Molecular Discovery Studio</span>
                <span className="text-xs">→</span>
              </button>

              <button
                onClick={onLaunchLab}
                className="inline-flex items-center justify-center rounded border border-white/40 bg-transparent text-white hover:border-white/70 hover:bg-white/5 h-11 px-6 text-[15px] font-medium transition-all cursor-pointer font-sans"
              >
                AutoDock Vina &amp; PyMOL Workbench
              </button>
            </div>

            {/* Live Scale Metric Badge */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs sm:text-sm font-mono text-neutral-400">
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-[11px] font-mono font-semibold text-emerald-400 uppercase tracking-wider">INDEXED</span>
              <span>16M biomedical literature records · 858M graph nodes · Real-time 3D physics force fields</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

