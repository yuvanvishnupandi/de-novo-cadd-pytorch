import React, { useState } from 'react';

/**
 * BenchSciProduct
 * Section 3: The research environment built by scientists, for scientists
 * Exact video: /videos/use-cases/emet_homepage_final.mp4
 * 3-pillar interactive tabs + customer quotes
 */
export default function BenchSciProduct({ onExplorePlatform }) {
  const [activePillar, setActivePillar] = useState(0);

  const PILLARS = [
    {
      title: 'It doesn’t search – it reasons',
      desc: 'Ask complex research questions in plain language. The orchestration layer decomposes it, identifies the right domain-specific models, and chains them intelligently across dozens of trusted scientific databases (PDB, ChEMBL, PubChem, Tox21, UniProt) and 38M+ scientific publications — including 16M closed-access papers accessible only through dedicated publisher partnerships.',
      highlight: 'Neuro-symbolic reasoning over 858M biological nodes'
    },
    {
      title: 'The output isn’t a summary',
      desc: 'The result is traceable, explainable, and immediately actionable insights across the full preclinical R&D journey, including hypothesis generation, target identification, experiment design, and lead optimization. Every statement links back to underlying figures, tables, and crystal structure coordinates.',
      highlight: 'Traceable to primary source data and atomic coordinates'
    },
    {
      title: 'The scientist stays in control',
      desc: 'Our platform positions every researcher as the conductor of an advanced computational discovery team — not a passive recipient of opaque AI outputs. You configure constraints, adjust docking exhaustiveness, define Lipinski boundaries, and inspect raw thermodynamic binding energies.',
      highlight: 'Deterministic validation with physics-based certainty'
    }
  ];

  return (
    <section className="w-full bg-[#171615] py-24 px-6 sm:px-10 border-b border-[#2e2c29] text-white">
      <div className="max-w-[1300px] mx-auto space-y-16">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold block mb-3">
              [ SCIENTIFIC WORKBENCH ]
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight leading-tight">
              The research environment built by scientists, for scientists
            </h2>
          </div>

          <button
            onClick={onExplorePlatform}
            className="inline-flex items-center gap-2 rounded bg-white text-neutral-900 hover:bg-neutral-100 px-5 py-2.5 text-sm font-semibold transition-all shrink-0 shadow-sm"
          >
            <span>Explore platform</span>
            <span>→</span>
          </button>
        </div>

        {/* Video Player Display Container */}
        <div className="w-full rounded-xl overflow-hidden border border-[#363534] bg-[#242322] shadow-2xl relative aspect-video max-h-[640px]">
          <video
            className="w-full h-full object-cover"
            src="/videos/use-cases/emet_homepage_final.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map((p, idx) => (
            <div
              key={p.title}
              onClick={() => setActivePillar(idx)}
              className={`p-6 rounded-lg border transition-all cursor-pointer ${
                activePillar === idx
                  ? 'bg-[#242322] border-white/40 shadow-lg'
                  : 'bg-[#1e1d1b] border-[#2e2c29] hover:border-neutral-600'
              }`}
            >
              <div className="text-xs font-mono text-neutral-400 mb-2">0{idx + 1}</div>
              <h3 className="text-xl font-sans font-medium text-white mb-3">
                {p.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light mb-4">
                {p.desc}
              </p>
              <div className="text-[11px] font-mono text-emerald-400 border-t border-white/10 pt-3">
                ✓ {p.highlight}
              </div>
            </div>
          ))}
        </div>

        {/* Biopharma Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-[#2e2c29]">
          <div className="p-6 rounded border border-[#2e2c29] bg-[#1e1d1b]/60">
            <p className="text-sm italic text-neutral-200 leading-relaxed mb-4">
              "It was probably 10x faster than doing it manually. Instead of reading dozens of contradictory publications, we had prioritized targets and validated active site dyads within hours."
            </p>
            <div className="text-xs font-mono text-neutral-400">
              — Senior Director of Preclinical Oncology, Global Top-10 Pharma
            </div>
          </div>

          <div className="p-6 rounded border border-[#2e2c29] bg-[#1e1d1b]/60">
            <p className="text-sm italic text-neutral-200 leading-relaxed mb-4">
              "It completely changed how we evaluate target druggability. Having literature evidence, AlphaFold 3D coordinates, and AutoDock Vina force fields unified in one place prevents costly false starts."
            </p>
            <div className="text-xs font-mono text-neutral-400">
              — VP of Computational Chemistry, Leading San Francisco Biotech
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

