import React from 'react';

/**
 * WorkbenchCTA
 * Terminal Call to Action Banner for In-Silico Screening
 */
export default function WorkbenchCTA({ onLaunchWorkbench, onExploreAntibody }) {
  return (
    <section className="mx-auto w-full max-w-[var(--page-max)] px-[var(--page-gutter-mobile)] md:px-8 py-16">
      <div className="relative flex min-h-[452px] items-center justify-center overflow-hidden rounded-[8px] bg-black border border-[#2e2c29]">
        {/* Halftone looping video background */}
        <video
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-75 mix-blend-screen"
          src="/videos/shared/halftone-cta-20260602-171042.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />

        {/* Gradient dark scrim for readable contrast */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="relative z-10 flex flex-col items-center gap-9 px-8 py-[120px] text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3.5 py-1 font-mono text-xs text-emerald-300">
            <span className="text-emerald-400 font-bold">✓</span>
            READY FOR IN-SILICO SCREENING
          </div>

          <p className="font-sans text-[26px] sm:text-[30px] font-normal leading-[1.35] tracking-tight text-[#f5f2ee]">
            Drug programs fail when biology is misunderstood. EUREKA closes that gap through biophysical force-fields, sequence diffusion, and verified structural proof.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={onLaunchWorkbench}
              className="inline-flex items-center justify-center rounded-[4px] bg-white text-black font-sans font-medium px-6 py-3 text-[15px] hover:bg-[#e8e5e0] transition-all transform active:scale-95 shadow-lg cursor-pointer"
            >
              Launch Interactive 3D Lab →
            </button>
            <button
              type="button"
              onClick={onExploreAntibody}
              className="inline-flex items-center justify-center rounded-[4px] border border-[#3e3c38] bg-[#1a1918]/80 backdrop-blur-sm text-[#d4d4d4] font-sans font-medium px-6 py-3 text-[15px] hover:bg-[#252422] hover:text-white transition-all cursor-pointer"
            >
              Explore Antibody Studio →
            </button>
          </div>

          <div className="font-mono text-[11px] text-[#737373]">
            Verified with 38M+ published biomedical records &amp; AutoDock Vina v1.2.5 physics engine
          </div>
        </div>
      </div>
    </section>
  );
}

