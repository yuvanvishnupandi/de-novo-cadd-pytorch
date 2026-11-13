import React from 'react';

/**
 * Footer
 * Scientific & Academic Footer for EUREKA In-Silico Discovery Platform:
 * - Floating dark rounded card (rounded-[36px] sm:rounded-[48px])
 * - Atmospheric diffused warm terracotta/copper ambient glow
 * - Top Left: Real Scientific Navigation (Workbench, Pipeline, 3D Lab, Genetics Studio, Case Studies)
 * - Top Right: GitHub Repository, Academic Preprints (arXiv, IEEE, bioRxiv) & Database Registries (PDB, ChEMBL, PubChem)
 * - Zero corporate fluff (no fake emails, phone numbers, or addresses)
 * - Bottom: Edge-to-edge glowing display watermark "Eureka" centered
 */
export default function Footer({ onNavigate }) {
  const handleNav = (pageKey) => {
    if (onNavigate) {
      onNavigate(pageKey);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-[#100f0e] px-4 sm:px-8 lg:px-12 py-10 lg:py-16 select-none">
      {/* Floating Card Container */}
      <div className="relative w-full max-w-[1640px] mx-auto rounded-[36px] sm:rounded-[48px] overflow-hidden bg-[#141312] border border-white/[0.08] shadow-2xl min-h-[520px] lg:min-h-[580px] flex flex-col justify-between p-8 sm:p-12 lg:p-16">
        
        {/* Warm Terracotta / Copper Ambient Glow Rising from Bottom Center */}
        <div
          className="absolute inset-0 pointer-events-none select-none z-0"
          style={{
            background: 'radial-gradient(ellipse 95% 75% at 50% 108%, rgba(225, 100, 48, 0.62) 0%, rgba(185, 72, 30, 0.4) 34%, rgba(120, 45, 18, 0.18) 64%, rgba(20, 19, 18, 0) 85%)'
          }}
        />

        {/* Secondary diffuse soft fill */}
        <div
          className="absolute -bottom-16 inset-x-0 h-80 pointer-events-none select-none z-0 blur-3xl opacity-80"
          style={{
            background: 'linear-gradient(to top, rgba(225, 100, 48, 0.38) 0%, rgba(160, 60, 24, 0.16) 50%, transparent 100%)'
          }}
        />

        {/* Top Content Row: Navigation (Left) + Academic & Repository Registries (Right) */}
        <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between items-start gap-10">
          
          {/* Top Left: Clean Scientific Navigation List */}
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              SCIENTIFIC WORKBENCH NAVIGATION
            </div>
            <nav className="flex flex-col space-y-2.5 font-sans text-lg sm:text-[20px] font-light text-white leading-tight tracking-tight">
              <button
                onClick={() => handleNav('overview')}
                className="text-left hover:text-[#f8a881] transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>Overview &amp; Architecture</span>
              </button>
              <button
                onClick={() => handleNav('lab')}
                className="text-left hover:text-[#f8a881] transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>Molecular Discovery Studio (AutoDock Vina &amp; PyMOL)</span>
              </button>
              <button
                onClick={() => handleNav('antibody')}
                className="text-left hover:text-[#f8a881] transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>Antibody Design Studio &amp; CDR Optimizer</span>
              </button>
              <button
                onClick={() => handleNav('case-studies')}
                className="text-left hover:text-[#f8a881] transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>Case Studies &amp; High-Throughput Phenomics</span>
              </button>
            </nav>
          </div>

          {/* Top Right: GitHub Repository + Academic Research & Benchmark Registries */}
          <div className="flex flex-col items-start lg:items-end space-y-3 font-mono text-xs sm:text-[13px] text-neutral-300">
            
            {/* GitHub Primary Repository Link */}
            <a
              href="https://github.com/yuvanvishnupandi/eureka"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-mono text-xs font-semibold transition-all shadow-lg hover:shadow-emerald-500/20"
            >
              {/* GitHub SVG Icon */}
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>github.com/yuvanvishnupandi/eureka</span>
              <span className="text-emerald-400">↗</span>
            </a>

            {/* Academic Paper & Preprints */}
            <div className="flex flex-col items-start lg:items-end space-y-1 pt-2">
              <div className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
                PEER-REVIEWED METHODOLOGY &amp; PREPRINTS
              </div>
              <div className="text-neutral-200 hover:text-white transition-colors">
                arXiv:2403.08588 [q-bio.BM] · <span className="text-emerald-400 font-bold">Biophysical Machine Learning</span>
              </div>
              <div className="text-neutral-300">
                IEEE / ACM Transactions on Computational Biology &amp; Bioinformatics
              </div>
              <div className="text-neutral-400 text-[11px]">
                bioRxiv · Lamarckian Genetic Algorithm Molecular Docking Force-Fields
              </div>
            </div>

            {/* Scientific Primary Database Registries */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-neutral-400">
              <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10 text-white font-mono">
                RCSB PDB (PDBQT/CIF)
              </span>
              <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10 text-white font-mono">
                EMBL-EBI ChEMBL
              </span>
              <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10 text-white font-mono">
                NIH Tox21 &amp; PubChem
              </span>
            </div>

            {/* Architecture Statement */}
            <div className="text-[11px] text-neutral-500 pt-1">
              Deterministic Generative AI + Machine Learning + Force Fields · Zero Agentic AI
            </div>

          </div>

        </div>

        {/* Bottom Giant Glowing Watermark: Wider, Cool, and Middled across full width */}
        <div className="relative z-10 w-full pt-10 sm:pt-16 select-none pointer-events-none overflow-hidden -mb-4 sm:-mb-6 flex justify-center items-center">
          <h2
            className="w-full font-sans font-medium text-center leading-[0.78] select-none text-transparent bg-clip-text"
            style={{
              fontSize: 'clamp(6.5rem, 23vw, 28rem)',
              letterSpacing: '-0.035em',
              backgroundImage: 'linear-gradient(to top, rgba(245, 155, 95, 0.72) 0%, rgba(225, 115, 60, 0.44) 42%, rgba(255, 255, 255, 0.16) 100%)'
            }}
          >
            Eureka
          </h2>
        </div>

      </div>
    </footer>
  );
}
