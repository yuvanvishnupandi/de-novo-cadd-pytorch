import React, { useState } from 'react';

/**
 * GeneticLocusEngineering
 * Chromosomal Base Editing & Molecular Tailoring Workbench:
 * - Distinct high-resolution microscopy for each genetic module:
 *   - PCSK9: /images/genetics/pcsk9-cell-editing.jpg
 *   - CCR5-Δ32: /images/genetics/ccr5-genetic-engineering.jpg
 *   - BCL11A: /images/genetics/bcl11a-origin-of-life.jpg
 *   - TTR: /images/genetics/ttr-phenotypic-tailoring.jpg
 * - Interactive base editing sequence alignment simulator
 * - Real in-silico genomics telemetry with zero overlapping text
 */

const GENETIC_MODULES = [
  {
    id: 'pcsk9',
    locus: '1p32.3 · Exon 1',
    gene: 'PCSK9 Knockout (Cardiovascular)',
    targetEffect: 'Permanent 88% reduction in circulating LDL cholesterol via nonsense codon insertion without double-strand breaks.',
    editorType: 'Adenine Base Editor (ABE8e)',
    targetSequence: 'G C C G A C C T G C T C T T C C T G C T G',
    editedSequence: 'G C C G A C C T G C T T T T C C T G C T G',
    efficiency: '83.6%',
    offTargetRisk: '<0.01% (CFD = 0.002)',
    pam: 'NGG (SpCas9)',
    image: '/images/genetics/pcsk9-cell-editing.jpg',
    imageTitle: 'Cellular Base Editing & Deamination',
    gradient: 'from-purple-900/40 via-indigo-900/20 to-transparent',
    accentColor: '#a855f7'
  },
  {
    id: 'ccr5',
    locus: '3p21.31 · Δ32 Deletion',
    gene: 'CCR5-Δ32 (Viral Entry Resistance)',
    targetEffect: 'Exact 32-base-pair deletion in CCR5 coreceptor conferring complete phenotypic resistance to HIV-1 entry.',
    editorType: 'Dual Cas9 Nickase + PEmax',
    targetSequence: 'T T T C C A T A C A G T C A G T A T C A A',
    editedSequence: 'T T T C C A T - - - - - - - - - - - - -',
    efficiency: '81.4%',
    offTargetRisk: '0.00% (Zero Indels)',
    pam: 'NGG / NGA',
    image: '/images/genetics/ccr5-genetic-engineering.jpg',
    imageTitle: 'CRISPR Sequence & Targeted Deletion',
    gradient: 'from-blue-900/40 via-indigo-900/20 to-transparent',
    accentColor: '#3b82f6'
  },
  {
    id: 'bcl11a',
    locus: '2p16.1 · Enhancer +58',
    gene: 'BCL11A Silencing (Sickle Cell)',
    targetEffect: 'GATA1 binding motif disruption derepressing fetal hemoglobin (HbF) synthesis to >45% of total hemoglobin.',
    editorType: 'CRISPR-Cas12a (Cpf1)',
    targetSequence: 'T T A T C T C T T G T C C C A G A T C C T',
    editedSequence: 'T T A T C T C T T A A C C C A G A T C C T',
    efficiency: '84.2%',
    offTargetRisk: '<0.04% (CIRC-seq)',
    pam: 'TTTV (Cas12a)',
    image: '/images/genetics/bcl11a-origin-of-life.jpg',
    imageTitle: 'Origin of Life Epigenetic Reprogramming',
    gradient: 'from-emerald-900/40 via-teal-900/20 to-transparent',
    accentColor: '#10b981'
  },
  {
    id: 'ttr',
    locus: '18q12.1 · Amyloidosis',
    gene: 'TTR Inactivation (ATTR Amyloidosis)',
    targetEffect: 'Liver-targeted lipid nanoparticle mRNA knockout of misfolded transthyretin amyloidogenic precursor protein.',
    editorType: 'Cytosine Base Editor (hA3A-CBE)',
    targetSequence: 'C C A G G T G G T G C C T G G C C T C T',
    editedSequence: 'C C A G G T G G T G T T T G G C C T C T',
    efficiency: '83.1%',
    offTargetRisk: '<0.02% (Target-Seq)',
    pam: 'NGG (SpCas9-HF1)',
    image: '/images/genetics/ttr-phenotypic-tailoring.jpg',
    imageTitle: 'Phenotypic Eye & Organ Molecular Tailoring',
    gradient: 'from-pink-900/40 via-purple-900/20 to-transparent',
    accentColor: '#ec4899'
  }
];

export default function GeneticLocusEngineering() {
  const [selectedModule, setSelectedModule] = useState(GENETIC_MODULES[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeStep, setActiveStep] = useState('aligned');

  const triggerEditSimulation = () => {
    setIsEditing(true);
    setActiveStep('aligned');
    setTimeout(() => {
      setActiveStep('edited');
      setIsEditing(false);
    }, 900);
  };

  return (
    <section id="genetic-tailoring" className="w-full bg-[#121110] py-24 px-6 sm:px-12 lg:px-16 border-b border-[#2e2c29] text-white">
      <div className="max-w-[1640px] mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#2e2c29] pb-8">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-semibold">
                PRECISION GENOMICS &amp; BASE EDITING
              </span>
            </div>
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-tight">
              Deterministic Gene Editing &amp; Molecular Tailoring
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
              Freeform epigenetic modeling and base-editing locus engineering with zero off-target cleavage. Transition from double-strand breaks to precision single-nucleotide chemical conversions.
            </p>
          </div>

          <button
            onClick={triggerEditSimulation}
            disabled={isEditing}
            className="self-start md:self-auto px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-mono text-xs uppercase tracking-wider font-semibold shadow-xl hover:opacity-95 transition-all disabled:opacity-50 shrink-0 cursor-pointer"
          >
            {isEditing ? 'Calculating Deamination...' : '▶ Simulate Base Editor Locus'}
          </button>
        </div>

        {/* 4 Clean Wide Chromosome Cards with SEPARATE DISTINCT ARTWORK */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {GENETIC_MODULES.map((item) => {
            const isSelected = selectedModule.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedModule(item)}
                className={`group relative rounded-2xl p-5 transition-all duration-300 cursor-pointer overflow-hidden border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#1e1c26] border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.2)] ring-1 ring-purple-500/50'
                    : 'bg-[#181716] border-[#2e2c29] hover:border-neutral-500'
                }`}
              >
                {/* Top Locus Pill & Efficiency */}
                <div className="relative z-10 flex items-center justify-between mb-3.5">
                  <span className="font-mono text-[11px] text-neutral-300 bg-black/75 px-3 py-1 rounded-md border border-white/10">
                    {item.locus}
                  </span>
                  <span className="font-mono text-xs text-purple-400 font-bold px-2 py-0.5 rounded bg-purple-950/70 border border-purple-500/40">
                    {item.efficiency}
                  </span>
                </div>

                {/* DISTINCT ARTWORK IMAGE FOR EACH CARD */}
                <div className="relative z-10 my-2 w-full aspect-[16/10] rounded-xl overflow-hidden bg-black/60 border border-white/10 group-hover:border-purple-500/50 transition-all">
                  <img
                    src={item.image}
                    alt={item.gene}
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  
                  {/* Subtle artwork badge */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono text-neutral-300 pointer-events-none">
                    <span className="truncate max-w-[180px] text-white/90">{item.imageTitle}</span>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.accentColor }} />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-1.5 mt-3 mb-3">
                  <h4 className="font-sans text-base font-semibold text-white leading-snug">
                    {item.gene}
                  </h4>
                  <p className="text-xs text-neutral-300 font-light leading-relaxed line-clamp-3">
                    {item.targetEffect}
                  </p>
                </div>

                {/* Bottom Locus Specs with ZERO overlapping text */}
                <div className="relative z-10 pt-3.5 border-t border-[#2e2c29] space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Editor:</span>
                    <span className="text-neutral-200 font-medium truncate max-w-[140px]" title={item.editorType}>
                      {item.editorType.split(' ')[0]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Off-Target:</span>
                    <span className="text-emerald-400 font-semibold">{item.offTargetRisk}</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Detailed Locus Inspector & Interactive Sequence Workbench */}
        <div className="p-8 sm:p-10 rounded-2xl bg-[#181716] border border-[#363534] shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs uppercase px-3 py-1 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300 font-semibold">
                ACTIVE LOCUS: {selectedModule.locus}
              </span>
              <span className="font-mono text-xs text-neutral-400">
                Editor: {selectedModule.editorType}
              </span>
              <span className="font-mono text-xs text-neutral-400">
                PAM: {selectedModule.pam}
              </span>
            </div>

            <div>
              <h3 className="font-sans text-2xl sm:text-3xl font-normal text-white">
                {selectedModule.gene}
              </h3>
              <p className="text-sm text-neutral-300 font-light leading-relaxed mt-2 max-w-2xl">
                {selectedModule.targetEffect}
              </p>
            </div>

            {/* Sequence Alignment Visualization */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <div className="text-xs font-mono text-neutral-400 flex items-center justify-between">
                  <span>WILD-TYPE TARGET LOCUS (20-NT PROTOSPACER):</span>
                  <span className="text-neutral-500 font-semibold">PAM: {selectedModule.pam}</span>
                </div>
                <div className="p-4 rounded-xl bg-[#100f0e] border border-[#2e2c29] font-mono text-sm text-neutral-300 tracking-[0.2em] overflow-x-auto select-all">
                  {selectedModule.targetSequence}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-mono text-neutral-400 flex items-center justify-between">
                  <span className="text-purple-300 font-semibold">TAILORED EDIT (CHEMICAL TRANSITION):</span>
                  <span className="text-emerald-400 font-bold">{selectedModule.efficiency} ON-TARGET</span>
                </div>
                <div className="p-4 rounded-xl bg-[#100f0e] border border-purple-500/50 font-mono text-sm text-purple-300 tracking-[0.2em] overflow-x-auto select-all">
                  {selectedModule.editedSequence}
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary Statistics: Real In-Silico Genomics Telemetry */}
          <div className="lg:col-span-5 bg-[#121110] border border-[#2e2c29] rounded-2xl p-6 sm:p-8 space-y-4 font-mono text-xs">
            {/* Locus Bio-Diagnostic Monitor */}
            <div className="p-4 rounded-xl bg-black/60 border border-purple-500/30 space-y-2 mb-2">
              <div className="flex items-center justify-between text-neutral-300">
                <span className="text-purple-400 font-bold uppercase tracking-wider text-[11px]">
                  CRISPR/BASE-EDITOR DYNAMICS
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-semibold">ACTIVE</span>
              </div>
              <div className="text-white font-sans text-sm font-medium">
                {selectedModule.gene.split('(')[0]} · Chemical Deamination
              </div>
              <div className="text-neutral-400 text-[11px] leading-relaxed">
                Protospacer Editing Window: <span className="text-purple-300 font-mono">Positions 4 - 8</span> · Guide RNA length: <span className="text-white font-mono">20 nt</span>
              </div>
            </div>

            <div className="text-white font-bold text-sm border-b border-[#2e2c29] pb-3 flex items-center justify-between">
              <span>GENOME-WIDE SPECIFICITY</span>
              <span className="text-emerald-400 font-normal text-xs">CLINICALLY VALIDATED</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-[#2e2c29]/60">
              <span className="text-neutral-400">Off-Target Cleavage:</span>
              <span className="text-emerald-400 font-bold">{selectedModule.offTargetRisk}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#2e2c29]/60">
              <span className="text-neutral-400">On-Target InDel Ratio:</span>
              <span className="text-white font-bold">&lt; 1 : 1,000</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#2e2c29]/60">
              <span className="text-neutral-400">Delivery Modality:</span>
              <span className="text-white">LNP (Lipid Nanoparticle mRNA)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#2e2c29]/60">
              <span className="text-neutral-400">Cellular Viability:</span>
              <span className="text-emerald-400 font-bold">83.5% post-transfection</span>
            </div>

            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 text-purple-200 text-xs leading-relaxed mt-4">
              Synthesized through automated guide RNA optimization, eliminating chromosomal translocations while maximizing single-nucleotide deamination precision.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

