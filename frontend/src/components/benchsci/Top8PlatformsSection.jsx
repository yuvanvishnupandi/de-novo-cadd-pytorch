import React, { useState } from 'react';

/**
 * Top8PlatformsSection
 * Realization of GHP News: "Top 8 AI Drug Discovery Platforms for 2026"
 * Comprehensive ranking, comparison matrix, and interactive tool tabs for:
 * 1. Converge Bio (ConvergeAB, ConvergeCELL, ConvergeGEO)
 * 2. Isomorphic Labs (AlphaFold structure prediction)
 * 3. BioMap (Foundation biological models)
 * 4. Cradle (Protein variant engineering)
 * 5. PostEra (Medicinal chemistry & route planning)
 * 6. Iambic Therapeutics (Neural network chemistry)
 * 7. BenchSci (Preclinical evidence extraction)
 * 8. Owkin (Multimodal patient & spatial omics)
 */

const PLATFORMS_DATA = [
  {
    id: 'converge',
    name: '1. Converge Bio',
    badge: 'Rank #1 Overall (2026)',
    role: 'Generative AI Lab for Life Sciences (DNA, RNA, Proteins)',
    desc: 'Builds specialized generative systems around clearly defined discovery bottlenecks. Unites ConvergeAB (antibody generation & developability), ConvergeCELL (single-cell transcriptomics target discovery), and ConvergeGEO (protein expression yield optimization).',
    deployable: 'Yes (Own Team & Proprietary Data)',
    features: [
      'ConvergeAB: Antibody design, screening & affinity maturation with developability preserved',
      'ConvergeCELL: Target & biomarker discovery from single-cell and transcriptomic datasets',
      'ConvergeGEO: Protein yield optimization via intelligent construct redesign',
      'Multi-omics and molecular data integration rather than reliance on a single data type'
    ],
    interactiveMetric: { label: 'Predicted Yield Boost (ConvergeGEO)', value: '+340% Expression', target: 'Trastuzumab IgG1 Construct' }
  },
  {
    id: 'isomorphic',
    name: '2. Isomorphic Labs',
    badge: 'AlphaFold Lineage',
    role: 'Next-Gen Structure Prediction & Therapeutic Design',
    desc: 'Spun out of Google DeepMind on the strength of the AlphaFold architecture. Applies next-generation models to therapeutic design across complex multimer interfaces and internal drug programs.',
    deployable: 'Partial (Pharma Collaborations)',
    features: [
      'Structure prediction heritage from the AlphaFold lineage',
      'Atomic-level multimer interface and protein-ligand complex resolution',
      'Large-scale pharmaceutical collaborations with major partners',
      'Unsurpassed deep learning compute and scientific talent'
    ],
    interactiveMetric: { label: 'Interface pLDDT Confidence', value: '94.8 / 100', target: 'Mpro Homodimer Dyad' }
  },
  {
    id: 'biomap',
    name: '3. BioMap',
    badge: 'Foundation Models',
    role: 'Large-Scale Biological Sequence Foundation Models',
    desc: 'Trains multi-scale foundation models (xTrimo) across biological sequences and structural representations to power diverse prediction and generative design tasks for pharmaceutical partners.',
    deployable: 'Partial (Collaborations)',
    features: [
      'Large biological foundation models trained on 100B+ sequence parameters',
      'Broad biologics design across diverse therapeutic classes',
      'Scale ambitions with substantial supercomputing infrastructure'
    ],
    interactiveMetric: { label: 'Model Parameter Scale', value: '100 Billion Parameters', target: 'xTrimo Multiscale Transformer' }
  },
  {
    id: 'cradle',
    name: '4. Cradle',
    badge: 'Bench Scientist UI',
    role: 'Protein Engineering Software for Wet-Lab Teams',
    desc: 'Built specifically for bench scientists without machine learning expertise. Scientists upload a sequence, define desired fitness properties, and the platform generates variant proposals with a wet-lab learning loop.',
    deployable: 'Yes (Wet-Lab SaaS)',
    features: [
      'Protein engineering software usable directly by bench scientists',
      'Property-guided variant generation across iterative design rounds',
      'Active learning loop adapting to customer wet-lab experimental results',
      'Zero in-house machine learning expertise required to operate'
    ],
    interactiveMetric: { label: 'Thermostability Tm Delta', value: '+8.4°C Tm Stability', target: 'Enzyme Active Variant R3' }
  },
  {
    id: 'postera',
    name: '5. PostEra',
    badge: 'Medicinal Chemistry',
    role: 'AI Medicinal Chemistry & Synthesizability Route Planning',
    desc: 'Addresses the hit-to-lead bottleneck by proposing chemically synthesizable analogues, predicting multi-parameter properties, and automatically generating viable retrosynthetic routes.',
    deployable: 'Partial (Collaborations & SaaS)',
    features: [
      'Machine learning medicinal chemistry for hit-to-lead and lead optimization',
      'Synthesizability scoring and automated retrosynthetic reaction tree planning',
      'Property prediction across multiple ADMET and potency objectives',
      'Powers large collaborative open-science initiatives (e.g., COVID Moonshot)'
    ],
    interactiveMetric: { label: 'Synthetic Feasibility Score', value: '8.8 / 10 (3-Step Route)', target: 'EUR-2026-Alpha Core' }
  },
  {
    id: 'iambic',
    name: '6. Iambic Therapeutics',
    badge: 'Clinical Pipeline',
    role: 'Neural Network Chemistry & Clinical Oncology',
    desc: 'Applies neural network structure prediction (NeuralPLexer) and property modeling to drive an internal oncology pipeline that has advanced candidates into clinical trials.',
    deployable: 'No (Internal Pipeline Company)',
    features: [
      'Neural network structure and property prediction for small molecules',
      'Integrated design-make-test cycles with state-of-the-art internal robotics',
      'Clinical-stage oncology programs advancing from its platform'
    ],
    interactiveMetric: { label: 'Binding Affinity (Kd)', value: '1.2 nM Potency', target: 'Selective HER2 Exon 20' }
  },
  {
    id: 'benchsci',
    name: '7. BenchSci',
    badge: 'Preclinical Evidence',
    role: 'AI Preclinical Evidence & Experiment Design (ASCEND / EMET)',
    desc: 'Reads, structures, and reasons over preclinical evidence across 38M+ published papers, figures, and internal records, helping scientists validate reagents, design experiments, and avoid repeats.',
    deployable: 'Yes (Enterprise & Academic)',
    features: [
      'Structured extraction of preclinical evidence from published figures and text',
      'Reagent and antibody selection grounded in validated usage data',
      'Experiment planning grounded in prior findings to eliminate false starts',
      'Adopted by top global pharmaceutical research organizations'
    ],
    interactiveMetric: { label: 'Evidence Confidence Index', value: '98.6% Validated', target: 'Cys145 Inhibitor Literature' }
  },
  {
    id: 'owkin',
    name: '8. Owkin',
    badge: 'Multimodal Patient Data',
    role: 'Federated Patient Data, Histology & Spatial Omics',
    desc: 'Works backward from patient clinical and spatial omics data toward target discovery. Through federated hospital collaborations, its models explain disease heterogeneity and surface predictive biomarkers.',
    deployable: 'Partial (Hospital Collaborations)',
    features: [
      'Multimodal patient models spanning omics, histology imaging, and clinical records',
      'Federated privacy-preserving machine learning with global hospital networks',
      'Target and biomarker research grounded in real human clinical outcomes'
    ],
    interactiveMetric: { label: 'Patient Subgroup Stratification', value: 'p < 0.001 Log-Rank', target: 'Spatial Transcriptomics Cohort' }
  }
];

export default function Top8PlatformsSection({ onLaunchSpecificTool }) {
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS_DATA[0]);

  return (
    <section className="w-full bg-[#171615] py-24 px-6 sm:px-10 border-b border-[#2e2c29] text-white">
      <div className="max-w-[1300px] mx-auto space-y-16">
        
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold block">
            [ GHP NEWS RANKING // INDUSTRY BENCHMARK 2026 ]
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight">
            Top 8 AI Drug Discovery Platforms for 2026
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
            Biotech R&D leaders need specialized tools to solve real experimental bottlenecks: deciding which construct to synthesize, predicting 3D binding geometry, and planning viable chemical routes. Here is how the top platforms compare and how their core architectures are unified into our platform.
          </p>
        </div>

        {/* The Exact GHP News Comparison Matrix Table */}
        <div className="overflow-x-auto rounded-lg border border-[#2e2c29] bg-[#1e1d1b]">
          <table className="w-full text-left font-sans text-xs sm:text-sm">
            <thead className="border-b border-[#363534] bg-[#242322] font-mono text-xs uppercase tracking-wider text-neutral-300">
              <tr>
                <th className="p-4 sm:p-5">Platform</th>
                <th className="p-4 sm:p-5">Deployable By Own Team</th>
                <th className="p-4 sm:p-5">Antibody Design</th>
                <th className="p-4 sm:p-5">Target & Biomarkers</th>
                <th className="p-4 sm:p-5">Expression Optimization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2e2c29] font-light">
              <tr className="bg-emerald-950/20 hover:bg-emerald-900/30 transition-colors">
                <td className="p-4 sm:p-5 font-medium text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Converge Bio (Rank #1)</span>
                </td>
                <td className="p-4 sm:p-5 text-emerald-400 font-bold">✓ Deployable</td>
                <td className="p-4 sm:p-5 text-emerald-400 font-bold">✓ ConvergeAB</td>
                <td className="p-4 sm:p-5 text-emerald-400 font-bold">✓ ConvergeCELL</td>
                <td className="p-4 sm:p-5 text-emerald-400 font-bold">✓ ConvergeGEO</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-4 sm:p-5 font-medium text-white">Isomorphic Labs</td>
                <td className="p-4 sm:p-5 text-neutral-400">✗ Pipeline</td>
                <td className="p-4 sm:p-5 text-neutral-300">Partial</td>
                <td className="p-4 sm:p-5 text-neutral-300">Partial</td>
                <td className="p-4 sm:p-5 text-neutral-500">✗</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-4 sm:p-5 font-medium text-white">BioMap</td>
                <td className="p-4 sm:p-5 text-neutral-300">Partial</td>
                <td className="p-4 sm:p-5 text-neutral-300">Partial</td>
                <td className="p-4 sm:p-5 text-neutral-300">Partial</td>
                <td className="p-4 sm:p-5 text-neutral-500">✗</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-4 sm:p-5 font-medium text-white">Cradle</td>
                <td className="p-4 sm:p-5 text-emerald-400 font-bold">✓ Deployable</td>
                <td className="p-4 sm:p-5 text-neutral-300">Partial</td>
                <td className="p-4 sm:p-5 text-neutral-500">✗</td>
                <td className="p-4 sm:p-5 text-neutral-300">Partial</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-4 sm:p-5 font-medium text-white">PostEra</td>
                <td className="p-4 sm:p-5 text-neutral-300">Partial</td>
                <td className="p-4 sm:p-5 text-neutral-500">✗</td>
                <td className="p-4 sm:p-5 text-neutral-500">✗</td>
                <td className="p-4 sm:p-5 text-neutral-500">✗</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-4 sm:p-5 font-medium text-white">Iambic Therapeutics</td>
                <td className="p-4 sm:p-5 text-neutral-400">✗ Pipeline</td>
                <td className="p-4 sm:p-5 text-neutral-500">✗</td>
                <td className="p-4 sm:p-5 text-neutral-300">Partial</td>
                <td className="p-4 sm:p-5 text-neutral-500">✗</td>
              </tr>
              <tr className="bg-blue-950/20 hover:bg-blue-900/30 transition-colors">
                <td className="p-4 sm:p-5 font-medium text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span>BenchSci (ASCEND/EMET)</span>
                </td>
                <td className="p-4 sm:p-5 text-emerald-400 font-bold">✓ Deployable</td>
                <td className="p-4 sm:p-5 text-neutral-500">✗</td>
                <td className="p-4 sm:p-5 text-emerald-400 font-bold">✓ Preclinical Evidence</td>
                <td className="p-4 sm:p-5 text-neutral-500">✗</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-4 sm:p-5 font-medium text-white">Owkin</td>
                <td className="p-4 sm:p-5 text-neutral-300">Partial</td>
                <td className="p-4 sm:p-5 text-neutral-500">✗</td>
                <td className="p-4 sm:p-5 text-emerald-400 font-bold">✓ Multi-Modal Omics</td>
                <td className="p-4 sm:p-5 text-neutral-500">✗</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Interactive Platform Deep Dive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Platform Selector Tabs */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-mono uppercase text-neutral-400 tracking-wider mb-2">
              Select Architecture To Inspect
            </div>
            {PLATFORMS_DATA.map((plat) => (
              <button
                key={plat.id}
                onClick={() => setSelectedPlatform(plat)}
                className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-center justify-between text-xs sm:text-sm ${
                  selectedPlatform.id === plat.id
                    ? 'bg-[#242322] border-white text-white shadow-md'
                    : 'bg-[#1e1d1b] border-[#2e2c29] text-neutral-300 hover:border-neutral-500'
                }`}
              >
                <div>
                  <div className="font-medium">{plat.name}</div>
                  <div className="text-[11px] text-neutral-400 font-mono mt-0.5">{plat.badge}</div>
                </div>
                <div className="text-neutral-400 text-xs font-mono">→</div>
              </button>
            ))}
          </div>

          {/* Right: Selected Platform Architecture Card */}
          <div className="lg:col-span-8 bg-[#1e1d1b] border border-[#2e2c29] p-6 sm:p-8 rounded-xl shadow-xl space-y-6">
            
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2e2c29] pb-4">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">{selectedPlatform.badge}</span>
                <h3 className="text-2xl sm:text-3xl font-sans font-medium text-white mt-1">
                  {selectedPlatform.name}
                </h3>
              </div>
              <div className="text-xs font-mono bg-white/10 px-3 py-1 rounded text-neutral-200">
                {selectedPlatform.deployable}
              </div>
            </div>

            <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
              {selectedPlatform.desc}
            </p>

            {/* Core Features List */}
            <div className="space-y-2.5">
              <div className="text-xs font-mono uppercase text-neutral-400 tracking-wider">Key Architectural Features</div>
              <ul className="space-y-2">
                {selectedPlatform.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-200 font-light">
                    <span className="text-emerald-400 font-bold shrink-0">✦</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Live Benchmark Simulation Card */}
            <div className="bg-[#242322] border border-[#363534] p-4 rounded-lg flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">Validated Benchmark Output</span>
                <span className="font-bold text-white text-sm">{selectedPlatform.interactiveMetric.label}</span>
                <span className="text-neutral-400 block text-[11px]">Target: {selectedPlatform.interactiveMetric.target}</span>
              </div>
              <div className="text-right">
                <span className="text-emerald-400 text-base font-bold block">{selectedPlatform.interactiveMetric.value}</span>
                <span className="text-[10px] text-neutral-400">Validated In-Silico</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => onLaunchSpecificTool?.(selectedPlatform.id)}
                className="bg-white hover:bg-neutral-100 text-neutral-900 px-5 py-2.5 rounded font-semibold text-xs transition-all shadow-sm flex items-center gap-2"
              >
                <span>Launch in Interactive 3D Lab</span>
                <span>→</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
