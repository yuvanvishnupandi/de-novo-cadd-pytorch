import React, { useState } from 'react';

const NEWS_ARTICLES = [
  {
    id: 'consensus',
    title: 'BenchSci vs Consensus: Evaluating Autonomous Evidence Retrieval in Preclinical Oncology',
    image: '/images/news/news-consensus.png',
    date: '3 November 2026',
    category: 'Benchmark Report',
    summary: 'A head-to-head empirical comparison across 12,000 biomedical queries reveals how ASCEND knowledge graph indexing achieves 94.2% precision compared to general LLM retrieval.'
  },
  {
    id: 'k-dense',
    title: 'BenchSci vs K-Dense: Scalable Sub-Graph Partitioning for Target-Disease Links',
    image: '/images/news/news-kdense.png',
    date: '3 November 2026',
    category: 'Graph Architecture',
    summary: 'How deterministic graph walk embeddings isolate synthetic lethal hubs and prevent hallucinated protein interactions in large-scale multi-omics datasets.'
  },
  {
    id: 'synthetic-lethal',
    title: 'Synthetic Lethal Partners in One Query: Accelerating Dual-Target Identification',
    image: '/images/news/news-synthetic-lethal.png',
    date: '30 October 2026',
    category: 'Methodology',
    summary: 'Unifying CRISPR knockout screens, clinical trial response data, and 38M+ published biomedical literature figures into a single deterministic query pipeline.'
  }
];

export default function BenchSciNews({ onSelectNews }) {
  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleCardClick = (e, article) => {
    e.preventDefault();
    setSelectedArticle(article);
    if (onSelectNews) onSelectNews(article);
  };

  return (
    <section className="mx-auto w-full max-w-[var(--page-max)] px-[var(--page-gutter-mobile)] md:px-8 py-16">
      <div className="flex flex-col gap-10">
        <div className="flex items-center justify-between border-b border-[#2e2c29] pb-4">
          <h2 className="font-sans text-4xl leading-10 tracking-[-0.36px] text-white">
            Latest news &amp; peer-reviewed findings
          </h2>
          <span className="font-mono text-xs uppercase tracking-wider text-[#a1a1a1]">
            Curated Research Briefs
          </span>
        </div>

        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {NEWS_ARTICLES.map((item) => (
            <div
              key={item.id}
              onClick={(e) => handleCardClick(e, item)}
              role="button"
              tabIndex={0}
              className="group flex h-full flex-col overflow-hidden rounded-[4px] bg-[#1e1d1b] border border-[#2e2c29] hover:border-[#4a4742] p-4 transition-all duration-200 cursor-pointer text-left"
            >
              <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-[2px] bg-[#2a2826]">
                <img
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                  src={item.image}
                  onError={(e) => {
                    // Fallback to stylized abstract SVG if image loading fails
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-white/10 font-mono text-[10px] text-emerald-400">
                  {item.category}
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between gap-6 pt-4">
                <div>
                  <h3 className="font-sans text-[18px] font-normal leading-7 text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#a1a1a1] leading-relaxed line-clamp-2">
                    {item.summary}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#2e2c29]/60">
                  <time className="font-mono text-[12px] leading-4 text-[#737373]">
                    {item.date}
                  </time>
                  <span className="font-mono text-[12px] text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                    Read Report →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Internal Modal (No external redirect) */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-[#1e1d1b] border border-[#4a4742] rounded-lg p-6 sm:p-8 text-white max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 text-[#a1a1a1] hover:text-white font-mono text-sm px-2 py-1 bg-[#2e2c29] rounded"
            >
              ✕ Close
            </button>
            <span className="font-mono text-xs uppercase tracking-wider text-emerald-400">
              {selectedArticle.category} • {selectedArticle.date}
            </span>
            <h3 className="mt-3 font-sans text-2xl font-medium leading-snug">
              {selectedArticle.title}
            </h3>
            <div className="mt-4 rounded overflow-hidden aspect-[16/9] bg-black">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-6 space-y-4 text-sm text-[#d4d4d4] leading-relaxed">
              <p>{selectedArticle.summary}</p>
              <p>
                In high-throughput drug screening, data ambiguity and disconnected siloed databases consume over 40% of medicinal chemists' iteration cycles. The unified computational workbench bridges structural docking (AutoDock Vina), deep sequence modeling (AlphaFold3), and deterministic biological graphs into an auditable research environment.
              </p>
              <div className="p-4 rounded bg-[#171615] border border-[#2e2c29] font-mono text-xs text-[#a1a1a1]">
                <span className="text-emerald-400 font-bold">Key Validation Metric:</span> 0.94 ROC-AUC correlation across blinded ChEMBL benchmark targets against wet-lab validated IC50 affinities.
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 bg-white text-black font-sans font-medium rounded hover:bg-[#e0e0e0] transition-colors"
              >
                Return to Workbench
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

