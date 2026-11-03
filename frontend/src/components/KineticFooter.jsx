import React, { useState } from 'react';

/**
 * KineticFooter
 * Exact realization of Pin 1107181889664964753:
 * - Two-tone architectural layout (Warm Cream + Lilac Kinetic Panel)
 * - Multi-column editorial links & newsletter pill
 * - Giant kinetic typography ticker: "E U R E K A >" with smooth scrolling motion
 */
export default function KineticFooter({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
      }, 4000);
    }
  };

  return (
    <footer className="w-full relative overflow-hidden font-sans border-t border-[#181715]/15">
      
      {/* ============================================================
          TOP TIER: WARM CREAM EDITORIAL INFORMATION HUB
          ============================================================ */}
      <div className="w-full bg-[#f3f2ee] text-[#181715] pt-16 pb-12 px-6 sm:px-10 lg:px-16 transition-colors">
        <div className="max-w-7xl mx-auto">
          
          {/* Main 5-Column Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10 mb-16">
            
            {/* Column 1: PRODUCTS */}
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#6b675e] font-semibold mb-5">
                PRODUCTS
              </div>
              <ul className="space-y-4 text-xs font-mono">
                <li>
                  <button
                    onClick={() => onNavigate?.('generator')}
                    className="text-left group block"
                  >
                    <span className="font-semibold text-[#181715] group-hover:underline block">
                      SMILES LSTM Generator
                    </span>
                    <span className="text-[#6b675e] text-[11px] block">
                      Autoregressive Language
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate?.('docking')}
                    className="text-left group block"
                  >
                    <span className="font-semibold text-[#181715] group-hover:underline block">
                      AutoDock Vina 3D
                    </span>
                    <span className="text-[#6b675e] text-[11px] block">
                      Grid Biophysics Engine
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate?.('admet')}
                    className="text-left group block"
                  >
                    <span className="font-semibold text-[#181715] group-hover:underline block">
                      Tox21 Safety Matrix
                    </span>
                    <span className="text-[#6b675e] text-[11px] block">
                      22-Endpoint Screening
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate?.('studio')}
                    className="text-left group block"
                  >
                    <span className="font-semibold text-[#181715] group-hover:underline block">
                      Desmond MD Trajectory
                    </span>
                    <span className="text-[#6b675e] text-[11px] block">
                      10ns RMSD Equilibrator
                    </span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: RESEARCH & PLATFORM */}
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#6b675e] font-semibold mb-5">
                PLATFORM
              </div>
              <ul className="space-y-2.5 text-xs font-mono text-[#181715]/90">
                <li>
                  <button onClick={() => onNavigate?.('targets')} className="hover:underline text-left">
                    Target Ingestion Hub
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate?.('studio')} className="hover:underline text-left">
                    Protein PrepWizard
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate?.('tree')} className="hover:underline text-left">
                    Chemical Space Tree
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate?.('campus')} className="hover:underline text-left">
                    Campus Facility Map
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate?.('leads')} className="hover:underline text-left">
                    Discovered Leads Deck
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: FOLLOW US */}
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#6b675e] font-semibold mb-5">
                FOLLOW US
              </div>
              <ul className="space-y-2.5 text-xs font-mono text-[#181715]/90">
                <li>
                  <a
                    href="https://github.com/yuvanvishnupandi/eureka"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline flex items-center gap-1"
                  >
                    <span>GitHub</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.rcsb.org/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline flex items-center gap-1"
                  >
                    <span>PDB Archive</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.ebi.ac.uk/chembl/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline flex items-center gap-1"
                  >
                    <span>ChEMBL Database</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://pubchem.ncbi.nlm.nih.gov/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline flex items-center gap-1"
                  >
                    <span>PubChem Database</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline flex items-center gap-1"
                  >
                    <span>X (Twitter)</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: GET IN TOUCH */}
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#6b675e] font-semibold mb-5">
                GET IN TOUCH
              </div>
              <div className="space-y-2.5 text-xs font-mono text-[#181715]/85">
                <p className="font-semibold text-[#181715]">888-744-2327</p>
                <p className="leading-snug">
                  Eureka Discovery Complex<br />
                  Mission Bay, San Francisco, CA
                </p>
                <div className="pt-2 space-y-1">
                  <a
                    href="mailto:lab@eureka-pharma.org"
                    className="hover:underline block text-[#181715]"
                  >
                    ✉ General Inquiries
                  </a>
                  <a
                    href="mailto:press@eureka-pharma.org"
                    className="hover:underline block text-[#181715]"
                  >
                    ✉ Media Inquiries
                  </a>
                </div>
              </div>
            </div>

            {/* Column 5: STAY INFORMED (Newsletter) */}
            <div className="col-span-2 md:col-span-3 lg:col-span-1">
              <div className="font-mono text-xs uppercase tracking-widest text-[#6b675e] font-semibold mb-5">
                STAY INFORMED
              </div>
              <p className="text-xs text-[#6b675e] font-sans leading-relaxed mb-4">
                Sign up for our newsletter to receive news, updates, and insights regarding the next era of modern autonomous therapeutics.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative border-b border-[#181715]/30 focus-within:border-[#181715] pb-1 flex items-center">
                  <span className="text-xs text-[#6b675e] font-mono mr-2">○</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email*  example@address.com"
                    className="w-full bg-transparent text-xs font-mono placeholder-[#6b675e]/70 text-[#181715] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#8e75ff] hover:bg-[#7d61fc] text-white font-mono text-xs uppercase tracking-wider py-2 rounded-sm transition-all shadow-sm font-semibold"
                >
                  {submitted ? '✓ Subscribed' : 'Submit'}
                </button>
              </form>
            </div>

          </div>

          {/* Under-Grid Divider & Legal Strip */}
          <div className="border-t border-[#181715]/15 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#6b675e] gap-4">
            <div>© 2026 EUREKA Platform</div>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <button onClick={() => onNavigate?.('specs')} className="hover:underline">
                Press Kit
              </button>
              <button onClick={() => onNavigate?.('overview')} className="hover:underline">
                Cookie Policy
              </button>
              <button onClick={() => onNavigate?.('overview')} className="hover:underline">
                Cookie Preferences
              </button>
              <button onClick={() => onNavigate?.('overview')} className="hover:underline">
                Privacy Policy
              </button>
              <button onClick={() => onNavigate?.('overview')} className="hover:underline">
                Log in
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ============================================================
          BOTTOM TIER: KINETIC LILAC SCROLLING BANNER
          (Exact realization of Pin 1107181889664964753 Kinetic Section)
          ============================================================ */}
      <div className="w-full bg-[#8e75ff] text-[#1b0b42] pt-12 pb-6 px-6 sm:px-10 lg:px-16 relative overflow-hidden select-none">
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Subtitle / Punchline */}
          <div className="mb-6 sm:mb-8">
            <h3 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl leading-tight font-normal text-[#1b0b42]">
              Effortless in-silico<br />
              molecular therapeutics
            </h3>
          </div>
        </div>

        {/* Continuous Kinetic Horizontal Marquee Banner */}
        <div className="w-full overflow-hidden whitespace-nowrap -mx-6 sm:-mx-10 lg:-mx-16">
          <div className="animate-kinetic-marquee flex items-center">
            
            {/* Repeated Kinetic Logo Units */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-12 sm:gap-20 px-6 sm:px-10">
                <span className="font-black text-6xl sm:text-8xl md:text-9xl lg:text-[12vw] tracking-tighter uppercase text-[#1b0b42] hover:text-[#0b0320] transition-colors inline-block leading-none">
                  EUREKA&gt;
                </span>
                <span className="text-3xl sm:text-5xl text-[#1b0b42]/40 font-mono">
                  ✦
                </span>
                <span className="font-sans font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-[7vw] tracking-tight uppercase text-[#1b0b42]/70 leading-none">
                  IN-SILICO VINA
                </span>
                <span className="text-3xl sm:text-5xl text-[#1b0b42]/40 font-mono">
                  ✦
                </span>
              </div>
            ))}

          </div>
        </div>

        {/* Bottom Micro Details */}
        <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-[#1b0b42]/15 flex flex-wrap items-center justify-between text-[10px] font-mono text-[#1b0b42]/70">
          <div>AUTONOMOUS IN-SILICO DISCOVERY WORKSTATION</div>
          <div>SAN FRANCISCO · BOSTON · BASEL · TOKYO</div>
          <div>DETERMINISTIC GENAI + BIOPHYSICAL VINA</div>
        </div>

      </div>

    </footer>
  );
}

