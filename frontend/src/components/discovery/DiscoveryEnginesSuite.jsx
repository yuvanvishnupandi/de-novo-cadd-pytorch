import React, { useState } from 'react';

/**
 * DiscoveryEnginesSuite
 * EUREKA's 4 In-Silico Scientific Discovery Architectures:
 * 1. EUREKA Sequence & Generative Biology Suite (Antibody Design, Codon Optimization, Multi-Tissue Regulation)
 * 2. EUREKA Multi-Omics & De Novo Chemistry Suite (Target Prioritization, Pocket Generative Chemistry, ADMET)
 * 3. EUREKA High-Throughput Cellular Phenomics Suite (Phenomics, High-Content Cellular Imaging, Closed-Loop Lab)
 * 4. EUREKA Macromolecular Biophysics Suite (Multimodal Co-Folding, Allosteric Pockets, AutoDock Vina LGA)
 *
 * PURE IN-SILICO METHODOLOGIES (COMPREHENSIVE OPEN RESEARCH ARCHITECTURE)
 */

const ENGINES = [
  {
    id: 'sequence',
    name: 'EUREKA Sequence & Generative Biology Suite',
    badge: 'EUREKA-AB & GEO ARCHITECTURE',
    title: 'Generative Antibody Design, Codon Optimization & Virtual Cell Phenotyping',
    summary: 'Directly deployable generative models for IgG, VHH nanobodies, and bispecific antibodies with multi-host expression optimization.',
    capabilities: [
      {
        title: 'EUREKA-AB Generative Antibody Engine',
        desc: 'Generates de novo antibodies across IgG, VHH single-domain nanobodies, and bispecific formats. In published EGFR (cetuximab) tests, generated 100,000 candidates from a single prompt; top sequence bound with 2.1× higher affinity, prioritizing down to 10 sequences for wet-lab synthesis.'
      },
      {
        title: 'EUREKA-GEO Host Expression Optimization',
        desc: 'Optimizes protein gene expression and codon usage across Chinese Hamster Ovary (CHO), human embryonic kidney (HEK293), and E. coli expression systems, maximizing titer while preventing aggregation.'
      },
      {
        title: 'EUREKA-CELL Virtual Cell Simulation',
        desc: 'Simulates in-silico cell states across multi-omics perturbations to discover disease biomarkers, synthetic lethal vulnerabilities, and resistance pathways.'
      },
      {
        title: 'Bio-Sequence Foundation Models & Sequence Extractor',
        desc: 'Pretrained autoregressive foundation models trained directly on DNA, RNA, and protein sequence repertoires. Includes an automated patent extractor mining freedom-to-operate sequences with transparent reproducibility.'
      }
    ],
    metrics: [
      { label: 'Epitope Sample Space', val: '100,000 Candidates' },
      { label: 'Affinity Improvement', val: '2.1× over Wildtype' },
      { label: 'Wet-Lab Candidates', val: 'Top 10 Sequences' },
      { label: 'Expression Hosts', val: 'CHO / HEK293 / E. coli' }
    ]
  },
  {
    id: 'chemistry',
    name: 'EUREKA Multi-Omics & De Novo Chemistry Suite',
    badge: 'MULTI-OMICS & DE NOVO CHEMISTRY',
    title: 'End-to-End Multi-Omics Target Discovery, De Novo Generation & Clinical Outcome Prediction',
    summary: 'A unified computational pipeline spanning target identification through automated pocket-conditioned drug design to clinical trial probability forecasting.',
    capabilities: [
      {
        title: 'Multi-Omics Target Prioritization',
        desc: 'Ranks therapeutic targets by integrating multi-omics datasets (genomics, transcriptomics, epigenetics), text-mined biomedical literature, and synthetic lethal pathway models.'
      },
      {
        title: 'Cavity-Conditioned Molecule Generation',
        desc: 'Pocket-conditioned generative chemistry creating de novo small-molecule leads tailored to 3D binding cavities, combined with rigorous ADMET prediction and Lipinski Rule of 5 filtering.'
      },
      {
        title: 'Clinical Trial Outcome Risk Modeling',
        desc: 'Predicts Phase I, II, and III clinical trial success probabilities and attrition risks by analyzing target biological rationale, trial design parameters, and molecular properties.'
      },
      {
        title: 'Clinical Translation Target Benchmark',
        desc: 'Proven clinical translation demonstrated across validated oncology and fibrosis kinase targets (e.g. TNIK, EGFR, Factor Xa), advancing optimized chemical leads with verified nanomolar affinity.'
      }
    ],
    metrics: [
      { label: 'Clinical Proof', val: 'Kinase & Serine Protease Leads' },
      { label: 'Pocket Generative Models', val: '42 Generative Tools' },
      { label: 'ADMET Profiling', val: '50+ In-Silico Endpoints' },
      { label: 'Target Evidence', val: 'Multi-Omics + Literature' }
    ]
  },
  {
    id: 'phenomics',
    name: 'EUREKA High-Throughput Cellular Phenomics Suite',
    badge: 'PHENOMICS & DISTRIBUTED COMPUTE',
    title: 'Automated High-Throughput Cellular Imaging & Precision Chemistry',
    summary: 'Bridges cellular image embeddings with physics-based force fields to capture complex disease phenotypes at scale.',
    capabilities: [
      {
        title: 'Phenomics & High-Throughput Imaging',
        desc: 'Extracts millions of cellular morphology features per compound across thousands of disease models using automated fluorescence microscopy and deep morphological representation learning.'
      },
      {
        title: 'Distributed Supercomputer Scale',
        desc: 'Powered by 504 GPU nodes, executing petabyte-scale embedding searches to pair phenotypic disease reversal signatures directly with chemical structures.'
      },
      {
        title: 'Phenotype-to-Pocket Coupling',
        desc: 'Combines phenotypic screening results with atomic pocket force fields, ensuring candidates not only bind structural active sites but restore healthy cellular morphology.'
      },
      {
        title: 'Automated Experimental Feedback Loop',
        desc: 'Closed-loop experimental automation where algorithmic predictions trigger robotic synthesis, validation, and cellular imaging within hours.'
      }
    ],
    metrics: [
      { label: 'Compute Infrastructure', val: '504 H100 GPUs' },
      { label: 'Phenotypic Features', val: '1,000s per Cell' },
      { label: 'Weekly Wet-Lab Cycles', val: 'Millions of Cellular Assays' },
      { label: 'Pipeline Modality', val: 'Phenomics + Chemistry' }
    ]
  },
  {
    id: 'biophysics',
    name: 'EUREKA Macromolecular Biophysics Suite',
    badge: 'MULTIMODAL STRUCTURAL PREDICTION',
    title: 'Frontier Structural Prediction Across Protein-Ligand & Protein-Protein Complexes',
    summary: 'Heritage of atomic structural co-folding applied to complex multimeric interfaces, allosteric regulation, and covalent binding.',
    capabilities: [
      {
        title: 'Frontier Multi-Modality Co-Folding',
        desc: 'Simultaneously folds and docks antibodies, antigens, cofactors, ions, and nucleic acids in a single end-to-end biophysical prediction pass with Angstrom-level coordinate accuracy.'
      },
      {
        title: 'Allosteric & Cryptic Pocket Discovery',
        desc: 'Identifies non-orthosteric binding pockets and conformational states invisible in static apo-crystal structures, unlocking previously undruggable oncology targets.'
      },
      {
        title: 'Physics-Informed Dynamic Ensembles',
        desc: 'Generates Boltzmann-weighted conformational ensembles rather than single rigid snapshots, accounting for physiological induced fit upon ligand binding.'
      },
      {
        title: 'AutoDock Vina Grid Coupling',
        desc: 'Direct integration with AutoDock Vina v1.2.5 Lamarckian Genetic Algorithm (LGA) force fields to validate free energy of binding (ΔG) across computed crystal geometries.'
      }
    ],
    metrics: [
      { label: 'Coordinate Precision', val: '< 1.2 Å Backbone RMSD' },
      { label: 'Target Modalities', val: 'Protein · Nucleic Acid · Ligand' },
      { label: 'Force Field Core', val: 'Vina LGA + Empirical Grid' },
      { label: 'Structural Source', val: 'Primary PDB Coordinates' }
    ]
  }
];

export default function DiscoveryEnginesSuite({ onLaunchLab, onLaunchPipeline }) {
  const [activeEngineId, setActiveEngineId] = useState('sequence');
  const activeEngine = ENGINES.find((e) => e.id === activeEngineId) || ENGINES[0];

  return (
    <section className="w-full bg-[#141312] py-24 px-6 sm:px-12 lg:px-16 border-b border-[#2e2c29] text-white">
      <div className="max-w-[1640px] mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#2e2c29] pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                COMPUTATIONAL ARCHITECTURE // INDUSTRY DISCOVERY PILLARS
              </span>
            </div>
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white">
              Integrated Multi-Platform Capabilities
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base font-light mt-2 max-w-2xl">
              We unify the validated breakthroughs of generative biology, phenomics, multi-omics target ranking, and atomic force fields into one cohesive open research framework.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLaunchPipeline}
              className="px-5 py-2.5 rounded bg-white text-neutral-900 hover:bg-neutral-100 font-sans text-xs font-semibold uppercase tracking-wider transition-all shadow cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              View Pipeline Workflow →
            </button>
          </div>
        </div>

        {/* 4 Interactive Engine Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ENGINES.map((engine) => {
            const isSelected = activeEngine.id === engine.id;
            return (
              <button
                key={engine.id}
                onClick={() => setActiveEngineId(engine.id)}
                className={`p-5 rounded-xl text-left transition-all border flex flex-col justify-between cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                  isSelected
                    ? 'bg-[#22211f] border-emerald-500 shadow-xl'
                    : 'bg-[#1a1918] border-[#2e2c29] hover:border-neutral-600 text-neutral-400 hover:text-white'
                }`}
              >
                <div>
                  <div className="font-mono text-[11px] text-emerald-400 font-semibold mb-1">
                    {engine.badge}
                  </div>
                  <div className="font-sans text-base font-medium text-white mb-2 leading-snug">
                    {engine.name}
                  </div>
                </div>
                <div className="text-[11px] text-neutral-400 font-light line-clamp-2">
                  {engine.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Engine Feature Dashboard */}
        <div className="rounded-2xl bg-[#1e1d1b] border border-[#363534] p-8 lg:p-10 space-y-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#2e2c29] pb-6">
            <div className="space-y-1">
              <span className="font-mono text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                {activeEngine.badge}
              </span>
              <h3 className="font-sans text-2xl sm:text-3xl text-white font-normal">
                {activeEngine.title}
              </h3>
              <p className="text-neutral-300 text-sm font-light max-w-3xl">
                {activeEngine.summary}
              </p>
            </div>

            <button
              onClick={onLaunchLab}
              className="self-start lg:self-auto px-5 py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-sans text-xs font-semibold uppercase tracking-wider transition-all shadow"
            >
              Simulate In Lab →
            </button>
          </div>

          {/* 4 Feature Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeEngine.capabilities.map((cap, idx) => (
              <div
                key={cap.title}
                className="p-6 rounded-xl bg-[#141312] border border-[#2e2c29] space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="font-mono text-[11px] text-emerald-400 font-semibold mb-1">
                    0{idx + 1} // {cap.title.split(' ')[0]}
                  </div>
                  <h4 className="font-sans text-base font-medium text-white mb-2">
                    {cap.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                    {cap.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Key Empirical Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#2e2c29]">
            {activeEngine.metrics.map((m) => (
              <div
                key={m.label}
                className="p-4 rounded-lg bg-[#141312] border border-[#2e2c29]"
              >
                <div className="text-[11px] font-mono text-neutral-400 mb-1">
                  {m.label}
                </div>
                <div className="text-lg sm:text-xl font-mono font-semibold text-white">
                  {m.val}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
