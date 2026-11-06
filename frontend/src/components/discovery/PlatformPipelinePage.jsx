import React, { useState, useEffect } from 'react';
import DiscoveryEnginesSuite from './DiscoveryEnginesSuite';

/**
 * PlatformPipelinePage
 * Dark-Mode Platform & De Novo Discovery Pipeline Page
 * Features:
 * - Normal consistent dark obsidian theme (#141312 / #171615)
 * - 2-Column layout with ZERO text overlap
 * - Prominent showcase of: /images/bigmolecule_website_rightside.webm on the right
 * - 5-Stage De Novo Discovery Pipeline with PDB coordinate telemetry
 * - Integrated Discovery Engines Suite (Generative Biology, Multi-Omics, Cellular Phenomics, Macromolecular Biophysics)
 */

const PIPELINE_STAGES = [
  {
    id: 'stage-1',
    step: 'STAGE 01',
    name: 'Epitope & Pocket Identification',
    tag: 'CRYO-EM & PDB POCKET SCAN',
    summary: 'High-resolution target cavity mapping and solvent-accessible surface area (SASA) computation.',
    details: 'Maps spatial electrostatic potential, steric exclusion grids, and hydrogen bonding donor/acceptor loci across crystallographic coordinates (PDB). Computes Connolly solvent-excluded surface to isolate deep druggable pockets.',
    metrics: [
      { label: 'Cavity Volume', val: '482 Å³' },
      { label: 'SASA Druggability', val: '0.89 / 1.0' },
      { label: 'Active Site Dyad', val: 'Lys745 - Glu762' }
    ]
  },
  {
    id: 'stage-2',
    step: 'STAGE 02',
    name: 'De Novo Scaffold Generation',
    tag: 'EQUIVARIANT DIFFUSION & SE(3)',
    summary: 'Generative autoregressive molecular graph sampling tailored to steric pocket constraints.',
    details: 'Generates de novo small-molecule scaffolds and CDR-H3 loops using 3D equivariant diffusion conditioned on active site electrostatics. Eliminates pan-assay interference compounds (PAINS) at generation time.',
    metrics: [
      { label: 'Generated Candidates', val: '10,000 / sec' },
      { label: 'PAINS Filter Pass', val: '83.8%' },
      { label: 'Novel Chemotypes', val: '84.2%' }
    ]
  },
  {
    id: 'stage-3',
    step: 'STAGE 03',
    name: 'AutoDock Vina Thermodynamic Docking',
    tag: 'LAMARCKIAN GENETIC ALGORITHM',
    summary: 'Iterative Monte Carlo energy minimization with empirical scoring functions for ΔG affinity.',
    details: 'Executes rigid-receptor, flexible-ligand docking over cubic grid bounding boxes. Calculates Lennard-Jones 6-12 van der Waals dispersion, directional hydrogen bonding, and torsional entropy penalties.',
    metrics: [
      { label: 'Binding Free Energy ΔG', val: '-9.8 kcal/mol' },
      { label: 'Inhibition Constant Ki', val: '24.1 nM' },
      { label: 'RMSD vs Crystal', val: '0.84 Å' }
    ]
  },
  {
    id: 'stage-4',
    step: 'STAGE 04',
    name: 'Multi-Parameter Lead Optimization',
    tag: 'LIPINSKI & ADMET OPTIMIZATION',
    summary: 'Simultaneous Pareto co-optimization of potency, metabolic stability, and pharmacokinetics.',
    details: 'Filters candidates across Lipinski’s Rule of 5, Veber oral bioavailability criteria, topological polar surface area (TPSA ≤ 90 Å²), and hERG cardiac toxicity risk models via Graph Convolutional Networks (GCN).',
    metrics: [
      { label: 'Lipinski Compliance', val: '5 / 5 Rules' },
      { label: 'TPSA Polar Area', val: '64.8 Å²' },
      { label: 'hERG Safety Margin', val: '> 30 μM' }
    ]
  },
  {
    id: 'stage-5',
    step: 'STAGE 05',
    name: 'Retrosynthesis & Reaction Viability',
    tag: 'REACTION TREE DECOMPOSITION',
    summary: 'Deterministic backward tree search into commercially available building blocks.',
    details: 'Decomposes optimized molecules into validated synthesis routes using USPTO-trained forward and retrosynthetic transformers. Verifies building block availability in Sigma-Aldrich and Enamine catalogs.',
    metrics: [
      { label: 'Synthetic Steps', val: '4 Linear Steps' },
      { label: 'Overall Yield Est.', val: '38.4%' },
      { label: 'Stock Precursors', val: '100% Commercial' }
    ]
  }
];

const TARGETS = [
  {
    id: '4zau',
    name: 'EGFR Kinase Domain (T790M/L858R)',
    pdb: '4ZAU',
    organism: 'Homo sapiens',
    resolution: '1.80 Å',
    bindingPocket: 'ATP-binding cleft (Leu718 - Asp855)',
    kd: '14.2 nM',
    deltaG: '-10.4 kcal/mol'
  },
  {
    id: '1fjs',
    name: 'Factor Xa Coagulation Serine Protease',
    pdb: '1FJS',
    organism: 'Homo sapiens',
    resolution: '2.10 Å',
    bindingPocket: 'S1 pocket (Asp189 anchor dyad)',
    kd: '28.5 nM',
    deltaG: '-9.6 kcal/mol'
  },
  {
    id: '1err',
    name: 'Estrogen Receptor-α Ligand Binding Domain',
    pdb: '1ERR',
    organism: 'Homo sapiens',
    resolution: '1.95 Å',
    bindingPocket: 'Steroid pocket (His524 - Arg394)',
    kd: '4.8 nM',
    deltaG: '-11.2 kcal/mol'
  },
  {
    id: '3mxf',
    name: 'BRD4 Bromodomain-1 (Epigenetic Reader)',
    pdb: '3MXF',
    organism: 'Homo sapiens',
    resolution: '1.65 Å',
    bindingPocket: 'KAc binding pocket (Asn140 - Tyr97)',
    kd: '42.0 nM',
    deltaG: '-8.9 kcal/mol'
  }
];

export default function PlatformPipelinePage({ onNavigate }) {
  const [activeStageIndex, setActiveStageIndex] = useState(2); // AutoDock Vina Docking default
  const [selectedTarget, setSelectedTarget] = useState(TARGETS[0]);

  // Synchronize target selection with live backend simulation API
  useEffect(() => {
    fetch(`http://localhost:8000/api/pipeline/simulate?target_id=${selectedTarget.pdb}`)
      .then(r => r.json())
      .then(d => console.log('[EUREKA Pipeline Backend State]', d))
      .catch(() => {});
  }, [selectedTarget]);

  const activeStage = PIPELINE_STAGES[activeStageIndex];

  return (
    <div className="w-full min-h-screen bg-[#141312] text-[#f5f2ee] font-sans antialiased">
      
      {/* Sub-Header Breadcrumb */}
      <div className="w-full border-b border-[#2e2c29] bg-[#1a1918]/80 backdrop-blur px-6 sm:px-12 lg:px-16 py-3.5">
        <div className="max-w-[1520px] mx-auto flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-neutral-400">
            <button
              onClick={() => onNavigate('overview')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              EUREKA
            </button>
            <span>/</span>
            <span className="text-white">Platform &amp; Pipeline</span>
            <span>/</span>
            <span className="text-emerald-400 font-semibold">{activeStage.name}</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-neutral-400">
            <span>Force Field: AutoDock Vina v1.2.5</span>
            <span className="h-1 w-1 rounded-full bg-neutral-600" />
            <span className="text-emerald-400">PDB: {selectedTarget.pdb} ({selectedTarget.resolution})</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          DARK HERO SHOWCASE (SEAMLESS 3D MACROMOLECULE · CINEMA EXPANSIVE SCALE)
         ========================================================================= */}
      <section className="relative w-full bg-[#141312] border-b border-[#2e2c29] px-6 sm:px-12 lg:px-16 pt-4 sm:pt-6 pb-12 sm:pb-16 overflow-hidden flex items-start">
        {/* Ambient subtle backdrop illumination */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[750px] h-[750px] bg-emerald-950/25 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-[1640px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start relative z-10 w-full">
          
          {/* Left Column: Vision Card & Targets (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Pill Container */}
            <div className="rounded-[28px] border border-[#363534] bg-[#1c1b19]/90 backdrop-blur-md p-6 sm:p-8 lg:p-10 shadow-2xl space-y-5">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold uppercase tracking-wider">
                  FRONTIER IN-SILICO
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-semibold">
                  BIOPHYSICAL DISCOVERY
                </span>
              </div>

              <h1 className="font-sans text-2xl sm:text-3xl lg:text-[34px] font-light leading-[1.3] text-white tracking-tight">
                Frontier computational physics and biophysical force-fields unlock deeper structural insights, deterministic binding energetics, and rapid candidate prioritization for de novo molecular leads.
              </h1>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <a
                  href="#pipeline-details"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-neutral-900 hover:bg-neutral-100 font-sans text-sm font-semibold transition-all shadow-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Explore De Novo Pipeline</span>
                  <span>↓</span>
                </a>

                <button
                  onClick={() => onNavigate('lab')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#242322] border border-[#363534] text-neutral-300 hover:text-white font-sans text-sm font-medium transition-all shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Launch 3D Biophysics Lab</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Target Selector Bar */}
            <div className="space-y-2 font-mono text-xs">
              <div className="text-neutral-400 uppercase tracking-wider text-[11px]">
                ACTIVE VALIDATED TARGET:
              </div>
              <div className="flex flex-wrap gap-2">
                {TARGETS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTarget(t)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97] ${
                      selectedTarget.id === t.id
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow'
                        : 'bg-[#1e1d1b] border-[#2e2c29] text-neutral-400 hover:text-white'
                    }`}
                  >
                    {t.pdb} · {t.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* In-Silico Target Telemetry & Cavity Parameters Box */}
            <div className="rounded-2xl border border-[#363534] bg-[#1a1918]/90 backdrop-blur p-5 sm:p-6 space-y-4 font-mono text-xs shadow-xl">
              <div className="flex items-center justify-between border-b border-[#2e2c29] pb-3">
                <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                  CRYSTALLOGRAPHIC CAVITY &amp; LIGAND TELEMETRY
                </span>
                <span className="text-[10px] text-neutral-400 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                  PDB: {selectedTarget.pdb} ({selectedTarget.resolution})
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="p-2.5 rounded bg-[#100f0e] border border-[#2e2c29] space-y-1">
                  <div className="text-neutral-400 text-[10px]">Active Binding Pocket</div>
                  <div className="text-white font-medium truncate" title={selectedTarget.bindingPocket}>
                    {selectedTarget.bindingPocket}
                  </div>
                </div>

                <div className="p-2.5 rounded bg-[#100f0e] border border-[#2e2c29] space-y-1">
                  <div className="text-neutral-400 text-[10px]">Organism &amp; Host</div>
                  <div className="text-white font-medium">
                    {selectedTarget.organism}
                  </div>
                </div>

                <div className="p-2.5 rounded bg-[#100f0e] border border-[#2e2c29] space-y-1">
                  <div className="text-neutral-400 text-[10px]">Thermodynamic Free Energy</div>
                  <div className="text-emerald-400 font-bold">
                    {selectedTarget.deltaG}
                  </div>
                </div>

                <div className="p-2.5 rounded bg-[#100f0e] border border-[#2e2c29] space-y-1">
                  <div className="text-neutral-400 text-[10px]">Experimental Inhibition (Kd)</div>
                  <div className="text-cyan-400 font-bold">
                    {selectedTarget.kd}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-400 border-t border-[#2e2c29]">
                <span>Force Field: <span className="text-neutral-200">AutoDock Vina LGA v1.2.5</span></span>
                <span>Accuracy: <span className="text-emerald-400 font-bold">83.8% Benchmark</span></span>
              </div>
            </div>

          </div>

          {/* Right Column: Seamless 3D Macromolecule Showcase */}
          <div className="lg:col-span-7 relative flex items-center justify-center lg:justify-end pointer-events-none min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] overflow-hidden">
            
            {/* Ambient Backlight Glow behind molecule */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-emerald-600/15 rounded-full blur-[120px] pointer-events-none select-none" />

            {/* 3D WebM Molecule Player - Hardware Accelerated, Zero Lag */}
            <video
              className="w-full max-w-[560px] xl:max-w-[640px] h-auto object-contain select-none pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
              src="/images/bigmolecule_website_rightside.webm"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />

            {/* Bottom Binding Energy Glass Badge (Pinned cleanly in bottom right corner) */}
            <div className="absolute bottom-4 right-4 sm:right-6 bg-[#141312]/92 backdrop-blur-md px-5 py-3 rounded-xl border border-emerald-500/40 text-right shadow-2xl pointer-events-none z-10 font-mono">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight">
                {selectedTarget.deltaG}
              </div>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
                ΔG BINDING FREE ENERGY
              </div>
              <div className="text-xs text-white mt-0.5 font-medium">
                Kd = {selectedTarget.kd}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          END-TO-END 5-STAGE DE NOVO DISCOVERY PIPELINE
         ========================================================================= */}
      <section id="pipeline-details" className="w-full px-6 sm:px-12 lg:px-16 py-24 bg-[#121110] border-b border-[#2e2c29]">
        <div className="max-w-[1520px] mx-auto space-y-14">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold block mb-2">
                [ DE NOVO MOLECULAR DISCOVERY PIPELINE ]
              </span>
              <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight">
                Deterministic 5-Stage Discovery Architecture
              </h2>
            </div>
            <p className="text-sm sm:text-base text-neutral-300 max-w-lg font-light leading-relaxed">
              Inspect underlying biophysical algorithms, grid bounding boxes, and empirical energy scoring across validated crystallographic targets.
            </p>
          </div>

          {/* Stepper Tabs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {PIPELINE_STAGES.map((s, idx) => {
              const isActive = activeStageIndex === idx;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveStageIndex(idx)}
                  className={`p-5 rounded-xl text-left transition-all border flex flex-col justify-between cursor-pointer ${
                    isActive
                      ? 'bg-[#22211f] border-emerald-500 shadow-xl ring-1 ring-emerald-500/50'
                      : 'bg-[#1a1918] border-[#2e2c29] hover:border-neutral-500 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="font-mono text-xs text-emerald-400 font-semibold mb-1">
                    {s.step}
                  </div>
                  <div className="font-sans text-sm font-medium text-white mb-2 leading-snug">
                    {s.name}
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 truncate">
                    {s.tag}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Detailed Workbench */}
          <div className="rounded-2xl bg-[#1e1d1b] border border-[#363534] p-8 lg:p-12 space-y-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#2e2c29] pb-6">
              <div>
                <span className="font-mono text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                  {activeStage.step} // {activeStage.tag}
                </span>
                <h3 className="font-sans text-2xl sm:text-3xl text-white font-normal mt-1">
                  {activeStage.name}
                </h3>
                <p className="text-neutral-300 text-sm mt-2 font-light max-w-2xl leading-relaxed">
                  {activeStage.summary}
                </p>
              </div>

              <button
                onClick={() => onNavigate('lab')}
                className="self-start lg:self-auto px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-sans text-xs font-semibold uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                Simulate In 3D Lab →
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Algorithm Details */}
              <div className="lg:col-span-7 space-y-5">
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                  METHODOLOGY &amp; MATHEMATICAL SCORING:
                </h4>
                <p className="text-sm text-neutral-300 leading-relaxed font-light">
                  {activeStage.details}
                </p>

                <div className="p-4 rounded-xl bg-[#141312] border border-[#2e2c29] font-mono text-xs text-neutral-300 space-y-1.5">
                  <div className="text-neutral-500 text-[10px] uppercase font-bold">Force Field Formulation:</div>
                  <div className="text-emerald-400">
                    ΔG = ΔG_vdw ∑ (A/r¹² - B/r⁶) + ΔG_hbond ∑ E(t) + ΔG_elec ∑ (q₁q₂/εr) + ΔG_tor N_rot
                  </div>
                </div>
              </div>

              {/* Telemetry Metrics */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                {activeStage.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="p-5 rounded-xl bg-[#141312] border border-[#2e2c29]"
                  >
                    <div className="text-xs font-mono text-neutral-400 mb-1">
                      {m.label}
                    </div>
                    <div className="text-xl sm:text-2xl font-mono font-semibold text-white">
                      {m.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Multi-Platform Discovery Engines Suite */}
      <DiscoveryEnginesSuite
        onLaunchLab={() => onNavigate('lab')}
        onLaunchPipeline={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* Cross-Link Footer CTA */}
      <section className="w-full px-6 sm:px-12 lg:px-16 py-20 bg-[#141312]">
        <div className="max-w-[1520px] mx-auto rounded-3xl bg-gradient-to-r from-[#1e1d1b] to-[#252422] border border-[#363534] p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3">
            <h3 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-light text-white">
              Ready to dock candidate leads against real PDB targets?
            </h3>
            <p className="text-sm sm:text-base text-neutral-400 font-light max-w-xl leading-relaxed">
              Open the interactive WebGL 3D biophysics laboratory to inspect real-time rotatable bonds, hydrogen bonds, and AutoDock Vina force fields.
            </p>
          </div>

          <button
            onClick={() => onNavigate('lab')}
            className="inline-flex items-center gap-2.5 rounded-lg bg-white text-neutral-900 hover:bg-neutral-100 px-8 py-4 font-medium text-base transition-all shrink-0 font-sans shadow-xl cursor-pointer"
          >
            <span>Open 3D Biophysics Lab</span>
            <span>→</span>
          </button>
        </div>
      </section>
    </div>
  );
}
