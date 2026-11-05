import React from 'react';

/**
 * PreFooterMolecule
 * High-impact 3D rotating molecular visualizer placed directly before the footer.
 * Features: /images/molecule-rotate-beforefooter.mp4
 * - NO "EUREKA AUTONOMOUS IN-SILICO ENGINE" badge (per user request)
 * - 100% visible, bright, crystal-clear rotating 3D molecule video
 * - Clean spacious typography with direct navigation to the 3D lab
 */
export default function PreFooterMolecule({ onLaunchLab }) {
  return (
    <section className="relative w-full min-h-[560px] lg:min-h-[620px] bg-[#121110] border-t border-b border-[#2e2c29] overflow-hidden flex items-center">
      {/* 100% Visible, Crisp Molecular Video on the Right / Background */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-7/12 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <video
          className="w-full h-full max-h-[620px] object-contain object-center lg:object-right opacity-100 transform scale-110"
          src="/images/molecule-rotate-beforefooter.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        {/* Soft radial fade only at the leftmost edge to blend with dark text side */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#121110] to-transparent pointer-events-none hidden lg:block" />
      </div>

      {/* Floating Crystallographic Reference (Top Right) */}
      <div className="absolute top-6 right-8 hidden sm:flex items-center gap-2 z-10 pointer-events-none">
        <div className="px-3 py-1 rounded bg-black/70 backdrop-blur border border-white/10 text-xs font-mono text-neutral-300 flex items-center gap-2">
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold">3D</span>
          <span>ROTATING COORD · [PDB: 6LU7-LIG] · SOLVATED</span>
        </div>
      </div>

      {/* Left Column Content (Wide, High-Contrast, Crystal-Clear) */}
      <div className="relative z-10 w-full max-w-[1640px] mx-auto px-6 sm:px-12 lg:px-16 py-16 lg:py-24">
        <div className="max-w-2xl space-y-6">
          
          {/* Main Headline */}
          <h2 className="font-sans text-4xl sm:text-5xl lg:text-[56px] font-light tracking-tight text-white leading-[1.08]">
            From biological sequence to synthesizable lead in minutes, not months.
          </h2>

          {/* Body Description */}
          <p className="text-neutral-300 text-base sm:text-lg font-light leading-relaxed max-w-xl">
            Integrate biophysical docking force-fields, single-cell transcriptomic target graphs, and multi-round protein fitness models into your active pipeline. Zero hallucinations, backed by primary structural coordinates, empirical force-fields, and peer-reviewed literature proof.
          </p>

          {/* Action Button & Specs */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 pt-3">
            <button
              onClick={onLaunchLab}
              className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-white text-neutral-900 hover:bg-neutral-100 font-sans font-medium text-sm sm:text-base px-8 py-3.5 transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0"
            >
              <span>Explore Interactive 3D Lab</span>
              <span className="text-lg">→</span>
            </button>

            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-mono text-neutral-400">
              <span>AutoDock Vina v1.2.5</span>
              <span>·</span>
              <span>PyTorch LSTM</span>
              <span>·</span>
              <span className="text-emerald-400 font-semibold">858M Graph Nodes</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
