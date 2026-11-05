import React, { useState } from 'react';

/**
 * CoreCapabilities
 * Core Technical Architecture & Differentiators:
 * 4 Halftone video cards:
 * - data-white-halftone.mp4 (Data no one else can access)
 * - models-halftone.mp4 (Generative biology & sequence modeling)
 * - science-green-halftone.mp4 (Physics-based molecular modeling & docking)
 * - enterprise-purple-halftone.mp4 (Enterprise-grade security and validation)
 * Optimized for butter-smooth 60fps playback without browser lag.
 */
export default function CoreCapabilities({ onSelectFeature }) {
  const [activeCard, setActiveCard] = useState(0);

  const CARDS = [
    {
      num: '0 1',
      title: 'Curated biological knowledge federation',
      subtitle: '16M peer-reviewed literature records + 858M biological graph nodes',
      desc: 'EUREKA unifies primary data across 16M indexed biomedical publications, 780K chemical patents, and over 1,000 curated molecular databases (PDB, ChEMBL, PubChem, UniProt). Behind the literature reasoning: a multidimensional biological knowledge graph containing 858M nodes and 2.2B relationship edges across 241 ontological types — mapping genes, targets, pathways, and phenotypic responses.',
      video: '/videos/use-cases/data-white-halftone.mp4',
      stats: '16M Literature · 858M Nodes · 2.2B Edges'
    },
    {
      num: '0 2',
      title: 'Generative biology & sequence modeling',
      subtitle: 'Autoregressive language models & multi-round fitness optimization',
      desc: 'EUREKA couples specialized generative architectures for biotherapeutic design: autoregressive sequence models for de novo antibody and nanobody generation (IgG, VHH), AlphaFold structural predictions, and machine-learning-guided protein fitness engineering to optimize affinity, expression yield, and stability.',
      video: '/videos/use-cases/models-halftone.mp4',
      stats: 'Antibody Design · Structural Prediction · Fitness ML'
    },
    {
      num: '0 3',
      title: 'Physics-based molecular modeling & docking',
      subtitle: 'Deterministic AutoDock Vina force-fields & energetics',
      desc: 'Generative chemistry is coupled directly to biophysical force-fields. EUREKA integrates deep generative molecular design with AutoDock Vina 3D grid force fields, calculating spatial binding poses, Ramachandran compliance, and exact thermodynamic binding free energies (ΔG = -9.84 kcal/mol, Ki = 58.4 nM) against validated catalytic target pockets.',
      video: '/videos/use-cases/science-green-halftone.mp4',
      stats: 'AutoDock Vina · LGA Search · Grid Force-Fields'
    },
    {
      num: '0 4',
      title: 'Reproducible computational infrastructure',
      subtitle: 'GPU-accelerated pipelines & open reproducible workflows',
      desc: 'Engineered for high-throughput discovery workflows. EUREKA provides modular PyTorch and CUDA acceleration, transparent parameter tuning, reproducible random seeds, and complete chemical inspection via standard SDF, PDB, and FASTA coordinate formats with zero black-box barriers.',
      video: '/videos/use-cases/enterprise-purple-halftone.mp4',
      stats: 'CUDA Accelerated · Open Standards · SDF/PDB Export'
    }
  ];

  return (
    <section className="w-full bg-[#171615] py-24 px-6 sm:px-12 lg:px-16 border-b border-[#2e2c29] text-white">
      <div className="max-w-[1640px] mx-auto space-y-16">
        
        {/* Header */}
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold block mb-3">
            [ ARCHITECTURAL CAPABILITIES ]
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight">
            Core Computational &amp; In-Silico Discovery Capabilities
          </h2>
        </div>

        {/* 4 Halftone Video Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CARDS.map((card, idx) => (
            <div
              key={card.title}
              onMouseEnter={() => setActiveCard(idx)}
              className="group bg-[#1e1d1b] border border-[#2e2c29] hover:border-neutral-500 rounded-xl overflow-hidden transition-all duration-300 flex flex-col justify-between transform-gpu"
            >
              
              {/* Halftone Video Preview Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                <video
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none will-change-transform"
                  src={card.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
                <div className="absolute top-4 left-4 font-mono text-xs text-white/90 bg-black/70 px-2.5 py-1 rounded border border-white/10">
                  {card.num}
                </div>
                <div className="absolute bottom-4 right-4 font-mono text-[11px] text-emerald-400 bg-black/70 px-2.5 py-1 rounded border border-white/10">
                  {card.stats}
                </div>
              </div>

              {/* Text Description */}
              <div className="p-6 sm:p-8 space-y-3">
                <div className="text-xs font-mono text-neutral-400">
                  {card.subtitle}
                </div>
                <h3 className="text-2xl font-sans font-medium text-white group-hover:text-neutral-100">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                  {card.desc}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => onSelectFeature?.(idx)}
                    className="text-xs font-mono text-white underline hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    Explore capability →
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

