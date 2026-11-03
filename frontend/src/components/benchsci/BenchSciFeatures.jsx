import React, { useState } from 'react';

/**
 * BenchSciFeatures
 * Section 4: What makes the platform different
 * 4 Halftone video cards:
 * - data-white-halftone.mp4 (Data no one else can access)
 * - models-halftone.mp4 (Top 8 AI drug discovery architectures)
 * - science-green-halftone.mp4 (Physics-based molecular modeling & docking)
 * - enterprise-purple-halftone.mp4 (Enterprise-grade security and validation)
 */
export default function BenchSciFeatures({ onSelectFeature }) {
  const [activeCard, setActiveCard] = useState(0);

  const CARDS = [
    {
      num: '0 1',
      title: 'Data no one else can access',
      subtitle: '16M closed-access papers + 858M biological graph nodes',
      desc: 'Eight years of publisher partnerships built legal access to 16M closed-access papers — plus 780K patents, 310K preprints, and 1,000+ curated molecular databases. Behind the literature: a proprietary knowledge graph with 858M nodes, 2.2B relationship edges, and 100M ontological nodes across 241 edge types. Layered on top: 16M antibodies, 22M RNAi entries, 18M CRISPR records, 500K cell lines, and 700K animal models.',
      video: '/videos/use-cases/data-white-halftone.mp4',
      stats: '16M Papers · 858M Nodes · 2.2B Edges'
    },
    {
      num: '0 2',
      title: 'Top 8 AI drug discovery architectures',
      subtitle: 'Unified multi-modal neural network models',
      desc: 'Our platform doesn’t rely on a single generic foundation model. It unites specialized architectures from the Top 8 AI platforms: Converge Bio generative biological language models (ConvergeAB for antibodies, ConvergeCELL for single-cell targets, ConvergeGEO for expression yield), Isomorphic Labs AlphaFold 3D structure predictions, PostEra synthetic route planning, and Cradle protein variant engineering.',
      video: '/videos/use-cases/models-halftone.mp4',
      stats: 'Converge Bio · AlphaFold · PostEra · Cradle'
    },
    {
      num: '0 3',
      title: 'Physics-based molecular modeling & docking',
      subtitle: 'Deterministic AutoDock Vina force-fields & energetics',
      desc: 'Generative chemistry must be paired with biophysical rigor. The platform couples PyTorch LSTM chemical generation with AutoDock Vina 3D grid force fields, calculating spatial binding poses, Ramachandran dihedral compliance, and exact binding free energy (ΔG = -9.84 kcal/mol, Ki = 58.4 nM) against validated catalytic dyads like Cys145 and His41 in SARS-CoV-2 Mpro.',
      video: '/videos/use-cases/science-green-halftone.mp4',
      stats: 'ΔG = -9.84 kcal/mol · Ki = 58.4 nM · Grid Box 20Å'
    },
    {
      num: '0 4',
      title: 'Enterprise-grade security and validation',
      subtitle: 'Dedicated private VPC & zero data retention',
      desc: 'Built for the most demanding pharmaceutical environments. Deployed in private isolated cloud VPCs, SOC 2 Type II certified, HIPAA compliant, and backed by a strict contractual guarantee: your proprietary discovery data, targets, and internal assays are never retained or used to retrain foundation models.',
      video: '/videos/use-cases/enterprise-purple-halftone.mp4',
      stats: 'SOC 2 Type II · Zero Data Retention · Air-Gapped'
    }
  ];

  return (
    <section className="w-full bg-[#171615] py-24 px-6 sm:px-10 border-b border-[#2e2c29] text-white">
      <div className="max-w-[1300px] mx-auto space-y-16">
        
        {/* Header */}
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold block mb-3">
            [ COMPETITIVE DIFFERENTIATION ]
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight">
            What makes our platform different
          </h2>
        </div>

        {/* 4 Halftone Video Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CARDS.map((card, idx) => (
            <div
              key={card.title}
              onMouseEnter={() => setActiveCard(idx)}
              className="group bg-[#1e1d1b] border border-[#2e2c29] hover:border-neutral-500 rounded-xl overflow-hidden transition-all duration-300 flex flex-col justify-between"
            >
              
              {/* Halftone Video Preview Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                <video
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={card.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
                <div className="absolute top-4 left-4 font-mono text-xs text-white/80 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded">
                  {card.num}
                </div>
                <div className="absolute bottom-4 right-4 font-mono text-[11px] text-emerald-400 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded">
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
                    className="text-xs font-mono text-white underline hover:opacity-80 transition-opacity"
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
