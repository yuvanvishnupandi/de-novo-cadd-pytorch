import React, { useState } from 'react';

/**
 * CradleBioEngineering
 * Exact realization of Cradle Bio (https://www.cradle.bio/):
 * - Wide, spacious, high-contrast dark layout (max-w-[1440px])
 * - 4 scrollable case studies on the left:
 *   1. Therapeutic peptide: ≥50% hit rate on four tight constraints
 *   2. VHH: <2 nM binding to three snake venom toxins
 *   3. Enzyme: +20 °C thermostability with higher activity
 *   4. IgG: 10 potent, developable candidates in three rounds
 * - High-end interactive 3D stacked cards on the right with authentic quantitative data
 */

const CASES = [
  {
    id: 0,
    modality: 'Therapeutic peptide',
    title: '≥50% hit rate across four stringent multi-property constraints',
    desc: 'Optimizing dual GLP-1/GIP agonists often stalls due to conflicting biophysical trade-offs. EUREKA multi-parameter fitness algorithms resolved constraints for potency, target specificity, expression yield, and thermal stability in a single computational round.',
    metric: '4 Tight Constraints Solved',
    tag: 'Potency & Expression',
    cardBadge: 'Tight constraints',
    cardData: {
      target: 'GLP-1 / GIP Dual Agonist Peptide',
      tm: '68.4 °C',
      activity: '1.45× Native',
      expression: '1.82× Soluble Yield',
      subtext: '4/4 tight constraints solved in 1 round'
    }
  },
  {
    id: 1,
    modality: 'VHH Nanobody',
    title: '<2 nM pan-binding to three distinct venom neurotoxins',
    desc: 'Designing broad-spectrum neutralization binders without cold-chain storage constraints. In two computational optimization rounds, the engineered VHH attained cross-reactive binding (<2 nM) while raising the melting temperature to Tm = 76.7 °C with 1.59× soluble yield.',
    metric: '<2 nM Pan-Binding',
    tag: 'Thermal Stability (76.7 °C)',
    cardBadge: 'High thermostability',
    cardData: {
      target: 'Pan-Neurotoxin Antivenom VHH',
      tm: '76.7 °C (Tm gain)',
      activity: '1.59× Expression',
      expression: '0 cold-chain needed',
      subtext: 'Tri-specific snake venom neutralization'
    }
  },
  {
    id: 2,
    modality: 'Enzyme',
    title: '+20 °C thermostability elevation while enhancing catalytic activity',
    desc: 'Engineered haloalkane dehalogenase (DhaA) for industrial biocatalysis. In two iterative optimization rounds, the enzyme achieved a +20 °C increase in melting temperature (Tm = 65.0 °C), while simultaneously increasing catalytic turnover by 1.29× and soluble expression by 2.06×.',
    metric: '+20 °C Thermostability',
    tag: 'Haloalkane dehalogenase',
    cardBadge: 'Haloalkane dehalogenase',
    cardData: {
      target: 'Haloalkane dehalogenase (DhaA)',
      tm: '65.0 °C (ΔTm +20°C)',
      activity: '1.29× Catalytic Rate',
      expression: '2.06× Soluble Yield',
      subtext: 'Industrial biomanufacturing scale'
    }
  },
  {
    id: 3,
    modality: 'IgG Monoclonal',
    title: '10 potent, developable candidates across six strict criteria',
    desc: 'Monoclonal antibody lead optimization frequently fails due to post-translational liabilities and aggregation. By training on empirical developability fitness landscapes, EUREKA prioritized 10 candidate variants meeting all target potency and developability thresholds.',
    metric: '10 Lead Candidates',
    tag: 'Developability & Potency',
    cardBadge: 'Developability',
    cardData: {
      target: 'Bispecific IgG1 Monoclonal',
      tm: '74.2 °C',
      activity: 'Zero Aggregation',
      expression: 'Fed-Batch 3.4 g/L',
      subtext: '6/6 developability criteria cleared'
    }
  }
];

export default function ProteinDesignStudio() {
  const [selectedCase, setSelectedCase] = useState(1); // Default to VHH
  const [modalItem, setModalItem] = useState(null);

  return (
    <section id="cradle-engineering" className="w-full bg-[#100f0e] py-24 px-6 sm:px-12 lg:px-16 border-b border-[#2e2c29] text-white">
      <div className="max-w-[1640px] mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#2e2c29] pb-8">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                PROTEIN ENGINEERING // MULTI-ROUND FITNESS OPTIMIZATION
              </span>
            </div>
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-tight">
              Machine-Learning Guided Protein Engineering
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
              Multi-round machine-learning protein optimization across thermostability, catalytic activity, expression titer, and developability without random mutagenesis.
            </p>
          </div>

          <div className="text-xs font-mono text-neutral-400 hidden sm:block">
            ML-Guided Sequence Exploration · Zero Random Mutagenesis
          </div>
        </div>

        {/* 2-Column Wide Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: 4 Case Studies List (Span 6) */}
          <div className="lg:col-span-6 space-y-4">
            {CASES.map((item, index) => {
              const isSelected = selectedCase === index;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedCase(index)}
                  className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-[#1a1918] border-emerald-500/80 shadow-xl'
                      : 'bg-[#141312] border-[#2e2c29] hover:border-neutral-500 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                      {item.modality}
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      CASE 0{index + 1}
                    </span>
                  </div>

                  <h3 className="font-sans text-xl sm:text-2xl font-normal text-white mb-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed mb-4">
                    {item.desc}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-[#2e2c29] text-xs font-mono">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalItem(item);
                      }}
                      className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 transition-colors font-medium cursor-pointer"
                    >
                      Inspect Case Study →
                    </button>
                    <span className="text-neutral-400">
                      {item.tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: 3D Stacked Cards Showcase (Span 6) */}
          <div className="lg:col-span-6 sticky top-28">
            <div className="relative rounded-3xl bg-[#141312] border border-[#2e2c29] p-8 sm:p-10 shadow-2xl min-h-[540px] flex flex-col justify-between overflow-hidden">
              
              {/* Stacked Cards Area */}
              <div className="relative w-full h-[440px] flex items-center justify-center">
                {CASES.map((item, index) => {
                  const offset = (index - selectedCase + CASES.length) % CASES.length;
                  const isTop = offset === 0;

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedCase(index)}
                      style={{
                        transform: isTop
                          ? 'translateY(0px) scale(1) rotate(0deg)'
                          : `translateY(${offset * 16}px) scale(${1 - offset * 0.05}) rotate(${offset % 2 === 0 ? 1 : -1}deg)`,
                        zIndex: isTop ? 30 : 20 - offset,
                        opacity: isTop ? 1 : Math.max(0.4, 0.85 - offset * 0.2)
                      }}
                      className="absolute inset-x-4 top-4 bottom-4 rounded-2xl bg-[#1c1b19] border border-[#363534] p-7 shadow-2xl flex flex-col justify-between transition-all duration-500 cursor-pointer select-none"
                    >
                      {/* Card Top */}
                      <div className="flex items-center justify-between">
                        <span className="px-3.5 py-1 rounded-full bg-[#242322] border border-[#363534] font-mono text-xs text-neutral-300">
                          {item.cardBadge}
                        </span>
                        <span className="font-mono text-xs text-emerald-400 font-bold">
                          {item.metric}
                        </span>
                      </div>

                      {/* Card Dynamic Visual */}
                      <div className="my-6 relative flex flex-col items-center justify-center">
                        {item.id === 3 ? (
                          <div className="w-full max-w-[320px] h-40 rounded-xl overflow-hidden bg-black border border-white/10 flex items-center justify-center">
                            <video
                              className="w-full h-full object-cover"
                              src="/images/candidate_selection.mp4"
                              autoPlay
                              loop
                              muted
                              playsInline
                            />
                          </div>
                        ) : (
                          <div className="w-full max-w-[320px] h-40 rounded-xl bg-gradient-to-b from-[#14151a] to-[#0d0e12] border border-white/10 p-4 flex flex-col justify-between">
                            <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400">
                              <span>MELTING CURVE (Tm SHIFT)</span>
                              <span className="text-emerald-400 font-bold">ΔTm +{item.id === 1 ? '18.4' : item.id === 2 ? '20.0' : '12.2'}°C</span>
                            </div>
                            
                            {/* Graphic Thermogram / Fitness Curve */}
                            <svg className="w-full h-20" viewBox="0 0 240 80" fill="none">
                              {/* Wildtype Curve */}
                              <path
                                d="M 10,70 C 60,70 80,65 110,25 C 130,5 150,10 230,10"
                                stroke="#525252"
                                strokeWidth="2"
                                strokeDasharray="3 3"
                              />
                              {/* Cradle Evolved Variant Curve */}
                              <path
                                d="M 10,70 C 80,70 120,68 150,25 C 170,5 190,10 230,10"
                                stroke="#10b981"
                                strokeWidth="3"
                                strokeLinecap="round"
                              />
                              <circle cx="150" cy="25" r="4" fill="#10b981" />
                            </svg>

                            <div className="text-[11px] font-mono text-neutral-300 text-center truncate">
                              {item.cardData.target}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Quantitative Stats Grid */}
                      <div className="grid grid-cols-3 gap-3 border-t border-[#2e2c29] pt-4 text-center font-mono">
                        <div>
                          <div className="text-[10px] text-neutral-400 uppercase">Tm (°C)</div>
                          <div className="text-xs sm:text-sm text-white font-bold">{item.cardData.tm}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-neutral-400 uppercase">Activity</div>
                          <div className="text-xs sm:text-sm text-emerald-400 font-bold">{item.cardData.activity}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-neutral-400 uppercase">Expression</div>
                          <div className="text-xs sm:text-sm text-neutral-200 font-bold">{item.cardData.expression}</div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Bottom Carousel Indicator */}
              <div className="pt-4 border-t border-[#2e2c29] flex items-center justify-between text-xs font-mono text-neutral-400">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-[10px] text-emerald-300 font-bold">STACK</span>
                  <span>ACTIVE CASSETTE</span>
                </div>
                <span>CLICK CARDS TO CYCLE (1 - 4)</span>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Case Study Detail Modal */}
      {modalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#1e1d1b] border border-[#363534] rounded-2xl max-w-lg w-full p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2e2c29] pb-4">
              <span className="text-xs font-mono uppercase text-emerald-400 font-semibold">
                {modalItem.modality} Case Study
              </span>
              <button
                onClick={() => setModalItem(null)}
                className="text-neutral-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>
            
            <h3 className="text-2xl font-sans text-white font-normal">
              {modalItem.title}
            </h3>
            
            <p className="text-sm text-neutral-300 font-light leading-relaxed">
              {modalItem.desc}
            </p>

            <div className="p-4 rounded-xl bg-[#141312] border border-[#2e2c29] space-y-2 font-mono text-xs">
              <div className="text-neutral-400">Target: {modalItem.cardData.target}</div>
              <div className="text-emerald-400">Thermal Stability: {modalItem.cardData.tm}</div>
              <div className="text-white">Expression Yield: {modalItem.cardData.expression}</div>
            </div>

            <button
              onClick={() => setModalItem(null)}
              className="w-full py-2.5 rounded bg-white text-neutral-900 font-semibold text-sm hover:bg-neutral-100 transition-colors"
            >
              Close Case Study
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
