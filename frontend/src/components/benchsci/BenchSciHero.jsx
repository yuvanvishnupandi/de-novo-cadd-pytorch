import React from 'react';

/**
 * BenchSciHero
 * Exact recreation of BenchSci Hero Section:
 * - Background video: /videos/use-cases/hero-halftone.mp4
 * - Exact dark halftone gradient overlays & noise filter
 * - Exact typography and layout (text-5xl leading-[52px])
 * - Free trial and Academic sign-up buttons
 */
export default function BenchSciHero({ onLaunchLab, onAcademicSignup }) {
  return (
    <section className="relative -mt-[68px] h-[92vh] min-h-[640px] w-full overflow-hidden bg-[#242322]">
      
      {/* Background Halftone Video */}
      <video
        className="absolute inset-0 h-full w-full translate-x-[15%] sm:translate-x-[20%] scale-105 object-cover opacity-90"
        src="/videos/use-cases/hero-halftone.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />

      {/* Multi-layer Linear Gradient Overlays for High-Contrast Text Legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(23, 22, 21, 0.55) 0%, rgba(23, 22, 21, 0) 22%), linear-gradient(105deg, rgba(23, 22, 21, 1) 0%, rgba(23, 22, 21, 1) 22%, rgba(23, 22, 21, 0.9) 34%, rgba(23, 22, 21, 0.72) 48%, rgba(23, 22, 21, 0.5) 62%, rgba(23, 22, 21, 0.26) 76%, rgba(23, 22, 21, 0.08) 88%, rgba(23, 22, 21, 0) 97%)'
        }}
      />

      {/* Radial Vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0 [mix-blend-mode:multiply]"
        style={{
          background: 'radial-gradient(135% 125% at 6% 115%, rgba(23, 22, 21, 0.95) 0%, rgba(23, 22, 21, 0.55) 42%, rgba(23, 22, 21, 0) 74%)'
        }}
      />

      {/* Subtle Noise Texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.12] [mix-blend-mode:overlay] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '160px 160px'
        }}
      />

      {/* Foreground Content */}
      <div className="relative flex h-full items-center pt-[68px]">
        <div className="mx-auto w-full max-w-[1300px] px-6 sm:px-10 md:px-12">
          <div className="max-w-[560px]">
            
            {/* Main Headline */}
            <h1 className="font-sans text-4xl sm:text-5xl lg:text-[54px] leading-[1.08] tracking-[-0.03em] font-normal text-white">
              <span className="block font-medium">EMET, the research environment for R&amp;D</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-8 sm:mt-10 font-sans text-base sm:text-lg leading-relaxed tracking-[-0.01em] text-neutral-200 font-light">
              Just as AI coding gives every developer a team of expert engineers, our platform gives every scientist a unified computational workbench — unifying data, models, software packages, workflows, lab-in-the-loop, and scientific reasoning into a single environment purpose-built for R&amp;D.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3">
              <button
                onClick={onLaunchLab}
                className="inline-flex items-center justify-center rounded bg-white text-neutral-900 hover:bg-neutral-100 h-10 px-5 text-[15px] font-semibold transition-all shadow-md gap-2"
              >
                <span>Try EMET for free</span>
                <span className="text-xs">→</span>
              </button>

              <button
                onClick={onAcademicSignup}
                className="inline-flex items-center justify-center rounded border border-white/40 bg-transparent text-white hover:border-white/20 hover:bg-white/10 h-10 px-5 text-[15px] font-medium transition-all"
              >
                Academic sign up
              </button>
            </div>

            {/* Live BenchSci Metric Tag */}
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>16M closed-access papers · 858M knowledge nodes · Top 8 AI models</span>
            </div>

          </div>
        </div>
      </div>

      <div aria-hidden="true" className="absolute bottom-0 h-px w-full bg-neutral-800"></div>
    </section>
  );
}
