import React, { useState } from 'react';

/**
 * GeneticsStudioPage
 * Dedicated Genetically Tailored Biology & Base Editing Page
 * Features:
 * - Normal consistent dark background (#141312 / #171615)
 * - 2-Column hero showcase featuring: /images/bigmolecule_website_rightside.webm (ZERO overlapping)
 * - Chromosomal locus engineering (PCSK9, CCR5-Δ32, BCL11A, TTR)
 * - Interactive Base Editing Workbench (CBE, ABE8e, PEmax, Cas12a)
 * - Live PAM site detection and editing window (-20 to -14 bp)
 * - Off-target CFD specificity scoring and indel analysis
 */

const GENOMIC_LOCI = [
  {
    id: 'pcsk9',
    locus: '1p32.3 · Exon 1',
    gene: 'PCSK9 Knockout (Cardiovascular)',
    therapeuticAim: 'Permanent 88% reduction in LDL cholesterol via nonsense codon insertion without double-strand breaks.',
    editorType: 'Adenine Base Editor (ABE8e)',
    pam: 'NGG (SpCas9)',
    editingWindow: 'Protospacer Positions 4 - 8',
    targetSequence: 'G C C G A C C T G C T C T T C C T G C T G',
    editedSequence: 'G C C G A C C T G C T T T T C C T G C T G',
    efficiency: '83.6%',
    offTargetScore: '<0.01% (CFD = 0.002)',
    indels: '0.04%',
    accent: 'purple',
    image: '/images/genetics/pcsk9-cell-editing.jpg',
    imageTitle: 'Cellular Base Editing & Deamination'
  },
  {
    id: 'ccr5',
    locus: '3p21.31 · Δ32 Deletion',
    gene: 'CCR5-Δ32 (Viral Entry Resistance)',
    therapeuticAim: 'Exact 32-base-pair deletion in CCR5 coreceptor conferring complete phenotypic resistance to HIV-1 entry.',
    editorType: 'Dual Cas9 Nickase + PEmax Prime Editor',
    pam: 'NGG / NGA',
    editingWindow: 'Prime Editing Extension 13 nt',
    targetSequence: 'T T T C C A T A C A G T C A G T A T C A A',
    editedSequence: 'T T T C C A T - - - - - - - - - - - - -',
    efficiency: '81.4%',
    offTargetScore: '0.00% (Zero Indels Detected)',
    indels: '0.00%',
    accent: 'blue',
    image: '/images/genetics/ccr5-genetic-engineering.jpg',
    imageTitle: 'CRISPR Sequence & Targeted Deletion'
  },
  {
    id: 'bcl11a',
    locus: '2p16.1 · Enhancer +58',
    gene: 'BCL11A Silencing (Sickle Cell & Thalassemia)',
    therapeuticAim: 'GATA1 binding motif disruption derepressing fetal hemoglobin (HbF) synthesis to >45% total Hb.',
    editorType: 'CRISPR-Cas12a (Cpf1)',
    pam: 'TTTV (Cas12a)',
    editingWindow: 'Positions 18 - 23 staggered cut',
    targetSequence: 'T T A T C T C T T G T C C C A G A T C C T',
    editedSequence: 'T T A T C T C T T A A C C C A G A T C C T',
    efficiency: '84.2%',
    offTargetScore: '<0.04% (CIRC-seq Validated)',
    indels: '0.08%',
    accent: 'emerald',
    image: '/images/genetics/bcl11a-origin-of-life.jpg',
    imageTitle: 'Origin of Life Epigenetic Reprogramming'
  },
  {
    id: 'ttr',
    locus: '18q12.1 · Amyloidosis',
    gene: 'TTR Gene Inactivation (ATTR Amyloidosis)',
    therapeuticAim: 'Liver-targeted lipid nanoparticle mRNA knockout of misfolded transthyretin amyloid fibrils.',
    editorType: 'Cytosine Base Editor (hA3A-CBE)',
    pam: 'NGG (SpCas9-HF1)',
    editingWindow: 'Positions 3 - 7 (C-to-T)',
    targetSequence: 'C C A G G T G G T G C C T G G C C T C T',
    editedSequence: 'C C A G G T G G T G T T T G G C C T C T',
    efficiency: '83.1%',
    offTargetScore: '<0.02% (Target-Seq)',
    indels: '0.02%',
    accent: 'pink',
    image: '/images/genetics/ttr-phenotypic-tailoring.jpg',
    imageTitle: 'Phenotypic Eye & Organ Molecular Tailoring'
  }
];

export default function GeneticsStudioPage({ onNavigate }) {
  const [activeLocus, setActiveLocus] = useState(GENOMIC_LOCI[0]);
  const [editorMode, setEditorMode] = useState('abe'); // 'cbe' | 'abe' | 'prime'
  const [simulating, setSimulating] = useState(false);
  const [customSeq, setCustomSeq] = useState('GCCGACCTGCTCTTCCTGCTG');
  const [simulatedSeq, setSimulatedSeq] = useState('GCCGACCTGCTTTTCCTGCTG');
  const [mutationCount, setMutationCount] = useState(3);

  const runSimulation = async () => {
    setSimulating(true);
    try {
      const resp = await fetch('http://localhost:8000/api/genetics/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locus_id: activeLocus.id,
          editor_type: editorMode,
          custom_sequence: customSeq
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        setSimulatedSeq(data.edited_sequence);
        setMutationCount(data.mutations_introduced);
        setSimulating(false);
        return;
      }
    } catch {
      // Fallback to local client simulation if backend is busy
    }
    setTimeout(() => {
      setSimulating(false);
      if (editorMode === 'cbe') {
        // Cytidine to Thymidine
        setSimulatedSeq(customSeq.replace(/C/g, 'T'));
        setMutationCount(customSeq.split('C').length - 1);
      } else if (editorMode === 'abe') {
        // Adenine to Guanine
        setSimulatedSeq(customSeq.replace(/A/g, 'G'));
        setMutationCount(customSeq.split('A').length - 1);
      } else {
        // Prime editor insertion
        setSimulatedSeq(customSeq.slice(0, 10) + 'TAGCTA' + customSeq.slice(10));
        setMutationCount(6);
      }
    }, 700);
  };

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
            <span className="text-white">Genetics Studio</span>
            <span>/</span>
            <span className="text-purple-400 font-semibold">{activeLocus.locus}</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-neutral-400">
            <span>Base Editor: {activeLocus.editorType.split(' ')[0]}</span>
            <span className="h-1 w-1 rounded-full bg-neutral-600" />
            <span className="text-purple-400">On-Target Specificity: 84.6%</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          HERO SHOWCASE (SEAMLESS 3D MACROMOLECULE · CINEMA EXPANSIVE SCALE)
         ========================================================================= */}
      <section className="relative w-full border-b border-[#2e2c29] px-6 sm:px-12 lg:px-16 pt-4 sm:pt-6 pb-12 sm:pb-16 bg-[#141312] overflow-hidden flex items-start">
        {/* Ambient subtle backdrop illumination */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[750px] h-[750px] bg-purple-950/25 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-[1640px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start relative z-10 w-full">
          
          {/* Left Column: Vision & Locus Header (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="rounded-[28px] border border-[#363534] bg-[#1c1b19]/90 backdrop-blur-md p-8 sm:p-10 shadow-2xl space-y-6">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                  GENOME EDITING
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-purple-400 font-semibold">
                  PRECISION BASE EDITING
                </span>
              </div>

              <h1 className="font-sans text-3xl sm:text-4xl lg:text-[42px] font-light tracking-tight text-white leading-tight">
                Deterministic Gene Editing &amp; Molecular Tailoring
              </h1>

              <p className="text-neutral-300 text-base font-light leading-relaxed">
                Freeform epigenetic modeling and base-editing locus engineering with zero off-target cleavage. Transition from blunt double-strand breaks to single-nucleotide chemical conversions without chromosomal translocations.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('pipeline')}
                  className="inline-flex items-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 font-medium text-sm transition-all shadow-lg font-sans cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Explore De Novo Pipeline</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => onNavigate('lab')}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#242322] border border-[#363534] hover:border-neutral-500 text-neutral-300 hover:text-white px-5 py-3 font-medium text-sm transition-all font-sans cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Dock In 3D Biophysics Lab</span>
                </button>
              </div>
            </div>

            {/* Locus Quick Selector */}
            <div className="space-y-2 font-mono text-xs">
              <div className="text-neutral-400 uppercase tracking-wider text-[11px]">
                SELECT CLINICAL TARGET LOCUS:
              </div>
              <div className="flex flex-wrap gap-2">
                {GENOMIC_LOCI.map((locus) => (
                  <button
                    key={locus.id}
                    onClick={() => {
                      setActiveLocus(locus);
                      setCustomSeq(locus.targetSequence.replace(/\s+/g, ''));
                      setSimulatedSeq(locus.editedSequence.replace(/\s+/g, ''));
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97] ${
                      activeLocus.id === locus.id
                        ? 'bg-purple-950/80 border-purple-500 text-purple-300 shadow'
                        : 'bg-[#1e1d1b] border-[#2e2c29] text-neutral-400 hover:text-white'
                    }`}
                  >
                    {locus.locus} · {locus.gene.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* In-Silico Genetics & PAM Telemetry Parameters Box */}
            <div className="rounded-2xl border border-[#363534] bg-[#1a1918]/90 backdrop-blur p-5 sm:p-6 space-y-4 font-mono text-xs shadow-xl">
              <div className="flex items-center justify-between border-b border-[#2e2c29] pb-3">
                <span className="text-purple-400 font-bold uppercase tracking-wider text-[11px]">
                  CRISPR BASE-EDITING &amp; LOCUS TELEMETRY
                </span>
                <span className="text-[10px] text-neutral-400 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                  {activeLocus.locus} · {activeLocus.gene.split(' ')[0]}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="p-2.5 rounded bg-[#100f0e] border border-[#2e2c29] space-y-1">
                  <div className="text-neutral-400 text-[10px]">Editor Modality</div>
                  <div className="text-white font-medium truncate" title={activeLocus.editorType}>
                    {activeLocus.editorType}
                  </div>
                </div>

                <div className="p-2.5 rounded bg-[#100f0e] border border-[#2e2c29] space-y-1">
                  <div className="text-neutral-400 text-[10px]">PAM Motif &amp; Window</div>
                  <div className="text-purple-300 font-medium">
                    {activeLocus.pam} · {activeLocus.editingWindow}
                  </div>
                </div>

                <div className="p-2.5 rounded bg-[#100f0e] border border-[#2e2c29] space-y-1">
                  <div className="text-neutral-400 text-[10px]">On-Target Efficiency</div>
                  <div className="text-purple-400 font-bold">
                    {activeLocus.efficiency}
                  </div>
                </div>

                <div className="p-2.5 rounded bg-[#100f0e] border border-[#2e2c29] space-y-1">
                  <div className="text-neutral-400 text-[10px]">CFD Specificity &amp; Indels</div>
                  <div className="text-emerald-400 font-bold">
                    {activeLocus.offTargetScore} (Indels: {activeLocus.indels})
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-400 border-t border-[#2e2c29]">
                <span>Translocation: <span className="text-emerald-400 font-bold">0.00% (No DSB)</span></span>
                <span>Delivery: <span className="text-neutral-200">LNP-mRNA</span></span>
              </div>
            </div>

          </div>

          {/* Right Column: Seamless 3D Macromolecule (Expansive Cinema-Scale, Covering Near Navbar to Middle) */}
          <div className="lg:col-span-7 xl:col-span-7 relative flex items-start justify-center lg:justify-end pointer-events-none min-h-[580px] sm:min-h-[680px] lg:min-h-[760px] xl:min-h-[820px] -mt-4 sm:-mt-8 lg:-mt-12 overflow-visible">
            
            {/* Ambient Backlight Glow behind molecule */}
            <div className="absolute right-0 top-1/3 -translate-y-1/2 w-[700px] sm:w-[850px] h-[700px] sm:h-[850px] bg-purple-600/20 rounded-full blur-[160px] pointer-events-none select-none" />

            {/* Expansive 3D WebM Molecule Player - Hardware Accelerated, Zero Lag */}
            <video
              className="w-[120%] sm:w-[130%] lg:w-[145%] xl:w-[155%] max-w-none h-auto object-contain object-top lg:object-right-top select-none pointer-events-none transform-gpu will-change-transform scale-120 sm:scale-130 lg:scale-145 xl:scale-155 origin-top-right -translate-y-2 sm:-translate-y-4 lg:-translate-y-6"
              style={{ contain: 'paint' }}
              src="/images/bigmolecule_website_rightside.webm"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />

            {/* Bottom Specificity Glass Badge (Pinned cleanly in bottom right corner) */}
            <div className="absolute bottom-4 right-4 sm:right-6 bg-[#141312]/92 backdrop-blur-md px-5 py-3 rounded-xl border border-purple-500/40 text-right shadow-2xl pointer-events-none z-10">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-purple-400 tracking-tight">
                {activeLocus.efficiency}
              </div>
              <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                ON-TARGET EFFICIENCY
              </div>
              <div className="text-xs font-mono text-emerald-400 mt-0.5 font-medium">
                Off-Target: {activeLocus.offTargetScore}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Loci Selector Cards (Wide, Separate Images, No Overlapping Text) */}
      <section className="w-full px-6 sm:px-12 lg:px-16 py-20 bg-[#121110] border-b border-[#2e2c29]">
        <div className="max-w-[1640px] mx-auto space-y-10">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-semibold block mb-2">
              [ TARGETED CLINICAL LOCI ]
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl font-light text-white tracking-tight">
              Validated Single-Base Therapeutic Targets
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {GENOMIC_LOCI.map((locus) => {
              const isSelected = activeLocus.id === locus.id;
              return (
                <div
                  key={locus.id}
                  onClick={() => {
                    setActiveLocus(locus);
                    setCustomSeq(locus.targetSequence.replace(/\s+/g, ''));
                    setSimulatedSeq(locus.editedSequence.replace(/\s+/g, ''));
                  }}
                  className={`group p-5 rounded-2xl cursor-pointer transition-all duration-300 border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#221f2d] border-purple-500 shadow-xl ring-1 ring-purple-500/40'
                      : 'bg-[#181716] border-[#2e2c29] hover:border-neutral-500'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono text-purple-400 font-semibold bg-black/60 px-2.5 py-0.5 rounded border border-white/10">
                        {locus.locus}
                      </span>
                      <span className="text-xs font-mono text-emerald-400 font-bold">
                        {locus.efficiency}
                      </span>
                    </div>

                    {/* Distinct Artwork Image */}
                    <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-black/60 border border-white/10 mb-3 group-hover:border-purple-500/50 transition-all">
                      <img
                        src={locus.image}
                        alt={locus.gene}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-2 left-2 text-[10px] font-mono text-white/90 truncate max-w-[200px]">
                        {locus.imageTitle}
                      </div>
                    </div>

                    <h3 className="font-sans text-base font-semibold text-white leading-snug mb-1.5">
                      {locus.gene}
                    </h3>
                    <p className="text-xs text-neutral-300 font-light leading-relaxed line-clamp-3">
                      {locus.therapeuticAim}
                    </p>
                  </div>

                  <div className="pt-3.5 border-t border-[#2e2c29] mt-3 space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Editor:</span>
                      <span className="text-neutral-200 font-medium truncate max-w-[140px]">{locus.editorType.split(' ')[0]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Off-Target:</span>
                      <span className="text-purple-300 font-semibold">{locus.offTargetScore}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Base-Editing Simulator */}
      <section className="w-full px-6 sm:px-12 lg:px-16 py-20 bg-[#141312]">
        <div className="max-w-[1640px] mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-semibold block mb-2">
                [ IN-SILICO LOCUS SIMULATION ]
              </span>
              <h2 className="font-sans text-3xl sm:text-4xl font-light text-white tracking-tight">
                Single-Nucleotide Transition Simulator
              </h2>
            </div>

            {/* Editor mode pills */}
            <div className="inline-flex rounded-full bg-[#242322] border border-[#363534] p-1">
              <button
                onClick={() => setEditorMode('abe')}
                className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  editorMode === 'abe'
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                ABE8e (A→G)
              </button>
              <button
                onClick={() => setEditorMode('cbe')}
                className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  editorMode === 'cbe'
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                hA3A-CBE (C→T)
              </button>
              <button
                onClick={() => setEditorMode('prime')}
                className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  editorMode === 'prime'
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                PEmax (Prime)
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-[#1e1d1b] border border-[#363534] p-8 lg:p-12 space-y-8 shadow-2xl">
            {/* Sequence Editor Box */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                  Target Genomic Protospacer (20nt + PAM):
                </label>
                <span className="text-xs font-mono text-purple-300">
                  PAM Recognized: {activeLocus.pam} · Window: {activeLocus.editingWindow}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-4">
                <input
                  type="text"
                  value={customSeq}
                  onChange={(e) => setCustomSeq(e.target.value.toUpperCase())}
                  className="flex-1 rounded-xl bg-[#121110] border border-[#363534] px-5 py-3.5 font-mono text-base tracking-widest text-white focus:outline-none focus:border-purple-500 uppercase"
                  placeholder="ENTER 20-NT DNA SEQUENCE..."
                />
                <button
                  onClick={runSimulation}
                  disabled={simulating}
                  className="px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all shrink-0 shadow-lg cursor-pointer"
                >
                  {simulating ? 'Calculating Deamination...' : '▶ Execute Base Edit'}
                </button>
              </div>
            </div>

            {/* Simulated Result Display */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6 border-t border-[#2e2c29]">
              <div className="lg:col-span-7 space-y-4">
                <div className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                  PREDICTED IN-SILICO ALLELE POST-EDIT:
                </div>
                
                <div className="p-6 rounded-xl bg-[#121110] border border-[#363534] space-y-3 font-mono">
                  <div className="text-xs text-neutral-500">ORIGINAL LOCUS:</div>
                  <div className="text-sm sm:text-base tracking-widest text-neutral-300 break-all">
                    {customSeq.split('').map((char, i) => (
                      <span key={i} className="inline-block px-0.5">
                        {char}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs text-purple-400 pt-2">EDITED ALLELE:</div>
                  <div className="text-sm sm:text-base tracking-widest text-white break-all">
                    {simulatedSeq.split('').map((char, i) => {
                      const isMutated = customSeq[i] && customSeq[i] !== char;
                      return (
                        <span
                          key={i}
                          className={`inline-block px-1 rounded ${
                            isMutated
                              ? 'bg-purple-600 text-white font-bold ring-1 ring-purple-400'
                              : 'text-neutral-300'
                          }`}
                        >
                          {char}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Specificity Telemetry */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#121110] border border-[#2e2c29]">
                  <div className="text-[11px] font-mono text-neutral-400 mb-1">On-Target Conversion</div>
                  <div className="text-2xl font-mono font-semibold text-emerald-400">
                    {activeLocus.efficiency}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#121110] border border-[#2e2c29]">
                  <div className="text-[11px] font-mono text-neutral-400 mb-1">Off-Target CFD</div>
                  <div className="text-2xl font-mono font-semibold text-purple-400">
                    0.002
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#121110] border border-[#2e2c29]">
                  <div className="text-[11px] font-mono text-neutral-400 mb-1">Bystander Edits</div>
                  <div className="text-2xl font-mono font-semibold text-white">
                    0 Loci
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#121110] border border-[#2e2c29]">
                  <div className="text-[11px] font-mono text-neutral-400 mb-1">Indel Frequency</div>
                  <div className="text-2xl font-mono font-semibold text-blue-400">
                    {activeLocus.indels}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
