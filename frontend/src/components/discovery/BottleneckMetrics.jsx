import React from 'react';

/**
 * BottleneckMetrics
 * Analysis of Preclinical Bottlenecks and Multi-Omics Fragmentation
 * 4 Big Stat Callouts + Problem Statement
 */
export default function BottleneckMetrics({ onExploreSolutions }) {
  const STATS = [
    { value: '36%', label: 'Annual data growth rate', desc: 'Exponential expansion of multi-omics and biomedical literature' },
    { value: '70%', label: 'Drugs fail in clinic', desc: 'Mainly due to lack of deep target biology understanding' },
    { value: '$400B', label: 'Coming off patent', desc: 'Blockbuster drugs facing patent cliff in next 8 years' },
    { value: '500 EB', label: 'Genomics data by 2035', desc: 'Overwhelming volume requiring unified computational architecture' }
  ];

  return (
    <section className="w-full bg-[#171615] py-24 px-6 sm:px-12 lg:px-16 border-b border-[#2e2c29] text-white">
      <div className="max-w-[1640px] mx-auto space-y-16">
        
        {/* Editorial Text */}
        <div className="max-w-3xl space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold block">
            [ THE PRECLINICAL BOTTLENECK ]
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight leading-tight">
            Modern biology is a fragmented nightmare. <span className="text-neutral-400">And it's getting worse.</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
            Seventy percent of drugs fail in the clinic — most because we didn't fully understand the biology. Not for lack of effort. For lack of infrastructure. Today, a scientist needs to manually stitch together dozens of disconnected resources, including paywalled literature, siloed databases, R and Python scripts, and internal data locked in spreadsheets no one can find.
          </p>
          <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
            The information exists. It just doesn't converge. Biology never had a unified workbench. The result is scientists acting as the connective tissue between data and tools that were never designed to work together — spending their most valuable hours on maintaining infrastructure instead of advancing discovery.
          </p>

          <div>
            <button
              onClick={onExploreSolutions}
              className="inline-flex items-center gap-2 rounded bg-white text-neutral-900 hover:bg-neutral-100 px-5 py-2.5 text-sm font-semibold transition-all shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore De Novo Pipeline</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* 4 Big Stat Callouts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-[#2e2c29]">
          {STATS.map((s) => (
            <div key={s.label} className="p-6 rounded-lg border border-[#2e2c29] bg-[#1e1d1b] space-y-2">
              <div className="text-4xl sm:text-5xl font-sans font-medium text-white tracking-tight">
                {s.value}
              </div>
              <div className="text-sm font-sans font-medium text-neutral-200">
                {s.label}
              </div>
              <div className="text-xs text-neutral-400 font-light">
                {s.desc}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

