import React, { useState, useEffect, useRef } from 'react';

/**
 * AntibodyDesignStudio
 * Generative Antibody Architecture & Biophysical Modeling:
 * 1. PERFECT COLOR MATCHING:
 *    - Radial vignette gradient mask (-webkit-mask-image) eliminates hard video edges.
 *    - Uses mix-blend-mode: screen so dark background renders 100% transparent.
 *    - Unified deep obsidian background (#0a0c10) with subtle ambient glow.
 * 2. REAL TYPING ANIMATION:
 *    - In "Generate", amino acid residues type out character by character with an active cursor.
 * 3. CLEAN DIRECT TABS (NO AUTO-CYCLE / NO JITTERY TIMERS / NO RESUME BUTTON):
 *    - Instant, reliable manual tab selection for full interactive control.
 * 4. CREATIVE TELEMETRY HUD:
 *    - Replaced blinking dot with a high-tech architectural specification ledger.
 */

const SEQUENCE_LINES = [
  'E V Q L Q Q S G A E L V R P G A S V K',
  'L S C T A S G F N I K D D F M H W V K',
  'Q R P E Q G L E W I G R I D P A N D N',
  'T K Y A P K F Q D K A T I I A D T S S N',
  'T A Y L Q L S S L T S E D T A V Y Y C V'
];

// Flattened residues for typing calculation
const ALL_RESIDUES = SEQUENCE_LINES.join(' ').split(' ');
const TOTAL_RESIDUES = ALL_RESIDUES.length;

export default function AntibodyDesignStudio() {
  const [activeTab, setActiveTab] = useState('generate'); // 'generate' | 'predict' | 'explain'
  const [typedCount, setTypedCount] = useState(0);
  const typingRef = useRef(null);

  // Typing Animation when in "Generate" mode & sync with backend API
  useEffect(() => {
    fetch('http://localhost:8000/api/antibody/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target_antigen: 'EGFR Domain III (Cetuximab analog)',
        rounds_of_optimization: 3
      })
    }).then(res => res.json()).then(data => {
      console.log('[Antibody API Telemetry]', data);
    }).catch(() => {});

    if (activeTab === 'generate') {
      setTypedCount(0);
      let count = 0;
      typingRef.current = setInterval(() => {
        count += 1;
        setTypedCount(count);
        if (count >= TOTAL_RESIDUES) {
          clearInterval(typingRef.current);
        }
      }, 55); // Types a residue every 55ms
    } else {
      setTypedCount(TOTAL_RESIDUES);
      if (typingRef.current) clearInterval(typingRef.current);
    }

    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
    };
  }, [activeTab]);

  // Helper to render the typing sequence grid in Generate mode
  const renderTypingSequence = () => {
    let residueCursor = 0;
    return (
      <div className="font-mono text-xs sm:text-sm lg:text-base leading-relaxed tracking-[0.25em] text-neutral-300 font-light select-none space-y-1.5">
        {SEQUENCE_LINES.map((line, lineIdx) => {
          const residues = line.split(' ');
          const lineStartIdx = residueCursor;
          const lineEndIdx = lineStartIdx + residues.length;
          residueCursor = lineEndIdx;

          // If current line hasn't been reached yet
          if (typedCount < lineStartIdx) {
            return (
              <p key={lineIdx} className="text-neutral-700">
                - - - - - - - - - - - - - - - - - - -
              </p>
            );
          }

          // If line is currently being typed
          return (
            <p key={lineIdx} className="flex flex-wrap items-center gap-x-[0.25em]">
              {residues.map((res, rIdx) => {
                const globalIdx = lineStartIdx + rIdx;
                if (globalIdx < typedCount) {
                  return (
                    <span key={rIdx} className="text-white font-medium">
                      {res}
                    </span>
                  );
                } else if (globalIdx === typedCount) {
                  return (
                    <span
                      key={rIdx}
                      className="inline-block px-1 rounded bg-blue-600/80 text-white font-bold"
                    >
                      {res}
                    </span>
                  );
                } else {
                  return (
                    <span key={rIdx} className="text-neutral-600">
                      _
                    </span>
                  );
                }
              })}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <section
      id="converge-studio"
      className="w-full bg-[#0a0c10] py-20 px-6 sm:px-12 lg:px-16 text-white border-b border-[#1c1f26] relative overflow-hidden"
    >
      {/* Ambient background glow to match video palette */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1640px] mx-auto relative z-10 space-y-10">
        
        {/* Top Control Bar: Clean Pill Tab Switcher (No auto-loading bar, no resume button) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex items-center rounded-full bg-[#15171e] p-1.5 border border-white/10 shadow-lg">
            {/* Tab 1: Generate */}
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-6 py-2 rounded-full font-sans text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === 'generate'
                  ? 'bg-[#252834] text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Generate
            </button>

            {/* Tab 2: Predict */}
            <button
              onClick={() => setActiveTab('predict')}
              className={`px-6 py-2 rounded-full font-sans text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === 'predict'
                  ? 'bg-[#252834] text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Predict
            </button>

            {/* Tab 3: Explain */}
            <button
              onClick={() => setActiveTab('explain')}
              className={`px-6 py-2 rounded-full font-sans text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === 'explain'
                  ? 'bg-[#252834] text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Explain
            </button>
          </div>
        </div>

        {/* 2-Column Main Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center min-h-[480px]">
          
          {/* Left Column: Heading & Dynamic Sequence */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Mode 1: Generate */}
            {activeTab === 'generate' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <div className="text-xs font-mono text-blue-400 uppercase tracking-widest font-semibold mb-2">
                    [ AUTOREGRESSIVE BIOLOGICAL SEQUENCE MODELING ]
                  </div>
                  <h2 className="font-sans text-4xl sm:text-5xl lg:text-[54px] font-light tracking-tight leading-[1.08] text-white">
                    Generate novel<br />Antibodies &amp; VHH
                  </h2>
                </div>

                {/* Animated Typing Sequence */}
                {renderTypingSequence()}

                {/* Live Real-time Generation Telemetry */}
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-400">
                  <span className="px-2.5 py-1 rounded bg-[#15171e] border border-white/10 text-blue-300">
                    Format: IgG · VHH Nanobody
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#15171e] border border-white/10 text-neutral-300">
                    Prompt Candidates: 100,000
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#15171e] border border-white/10 text-emerald-400 font-semibold">
                    Top Hit: 2.1× Cetuximab Affinity
                  </span>
                </div>
              </div>
            )}

            {/* Mode 2: Predict */}
            {activeTab === 'predict' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold mb-2">
                    [ ADMET &amp; THERMODYNAMICS CO-OPTIMIZATION ]
                  </div>
                  <h2 className="font-sans text-4xl sm:text-5xl lg:text-[54px] font-light tracking-tight leading-[1.08] text-white">
                    Predict binding &amp;<br />developability
                  </h2>
                </div>

                {/* Full Sequence Display */}
                <div className="font-mono text-xs sm:text-sm lg:text-base leading-relaxed tracking-[0.25em] text-neutral-300 font-light select-none space-y-1.5">
                  <p>E V Q L Q Q S G A E L V R P G A S V K</p>
                  <p>L S C T A S G F N I K D D F M H W V K</p>
                  <p>Q R P E Q G L E W I G R I D P A N D N</p>
                  <p>T K Y A P K F Q D K A T I I A D T S S N</p>
                  <p>T A Y L Q L S S L T S E D T A V Y Y C V</p>
                </div>

                {/* Developability & Expression Scoring */}
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-400">
                  <span className="px-2.5 py-1 rounded bg-[#15171e] border border-emerald-500/30 text-emerald-300">
                    Predicted Kd: 97 nM
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#15171e] border border-white/10 text-neutral-300">
                    Host: CHO &amp; HEK293 (2.4 g/L)
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#15171e] border border-white/10 text-neutral-300">
                    Aggregation: Low (0.02)
                  </span>
                </div>
              </div>
            )}

            {/* Mode 3: Explain */}
            {activeTab === 'explain' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <div className="text-xs font-mono text-blue-400 uppercase tracking-widest font-semibold mb-2">
                    [ RESIDUE SALIENCY &amp; CONTACT PHYSICS ]
                  </div>
                  <h2 className="font-sans text-4xl sm:text-5xl lg:text-[54px] font-light tracking-tight leading-[1.08] text-white">
                    Explain the<br />predictions
                  </h2>
                </div>

                {/* Sequence with Highlighted Badges */}
                <div className="font-mono text-xs sm:text-sm lg:text-base leading-relaxed tracking-[0.25em] text-neutral-300 font-light select-none space-y-1.5">
                  <p>E V Q L Q Q S G A E L V R P G A S V K</p>
                  <p className="flex items-center flex-wrap gap-x-[0.25em]">
                    <span>L S C T A S</span>
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#2b59c3] text-white font-semibold shadow">
                      G
                    </span>
                    <span>F N I K D D F M H</span>
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#2b59c3] text-white font-semibold shadow">
                      W
                    </span>
                    <span>V K</span>
                  </p>
                  <p className="flex items-center flex-wrap gap-x-[0.25em]">
                    <span>Q R P E Q G L E W I G R I D P A N D</span>
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#2b59c3] text-white font-semibold shadow">
                      N
                    </span>
                  </p>
                  <p>T K Y A P K F Q D K A T I I A D T S S N</p>
                  <p className="flex items-center flex-wrap gap-x-[0.25em]">
                    <span>T A Y</span>
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#2b59c3] text-white font-semibold shadow">
                      Q
                    </span>
                    <span>L S S L T S E D T A V Y Y C V</span>
                  </p>
                </div>

                {/* Saliency Metrics */}
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-400">
                  <span className="px-2.5 py-1 rounded bg-[#15171e] border border-blue-500/30 text-blue-300">
                    Optimized Kd: 1 nM
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#15171e] border border-white/10 text-neutral-300">
                    4 Key Affinity Mutations (G, W, N, Q)
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#15171e] border border-white/10 text-neutral-300">
                    ΔG = -12.4 kcal/mol
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Molecular Video Viewport with PERFECT COLOR BLENDING */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[420px] sm:min-h-[480px]">
            
            {/* Video Container with Radial Vignette Mask so edges vanish completely */}
            <div
              className="relative w-full max-w-[540px] aspect-square flex items-center justify-center transform-gpu"
              style={{
                WebkitMaskImage: 'radial-gradient(circle at center, black 58%, transparent 88%)',
                maskImage: 'radial-gradient(circle at center, black 58%, transparent 88%)'
              }}
            >
              
              {/* Video 1: Generate (molecule.mp4 - Blue Ribbon Model) */}
              <div
                className={`absolute inset-0 transition-opacity duration-700 flex items-center justify-center ${
                  activeTab === 'generate' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
                }`}
              >
                <video
                  className="w-full h-full object-contain"
                  style={{ mixBlendMode: 'screen' }}
                  src="/images/molecule.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                />
              </div>

              {/* Video 2: Predict (molecule2.mp4 - Complex + 97 nM Badge) */}
              <div
                className={`absolute inset-0 transition-opacity duration-700 flex items-center justify-center ${
                  activeTab === 'predict' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
                }`}
              >
                <video
                  className="w-full h-full object-contain"
                  style={{ mixBlendMode: 'screen' }}
                  src="/images/molecule2.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/bigmolecule_website_rightside.webm';
                  }}
                />

                {/* Vertical dashed connection indicator */}
                <div className="absolute top-[36%] left-[49%] w-0.5 h-10 border-l border-dashed border-white/60 pointer-events-none" />

                {/* 97 nM Badge */}
                <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex items-baseline gap-1 select-none pointer-events-none">
                  <span className="font-sans text-4xl sm:text-5xl font-light text-white tracking-tight">
                    97
                  </span>
                  <span className="font-sans text-xl text-neutral-300 font-light">
                    nM
                  </span>
                </div>
              </div>

              {/* Video 3: Explain (molecule3.mp4 - Annotated Complex + Target + 1 nM Badge) */}
              <div
                className={`absolute inset-0 transition-opacity duration-700 flex items-center justify-center ${
                  activeTab === 'explain' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
                }`}
              >
                <video
                  className="w-full h-full object-contain"
                  style={{ mixBlendMode: 'screen' }}
                  src="/images/molecule3.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                />

                {/* Target label */}
                <div className="absolute top-10 right-28 text-sm font-sans text-[#f08a4b] font-normal select-none pointer-events-none">
                  Target
                </div>

                {/* 1 nM Badge */}
                <div className="absolute bottom-24 right-4 flex items-baseline gap-1 select-none pointer-events-none">
                  <span className="font-sans text-4xl sm:text-5xl font-light text-white tracking-tight">
                    1
                  </span>
                  <span className="font-sans text-xl text-neutral-300 font-light">
                    nM
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* High-End Architectural Telemetry HUD (Replaces blinking dot with sleek design) */}
        <div className="rounded-xl border border-white/[0.08] bg-[#12141c]/90 backdrop-blur-md p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded bg-blue-900/40 text-blue-300 border border-blue-500/30">
              ACTIVE ENGINE ARCHITECTURE
            </span>
            <span className="font-sans text-sm font-medium text-white">
              EUREKA-AB v3.2
            </span>
            <span className="text-neutral-600 hidden sm:inline">|</span>
            <span className="font-mono text-xs text-neutral-300">
              Conditioned on EGFR Domain III (Cetuximab analog)
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400">
            <span>Target: <span className="text-white">EGFR Ectodomain</span></span>
            <span>·</span>
            <span>Validation: <span className="text-emerald-400 font-semibold">2.1× Higher Affinity</span></span>
            <span>·</span>
            <span>PDB Ref: <span className="text-blue-300">1YY9 (1.85 Å)</span></span>
          </div>
        </div>

      </div>
    </section>
  );
}
