import React from 'react';

/**
 * ProductPillars
 * In-Silico Scientific Discovery Pillars & Methodology
 * Pure academic and doctoral research scope (zero customer quotes / zero commercial fluff)
 * Clean, static, understated cards with no jittery hover effects.
 */
export default function ProductPillars({ onExplorePlatform }) {
  const PILLARS = [
    {
      num: '01',
      title: 'It doesn’t search – it reasons',
      desc: 'Ask complex research questions in plain language. The orchestration layer decomposes queries, identifies the right domain-specific models, and chains them deterministically across primary scientific databases (PDB, ChEMBL, PubChem, Tox21, UniProt) and peer-reviewed biomedical literature.',
      highlight: 'Knowledge reasoning over 858M biological nodes'
    },
    {
      num: '02',
      title: 'The output isn’t a summary',
      desc: 'The result is traceable, explainable, and immediately actionable insights across in-silico discovery: target identification, pocket coordinate mapping, Monte Carlo docking, and lead candidate optimization. Every output links directly to atomic crystal coordinates.',
      highlight: 'Traceable to primary PDB atomic coordinates'
    },
    {
      num: '03',
      title: 'The researcher stays in control',
      desc: 'EUREKA positions the researcher as the conductor of an advanced computational discovery suite. Configure spatial binding constraints, adjust Monte Carlo docking exhaustiveness, define Lipinski boundaries, and inspect raw thermodynamic binding energies.',
      highlight: 'Deterministic validation with physics-based force fields'
    }
  ];

  return (
    <section className="w-full bg-[#171615] py-14 px-6 sm:px-12 lg:px-16 border-b border-[#2e2c29] text-white">
      <div className="max-w-[1640px] mx-auto space-y-10">
        
        {/* 3 Clean Static Pillars (No jittery hover animations) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="p-7 rounded-lg border border-[#2e2c29] bg-[#1e1d1b] flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-mono text-neutral-500 mb-2">{p.num}</div>
                <h3 className="text-xl font-sans font-medium text-white mb-3">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light mb-4">
                  {p.desc}
                </p>
              </div>
              <div className="text-[11px] font-mono text-emerald-400 border-t border-[#2e2c29] pt-3">
                ✓ {p.highlight}
              </div>
            </div>
          ))}
        </div>

        {/* Academic Project Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#2e2c29]">
          <div className="p-6 rounded border border-[#2e2c29] bg-[#1a1918]">
            <div className="font-mono text-xs text-emerald-400 font-semibold mb-2">
              METHODOLOGY &amp; FORCE FIELDS
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed font-light">
              Couples AutoDock Vina Iterated Local Search (ILS/BFGS) global search with empirical scoring functions to calculate thermodynamic binding affinities (ΔG, Ki) and steric pocket compliance against validated PDB targets.
            </p>
          </div>

          <div className="p-6 rounded border border-[#2e2c29] bg-[#1a1918]">
            <div className="font-mono text-xs text-blue-400 font-semibold mb-2">
              ACADEMIC REPRODUCIBILITY &amp; BENCHMARKING
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed font-light">
              Designed as an open reproducible computational framework: zero proprietary black-box locks, transparent chemical descriptors, full SMILES structure inspection, and standard SDF coordinate export.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

